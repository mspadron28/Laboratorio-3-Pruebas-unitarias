import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('UserController - Validación de entradas', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            registerUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('debe registrar un usuario con datos válidos', async () => {
    const validUser: CreateUserDto = {
      name: 'Daniel2_Padron',
      email: 'danpad2@example.com',
      password: 'Admin2828@@',
    };

    jest.spyOn(service, 'registerUser').mockResolvedValue({
      user: { id: 1, name: validUser.name, email: validUser.email },
      token: 'fake-jwt-token',
    });

    const result = await controller.register(validUser);

    expect(result).toHaveProperty('user');
    expect(result.user).toMatchObject({
      id: 1,
      name: validUser.name,
      email: validUser.email,
    });
    expect(result).toHaveProperty('token');
    expect(result.token).toBe('fake-jwt-token');
  });

  it('debe rechazar un usuario con intento de XSS en el nombre', async () => {
    const invalidUser: CreateUserDto = {
      name: '<script>alert("XSS")</script>',
      email: 'danpad2@example.com',
      password: 'Admin2828@@',
    };

    jest.spyOn(service, 'registerUser').mockImplementation(() => {
      throw new BadRequestException('El nombre contiene caracteres no permitidos');
    });

    await expect(controller.register(invalidUser)).rejects.toThrow(BadRequestException);
  });

  it('debe rechazar un usuario con intento de inyección SQL en el email', async () => {
    const invalidUser: CreateUserDto = {
      name: 'Daniel2_Padron',
      email: "danpad2@example.com'; DROP TABLE users; --",
      password: 'Admin2828@@',
    };

    jest.spyOn(service, 'registerUser').mockImplementation(() => {
      throw new BadRequestException('Intento de inyección SQL detectado');
    });

    await expect(controller.register(invalidUser)).rejects.toThrow(BadRequestException);
  });

  it('debe rechazar un usuario con caracteres inválidos en la contraseña', async () => {
    const invalidUser: CreateUserDto = {
      name: 'Daniel2_Padron',
      email: 'danpad2@example.com',
      password: 'Pass<>word123;',
    };

    jest.spyOn(service, 'registerUser').mockImplementation(() => {
      throw new BadRequestException('La contraseña contiene caracteres inválidos');
    });

    await expect(controller.register(invalidUser)).rejects.toThrow(BadRequestException);
  });
});
