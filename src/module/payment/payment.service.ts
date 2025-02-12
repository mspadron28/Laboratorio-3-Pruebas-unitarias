import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { envs } from '../../config';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {
    this.verifyOrGenerateKeys();
  }

  // Método para verificar o generar claves
  public verifyOrGenerateKeys() {
    if (!envs.ENCRYPTION_KEY || envs.ENCRYPTION_KEY.length !== 44) {
      console.warn('ENCRYPTION_KEY no es válida, generando una nueva...');
      envs.ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64');
    }
    if (!envs.IV_KEY || envs.IV_KEY.length !== 24) {
      console.warn('IV_KEY no es válida, generando un nuevo IV...');
      envs.IV_KEY = crypto.randomBytes(16).toString('base64');
    }

    console.log('ENCRYPTION_KEY:', envs.ENCRYPTION_KEY);
    console.log('IV_KEY:', envs.IV_KEY);
  }

  // Método para encriptar datos sensibles
  public encryptData(data: string): string {
    const key = Buffer.from(envs.ENCRYPTION_KEY, 'base64');
    const iv = Buffer.from(envs.IV_KEY, 'base64');

    console.log('Longitud de la clave:', key.length);
    console.log('Longitud del IV:', iv.length); 

    if (key.length !== 32) throw new Error('Clave incorrecta. Debe ser de 32 bytes.');
    if (iv.length !== 16) throw new Error('IV incorrecto. Debe ser de 16 bytes.');

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    console.log('Datos encriptados:', encrypted);
    return encrypted;
  }

  // 🔹 Método para desencriptar datos sensibles
  public decryptData(data: string): string {
    const key = Buffer.from(envs.ENCRYPTION_KEY, 'base64');
    const iv = Buffer.from(envs.IV_KEY, 'base64');

    console.log('Intentando desencriptar datos:', data);
    console.log('Longitud de la clave:', key.length);
    console.log('Longitud del IV:', iv.length);

    if (key.length !== 32) throw new Error('Clave incorrecta en desencriptación.');
    if (iv.length !== 16) throw new Error('IV incorrecto en desencriptación.');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    console.log('Datos desencriptados:', decrypted);
    return decrypted;
  }

  async create(createPaymentDto: CreatePaymentDto) {
    console.log('Creando pago:', createPaymentDto);

    // Encriptamos el método de pago antes de guardarlo
    const encryptedPaymentMethod = this.encryptData(createPaymentDto.payment_method);

    return this.prisma.payment.create({
      data: {
        reservation_id: createPaymentDto.reservation_id,
        amount: createPaymentDto.amount,
        payment_method: encryptedPaymentMethod,
        status: createPaymentDto.status,
        transaction_id: createPaymentDto.transaction_id,
      },
    });
  }

  async findAll() {
    console.log('Buscando todos los pagos');
    return this.prisma.payment.findMany({
      include: { reservation: true },
    });
  }

  async findOne(id: number) {
    console.log(`Buscando pago con ID: ${id}`);

    const payment = await this.prisma.payment.findUnique({
      where: { payment_id: id },
    });

    if (!payment) {
      console.error(`Pago con ID ${id} no encontrado`);
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Desencriptamos el método de pago antes de devolverlo
    return {
      ...payment,
      payment_method: this.decryptData(payment.payment_method),
    };
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    console.log(`Actualizando pago con ID: ${id}`);
    return this.prisma.payment.update({
      where: { payment_id: id },
      data: updatePaymentDto,
    });
  }

  async remove(id: number) {
    console.log(`Eliminando pago con ID: ${id}`);
    return this.prisma.payment.delete({
      where: { payment_id: id },
    });
  }
}
