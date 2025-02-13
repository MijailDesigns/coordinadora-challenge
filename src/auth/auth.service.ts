import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const user = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (user) {
      throw new ConflictException('User already exists');
    }
    const newUser = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new BadRequestException('Credentials are not valid');

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Credentials are not valid');

    return {
      ...user,
      token: this.jwtService.sign({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
