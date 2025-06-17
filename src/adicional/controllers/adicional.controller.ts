import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdicionalService } from '../services/adicional.service';
import { CreateAdicionalDTO } from '../dtos/adicional.dto';

@Controller('adicional')
export class AdicionalController {
  constructor(private readonly adicionalService: AdicionalService) {}

  @Post()
  create(@Body() createAdicionalDto: CreateAdicionalDTO) {
    return this.adicionalService.create(createAdicionalDto);
  }

  @Get()
  findAll() {
    return this.adicionalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adicionalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdicionalDto: CreateAdicionalDTO) {
    return this.adicionalService.update(+id, updateAdicionalDto);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string): Promise<void> {
    return this.adicionalService.eliminar(+id);
  }
}
