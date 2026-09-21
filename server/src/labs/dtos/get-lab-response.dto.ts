import {
  ActivityContent,
  ActivitySuccessCriteria,
  ActivityType,
} from '../../activities/types/activity.types';

export interface LabActivityDto {
  id: string;
  title: string;
  type: ActivityType;
  checkStatement: string;
  content: ActivityContent;
  successCriteria: ActivitySuccessCriteria;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LabResponseDto {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  activities: LabActivityDto[];
}
