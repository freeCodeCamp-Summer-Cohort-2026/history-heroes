import {
  ActivityContent,
  ActivitySuccessCriteria,
  ActivityType,
} from '../../activities/types/activity.types';

export class LessonActivityDto {
  id: string;
  title: string;
  type: ActivityType;
  activityType: ActivityType;
  checkStatement: string;
  content: ActivityContent;
  successCriteria: ActivitySuccessCriteria;
  orderIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GetLessonResponseDto {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  contents: string;
  orderIndex: number;
  activities?: LessonActivityDto[];
}

export type LessonResponseDto = GetLessonResponseDto;
