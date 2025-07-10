import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class ControlServices {

  inicial = 'S';

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  toggle() {
    this.inicial = 'S';
  }

}