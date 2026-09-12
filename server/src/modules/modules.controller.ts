import { Controller, Get } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { ApiResponse } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

class ModulesDto{
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;  
}

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  /**
   * Returns the list of all available learning modules in the database.
   *
   * This can be loaded at: https://localhost:3000/api/v1/modules
   */
  @Get()
  @ApiResponse({ type: ModulesDto })
  public findAll(): Promise<Module[]> {
    return this.modulesService.findAll();
  }
}
