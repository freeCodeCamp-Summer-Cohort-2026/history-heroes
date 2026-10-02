import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginRequestDto } from '../auth/dto/login-request.dto';
import { UserLessonProgress } from '../progress/entities/user-lesson-progress.entity';
import { UserLabProgress } from '../progress/entities/user-lab-progress.entity';

@Injectable()
export class UsersService {
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Optional()
    private readonly configService?: ConfigService,
    @Optional()
    private readonly dataSource?: DataSource,
  ) {
    const rounds = Number(
      this.configService?.get<number | string>('BCRYPT_SALT_ROUNDS', 10) ?? 10,
    );
    if (!Number.isInteger(rounds) || rounds < 10) {
      throw new Error('BCRYPT_SALT_ROUNDS must be at least 10');
    }
    this.saltRounds = rounds;
  }

  /**
   * Returns user data for the user with the given email address.
   * Assumes the use-case for registration/login. Will return null if the user with this email does not exist.
   *
   * @throws NotFoundException if the user with the given email does not exist.
   */
  async getByEmail(
    email: Pick<LoginRequestDto, 'email'>,
    settings: {
      /**
       * If we are to include the password in the response, by default
       * this is false as this is a security risk.
       *
       * When included, this contains the hashed password for comparison.
       */
      includePassword?: boolean;
    } = {},
  ): Promise<User | null> {
    const { includePassword = false } = settings;

    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email.email });

    if (includePassword) {
      query.addSelect('user.password');
    }

    const user = await query.getOne();

    return user;
  }

  /**
   * Returns user data for the user with the given ID.
   * Assumes the use-case for profile/session lookups. Will return null if the user does not exist.
   */
  async getById(
    id: number,
    settings: {
      /**
       * If we are to include the password in the response, by default
       * this is false as this is a security risk.
       */
      includePassword?: boolean;
    } = {},
  ): Promise<User | null> {
    const { includePassword = false } = settings;

    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id });

    if (includePassword) {
      query.addSelect('user.password');
    }

    const user = await query.getOne();

    return user;
  }

  /**
   * Updates the isContentAuthor flag for the given user.
   *
   * @throws NotFoundException if user does not exist.
   */
  async updateContentAuthor(
    userId: number,
    isContentAuthor: boolean,
  ): Promise<User> {
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.isContentAuthor = isContentAuthor;
    return await this.usersRepository.save(user);
  }

  /**
   * Changes the password for the given user after verifying their current password.
   *
   * @throws NotFoundException if user does not exist.
   * @throws BadRequestException if current password does not match or new password is invalid.
   */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException(
        'New password must be at least 8 characters long',
      );
    }

    const user = await this.getById(userId, { includePassword: true });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isMatch =
      user.password &&
      (await this.comparePassword(currentPassword, user.password));
    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }

    user.password = await bcrypt.hash(newPassword, this.saltRounds);
    await this.usersRepository.save(user);
  }

  /**
   * Deletes a user and cleans up their associated lesson and lab progress records.
   *
   * @throws NotFoundException if user does not exist.
   */
  async deleteUser(userId: number): Promise<void> {
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (this.dataSource) {
      await this.dataSource.transaction(async (manager) => {
        await manager.getRepository(UserLessonProgress).delete({ userId });
        await manager.getRepository(UserLabProgress).delete({ userId });
        await manager.getRepository(User).delete(userId);
      });
    } else {
      await this.usersRepository.delete(userId);
    }
  }

  /**
   * Compares a plaintext password with a hashed password using bcrypt.
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Create a new user with the given email and password.
   */
  async create(user: {
    /**
     * The email of the user to create, is unique in the database
     */
    email: string;
    /**
     * Plaintext password, will be hashed/salted before creation.
     */
    password: string;
    /**
     * Whether the user is a content author
     */
    isContentAuthor?: boolean;
  }): Promise<User> {
    const userToCreate = new User();

    userToCreate.email = user.email;
    userToCreate.password = await bcrypt.hash(user.password, this.saltRounds);
    userToCreate.isContentAuthor = user.isContentAuthor ?? false;

    const createdUser = await this.usersRepository.save(userToCreate);

    return createdUser;
  }
}
