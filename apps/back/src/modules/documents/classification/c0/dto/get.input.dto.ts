import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class C0GetInputDto {
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  id: string;
}
