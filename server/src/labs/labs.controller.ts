import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { LabsService } from './labs.service';
import { LabResponseDto } from './dtos/get-lab-response.dto';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  /**
   * From a module ID, find its associated lab. The returned lab contains all of its activity data in the same response.
   * @param moduleId The ID of the module associated with the returned lab
   */
  @Get(':moduleId')
  public async getLabByModuleId(
    @Param('moduleId') moduleId: string,
  ): Promise<LabResponseDto> {
    const lab = await this.labsService.findByModuleId(moduleId);

    if (!lab) {
      throw new NotFoundException(`Lab with module ID ${moduleId} not found.`);
    }

    return lab;
  }
}
