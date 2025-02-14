import { Injectable } from '@nestjs/common';
import { CreateShippingOrderDto } from './dto/create-shipping-order.dto';
import { UpdateShippingOrderDto } from './dto/update-shipping-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingOrder } from './entities/shipping-order.entity';
import { PaginationDto } from '../shared/dtos/pagination.dto';

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

  update(id: number, updateShippingOrderDto: UpdateShippingOrderDto) {
    return `This action updates a #${id} shippingOrder`;
  }
}
