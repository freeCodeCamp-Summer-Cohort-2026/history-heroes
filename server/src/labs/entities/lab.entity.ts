import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('labs')
export class Lab {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'moduleId', type: 'varchar', length: 50 })
  moduleId: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'array' })
  activityIds: string[];
}
