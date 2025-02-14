import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService],
  imports: [TypeOrmModule.forFeature([Route])],
})
export class RoutesModule {}
