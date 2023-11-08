import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnlineOfflineService {
  public connectionChanged = new EventEmitter<boolean>();

  constructor() {
    window.addEventListener('online', () => this.updateConnectionStatus());
    window.addEventListener('offline', () => this.updateConnectionStatus());
    this.updateConnectionStatus();
  }

  private updateConnectionStatus() {
    this.connectionChanged.emit(navigator.onLine);
  }
}
