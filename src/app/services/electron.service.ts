import { Injectable, signal } from '@angular/core';

interface ElectronUpdateAPI {
  onChecking: (cb: () => void) => void;
  onAvailable: (cb: (info: { version: string }) => void) => void;
  onNotAvailable: (cb: () => void) => void;
  onProgress: (cb: (progress: { percent: number }) => void) => void;
  onDownloaded: (cb: () => void) => void;
  onError: (cb: (message: string) => void) => void;
  download: () => Promise<void>;
  install: () => Promise<void>;
}

interface ElectronAPI {
  minimizeWindow?: () => void;
  maximizeWindow?: () => void;
  closeWindow?: () => void;
  update?: ElectronUpdateAPI;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export type UpdateState =
  | { status: 'idle' }
  | { status: 'available'; version: string }
  | { status: 'downloading'; percent: number }
  | { status: 'downloaded' }
  | { status: 'error'; message: string };

@Injectable({ providedIn: 'root' })
export class ElectronService {
  readonly updateState = signal<UpdateState>({ status: 'idle' });

  private get api(): ElectronAPI | undefined {
    return (window as Window).electronAPI;
  }

  get isElectron(): boolean {
    return !!this.api;
  }

  minimize(): void {
    this.api?.minimizeWindow?.();
  }

  maximize(): void {
    this.api?.maximizeWindow?.();
  }

  close(): void {
    this.api?.closeWindow?.();
  }

  downloadUpdate(): void {
    this.api?.update?.download();
  }

  installUpdate(): void {
    this.api?.update?.install();
  }

  initUpdateListeners(): void {
    if (!this.api?.update) return;

    this.api.update.onAvailable((info: { version: string }) =>
      this.updateState.set({ status: 'available', version: info.version })
    );
    this.api.update.onProgress((p: { percent: number }) =>
      this.updateState.set({ status: 'downloading', percent: Math.floor(p.percent) })
    );
    this.api.update.onDownloaded(() =>
      this.updateState.set({ status: 'downloaded' })
    );
    this.api.update.onError((msg: string) =>
      this.updateState.set({ status: 'error', message: msg })
    );
  }
}
