import { Injectable, NotFoundException } from '@nestjs/common';
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
   * Returns user data for the user with the given email address.   *Assumes the use-case for registration. Will return null if the user with this email does not exist.he login request email type, which ultimately is just a string.
   *
   * @throws NotFoundException if the user with the given email does not exist.
   */
  async getByEmail(
    email: Pick<LoginRequestDto, 'email'>,
  ): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email: email.email },
    });

    return user || null;
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
    userToCreate.password = user.password; // In a real application, you should hash the password before saving it.

    const createdUser = await this.usersRepository.save(userToCreate);

    return createdUser;
  }
}
