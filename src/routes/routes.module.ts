import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import RouteRepository from './route.repository';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService, RouteRepository],
  imports: [TypeOrmModule.forFeature([Route]), DriversModule],
})
export class RoutesModule {}
