import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { envs } from '../../config';

describe('Encriptación de datos sensibles', () => {
  let controller: PaymentController;
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService, PrismaService],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  it('debe ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe cifrar el método de pago antes de guardar', async () => {
    const createPaymentDto: CreatePaymentDto = {
      reservation_id: 2,
      amount: 1300.75,
      payment_method: 'Credit Card',
      status: 'successful',
      transaction_id: 'TXN987601',
    };

    const encryptSpy = jest.spyOn(service, 'encryptData');

    await controller.create(createPaymentDto);

    expect(encryptSpy).toHaveBeenCalledWith(createPaymentDto.payment_method);
  });

  it('debería descifrar el método de pago al recuperar el pago', async () => {
    const key = Buffer.from(envs.ENCRYPTION_KEY, 'base64');
    const iv = Buffer.from(envs.IV_KEY, 'base64');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encryptedMethod = cipher.update('Credit Card', 'utf8', 'hex');
    encryptedMethod += cipher.final('hex');

    // Simulamos la búsqueda de un pago en la base de datos
    jest.spyOn(service, 'findOne').mockImplementation(async () => {
      return {
        payment_id: 3,
        reservation_id: 2,
        amount: 1300.75,
        payment_method: service.decryptData(encryptedMethod),
        status: 'successful',
        transaction_id: 'TXN987601',
        created_at: new Date(),
      };
    });

    const result = await controller.findOne('3');

    expect(result.payment_method).toBe('Credit Card');
  });
});
