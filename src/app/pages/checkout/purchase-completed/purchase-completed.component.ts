import { Address } from './../../../app.models';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { AppService } from '../../../app.service';
import { Caja, Destino, Camion, Marcacion } from 'src/app/app.modelsWebShop';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-purchase-completed',
  templateUrl: './purchase-completed.component.html',
  styleUrls: ['./purchase-completed.component.scss']
})
export class PurchaseCompletedComponent implements OnInit {

  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  @ViewChild('verticalStepper') verticalStepper: MatStepper;
  billingForm: FormGroup;
  total = 0;
  grandTotal = 0;
  cartItemCount = 0;
  cartItemCountTotal = 0;
  addrees: Address;
  cartList: Caja[]
  public destinoSeleccionado: Destino;
  public camionSeleccionado: Camion;
  public marcacionSleccionada: Marcacion;
  public cli
  public nombre: any
  public fechaConexion


  constructor(public appService: AppService, public formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngOnInit() {

    this.getObtenerDetalleCompra()
    this.getObtenerClientePedido()
    this.initPage()
  }

  public initPage() {
    this.fechaConexion = localStorage.getItem('_ls_dateConecction')

    this.appService.Data.cartListCaja.forEach(caja => {
      this.total += caja.totalPrecio;
      this.grandTotal += caja.totalPrecio;
      this.cartItemCount += 1;
      this.cartItemCountTotal += 1;
      caja.mostrarDetalle = false;
    });
  }

  public getObtenerClientePedido() {
    this.cli = JSON.parse(localStorage.getItem('Usuario'));
    this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
    this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"))
    this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"))
  }


  public getObtenerDetalleCompra() {
    this.cartList = JSON.parse(localStorage.getItem("Purchase"))
    if (this.cartList != undefined) {
      this.cartList.forEach(caja => {
        this.total += caja.totalPrecio;
        this.grandTotal += caja.totalPrecio;
        this.cartItemCount += 1;
        this.cartItemCountTotal += 1;
        caja.mostrarDetalle = false;
      });
      localStorage.removeItem("Purchase")
    }
    else {
      return
    }

  }

}

