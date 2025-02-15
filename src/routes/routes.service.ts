import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import RouteRepository from './route.repository';
import { DriversService } from '../drivers/drivers.service';
import { SearchDto } from '../shared/dtos/search.dto';

@Injectable()
export class RoutesService {
  constructor(
    private readonly routeRepository: RouteRepository,
    private readonly driversService: DriversService,
  ) {}
  create(createRouteDto: CreateRouteDto) {
    const newRoute = this.routeRepository.create(createRouteDto);
    return this.routeRepository.save(newRoute);
  }

  async findAll(searchDto: SearchDto) {
    const { limit, offset } = searchDto;
    const [result, total] = await this.routeRepository.findAndCount({
      take: limit,
      skip: offset,
    });
    return {
      result,
      total,
    };
  }

  findOne(id: number) {
    return this.routeRepository.findOneBy({ id });
  }

  async update(id: number, updateRouteDto: UpdateRouteDto) {
    const route = await this.routeRepository.findOneBy({ id });
    if (!route) {
      throw new BadRequestException('Route not found');
    }
    if (updateRouteDto.driverId) {
      const driverId = updateRouteDto.driverId;
      const checkDriverWithTruck = await this.driversService.findOne(driverId);
      if (!checkDriverWithTruck?.truckId) {
        throw new BadRequestException('Driver is not available for this route');
      }
    }
    return this.routeRepository.update(id, updateRouteDto);
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
