import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Get()
  search(@Query('search') search: string) {
    return this.metricsService.search(search);
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Get('/total-animals-by-area')
  findNumberOfAnimalsByArea() {
    return this.metricsService.findNumberOfAnimalsByArea();
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Get('/total-animals-by-specie')
  findNumberOfAnimalsBySpecie() {
    return this.metricsService.findNumberOfAnimalsBySpecie();
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Get('/percentage-of-comments-with-replies')
  findPercentageOfCommentsWithReplies() {
    return this.metricsService.findPercentageOfCommentsWithReplies();
  }
  @Auth(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @Get('/animals')
  findAnimalsByDate(@Query('date') date: string) {
    return this.metricsService.findAnimalsByDate(date);
  }
}
