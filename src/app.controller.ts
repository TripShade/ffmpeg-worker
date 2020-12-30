import {
  Controller,
  Get,
  Post,
  Res,
  UseInterceptors,
  UploadedFile,
  Query,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import * as cmd from 'node-command-line';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApngUploadDto } from './Dto/ApngUploadDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('gif/download')
  async downloadFileGif(@Query('name') name, @Res() res): Promise<void> {
    const file = await path.basename(`/app/downloads/${name}.gif`);
    if (file) {
      res.set({
        'Content-Type': 'image/gif',
      });
      await res.sendFile(`downloads/${name}.gif`, { root: './' });
    }
  }

  @Post('gif/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadedFileGif(
    @UploadedFile() file,
    @Body() apngUploadDto: ApngUploadDto,
  ) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };

    const unpackRes = await cmd.run(
      `unzip -q /app/files/${file.filename} -d /app/files/${file.filename}-files`,
    );

    if (unpackRes.success) {
      const converted = await this.appService.convertSequence(
        apngUploadDto,
        file,
        'gif',
      );
      if (!converted) {
        response['error'] = 'Files failed converting';
      }
    } else {
      fs.unlink(`/app/files/${file.filename}`, (err) => console.log(err));
      response['error'] = 'File is not a ZIP!';
    }
    return response;
  }

  @Get('apng/download')
  async downloadFileApng(@Query('name') name, @Res() res): Promise<void> {
    const file = await path.basename(`/app/downloads/${name}.apng`);
    if (file) {
      res.set({
        'Content-Type': 'image/apng',
      });

      await res.sendFile(`downloads/${name}.apng`, { root: './' });
    }
  }

  @Post('apng/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadedFileApng(
    @UploadedFile() file,
    @Body() apngUploadDto: ApngUploadDto,
  ) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };

    const unpackRes = await cmd.run(
      `unzip -q /app/files/${file.filename} -d /app/files/${file.filename}-files`,
    );

    if (unpackRes.success) {
      const converted = await this.appService.convertSequence(
        apngUploadDto,
        file,
        'apng',
      );
      if (!converted) {
        response['error'] = 'Files failed converting';
      }
    } else {
      fs.unlink(`/app/files/${file.filename}`, (err) => console.log(err));
      response['error'] = 'File is not a ZIP!';
    }
    return response;
  }

  @Get('webp/download')
  async downloadFileWebp(@Query('name') name, @Res() res): Promise<void> {
    const file = await path.basename(`/app/downloads/${name}.webp`);
    if (file) {
      res.set({
        'Content-Type': 'image/webp',
      });

      await res.sendFile(`downloads/${name}.webp`, { root: './' });
    }
  }

  @Post('webp/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadedFileWebp(
    @UploadedFile() file,
    @Body() apngUploadDto: ApngUploadDto,
  ) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };

    const unpackRes = await cmd.run(
      `unzip -q /app/files/${file.filename} -d /app/files/${file.filename}-files`,
    );

    if (unpackRes.success) {
      const converted = await this.appService.convertSequence(
        apngUploadDto,
        file,
        'webp',
        '-vcodec libwebp -lossless 1 -qscale 100 -preset default -an -vsync 0',
      );
      if (!converted) {
        response['error'] = 'Files failed converting';
      }
    } else {
      fs.unlink(`/app/files/${file.filename}`, (err) => console.log(err));
      response['error'] = 'File is not a ZIP!';
    }
    return response;
  }
}
