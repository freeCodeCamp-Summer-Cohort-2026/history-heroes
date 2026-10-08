import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { GetModuleLessonsResponseDto } from './dto/get-module-lessons-response.dto';
import { LessonsService } from '../lessons/lessons.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UpdateModuleDto, updateModuleSchema } from './dto/update-module.dto';
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe';

@Controller('modules')
export class ModulesController {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly lessonsService: LessonsService,
  ) {}

  /**
   * Returns the list of all available learning modules in the database.
   *
   * This can be loaded at: https://localhost:3000/api/v1/modules
   */
  @Get()
  public findAll(): Promise<Module[]> {
    return this.modulesService.findAll();
  }

  @Patch(':moduleId')
  @UseGuards(AuthenticatedGuard)
  public update(
    @Param('moduleId') moduleId: string,
    @Body(new ZodValidationPipe(updateModuleSchema))
    updates: UpdateModuleDto,
  ): Promise<Module> {
    return this.modulesService.update(moduleId, updates);
  }

  @Get(':moduleId/lessons')
  public getModuleLessons(
    @Param('moduleId') moduleId: string,
  ): Promise<GetModuleLessonsResponseDto> {
    return this.lessonsService.getModuleLessons(moduleId);
  }
}
