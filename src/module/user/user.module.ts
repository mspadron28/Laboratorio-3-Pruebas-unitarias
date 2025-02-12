import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../../config';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports:[
    JwtModule.register({
      global: true,
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  exports: [UserService],
})
export class UserModule {}
