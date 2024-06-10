import { Injectable } from '@nestjs/common';
import { AnimalsService } from 'src/animals/animals.service';
import { AreasService } from 'src/areas/areas.service';
import { CommentsService } from 'src/comments/comments.service';
import { SpeciesService } from 'src/species/species.service';

@Injectable()
export class MetricsService {
  constructor(private readonly areasService: AreasService,
    private readonly speciesService: SpeciesService,
    private readonly commentsService: CommentsService,
    private readonly animalsService: AnimalsService
  ){}
  findNumberOfAnimalsByArea() {
    return this.areasService.findNumberOfAnimalsByArea();
  }

  findNumberOfAnimalsBySpecie(){
    return this.speciesService.findNumberOfAnimalsBySpecie();
  }
  async findPercentageOfCommentsWithReplies(){
    return {percentage: await this.commentsService.findPercentageOfCommentsWithReplies()};
  }
  findAnimalsByDate(date: string){
    return this.animalsService.findAnimalsByDate(date);
  }
  search(search: string) {
    return this.areasService.search(search);
  }
}
