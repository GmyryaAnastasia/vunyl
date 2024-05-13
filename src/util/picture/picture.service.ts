import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class PictureService {
  async convertDataURLToBuffer(dataURL: string): Promise<Buffer> {
    const response: fetch.Response = await fetch(dataURL);
    const bufferData: Buffer = await response.buffer();

    return Buffer.from(bufferData);

  }

  convertBufferToDataURL(data: Buffer) {
    const buffer: Buffer = Buffer.from(data);
    const base64: string = buffer.toString('base64');

    return 'data:image/png;base64,' + base64;
  }
}
