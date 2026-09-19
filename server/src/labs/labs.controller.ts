import { Controller, Get, Param } from '@nestjs/common';
import { LabsService } from './labs.service';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  /**
   * From a module ID, find its associated lab. The returned lab contains all of its activity data in the same response.
   * @param moduleId The ID of the module associated with the returned lab
   */
  @Get(':moduleId')
  public async getLabByModuleId(@Param('moduleId') moduleId: string) {}
}
