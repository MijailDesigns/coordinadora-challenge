import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { FilterService } from '../shared/filters/filter.service';

@Module({
  controllers: [DriversController],
  providers: [DriversService, FilterService],
  imports: [TypeOrmModule.forFeature([Driver])],
  exports: [DriversService],
})
export class DriversModule {}
