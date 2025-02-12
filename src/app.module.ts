import { Module } from '@nestjs/common';

import { UserModule } from './module/user/user.module';
import { DestinationModule } from './module/destination/destination.module';
import { TripModule } from './module/trip/trip.module';
import { ReservationModule } from './module/reservation/reservation.module';
import { PaymentModule } from './module/payment/payment.module';
import { NotificationModule } from './module/notification/notification.module';
import { PrismaModule } from './module/prisma/prisma.module';

@Module({
  imports: [UserModule, DestinationModule, TripModule, ReservationModule, PaymentModule, NotificationModule, PrismaModule],
})
export class AppModule {}
