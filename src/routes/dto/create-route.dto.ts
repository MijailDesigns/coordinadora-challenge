import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRouteDto {
  @IsNotEmpty({ message: 'Ciudad de origen no puede estar vacia' })
  @IsString({ message: 'Ciudad de origen debe ser una cadena de texto' })
  @ApiProperty({
    description: 'Origin city',
    required: true,
    type: String,
  })
  origen: string;

  @IsNotEmpty({ message: 'Ciudad de destino no puede estar vacia' })
  @IsString({ message: 'Ciudad de destino debe ser una cadena de texto' })
  @ApiProperty({
    description: 'Destination city',
    required: true,
    type: String,
  })
  destino: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Driver id',
    required: false,
    type: Number,
  })
  driverId?: number;
}
