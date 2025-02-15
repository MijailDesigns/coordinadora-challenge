import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ShippingOrdersService } from './shipping-orders.service';
import { CreateShippingOrderDto } from './dto/create-shipping-order.dto';
import { UpdateShippingOrderDto } from './dto/update-shipping-order.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SearchDto } from '../shared/dtos/search.dto';

@ApiBearerAuth('TOKEN')
@Controller('shipping-orders')
export class ShippingOrdersController {
  constructor(private readonly shippingOrdersService: ShippingOrdersService) {}

  @Post()
  create(@Body() createShippingOrderDto: CreateShippingOrderDto) {
    return this.shippingOrdersService.create(createShippingOrderDto);
  }

  @Post('search')
  findAll(@Body() searchDto: SearchDto) {
    return this.shippingOrdersService.findAll(searchDto);
  }

  // @Post('metrics')
  // getMetrics(@Body() searchDto: SearchDto) {
  //   return this.shippingOrdersService.getMetrics(searchDto);
  // }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shippingOrdersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShippingOrderDto: UpdateShippingOrderDto,
  ) {
    return this.shippingOrdersService.update(id, updateShippingOrderDto);
  }
}
