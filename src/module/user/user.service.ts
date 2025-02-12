import { 
  Injectable, NotFoundException, BadRequestException, UnauthorizedException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; 
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/guards/interfaces/jwt-payload.interface';
import { envs } from '../../config';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Registro de usuario
  async registerUser(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      user: { id: newUser.user_id, name: newUser.name, email: newUser.email },
      token: await this.signJWT({ userId: newUser.user_id, email: newUser.email }),
    };
  }

  // Login de usuario
  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User or password invalid');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('User or password invalid');
    }

    return {
      user: { id: user.user_id, name: user.name, email: user.email },
      token: await this.signJWT({ userId: user.user_id, email: user.email }),
    };
  }

  // Firmar token JWT
  async signJWT(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, { secret: envs.JWT_SECRET });
  }

  // Verificar token JWT
  async verifyToken(token: string) {
    try {
      const { userId, email } = this.jwtService.verify(token, { secret: envs.JWT_SECRET });
      return { userId, email };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Métodos CRUD
  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { user_id: id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { user_id: id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { user_id: id } });
  }
}
