import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: { email: string; password: string }) {
    // TODO: 実際の認証ロジックを実装
    return {
      message: 'Login endpoint',
      email: loginDto.email,
    };
  }

  async register(registerDto: { email: string; name: string; password: string }) {
    const user = await this.usersService.create(registerDto);
    // TODO: パスワードを返さないようにする
    return {
      message: 'User registered successfully',
      user,
    };
  }
}
