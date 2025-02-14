import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';
import { AddressDTO } from './address.dto';

export class CreateShippingOrderDto {
  @IsNotEmpty({ message: 'El peso no puede estar vacío' })
  @IsNumber({}, { message: 'El peso debe ser un número' })
  @Min(0.1, { message: 'El peso mínimo es 0.1 kg' })
  peso: number;

  @IsNotEmpty({ message: 'Las dimensiones no pueden estar vacías' })
  @IsString({ message: 'Las dimensiones deben ser una cadena de texto' })
  dimensiones: string;

  @IsNotEmpty({ message: 'El tipo de producto no puede estar vacío' })
  @IsString({ message: 'El tipo de producto debe ser una cadena de texto' })
  tipoProducto: string;

  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  direccionDestinatario: AddressDTO;

  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  direccionRemitente: AddressDTO;
}
