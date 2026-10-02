/**
 * DTO representing the response returned when resetting user or session progress.
 */
export class ResetProgressResponseDto {
  message: string;
  deletedLessons: number;
  deletedLabs: number;
}
