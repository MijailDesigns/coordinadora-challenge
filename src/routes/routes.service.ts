import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import RouteRepository from './route.repository';
import { DriversService } from '../drivers/drivers.service';

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

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
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
    const driverId = updateRouteDto.driverId;
    const route = await this.routeRepository.findOneBy({ id });
    if (!route) {
      throw new BadRequestException('Route not found');
    }
    const checkDriverWithTruck = await this.driversService.findOne(driverId);
    if (!checkDriverWithTruck?.truckId) {
      throw new BadRequestException('Driver is not available for this route');
    }

    return this.routeRepository.update(id, updateRouteDto);
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
