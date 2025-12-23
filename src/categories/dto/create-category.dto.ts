import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CategoriyCreateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string = '';

  @IsBoolean()
  active: boolean = true;
}
