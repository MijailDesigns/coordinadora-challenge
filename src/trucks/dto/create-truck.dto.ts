import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTruckDto {
  @IsNotEmpty({ message: 'La placa no puede estar vacia' })
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  @ApiProperty({
    description: 'License plate',
    required: true,
    type: String,
  })
  placa: string;

  @IsNotEmpty({ message: 'El modelo no puede estar vacio' })
  @IsString({ message: 'El modelo debe ser una cadena de texto' })
  @ApiProperty({
    description: 'Truck model',
    required: true,
    type: String,
  })
  modelo: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Driver id',
    required: false,
    type: Number,
  })
  driverId?: number;
}
