import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShippingOrderDto } from './dto/create-shipping-order.dto';
import { UpdateShippingOrderDto } from './dto/update-shipping-order.dto';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import { RoutesService } from '../routes/routes.service';
import ShippingOrderRepository from './shipping-order.repository';
import { ShippingOrder } from './entities/shipping-order.entity';
import { Route } from '../routes/entities/route.entity';
import { EntityManager } from 'typeorm';
import SHIPPING_STATUS from '../shared/enums/shipping-status';
import { TrucksService } from '../trucks/trucks.service';

@Injectable()
export class ShippingOrdersService {
  constructor(
    private readonly shippingOrderRepository: ShippingOrderRepository,
    private readonly routesService: RoutesService,
    private readonly truckService: TrucksService,
  ) {}
  async create(createShippingOrderDto: CreateShippingOrderDto) {
    const shipping = this.shippingOrderRepository.create(
      createShippingOrderDto,
    );
    return this.shippingOrderRepository.save(shipping);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    const [result, total] = await this.shippingOrderRepository.findAndCount({
      take: limit,
      skip: offset,
    });
    return {
      result,
      total,
    };
  }

  findOne(id: number) {
    return this.shippingOrderRepository.findOneBy({ id });
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

    return this.asignShippingOrderToRouteTransactions(id, checkRoute, {
      volume,
      weight,
    });
  }

  private async asignShippingOrderToRouteTransactions(
    shippingOrderId: number,
    route: Route,
    orderDimensionsAndWeight: { volume: number; weight: number },
  ) {
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

  private async assignShippingOrderToRoute(
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

  private calculateOrderDimensionsAndWeight(shippingOrder: ShippingOrder) {
    const { largo, ancho, alto } = shippingOrder;
    const volume = largo * ancho * alto;
    const weight = shippingOrder.peso;
    return { volume, weight };
  }
}
