import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './interfaces /jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const userFound = await this.userService.findOne(email);

    if (!userFound || !bcrypt.compareSync(password, userFound.password))
      throw new UnauthorizedException('Invalid Credentials');

    const payload: JWTPayload = {
      sub: userFound._id.toString(),
      email: userFound.email,
      role: userFound.role.name,
    };
    try {
      return {
        user: {
          name: userFound.name,
          email: userFound.email,
          role: userFound.role.name,
        },
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }
}
