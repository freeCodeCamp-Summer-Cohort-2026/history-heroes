import { Lesson } from '../entities/lesson.entity';

/**
 * Interface representing the return data type for
 * the getModuleLessons endpoint, which returns
 * all the lessons and activities for a given moduleId
 */
export interface GetModuleLessonsResponseDto {
  /**
   * TODO: this is a temporary type for fake data,
   * this should be replaced/provided via #50.
   */
  lessons: Array<Lesson>;
}
