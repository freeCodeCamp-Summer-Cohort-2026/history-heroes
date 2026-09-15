import { Lesson } from '../entities/lesson.entity';

/**
 * Interface representing the return data type for
 * the getModuleLessons endpoint, which returns
 * all the lessons and activities for a given moduleId
 */
export type GetModuleLessonsResponseDto = Lesson[];
