import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  public isReady: boolean = false;
  private ffmpeg;
  public isRunning: boolean = false;

  constructor() {
    this.ffmpeg = createFFmpeg({
      log: true,
    });
  }

  public async init(): Promise<void> {
    if(this.isReady) {
      return;
    }

    await this.ffmpeg.load();

    this.isReady = true;
  }

  public async getScreenshots(file: File): Promise<void> {
    this.isRunning = true;

    const data = await fetchFile(file);

    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds =[1, 2, 3];
    const commands = seconds.map((second) => {
      return `-ss ${second} -i ${file.name} -vframes 1 -q:v 2 -f image2 ${second}.jpg`;
    });

    await this.ffmpeg.run(...commands);

    await this.ffmpeg.run(`-i ${file.name} -ss 00:00:01 -vframes 1 -q:v 2 ${file.name}.jpg`);

    const screenshots: any = seconds.map((second) => {
      const screenshot = this.ffmpeg.FS('readFile', `${second}.jpg`);
      const screenshotBlob = new Blob([screenshot.buffer], { type: 'image/jpeg' });

      const screenshotURL = URL.createObjectURL(screenshotBlob);

      this.isRunning = false;

      return screenshots;
    });
  }

  public async blobFromURL(url: string): Promise<Blob> {
    const response = await fetch(url);

    return await response.blob();
  }
}
