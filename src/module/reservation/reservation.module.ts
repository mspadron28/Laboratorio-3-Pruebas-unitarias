import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../../config';
@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
   imports:[
      JwtModule.register({
        global: true,
        secret: envs.JWT_SECRET,
        signOptions: { expiresIn: '2h' },
      }),
    ],
})
export class ReservationModule {}
