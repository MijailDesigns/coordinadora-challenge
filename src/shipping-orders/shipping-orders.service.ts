import { Injectable } from '@nestjs/common';
import { CreateShippingOrderDto } from './dto/create-shipping-order.dto';
import { UpdateShippingOrderDto } from './dto/update-shipping-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingOrder } from './entities/shipping-order.entity';

@Injectable()
export class ShippingOrdersService {
  constructor(
    @InjectRepository(ShippingOrder)
    private readonly shippingOrderRepository: Repository<ShippingOrder>,
  ) {}
  async create(createShippingOrderDto: CreateShippingOrderDto) {
    const shipping = this.shippingOrderRepository.create(
      createShippingOrderDto,
    );
    return this.shippingOrderRepository.save(shipping);
  }

  findAll() {
    return `This action returns all shippingOrders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shippingOrder`;
  }

  update(id: number, updateShippingOrderDto: UpdateShippingOrderDto) {
    return `This action updates a #${id} shippingOrder`;
  }
}
