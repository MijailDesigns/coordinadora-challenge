import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import SHIPPING_STATUS from '../../shared/enums/shipping-status';
import { IsInt, IsString, Min } from 'class-validator';
import { Route } from '../../routes/entities/route.entity';

@Entity()
export class ShippingOrder {
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  peso: number;

  @Column({ type: 'int', precision: 3, nullable: false })
  largo: number;

  @Column({ type: 'int', precision: 3, nullable: false })
  ancho: number;

  @Column({ type: 'int', precision: 3, nullable: false })
  alto: number;

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
  createdAt: Date;

  @Column({ nullable: true })
  onTheRouteAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @RelationId((shippingOrder: ShippingOrder) => shippingOrder.route)
  @Column('int', { nullable: true })
  routeId?: number;

  @ManyToOne(() => Route, (route) => route.shippingOrders, { nullable: true })
  @JoinTable()
  route: Route;
}
