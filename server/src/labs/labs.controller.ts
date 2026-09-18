import { Controller, Get, Param } from '@nestjs/common';

@Controller('labs')
export class LabsController {
  @Get(':moduleId')
  public async getLabByModuleId(@Param('moduleId') moduleId: string) {}
}
