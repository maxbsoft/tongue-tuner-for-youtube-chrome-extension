import { TrackInfo } from './TrackInfo';

export class SyncManager {
  private currentTime: number = 0;

  constructor() {}

  public updateTime(time: number, tracks: TrackInfo[]): void {
    this.currentTime = time;
    // ... Логика синхронизации
  }

  // ... Дополнительные методы для синхронизации
}
