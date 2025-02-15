import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Route } from '../../routes/entities/route.entity';
import { Truck } from '../../trucks/entities/truck.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  licencia: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  isAvailable: boolean;

  @RelationId((driver: Driver) => driver.truck)
  @Column('int', { nullable: true })
  truckId?: number;

  @OneToMany(() => Route, (route) => route.driver)
  routes: Route[];

  @OneToOne(() => Truck, { nullable: true })
  @JoinColumn()
  truck: Truck;
}
