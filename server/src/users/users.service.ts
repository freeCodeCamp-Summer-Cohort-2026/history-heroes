import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginRequestDto } from '../auth/dto/login-request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

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
       * this is false as this is plaintext and a security risk.
       *
       * Post #46, this will be unhashed for external comparison, but probably via another setting
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
    // TODO: add hashing here, see issue #46
    userToCreate.password = user.password;

    const createdUser = await this.usersRepository.save(userToCreate);

    return createdUser;
  }
}
