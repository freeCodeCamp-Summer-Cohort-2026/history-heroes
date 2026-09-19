import {} from '../../activities/entities/activity.entity';
import {
  ActivityContent,
  ActivitySuccessCriteria,
  ActivityType,
} from '../../activities/types/activity.types';

export class LabActivityDto {
  id: string;
  title: string;
  type: ActivityType;
  checkStatement: string;
  content: ActivityContent;
  successCriteria: ActivitySuccessCriteria;
  createdAt?: Date;
  updatedAt?: Date;
}

export class LabResponseDto {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  activities: LabActivityDto[];
}
