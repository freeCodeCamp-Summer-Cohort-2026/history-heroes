import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lab } from './entities/lab.entity';
import { LabResponseDto } from './dtos/get-lab-response.dto';
import { LabActivityAssignment } from '../activities/entities/lab-activity-assignment.entity';

@Injectable()
export class LabsService {
  constructor(
    @InjectRepository(Lab)
    private readonly labsRepository: Repository<Lab>,
    @InjectRepository(LabActivityAssignment)
    private readonly assignmentsRepository: Repository<LabActivityAssignment>,
  ) {}

  public async findByModuleId(
    moduleId: string,
  ): Promise<LabResponseDto | null> {
    // find lab entity by module id
    const lab = await this.labsRepository.findOneBy({ moduleId });

    if (!lab) return null;

    // find all associated activities
    const assignments = await this.assignmentsRepository.find({
      where: {
        labId: lab.id,
      },
      relations: {
        activity: true,
      },
    });

    const activities = assignments.map(({ activity }) => activity);

    return {
      id: lab.id,
      moduleId: lab.moduleId,
      title: lab.title,
      description: lab.description,
      activities,
    };
  }
}
