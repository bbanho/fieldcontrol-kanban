import { IsString, IsInt, Min, MaxLength } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsInt()
  @Min(0)
  position: number;
} 