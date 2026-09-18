import { Controller, Get, Param } from '@nestjs/common';
import { LabsService } from './labs.service';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Get(':moduleId')
  public async getLabByModuleId(@Param('moduleId') moduleId: string) {}
}
