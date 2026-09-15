import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { GetModuleLessonsResponseDto } from './dto/get-module-lessons-response.dto';
import { LessonsService } from './lessons.service';

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

  @Get(':moduleId/lessons')
  public async getModuleLessons(
    @Param('moduleId') moduleId: string,
  ): Promise<GetModuleLessonsResponseDto> {
    const [module, lessons] = await Promise.all([
      this.modulesService.findById(moduleId),
      this.lessonsService.getModuleLessons(moduleId),
    ]);
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found.`);
    }

    return {
      lessons,
    };
  }
}
