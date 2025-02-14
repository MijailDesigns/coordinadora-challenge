import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTruckDto {
  @IsNotEmpty({ message: 'La placa no puede estar vacia' })
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  placa: string;

  @IsNotEmpty({ message: 'El modelo no puede estar vacio' })
  @IsString({ message: 'El modelo debe ser una cadena de texto' })
  modelo: string;

  @IsNumber()
  @IsOptional()
  driverId: number;
}
