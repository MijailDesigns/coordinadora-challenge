import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty({ message: 'La placa no puede estar vacia' })
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  @ApiProperty({
    description: 'Driver name',
    required: true,
    type: String,
  })
  nombre: string;

  @IsNotEmpty({ message: 'El modelo no puede estar vacio' })
  @IsString({ message: 'El modelo debe ser una cadena de texto' })
  @ApiProperty({
    description: 'License driver',
    required: true,
    type: String,
  })
  licencia: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Truck id',
    required: false,
    type: Number,
  })
  truckId: number;
}
