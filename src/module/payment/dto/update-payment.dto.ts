import { IsInt, IsOptional, IsString, IsEnum, IsPositive, IsUUID } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsInt()
  reservation_id?: number;

  @IsOptional()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'paid', 'failed'])
  status?: string;

  @IsOptional()
  @IsUUID()
  transaction_id?: string;
}
