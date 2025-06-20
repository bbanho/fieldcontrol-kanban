import { IsString, IsInt, Min, MaxLength, IsOptional } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  position: number;

  @IsInt()
  @Min(1)
  columnId: number;
} 