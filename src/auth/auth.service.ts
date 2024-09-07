import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/roles/decorator.ts/role.decorator';
import { Role } from 'src/roles/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(user: SignInDto): Promise<{ access_token: string }> {
    const { username, password } = user;
    const validUser = await this.validateUser(username, password);
  
    // Corrigindo o payload para pegar o role do usuário
    const payload = { username: validUser.username, role: validUser.role };
  
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
          role: user.role
        };
      }
    }
    throw new UnauthorizedException(
      'Email address or password provided is incorrect.',
    );
  }
}