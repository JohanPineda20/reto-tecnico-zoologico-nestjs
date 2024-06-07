import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AreasService {
  constructor(@InjectRepository(Area)
  private areaRepository: Repository<Area>,){}
  async create(createAreaDto: CreateAreaDto) {
    await this.findByName(createAreaDto.name);
    return this.areaRepository.save(createAreaDto);
  }

  findAll() {
    return this.areaRepository.find({relations: ['species']})
  }

  async findOne(id: number) {
    const area = await this.areaRepository.findOne({where: {id}, relations: ['species']});
    if(!area) throw new NotFoundException(`area not found`)
    return area
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    const area = await this.findOne(id);
    if(updateAreaDto.name && area.name !== updateAreaDto.name) {
      await this.findByName(updateAreaDto.name)
    }
    const areaUpdated = this.areaRepository.merge(area, updateAreaDto)
    return this.areaRepository.save(areaUpdated)
  }

  async remove(id: number) {
    const area = await this.areaRepository.findOne({where: {id}, relations: ['species', 'species.animals']});
    if(!area) throw new NotFoundException(`area not found`)
    for (const species of area.species) {
      if (species.animals.length > 0) {
        throw new ConflictException(`Cannot delete area ${area.name} because species ${species.name} has animals`);
      }
      delete species.animals
    }
    return this.areaRepository.remove(area);
  }
  private async findByName(name: string){
    const area = await this.areaRepository.findOneBy({name});
    if(area){
      throw new ConflictException(`area already exists with name: ${area.name}`);
    }
  }
}
