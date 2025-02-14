import { IsNotEmpty, IsNumber, Min, IsString, Max } from 'class-validator';
import { AddressDTO } from './address.dto';

export class CreateShippingOrderDto {
  @IsNotEmpty({ message: 'El peso no puede estar vacío' })
  @IsNumber({}, { message: 'El peso debe ser un número' })
  @Min(0.1, { message: 'El peso mínimo es 0.1 kg' })
  @Max(200, { message: 'El peso maximo es 200 kg' })
  peso: number;

  @IsNotEmpty({ message: 'Largo no debe estar vacio' })
  @IsNumber({}, { message: 'Largo debe ser un número' })
  @Min(0.1, { message: 'El largo mínimo es 0.1 cm' })
  @Max(400, { message: 'El largo maximo es 400 cm' })
  largo: number;

  @IsNotEmpty({ message: 'Ancho no debe estar vacio' })
  @IsNumber({}, { message: 'Ancho debe ser un número' })
  @Min(0.1, { message: 'El ancho mínimo es 0.1 cm' })
  @Max(200, { message: 'El ancho maximo es 200 cm' })
  ancho: number;

  @IsNotEmpty({ message: 'Alto no debe estar vacio' })
  @IsNumber({}, { message: 'alto debe ser un número' })
  @Min(0.1, { message: 'El alto mínimo es 0.1 cm' })
  @Max(200, { message: 'El alto maximo es 200 cm' })
  alto: number;

  @IsNotEmpty({ message: 'El tipo de producto no puede estar vacío' })
  @IsString({ message: 'El tipo de producto debe ser una cadena de texto' })
  tipoProducto: string;

  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  direccionDestinatario: AddressDTO;

  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  direccionRemitente: AddressDTO;
}
