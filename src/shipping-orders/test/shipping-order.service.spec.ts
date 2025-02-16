import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TrucksService } from '../../trucks/trucks.service';
import { Route } from '../../routes/entities/route.entity';
import { ShippingOrder } from '../entities/shipping-order.entity';
import ShippingOrderRepository from '../shipping-order.repository';
import { ShippingOrdersService } from '../shipping-orders.service';

describe('ShippingOrdersService', () => {
  let service: ShippingOrdersService;
  let shippingOrderRepository: jest.Mocked<ShippingOrderRepository>;
  let cacheManager: jest.Mocked<Cache>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingOrdersService,
        {
          provide: ShippingOrderRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOneBy: jest.fn(),
            findRouteWithDetails: jest.fn(),
            manager: {
              transaction: jest.fn(),
            },
          },
        },
        {
          provide: TrucksService,
          useValue: {
            updateAvailableCapacity: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShippingOrdersService>(ShippingOrdersService);
    shippingOrderRepository = module.get(ShippingOrderRepository);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and cache a shipping order', async () => {
      const createShippingOrderDto = {
        peso: 2.5,
        largo: 30,
        ancho: 20,
        alto: 10,
        tipoProducto: 'Electrónicos',
        direccionDestinatario: {
          direccion: 'Calle 123 # 45-67',
          ciudad: 'Bogotá',
          departamento: 'Cundinamarca',
          codigoPostal: '110111',
        },
        direccionRemitente: {
          direccion: 'Calle 123 # 45-67',
          ciudad: 'Bogotá',
          departamento: 'Cundinamarca',
          codigoPostal: '110111',
        },
        routeId: 1,
      };
      const savedShipping = {
        id: 1,
        ...createShippingOrderDto,
      } as ShippingOrder;

      shippingOrderRepository.create.mockReturnValue(savedShipping);
      shippingOrderRepository.save.mockResolvedValue(savedShipping);
      cacheManager.set.mockResolvedValue(undefined);

      const result = await service.create(createShippingOrderDto);

      expect(shippingOrderRepository.create).toHaveBeenCalledWith(
        createShippingOrderDto,
      );
      expect(shippingOrderRepository.save).toHaveBeenCalledWith(savedShipping);
      expect(cacheManager.set).toHaveBeenCalledWith(
        `shippingOrder_${savedShipping.id}`,
        savedShipping,
      );
      expect(result).toEqual(savedShipping);
    });
  });

  describe('findAll', () => {
    it('should return a list of shipping orders', async () => {
      const searchDto = { limit: 10, offset: 0 };
      const result = [{ id: 1 }] as ShippingOrder[];
      const total = 1;

      shippingOrderRepository.findAndCount.mockResolvedValue([result, total]);

      const response = await service.findAll(searchDto);

      expect(shippingOrderRepository.findAndCount).toHaveBeenCalledWith({
        take: searchDto.limit,
        skip: searchDto.offset,
      });
      expect(response).toEqual({ result, total });
    });
  });

  describe('findOne', () => {
    it('should return a cached shipping order if available', async () => {
      const id = 1;
      const cachedShipping = { id } as ShippingOrder;

      cacheManager.get.mockResolvedValue(cachedShipping);

      const result = await service.findOne(id);

      expect(cacheManager.get).toHaveBeenCalledWith(`shippingOrder_${id}`);
      expect(result).toEqual(cachedShipping);
    });

    it('should fetch and cache a shipping order if not in cache', async () => {
      const id = 1;
      const shippingOrder = { id } as ShippingOrder;

      cacheManager.get.mockResolvedValue(undefined);
      shippingOrderRepository.findOneBy.mockResolvedValue(shippingOrder);
      cacheManager.set.mockResolvedValue(undefined);

      const result = await service.findOne(id);

      expect(shippingOrderRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(cacheManager.set).toHaveBeenCalledWith(
        `shippingOrder_${id}`,
        shippingOrder,
      );
      expect(result).toEqual(shippingOrder);
    });

    it('should throw NotFoundException if shipping order does not exist', async () => {
      const id = 1;

      cacheManager.get.mockResolvedValue(undefined);
      shippingOrderRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a shipping order and clear cache', async () => {
      const id = 1;
      const updateShippingOrderDto = { routeId: 2 };
      const shipping = { id } as ShippingOrder;
      const route = {
        driver: {
          truck: {
            id: 1,
            capacidadVolumenDisponible: 100,
            capacidadPesoDisponible: 200,
          },
          isAvailable: true,
        },
      } as Route;

      jest.spyOn(service, 'findOne').mockResolvedValue(shipping);
      shippingOrderRepository.findRouteWithDetails.mockResolvedValue(route);
      jest
        .spyOn(service as any, 'calculateOrderDimensionsAndWeight')
        .mockReturnValue({ volume: 50, weight: 100 });
      jest
        .spyOn(service as any, 'asignShippingOrderToRouteTransactions')
        .mockResolvedValue(shipping);
      cacheManager.del.mockResolvedValue(undefined);

      const result = await service.update(id, updateShippingOrderDto);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(shippingOrderRepository.findRouteWithDetails).toHaveBeenCalledWith(
        updateShippingOrderDto.routeId,
      );
      expect(result).toEqual(shipping);
      expect(cacheManager.del).toHaveBeenCalledWith(`shippingOrder_${id}`);
    });

    it('should throw NotFoundException if shipping order does not exist', async () => {
      const id = 1;
      const updateShippingOrderDto = { routeId: 2 };

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.update(id, updateShippingOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if route or truck is not available', async () => {
      const id = 1;
      const updateShippingOrderDto = { routeId: 2 };
      const shipping = { id } as ShippingOrder;
      const route = {
        driver: {
          truck: null,
          isAvailable: false,
        },
      } as Route;

      jest.spyOn(service, 'findOne').mockResolvedValue(shipping);
      shippingOrderRepository.findRouteWithDetails.mockResolvedValue(route);

      await expect(service.update(id, updateShippingOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if shipping order exceeds truck capacity', async () => {
      const id = 1;
      const updateShippingOrderDto = { routeId: 2 };
      const shipping = { id } as ShippingOrder;
      const route = {
        driver: {
          truck: {
            id: 1,
            capacidadVolumenDisponible: 100,
            capacidadPesoDisponible: 200,
          },
          isAvailable: true,
        },
      } as Route;

      jest.spyOn(service, 'findOne').mockResolvedValue(shipping);
      shippingOrderRepository.findRouteWithDetails.mockResolvedValue(route);
      jest
        .spyOn(service as any, 'calculateOrderDimensionsAndWeight')
        .mockReturnValue({ volume: 150, weight: 250 });

      await expect(service.update(id, updateShippingOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
