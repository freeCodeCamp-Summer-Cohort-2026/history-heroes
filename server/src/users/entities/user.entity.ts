import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  /**
   * Password stored as a salted bcrypt hash.
   * `select: false` ensures password hash is never implicitly returned in queries.
   */
  @Column({
    // select is false as we never implicitly return this information.
    select: false,
  })
  password?: string;

  @Column({ default: false })
  isContentAuthor: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
