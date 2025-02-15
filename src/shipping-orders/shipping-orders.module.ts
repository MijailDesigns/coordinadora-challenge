import { Module } from '@nestjs/common';
import { ShippingOrdersService } from './shipping-orders.service';
import { ShippingOrdersController } from './shipping-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingOrder } from './entities/shipping-order.entity';
import { RoutesModule } from '../routes/routes.module';
import ShippingOrderRepository from './shipping-order.repository';
import { TrucksModule } from '../trucks/trucks.module';

@Module({
  controllers: [ShippingOrdersController],
  providers: [ShippingOrdersService, ShippingOrderRepository],
  imports: [
    TypeOrmModule.forFeature([ShippingOrder]),
    RoutesModule,
    TrucksModule,
  ],
})
export class ShippingOrdersModule {}
