import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '../auth/guards';

describe('RS1: Autenticación y Autorización', () => {
  let app: INestApplication;
  let reservationService = { create: jest.fn() };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        { provide: ReservationService, useValue: reservationService },
      ],
    })
      .overrideGuard(AuthGuard) // Simula el AuthGuard
      .useValue({
        canActivate: jest.fn().mockImplementation((context) => {
          const request = context.switchToHttp().getRequest();
          if (request.headers.authorization === 'Bearer valid_token') {
            request.user = { userId: 1, email: 'test@example.com' }; // Simulamos un usuario autenticado
            return true;
          }
          return false;
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Debe rechazar la creación de una reserva si el usuario no está autenticado', async () => {
    return request(app.getHttpServer())
      .post('/reservation')
      .send({ tripId: 1, userId: 2 })
      .expect(401); // Unauthorized
  });

  it('Debe permitir la creación de una reserva si el usuario está autenticado', async () => {
    reservationService.create.mockResolvedValue({
      reservation_id: 1,
      tripId: 1,
      userId: 2,
    });

    return request(app.getHttpServer())
      .post('/reservation')
      .set('Authorization', 'Bearer valid_token') // Simulamos un token válido
      .send({ tripId: 1, userId: 2 })
      .expect(201) // Created
      .expect((res) => {
        expect(res.body).toHaveProperty('reservation_id', 1);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
