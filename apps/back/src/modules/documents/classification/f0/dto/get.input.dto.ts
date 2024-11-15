import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class F0GetInputDto {
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  id: string;
}
