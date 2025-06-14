import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  loading = signal(false);

  show() {
    this.loading.set(true);
    console.log("Loading started");
  }

  hide() {
    this.loading.set(false);
  }

  toggle() {
    this.loading.update((val) => !val);
  }

  get state() {
    return this.loading;
  }
}
