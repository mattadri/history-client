import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private defaultImage: string;

  constructor() {
    this.defaultImage = 'https://s3.us-east-2.amazonaws.com/dev.history/history_default.png';
  }

  getDefaultImage(): string {
    return this.defaultImage;
  }
}
