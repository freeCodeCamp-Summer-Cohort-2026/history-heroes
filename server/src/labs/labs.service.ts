import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../modules/entities/module.entity';
import { Activity } from '../activities/entities/activity.entity';
import { Lab } from './entities/lab.entity';

@Injectable()
export class LabsService {
  constructor(
    @InjectRepository(Lab)
    private readonly labsRepository: Repository<Lab>,
    @InjectRepository(Module)
    private readonly modulesRepository: Repository<Module>,
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  public async findByModuleId(moduleId: string) {
    // find lab entity by module id

    // find all associated activities
  }
}
