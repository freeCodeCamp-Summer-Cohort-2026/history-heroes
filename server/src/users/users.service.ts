import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Returns user data for the current authenticated user.
   * Currently retrieves the seeded 'test-user' until auth guards are implemented.
   */
  async getMe(): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username: 'test-user' },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
