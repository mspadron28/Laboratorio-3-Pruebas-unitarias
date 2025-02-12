import { IsInt, IsNotEmpty, IsPositive, IsDateString, Min } from 'class-validator';

export class CreateTripDto {
  @IsInt()
  @IsNotEmpty()
  destination_id: number;

  @IsDateString()
  @IsNotEmpty()
  departure_date: string;

  @IsDateString()
  @IsNotEmpty()
  return_date: string;

  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  available_seats: number;
}
