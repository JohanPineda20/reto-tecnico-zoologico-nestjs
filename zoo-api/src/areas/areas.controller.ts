import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}
  @Auth(RoleEnum.ADMIN)
  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Get()
  findAll() {
    return this.areasService.findAll();
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.areasService.findOne(id);
  }
  @Auth(RoleEnum.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.update(id, updateAreaDto);
  }
  @Auth(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.areasService.remove(id);
  }
}
