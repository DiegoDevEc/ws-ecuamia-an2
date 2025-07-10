import { Caja } from 'src/app/app.modelsWebShop';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { log } from 'util';
import { AddedComponent } from 'src/app/pages/popus/added/added.component';

@Component({
  selector: 'app-controls-box-complet',
  templateUrl: './controls-box-complet.component.html',
  styleUrls: ['./controls-box-complet.component.scss']
})
export class ControlsBoxCompletComponent implements OnInit {

  @Input() caja: Caja;
  @Input() type: string;
  @Input() cantidadCajas: number;
  @Input() imagen: any
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() limpiarOut: EventEmitter<any> = new EventEmitter<any>();

  public count = 0;
  public align = 'center center';

  constructor(public appService: AppService, public snackBar: MatSnackBar, public dialog: MatDialog) { 
   // this.appService.eventoSeleccionaCamionYPo.subscribe(() =>{
     // this.increment()
  //  })
  }

  ngOnInit() {
    this.layoutAlign();
  }

  public layoutAlign() {
    if (this.type === 'all') {
      this.align = 'space-between center';
    } else if (this.type === 'wish') {
      this.align = 'start center';
    } else {
      this.align = 'center center';
    }
  }

  public increment() {

    if (this.cantidadCajas == null || this.cantidadCajas == undefined) { return }
    // for (let index = 0; index < this.cantidadCajas; index++) {
    this.caja.totalPiezas = 0;
    this.caja.totalPrecio = 0;
    let totalAux = 0;
    let totalAuxJv = 0;
    let tipocaja = '';

    this.caja.variedades.forEach(element => {
      this.caja.totalPiezas += element.cantidadPorCaja;
      totalAux = element.precio * element.cantidadPorCaja;
   //   totalAuxJv = element.precioJv * element.cantidadPorCaja;
      this.caja.totalPrecio += totalAux;
      //this.caja.totalPrecioJv += totalAuxJv;
      tipocaja = element.caja;
    });

    this.caja.tallasDeCaja = this.appService.obtenerTallasCaja(this.caja);
    this.caja.mostrarDetalle = false;
    this.caja.tipoCaja = tipocaja;
    this.caja.codigoTipoCliente;
    this.caja.tipoCajaFlorex = this.appService.obtenerTipoCajaFlorex(this.caja);
    var respuesta = this.appService.agregarCajaCartCompleta(this.caja, this.cantidadCajas, this.caja);

    if (respuesta) {
      const timeout = 1500;
      const dialogRef = this.dialog.open(AddedComponent, {
        data: { producto: this.caja, tipoAgrega: 'C', imagen: this.caja.imagen, cantidad: this.cantidadCajas },
        width: '400px',
        panelClass: 'added-product'
      });
      dialogRef.afterClosed().subscribe(res => { });
      /*dialogRef.afterOpened().subscribe(res => {
        setTimeout(() => {
          dialogRef.close();
        }, timeout)
      });*/
    }

    this.limpiarOut.emit("1");

    //}
  }

  public changeQuantity(value) {
    this.onQuantityChange.emit(value);
  }

}


