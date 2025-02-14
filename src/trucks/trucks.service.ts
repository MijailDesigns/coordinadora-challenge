import { Injectable } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Truck } from './entities/truck.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../shared/dtos/pagination.dto';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck)
    private readonly truckRepository: Repository<Truck>,
  ) {}
  create(createTruckDto: CreateTruckDto) {
    const newTruck = this.truckRepository.create(createTruckDto);
    return this.truckRepository.save(newTruck);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    const [result, total] = await this.truckRepository.findAndCount({
      take: limit,
      skip: offset,
    });
    return {
      result,
      total,
    };
  }

  findOne(id: number) {
    return this.truckRepository.findOneBy({ id });
  }

  update(id: number, updateTruckDto: UpdateTruckDto) {
    return this.truckRepository.update(id, updateTruckDto);
  }
}
