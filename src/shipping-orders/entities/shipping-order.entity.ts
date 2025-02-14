import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import SHIPPING_STATUS from '../../shared/enums/shipping-status';
import { IsInt, IsString, Min } from 'class-validator';

@Entity()
export class ShippingOrder {
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  peso: number;

  @Column({ nullable: false })
  dimensiones: string;

  @IsString()
  @Column({ nullable: false })
  tipoProducto: string;

  @Column({ type: 'json', nullable: false })
  direccionDestinatario: {
    direccion: string;
    ciudad: string;
    departamento: string;
    codigoPostal: string;
  };

  @Column({ type: 'json', nullable: false })
  direccionRemitente: {
    direccion: string;
    ciudad: string;
    departamento: string;
    codigoPostal: string;
  };

  @Column({
    type: 'enum',
    enum: SHIPPING_STATUS,
    default: SHIPPING_STATUS.EN_ESPERA,
  })
  estado: SHIPPING_STATUS;

  @CreateDateColumn()
  fechaCreacion: Date;
}
