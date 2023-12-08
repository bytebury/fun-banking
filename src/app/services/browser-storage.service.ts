import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserStorageService {
  constructor() {}
  get(key: string) {
    return localStorage.getItem(key);
  }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    return localStorage.removeItem(key);
  }
}
