import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Driver } from '../../drivers/entities/driver.entity';

@Entity()
export class Truck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  placa: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  modelo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  capacidadCarga: number;

  @OneToOne(() => Driver, (driver) => driver.truck)
  driver: Driver;
}
