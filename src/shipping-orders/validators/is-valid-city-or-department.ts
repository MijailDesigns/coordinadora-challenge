import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

const ciudadesColombia = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Pereira',
  'Manizales',
  'Cúcuta',
  'Ibagué',
];

const departamentosColombia = [
  'Cundinamarca',
  'Antioquia',
  'Valle del Cauca',
  'Atlántico',
  'Bolívar',
  'Santander',
  'Risaralda',
  'Caldas',
  'Norte de Santander',
  'Tolima',
];

@ValidatorConstraint({ name: 'esCiudadODepartamentoValido', async: false })
export class IsValidCityOrDepartment implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const tipo = args.constraints[0]; // 'ciudad' o 'departamento'
    if (tipo === 'ciudad') {
      return ciudadesColombia.includes(value);
    } else if (tipo === 'departamento') {
      return departamentosColombia.includes(value);
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const tipo = args.constraints[0];
    return `El ${tipo} no es válido en Colombia.`;
  }
}
