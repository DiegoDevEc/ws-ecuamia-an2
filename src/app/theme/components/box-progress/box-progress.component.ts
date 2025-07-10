import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Caja } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-box-progress',
  templateUrl: './box-progress.component.html',
  styleUrls: ['./box-progress.component.scss']
})
export class BoxProgressComponent implements OnInit {

  @Output() addToCart: EventEmitter<any> = new EventEmitter<any>();

  public cajaArmada: Caja;

  Event

  constructor(public appService: AppService) { }

  ngOnInit() {
    this.cajaArmada = this.appService.CajaArmada
  }

  agregarACaja() {
    this.addToCart.emit();
  }

}
