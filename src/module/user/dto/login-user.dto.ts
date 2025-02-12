import { IsEmail, IsNotEmpty, IsStrongPassword, Matches } from 'class-validator';

export class LoginUserDto {
 @IsEmail()
  @Matches(/^[a-zA-Z0-9@._-]+$/, {
    message: 'El correo electrónico contiene caracteres no permitidos.',
  })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Matches(/^[^\s'";<>]*$/, {
    message: 'La contraseña contiene caracteres no permitidos.',
  })
  password: string;
}
