import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QrscanService } from './qrscan.service';
import { CreateQrscanDto } from './dto/create-qrscan.dto';
import { UpdateQrscanDto } from './dto/update-qrscan.dto';

@Controller('qrscan')
export class QrscanController {
  constructor(private readonly qrscanService: QrscanService) {}

  /* @Post()
  create(@Body() createQrscanDto: CreateQrscanDto) {
    return this.qrscanService.create(createQrscanDto);
  } */

  @Post()
  scan(@Body() createQrscanDto: CreateQrscanDto) {
    return this.qrscanService.scan(createQrscanDto);
  }

  @Get()
  findAll() {
    return this.qrscanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qrscanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQrscanDto: UpdateQrscanDto) {
    return this.qrscanService.update(+id, updateQrscanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qrscanService.remove(+id);
  }
}
