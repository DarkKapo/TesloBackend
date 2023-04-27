import { Controller, Get } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOkResponse({ description: 'Seed ok' })
  @ApiNotFoundResponse({ description: 'Not found' })
  executeSeed() {
    return this.seedService.runSeed()
  }
}
