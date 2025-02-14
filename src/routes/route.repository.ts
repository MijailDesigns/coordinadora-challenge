import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Route } from './entities/route.entity';

@Injectable()
export default class RouteRepository extends Repository<Route> {
  constructor(private readonly dataSource: DataSource) {
    super(Route, dataSource.createEntityManager());
  }
}
