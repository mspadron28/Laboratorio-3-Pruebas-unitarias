import { IsInt, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  @IsEnum(['pending', 'sent', 'failed'])
  status?: string;
}
