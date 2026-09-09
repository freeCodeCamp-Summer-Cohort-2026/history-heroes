/**
 * DTO or data-transfer-object that represents what individual items are returned from the individual modules endpoint
 */
export class ModuleResponseDto {
  id: string;
  title: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
