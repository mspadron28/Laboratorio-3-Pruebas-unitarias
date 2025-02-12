import { IsInt, IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsInt()
  trip_id?: number;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'confirmed', 'canceled'])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'paid', 'failed'])
  payment_status?: string;
}
