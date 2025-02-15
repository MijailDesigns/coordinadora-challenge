import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { FilterService } from '../shared/filters/filter.service';
import { SearchDto } from '../shared/dtos/search.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly filterService: FilterService<Driver>,
  ) {}
  create(createDriverDto: CreateDriverDto) {
    const newDriver = this.driverRepository.create(createDriverDto);
    return this.driverRepository.save(newDriver);
  }

  async findAll(searchDto: SearchDto) {
    const { filters, limit, offset } = searchDto;
    const whereOptions = this.filterService.parseFilters(filters);
    const [result, total] = await this.driverRepository.findAndCount({
      where: whereOptions,
      take: limit,
      skip: offset,
    });
    return {
      result,
      total,
    };
  }

  findOne(id: number) {
    return this.driverRepository.findOne({
      where: { id },
      relations: ['truck'],
    });
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return this.driverRepository.update(id, updateDriverDto);
  }
}
