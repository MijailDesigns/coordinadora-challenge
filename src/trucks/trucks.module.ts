import { Module } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { TrucksController } from './trucks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Truck } from './entities/truck.entity';

@Module({
  controllers: [TrucksController],
  providers: [TrucksService],
  imports: [TypeOrmModule.forFeature([Truck])],
})
export class TrucksModule {}
