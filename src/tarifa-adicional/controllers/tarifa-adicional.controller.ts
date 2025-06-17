import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { TarifaAdicionalService } from '../services/tarifa-adicional.service';
import { CreateTarifaAdicionalDTO } from '../dtos/tarifa-adicional.dto';

@Controller('tarifa-adicional')
export class TarifaAdicionalController {
  constructor(private readonly service: TarifaAdicionalService) {}

  @Post()
  create(@Body() dto: CreateTarifaAdicionalDTO) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateTarifaAdicionalDTO) {
    return this.service.update(+id, dto);
  }

  
}
