import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository } from 'typeorm';

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
  async findAnimalsByArea(id: number) {
    const area = await this.areaRepository.findOne({
      where: {id, species: {animals: {comments: { parentComment: IsNull() }}}}, 
      relations: ['species', 'species.animals', 'species.animals.comments', 'species.animals.comments.author', 'species.animals.comments.replies', 'species.animals.comments.replies.author'],
      select: {
        species: {
          id: true,
          name: true,
          animals: {
            id: true,
            name: true,
            comments: {
              id: true,
              body: true,
              createdAt: true,
              author: { email: true },
              replies: {
                id: true,
                body: true,
                createdAt: true,
                author: { email: true },
              }}}}}
    });
    if(!area) throw new NotFoundException(`area not found`)
    return area;
  }
  private async findByName(name: string){
    const area = await this.areaRepository.findOneBy({name});
    if(area){
      throw new ConflictException(`area already exists with name: ${area.name}`);
    }
  }

  async findNumberOfAnimalsByArea(){
    const areasWithAnimalCount = await this.areaRepository.createQueryBuilder('area')
    .select('area.id', 'id')
    .addSelect('area.name', 'name')
    .addSelect('COUNT(animal.id)', 'animalCount')
    .leftJoin('area.species', 'species')
    .leftJoin('species.animals', 'animal')
    .groupBy('area.id')
    .getRawMany();

    return areasWithAnimalCount;
  }

  async search(search: string){
    const result = await this.areaRepository.createQueryBuilder('area')
            .leftJoin('area.species', 'species')
            .leftJoin('species.animals', 'animals')
            .leftJoin('animals.comments', 'comments')
            .leftJoin('comments.author', 'commentAuthor')
            .leftJoin('comments.replies', 'replies')
            .leftJoin('replies.author', 'replyAuthor')
            .addSelect(['species.id','species.name', 
              'animals.id', 'animals.name', 
              'comments.id', 'comments.body', 'comments.createdAt', 'commentAuthor.email',
              'replies.id', 'replies.body', 'replies.createdAt', 'replyAuthor.email'])
            .where('comments.parentComment IS NULL')
            .andWhere(new Brackets(qb => {
              qb.where('area.name LIKE :query', { query: `%${search}%` })
                .orWhere('species.name LIKE :query', { query: `%${search}%` })
                .orWhere('animals.name LIKE :query', { query: `%${search}%` })
                .orWhere('comments.body LIKE :query', { query: `%${search}%` })
                .orWhere('replies.body LIKE :query', { query: `%${search}%` })
          }))
            .getMany();
    return result;
  }
}
