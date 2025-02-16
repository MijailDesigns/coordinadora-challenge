import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShippingOrderDto } from './dto/create-shipping-order.dto';
import { UpdateShippingOrderDto } from './dto/update-shipping-order.dto';
import { SearchDto } from '../shared/dtos/search.dto';
import ShippingOrderRepository from './shipping-order.repository';
import { ShippingOrder } from './entities/shipping-order.entity';
import { Route } from '../routes/entities/route.entity';
import { EntityManager } from 'typeorm';
import SHIPPING_STATUS from '../shared/enums/shipping-status';
import { TrucksService } from '../trucks/trucks.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ShippingOrdersService {
  constructor(
    private readonly shippingOrderRepository: ShippingOrderRepository,
    private readonly truckService: TrucksService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  async create(createShippingOrderDto: CreateShippingOrderDto) {
    const shipping = this.shippingOrderRepository.create(
      createShippingOrderDto,
    );
    const savedShipping = await this.shippingOrderRepository.save(shipping);

    const cacheKey = `shippingOrder_${savedShipping.id}`;
    await this.cacheManager.set(cacheKey, savedShipping);

    return savedShipping;
  }

  async findAll(searchDto: SearchDto) {
    const { limit, offset } = searchDto;
    const [result, total] = await this.shippingOrderRepository.findAndCount({
      take: limit,
      skip: offset,
    });
    return {
      result,
      total,
    };
  }

  async findOne(id: number) {
    const cacheKey = `shippingOrder_${id}`;
    const cachedData = await this.cacheManager.get<ShippingOrder>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const shippingOrder = await this.shippingOrderRepository.findOneBy({ id });

    if (!shippingOrder) {
      throw new NotFoundException('Shipping order not found');
    }

    await this.cacheManager.set(cacheKey, shippingOrder);
    return shippingOrder;
  }

  async update(id: number, updateShippingOrderDto: UpdateShippingOrderDto) {
    const shipping = await this.findOne(id);
    if (!shipping) {
      throw new NotFoundException('Shipping order not found');
    }
    const checkRoute = await this.shippingOrderRepository.findRouteWithDetails(
      updateShippingOrderDto.routeId,
    );
    if (!checkRoute?.driver?.truck || !checkRoute.driver.isAvailable) {
      throw new BadRequestException('Route or truck not available');
    }
    const { volume, weight } = this.calculateOrderDimensionsAndWeight(shipping);
    const { capacidadVolumenDisponible, capacidadPesoDisponible } =
      checkRoute.driver.truck;

    if (volume > capacidadVolumenDisponible || weight > capacidadPesoDisponible)
      throw new BadRequestException('Shipping order exceeds truck capacity');

    const cacheKey = `shippingOrder_${id}`;
    await this.cacheManager.del(cacheKey);

    return this.asignShippingOrderToRouteTransactions(id, checkRoute, {
      volume,
      weight,
    });
  }

  // getMetrics(searchDto: SearchDto) {
  //   return this.shippingOrderRepository.getMetrics(searchDto);
  // }

  protected async asignShippingOrderToRouteTransactions(
    shippingOrderId: number,
    route: Route,
    orderDimensionsAndWeight: { volume: number; weight: number },
  ) {
    const cacheKey = `shippingOrder_${shippingOrderId}`;
    await this.cacheManager.del(cacheKey);

    return this.shippingOrderRepository.manager.transaction(async (manager) => {
      await this.assignShippingOrderToRoute(manager, shippingOrderId, route.id);
      await this.truckService.updateAvailableCapacity(
        manager,
        route.driver.truck.id,
        {
          volumeOrder: orderDimensionsAndWeight.volume,
          weightOrder: orderDimensionsAndWeight.weight,
          currentVolume: route.driver.truck.capacidadVolumenDisponible,
          currentWeight: route.driver.truck.capacidadPesoDisponible,
        },
      );
    });
  }

  protected async assignShippingOrderToRoute(
    manager: EntityManager,
    shippingOrderId: number,
    routeId: number,
  ) {
    await manager
      .createQueryBuilder(ShippingOrder, 'shippingOrder')
      .update()
      .set({ routeId: routeId, estado: SHIPPING_STATUS.EN_TRANSITO })
      .where('id = :id', { id: shippingOrderId })
      .execute();
  }

  protected calculateOrderDimensionsAndWeight(shippingOrder: ShippingOrder) {
    const { largo, ancho, alto } = shippingOrder;
    const volume = largo * ancho * alto;
    const weight = shippingOrder.peso;
    return { volume, weight };
  }
}
