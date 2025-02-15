import { PartialType } from '@nestjs/mapped-types';
import { CreateShippingOrderDto } from './create-shipping-order.dto';

export class UpdateShippingOrderDto extends PartialType(
  CreateShippingOrderDto,
) {}
