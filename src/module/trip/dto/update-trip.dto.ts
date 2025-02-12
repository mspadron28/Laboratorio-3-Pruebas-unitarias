import { IsInt, IsOptional, IsPositive, IsDateString, Min } from 'class-validator';

export class UpdateTripDto {
  @IsOptional()
  @IsInt()
  destination_id?: number;

  @IsOptional()
  @IsDateString()
  departure_date?: string;

  @IsOptional()
  @IsDateString()
  return_date?: string;

  @IsOptional()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  available_seats?: number;
}
