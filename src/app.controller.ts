import {
  Controller,
  Get,
  Post,
  Res,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import * as cmd from 'node-command-line';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('download')
  async downloadFile(
    @Query('name') name,
    @Query('framerate') framerate: number,
    @Query('loop') loop: boolean,
    @Res() res,
  ): Promise<void> {
    // unpack zip
    const unpackRes = await cmd.run(
      `unzip -q /app/files/${name} -d /app/files/${name}-files`,
    );

    if (unpackRes.success) {
      await fs.readdir(`/app/files/${name}-files`, async (err, items) => {
        // set fileName and loop variable for images
        const fileNumbers = items[items.length - 1].match(/(\d+)/).length;
        const fileName = items[items.length - 1].split(/(\d)/)[0];

        // convert PNG's to APNG
        await cmd.run(
          `ffmpeg -r ${framerate} -i /app/files/${name}-files/${fileName}%0${fileNumbers}d.png -plays ${
            loop ? 0 : 1
          } /app/downloads/${name}.apng`,
        );

        // check if APNG exists & return fileStream of APNG
        const file = await path.basename(`/app/downloads/${name}.apng`);
        if (file) {
          const reader = await fs.createReadStream(
            `/app/downloads/${name}.apng`,
          );
          reader.pipe(res);
        }
      });
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadedFile(@UploadedFile() file) {
    console.log(file);
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }
}
