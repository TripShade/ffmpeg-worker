import { Injectable } from '@nestjs/common';
import * as cmd from 'node-command-line';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async convertSequence(
    apngUploadDto,
    file,
    ext: string,
    options: string = '',
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await fs.readdir(
        `/app/files/${file.filename}-files`,
        async (err, items: string[]) => {
          const fileNumbers = items[items.length - 1].match(/(\d+)/).length;
          const fileName = items[items.length - 1].split(/(\d)/)[0];

          const convert = await cmd.run(
            `ffmpeg -r ${apngUploadDto.framerate} -i /app/files/${
              file.filename
            }-files/${fileName}%0${fileNumbers}d.png ${options} -plays ${
              apngUploadDto.loop ? 0 : 1
            } /app/downloads/${file.filename}.${ext}`,
          );

          if (!convert.success) {
            reject(
              'Make sure ZIP root files are name numbered PNGs. someImage0001.png',
            );
          }

          fs.unlink(`/app/files/${file.filename}`, err => console.log(err));
          fs.rmdir(
            `/app/files/${file.filename}-files`,
            { recursive: true },
            err => reject(err),
          );

          resolve(convert.success);
        },
      );
    });
  }
}
