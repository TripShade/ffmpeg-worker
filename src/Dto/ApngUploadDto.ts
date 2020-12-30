import { IsNumberString, IsBooleanString } from 'class-validator';

export class ApngUploadDto {
  @IsNumberString()
  framerate: number;

  @IsBooleanString()
  loop: boolean;
}
