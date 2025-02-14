import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty({ message: 'La placa no puede estar vacia' })
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  nombre: string;

  @IsNotEmpty({ message: 'El modelo no puede estar vacio' })
  @IsString({ message: 'El modelo debe ser una cadena de texto' })
  licencia: string;

  @IsNumber()
  @IsOptional()
  truckId: number;
}
