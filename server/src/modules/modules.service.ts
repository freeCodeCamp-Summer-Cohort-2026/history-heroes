import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private readonly modulesRepository: Repository<Module>,
  ) {}

  /**
   * Returns the learning module with the given ID, or throws an error if not found.
   */
  async findById(moduleId: string): Promise<Module | null> {
    const module = await this.modulesRepository.findOne({
      where: { id: moduleId },
    });
    return module;
  }

  /**
   * Returns a list of all learning modules in the database, ordered by their display order.
   */
  async findAll(): Promise<Module[]> {
    return this.modulesRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }
}
