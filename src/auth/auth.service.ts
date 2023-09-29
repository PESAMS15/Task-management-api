import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { AuthCrediventialsDto } from './dto/auth-credientials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload-interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private UserRepository: MongoRepository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(AuthCrediventialsDto: AuthCrediventialsDto): Promise<User> {
    const { username, password } = AuthCrediventialsDto;
    const salt = await bcrypt.genSalt();
    const user = this.UserRepository.create({
      username,
      salt,
      password: await this.hashPassword(password, salt),
    });
    try {
      await this.UserRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    AuthCrediventialsDto: AuthCrediventialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = AuthCrediventialsDto;
    const user = await this.UserRepository.findOne({ where: { username } });
    if (user && (await user.validatePassword(password))) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      this.logger.debug(
        `Generated JWT Token with payload ${JSON.stringify(payload)}`,
      );
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
