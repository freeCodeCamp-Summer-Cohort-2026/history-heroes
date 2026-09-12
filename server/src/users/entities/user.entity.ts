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
   * SECURITY WARNING: Storing plaintext passwords is insecure and temporary.
   * This is strictly for local dev/testing initialization.
   * TODO: Hash/salt with bcrypt before production use.
   *
   * Issue ref: #46
   */
  @Column({
    // select is false as we never implicitly return this information.
    select: false,
  })
  password?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
