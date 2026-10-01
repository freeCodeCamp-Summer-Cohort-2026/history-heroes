import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginRequestDto } from '../auth/dto/login-request.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Optional()
    private readonly configService?: ConfigService,
  ) {
    this.saltRounds = Number(
      this.configService?.get<number | string>('BCRYPT_SALT_ROUNDS', 10) ?? 10,
    );
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
  }): Promise<User> {
    const userToCreate = new User();

    userToCreate.email = user.email;
    userToCreate.password = await bcrypt.hash(user.password, this.saltRounds);

    const createdUser = await this.usersRepository.save(userToCreate);

    return createdUser;
  }
}
