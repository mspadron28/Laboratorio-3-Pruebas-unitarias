import { IsInt, IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  trip_id: number;

  @IsString()
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'canceled'])
  status?: string;

  @IsString()
  @IsOptional()
  @IsIn(['pending', 'paid', 'failed'])
  payment_status?: string;
}
