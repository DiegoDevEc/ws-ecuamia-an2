import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageUpdateService {
  private localStorageUpdateSubject: Subject<void> = new Subject<void>();

  localStorageUpdate$ = this.localStorageUpdateSubject.asObservable();

  emitUpdate() {
    this.localStorageUpdateSubject.next();
  }
}