import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { ShippingOrder } from '../../shipping-orders/entities/shipping-order.entity';
import { Driver } from '../../drivers/entities/driver.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  origen: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  destino: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  inicioRuta: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  finalizoRuta: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ubicacionActual?: string;

  @Column({ type: 'datetime', nullable: true })
  fechaInicio?: Date;

  @Column({ type: 'datetime', nullable: true })
  fechaFinalizacion?: Date;
  @BeforeInsert()
  setFechaInicio() {
    if (this.inicioRuta) {
      this.fechaInicio = new Date();
      this.ubicacionActual = this.origen;
    }
  }

  @BeforeUpdate()
  setFechaFinalizacion() {
    if (this.finalizoRuta && !this.fechaFinalizacion) {
      this.fechaFinalizacion = new Date();
      this.ubicacionActual = this.destino;
    }
  }

  @RelationId((route: Route) => route.driver)
  @Column('int', { nullable: true })
  driverId?: number;

  @OneToMany(() => ShippingOrder, (shippingOrder) => shippingOrder.route)
  shippingOrders: ShippingOrder[];

  @ManyToOne(() => Driver, (driver) => driver.routes, { nullable: true })
  @JoinTable()
  driver: Driver;
}
