import { Controller, Get, UseGuards } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';

@Controller('modules')
// **Note** this is provided here more on the basis of example.
// at the time of writing its unclear if this endpoint is actually blocked
@UseGuards(SessionAuthGuard)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  /**
   * Returns the list of all available learning modules in the database.
   *
   * This can be loaded at: https://localhost:3000/api/v1/modules
   */
  @Get()
  public findAll(): Promise<Module[]> {
    return this.modulesService.findAll();
  }
}
