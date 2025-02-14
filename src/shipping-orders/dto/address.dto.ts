import { IsNotEmpty, IsString, Matches, Validate } from 'class-validator';
import { IsValidCityOrDepartment } from '../validators/is-valid-city-or-department';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDTO {
  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @Matches(
    /^[a-zA-Z0-9\s]+\s\d+\s#\s\d{1,2}-\d{1,2}$/,
    // /^[a-zA-Z0-9\s]+\s\d+\s?([a-zA-Z0-9\s]*)?,\s?[a-zA-Z\s]+,\s?[a-zA-Z\s]+$/,
    {
      message: 'El formato de la dirección no es válido para Colombia.',
    },
  )
  @ApiProperty({
    description: 'Address',
    required: true,
    type: String,
  })
  direccion: string;

  @IsNotEmpty({ message: 'La ciudad no puede estar vacía' })
  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @Validate(IsValidCityOrDepartment, ['ciudad'], {
    message: 'La ciudad no es válida en Colombia.',
  })
  @ApiProperty({
    description: 'City',
    required: true,
    type: String,
  })
  ciudad: string;

  @IsNotEmpty({ message: 'El departamento no puede estar vacío' })
  @IsString({ message: 'El departamento debe ser una cadena de texto' })
  @Validate(IsValidCityOrDepartment, ['departamento'], {
    message: 'El departamento no es válido en Colombia.',
  })
  @ApiProperty({
    description: 'Department',
    required: true,
    type: String,
  })
  departamento: string;

  @IsNotEmpty({ message: 'El código postal no puede estar vacío' })
  @Matches(/^\d{6}$/, {
    message: 'El código postal debe tener 6 dígitos.',
  })
  @ApiProperty({
    description: 'Postal code',
    required: true,
    type: String,
  })
  codigoPostal: string;
}
