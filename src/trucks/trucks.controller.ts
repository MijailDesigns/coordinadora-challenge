import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SearchDto } from '../shared/dtos/search.dto';

@ApiBearerAuth('TOKEN')
@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Post()
  create(@Body() createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  @Post('search')
  findAll(@Body() searchDto: SearchDto) {
    return this.trucksService.findAll(searchDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trucksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTruckDto: UpdateTruckDto,
  ) {
    return this.trucksService.update(+id, updateTruckDto);
  }
}
