import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ShippingOrder } from './entities/shipping-order.entity';
import { Route } from '../routes/entities/route.entity';

@Injectable()
export default class ShippingOrderRepository extends Repository<ShippingOrder> {
  constructor(private readonly dataSource: DataSource) {
    super(ShippingOrder, dataSource.createEntityManager());
  }

  async findRouteWithDetails(id: number) {
    return this.dataSource
      .getRepository(Route)
      .createQueryBuilder('route')
      .innerJoinAndSelect('route.driver', 'driver')
      .innerJoinAndSelect('driver.truck', 'truck')
      .where('route.id = :id', { id })
      .getOne();
  }
}
