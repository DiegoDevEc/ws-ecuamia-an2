import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {private screenWidth = new BehaviorSubject<number>(window.innerWidth);

  constructor() {
    this.handleResize();
  }

  @HostListener('window:resize', ['$event'])
  handleResize(event?) {
    this.screenWidth.next(window.innerWidth);
  }

  getScreenWidth() {
    return this.screenWidth.asObservable();
  }

  isMobile(): boolean {
    return this.screenWidth.value < 768; // Ejemplo de breakpoint móvil
  }
}
