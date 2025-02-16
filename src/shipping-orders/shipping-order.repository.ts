import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ShippingOrder } from './entities/shipping-order.entity';
import { Route } from '../routes/entities/route.entity';
// import { SearchDto } from '../shared/dtos/search.dto';
// import * as fs from 'fs';

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

  // async getMetrics(searchDto: SearchDto) {
  //   const { limit, offset } = searchDto;
  //   const content = fs.readFileSync(
  //     'src/shipping-orders/entities/queries/shipping-order-metric.sql',
  //     'utf8',
  //   );

  //   // return await this.dataSource.query(content);
  //   const qb = this.dataSource
  //     .createQueryBuilder()
  //     .select('*')
  //     .from(`(${content})`, 'shippingOrder') // Usar la consulta SQL como subconsulta
  //     .where('shippingOrder.some_column = :someValue', { someValue: 'value' })
  //     .limit(limit)
  //     .offset(offset);

  //   return qb.getRawMany();
  // }
}
