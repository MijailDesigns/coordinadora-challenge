import { Module } from '@nestjs/common';
import { ShippingOrdersService } from './shipping-orders.service';
import { ShippingOrdersController } from './shipping-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingOrder } from './entities/shipping-order.entity';

@Module({
  controllers: [ShippingOrdersController],
  providers: [ShippingOrdersService],
  imports: [TypeOrmModule.forFeature([ShippingOrder])],
})
export class ShippingOrdersModule {}
