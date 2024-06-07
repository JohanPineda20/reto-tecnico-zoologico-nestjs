import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { AreasService } from 'src/areas/areas.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private specieRepository: Repository<Species>,
    private readonly areaService: AreasService){}
  async create(createSpeciesDto: CreateSpeciesDto) {
    await this.findByName(createSpeciesDto.name)
    const area = await this.areaService.findOne(createSpeciesDto.areaId)
    delete area.species
    return this.specieRepository.save({name: createSpeciesDto.name, area});
  }

  findAll() {
    return this.specieRepository.find({relations: ['area','animals']})
  }

  async findOne(id: number) {
    const specie = await this.specieRepository.findOne({where: {id}, relations: ['area','animals']});
    if(!specie) throw new NotFoundException(`specie not found`)
    return specie;
  }

  async update(id: number, updateSpeciesDto: UpdateSpeciesDto) {
    const specie = await this.findOne(id);
    if(updateSpeciesDto.name && specie.name !== updateSpeciesDto.name) {
      await this.findByName(updateSpeciesDto.name)
    }
    if(updateSpeciesDto.areaId){
      const area = await this.areaService.findOne(updateSpeciesDto.areaId)
      specie.area.id = area.id;
    }
    const specieUpdated = this.specieRepository.merge(specie, updateSpeciesDto);
    return await this.specieRepository.save(specieUpdated);
  }

  async remove(id: number) {
    const specie = await this.findOne(id);
    if(specie.animals.length > 0){
      throw new ConflictException(`cannot delete specie with animals`);
    }
    return await this.specieRepository.remove(specie);
  }
  private async findByName(name: string){
    const specie = await this.specieRepository.findOneBy({name});
    if(specie){
      throw new ConflictException(`specie already exists with name: ${specie.name}`);
    }
  }
}
