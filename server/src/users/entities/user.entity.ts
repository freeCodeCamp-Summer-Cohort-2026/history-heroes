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
  username: string;

  @Column({ nullable: true })
  email?: string;

  /**
   * SECURITY WARNING: Storing plaintext passwords is insecure and temporary.
   * This is strictly for local dev/testing initialization.
   * TODO: Hash/salt with bcrypt before production use.
   *
   * Issue ref: #46
   */
  @Column({ select: false })
  password?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
