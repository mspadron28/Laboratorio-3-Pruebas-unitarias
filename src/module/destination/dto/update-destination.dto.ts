import { IsOptional } from 'class-validator';

export class UpdateDestinationDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  country?: string;
}
