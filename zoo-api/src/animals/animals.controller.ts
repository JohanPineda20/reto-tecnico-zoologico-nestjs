import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { Payload } from 'src/common/interfaces/payload';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}
  @Auth(RoleEnum.ADMIN)
  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(createAnimalDto);
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Get()
  findAll() {
    return this.animalsService.findAll();
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.animalsService.findOne(id);
  }
  @Auth(RoleEnum.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalsService.update(id, updateAnimalDto);
  }
  @Auth(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.animalsService.remove(id);
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Post(':id/comments')
  createComment(@Param('id', ParseIntPipe) id: number, 
                @Body() createCommentDto: CreateCommentDto,
                @AuthUser() user: Payload) {
    return this.animalsService.createComment(id, user, createCommentDto);
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Patch(':id/comments/:commentId')
  updateComment(@Param('id', ParseIntPipe) id: number, 
                @Body() updateCommentDto: UpdateCommentDto,
                @AuthUser() user: Payload,
                @Param('commentId', ParseIntPipe) commentId: number) {
    return this.animalsService.updateComment(id, user, updateCommentDto, commentId);
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Delete(':id/comments/:commentId')
  removeComment(@Param('id', ParseIntPipe) id: number,
                @AuthUser() user: Payload,
                @Param('commentId', ParseIntPipe) commentId: number) {
    return this.animalsService.removeComment(id, user, commentId);
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Post(':id/comments/:commentId')
  createReply(@Param('id', ParseIntPipe) id: number, 
              @Body() createCommentDto: CreateCommentDto,
              @AuthUser() user: Payload,
              @Param('commentId', ParseIntPipe) commentId: number) {
    return this.animalsService.createReply(id, user, createCommentDto, commentId);
  }
}
