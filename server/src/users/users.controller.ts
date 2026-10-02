import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe';
import {
  ChangePasswordDto,
  changePasswordSchema,
  UpdateContentAuthorDto,
  updateContentAuthorSchema,
} from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Updates current user's isContentAuthor status.
   * Accessible at: PATCH /api/v1/users/me
   */
  @Patch('me')
  @UseGuards(AuthenticatedGuard)
  async updateMe(
    @Body(new ZodValidationPipe(updateContentAuthorSchema))
    body: UpdateContentAuthorDto,
    @Req() req: Request,
  ) {
    const userId = req.session.userId!;
    const user = await this.usersService.updateContentAuthor(
      userId,
      body.isContentAuthor,
    );

    return {
      id: user.id,
      email: user.email,
      isContentAuthor: user.isContentAuthor,
    };
  }

  /**
   * Updates current user's isContentAuthor status via PUT.
   * Accessible at: PUT /api/v1/users/me
   */
  @Put('me')
  @UseGuards(AuthenticatedGuard)
  async updateMePut(
    @Body(new ZodValidationPipe(updateContentAuthorSchema))
    body: UpdateContentAuthorDto,
    @Req() req: Request,
  ) {
    return this.updateMe(body, req);
  }

  /**
   * Changes current user's password.
   * Accessible at: POST /api/v1/users/me/change-password
   */
  @Post('me/change-password')
  @UseGuards(AuthenticatedGuard)
  async changePassword(
    @Body(new ZodValidationPipe(changePasswordSchema)) body: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const userId = req.session.userId!;
    await this.usersService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
    );

    return { message: 'Password updated successfully' };
  }

  /**
   * Deletes current user's account and destroys their active session.
   * Accessible at: DELETE /api/v1/users/me
   */
  @Delete('me')
  @UseGuards(AuthenticatedGuard)
  async deleteMe(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.session?.userId;
    if (userId) {
      await this.usersService.deleteUser(userId);
    }

    if (req.session?.destroy) {
      await new Promise<void>((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            return reject(
              new InternalServerErrorException('Failed to destroy session'),
            );
          }
          resolve();
        });
      });
    }

    res.clearCookie('connect.sid', { path: '/' });
    return { message: 'Account deleted successfully' };
  }
}
