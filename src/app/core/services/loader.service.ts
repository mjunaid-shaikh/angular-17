import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading = signal<boolean>(false); // ← using Angular Signals!
  constructor() { }

  show() {
    this.isLoading.set(true);
  }
  hide() {
    this.isLoading.set(false);
  }
}
