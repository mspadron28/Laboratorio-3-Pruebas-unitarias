import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDestinationDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  country: string;
}
