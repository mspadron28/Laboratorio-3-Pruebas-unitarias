import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'sent', 'failed'])
  status?: string;
}
