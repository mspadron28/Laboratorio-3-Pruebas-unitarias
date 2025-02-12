import { IsInt, IsNotEmpty, IsString, IsOptional, IsPositive, IsEnum, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  reservation_id: number;

  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsString()
  @IsOptional()
  @IsEnum(['pending', 'paid', 'failed'])
  status?: string;

  @IsUUID()
  @IsOptional()
  transaction_id?: string;
}
