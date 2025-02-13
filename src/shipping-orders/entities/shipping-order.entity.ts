import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import SHIPPING_STATUS from '../../shared/shipping-status';
import { IsInt, IsString, Min } from 'class-validator';

@Entity()
export class ShippingOrder {
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  peso: number;

  @Column()
  dimensiones: string;

  @IsString()
  @Column()
  tipoProducto: string;

  @Column()
  direccionDestinatario: string;

  @Column()
  direccionRemitente: string;

  @Column({
    type: 'enum',
    enum: SHIPPING_STATUS,
    default: SHIPPING_STATUS.EN_ESPERA,
  })
  estado: SHIPPING_STATUS;

  @CreateDateColumn()
  fechaCreacion: Date;
}
