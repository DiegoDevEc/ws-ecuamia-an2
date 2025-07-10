import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppWebshopService } from 'src/app/app-webshop.service';

import * as _ from 'lodash';
import { EnumTipoCaja } from 'src/app/enumeration/enumeration';
import { MatDialog } from '@angular/material';
import { NoteBoxesComponent } from 'src/app/pages/popus/note-boxes/note-boxes.component';
import { CajaCarritoWebShop, ProductoWebShop } from 'src/app/app.modelsWebShopV2';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-product-controls',
  templateUrl: './product-controls.component.html',
  styleUrls: ['./product-controls.component.scss']
})
export class ProductControlsComponent {

  @Input() quantity: number = 0;
  @Input() indexDetalle: number = 0;
  @Output() filtrarPorVariedadAgregada: EventEmitter<any> = new EventEmitter<any>();

  constructor(public appService: AppService, public appWebshopService: AppWebshopService, public dialog: MatDialog) {
  }

  increaseQuantity() {
    this.appService.existenProveedoresEb(this.appWebshopService.cajaMixtaArmada.detalle[this.indexDetalle].producto.codigoVariedad).subscribe((dataProveedor) => {
      let modifico
      if(this.appWebshopService.contadorClicsAddBox > 0 && dataProveedor){
        modifico = this.appWebshopService.recalcularCajaEb(1, this.indexDetalle)
      }else{
        modifico = this.appWebshopService.recalcularCaja(1, this.indexDetalle)
      }
      if(!modifico){
       this._mensajeCajaCompleta()
      }else{
       this.filtrarPorVariedadAgregada.emit("1");
      }
    })
  }

  decreaseQuantity() {
    this.appService.existenProveedoresEb(this.appWebshopService.cajaMixtaArmada.detalle[this.indexDetalle].producto.codigoVariedad).subscribe((dataProveedor) => {
      let modifico
      if(this.appWebshopService.contadorClicsAddBox > 0 && dataProveedor){
        if (this.quantity > 1) {
          const modifico =  this.appWebshopService.recalcularCajaEb(-1, this.indexDetalle)
          this.filtrarPorVariedadAgregada.emit("1");
        }
      }else{
        if (this.quantity > 1) {
          const modifico =  this.appWebshopService.recalcularCaja(-1, this.indexDetalle)
          this.filtrarPorVariedadAgregada.emit("1");
        }
      }
    })
  }

  editQuantity(newQuantity: number) {
    if (newQuantity >= 0) {
      this.quantity = newQuantity;
    }
  }

  public _mensajeCajaCompleta() {
    const dialogRef = this.dialog.open(NoteBoxesComponent, {
      data: { variedad: null, condicion: 'FULL' },
      panelClass: 'note-boxes'
    });
  }

  public _mensajeCajaIncrease() {
    const dialogRef = this.dialog.open(NoteBoxesComponent, {
      data: { variedad: null, condicion: 'ADD' },
      panelClass: 'note-boxes'
    });
  }

}
