import { Component, OnInit } from '@angular/core';
import { Cajas, CargosAdicionales } from 'src/app/app.modelsWebShop';
import swal from 'sweetalert2';
import { AppService } from 'src/app/app.service';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppWebshopService } from 'src/app/app-webshop.service';

@Component({
  selector: 'app-cargos-adicionales',
  templateUrl: './cargos-adicionales.component.html',
  styleUrls: ['./cargos-adicionales.component.scss']
})
export class CargosAdicionalesComponent implements OnInit {

  boxesEB: number = 0;
  boxesQB: number = 0;
  boxesHB: number = 0;
  boxesEBT: number = 0;
  boxesQBT: number = 0;
  boxesHBT: number = 0;
  cargos: CargosAdicionales;
  dataobjectBoxes: CargosAdicionales;
  countBoxesTruckingHB: number = 0;
  countBoxesTruckingQB: number = 0;
  countBoxesTruckingEB: number = 0;
  countPoint: number = 0;
  usuario: any;
  codigoUsuario: any;
  cantidadPorLote: number = 0;
  precioPorLote: number = 0;
  precioPorCaja: number = 0;
  contadorPorLote = 0;


  constructor(public dialogRef: MatDialogRef<CargosAdicionalesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any, public appService: AppService, public appWebShopService: AppWebshopService) {

  }

  ngOnInit() {    
    setTimeout(() => {
      var resultado = this.appService._consultarSiEsFloristeria()
      if (resultado === 'N') {
        if (this.data.value === 'ORDER STATUS') {
          this.appService.esFloristeria = 'N'
          this._orderStatusCargosAdicionales(this.appService.esFloristeria, this.data.cajas);
        } else {
          this._getCargosAdicionalesMarcacion();
        }
      }
      if (resultado === 'S') {
        if (this.data.value === 'ORDER STATUS') {
          this.appService.esFloristeria = 'S'
          this._orderStatusCargosAdicionales(this.appService.esFloristeria, this.data.cajas);
        } else {
          this._getCargosAdicionalesPorFloristeria();
        }
      }
    }, 20);
  }

  public close() {
    this.dialogRef.close()
  }



  public _getCargosAdicionalesMarcacion() {

    this.usuario = JSON.parse(localStorage.getItem("Usuario"));
    var marcacionFinal = null
    this.codigoUsuario = this.usuario.codigoPersona

    if (this.data.condicion === false) { marcacionFinal = JSON.parse(sessionStorage.getItem("Marcacion")) }
    if (this.data.condicion === true) { marcacionFinal = JSON.parse(sessionStorage.getItem("MarcacionStading")); }

    this.appService._getCargosAdicionalesMarcacion(this.codigoUsuario).subscribe(data => {

      for (let da of data) {
        if (da.tipoCaja == "EB") { this.boxesEB = da.valorEnvio }
        if (da.tipoCaja == "HB") { this.boxesHB = da.valorEnvio }
        if (da.tipoCaja == "QB") { this.boxesQB = da.valorEnvio }
      }

      this.cargos = new CargosAdicionales(
        this.boxesEB,
        this.boxesQB,
        this.boxesHB
      );

      if (this.data.value == "CART") {
        this.contadorPorTipoCaja(this.data.condicion)
      }

    });

    if (this.usuario.codigoClientePadre === undefined || this.usuario.codigoClientePadre === null) {

      this.appService._getCargasTransportePorMarcacion(marcacionFinal.pk.codigoMarcacion).subscribe(data => {
        this._iniciarVariables();
        localStorage.setItem("ls_cargos", JSON.stringify(data));
        var resultado = JSON.parse(localStorage.getItem("ls_cargos"));
        if (resultado.length > 1) {
          resultado.forEach(item => {
            if (item.tipoCaja == "EB") { this.boxesEB = item.valorEnvio }
            if (item.tipoCaja == "HB") { this.boxesHB = item.valorEnvio }
            if (item.tipoCaja == "QB") { this.boxesQB = item.valorEnvio }

            this.cargos = new CargosAdicionales(
              this.boxesEB,
              this.boxesQB,
              this.boxesHB
            );

          });
        }

        if (this.data.value == "CART") {
          this.contadorPorTipoCaja(this.data.condicion)
        }
      });
    }

  }

  _iniciarVariables() {
    this.boxesEB = 0
    this.boxesQB = 0
    this.boxesHB = 0
    this.boxesEBT = 0
    this.boxesQBT = 0
    this.boxesHBT = 0
    this.countBoxesTruckingEB = 0
    this.countBoxesTruckingQB = 0
    this.countBoxesTruckingHB = 0
  }

  public contadorPorTipoCaja(condicion: boolean) {
    for (let itemBoxes of this.appService.Data.cartListCaja) {
      if (itemBoxes.stadingOrder === condicion) {
        if (itemBoxes.tipoCaja == 'EB') {
          this.countBoxesTruckingEB += itemBoxes.cantidadIngresada
        }
        if (itemBoxes.tipoCaja == 'QB') {
          this.countBoxesTruckingQB += itemBoxes.cantidadIngresada
        }
        if (itemBoxes.tipoCaja == 'HB') {
          this.countBoxesTruckingHB += itemBoxes.cantidadIngresada
        }
      }
    }

    this.boxesEBT = this.boxesEB * this.countBoxesTruckingEB
    this.boxesQBT = this.boxesQB * this.countBoxesTruckingQB
    this.boxesHBT = this.boxesHB * this.countBoxesTruckingHB

  }

  _getCargosAdicionalesPorFloristeria() {
    this.appService.esFloristeria = 'S'
    let camion = JSON.parse(sessionStorage.getItem("Camion"));
    let marcacion = JSON.parse(sessionStorage.getItem("Marcacion"));
    this.appService._getCargosPorFloristeria(camion.codigoCamion, marcacion.pk.codigoMarcacion).subscribe(data => {
      this.cantidadPorLote = data[0].cantidadLote
      this.precioPorLote = data[0].precioLote
      this.precioPorCaja = data[0].precioCaja
      this._calcularTotalCargosPorFloristeria(this.data.condicion)
    });
  }

  _calcularTotalCargosPorFloristeria(condicion: boolean) {

    this.appService.totalValorFloristeria = 0
    this.appService.totalTuckingBoxes = 0
    this.contadorPorLote = 0
    this.countBoxesTruckingEB = 0
    this.countBoxesTruckingHB = 0
    this.countBoxesTruckingQB = 0

    for (let itemBoxes of this.appService.Data.cartListCaja) {
      if (itemBoxes.stadingOrder === condicion) {
        if (itemBoxes.tipoCaja == 'EB') {
          this.countBoxesTruckingEB += itemBoxes.cantidadIngresada
        }
        if (itemBoxes.tipoCaja == 'QB') {
          this.countBoxesTruckingQB += itemBoxes.cantidadIngresada
        }
        if (itemBoxes.tipoCaja == 'HB') {
          this.countBoxesTruckingHB += itemBoxes.cantidadIngresada
        }
        this.contadorPorLote += itemBoxes.cantidadIngresada
      }
    }

    this.boxesEBT = this.boxesEB * this.countBoxesTruckingEB
    this.boxesQBT = this.boxesQB * this.countBoxesTruckingQB
    this.boxesHBT = this.boxesHB * this.countBoxesTruckingHB


    if (this.contadorPorLote > this.cantidadPorLote) {
      let cajasAdicionalesPorCobrar = this.contadorPorLote - this.cantidadPorLote
      this.appService.totalValorFloristeria = this.precioPorLote
      for (let i = 0; i < cajasAdicionalesPorCobrar; i++) {
        this.appService.totalValorFloristeria += this.precioPorCaja
      }
    } else if (this.contadorPorLote <= this.cantidadPorLote && this.contadorPorLote > 0) {
      this.appService.totalValorFloristeria = this.precioPorLote
    }

    this.appService.totalTuckingBoxes = this.appService.totalValorFloristeria

  }

  _orderStatusCargosAdicionales(esFloristeria: string, datos) {

    if (esFloristeria == 'N') {
      this.appService._getCargasTransportePorMarcacion(datos.codigoMarcacion).subscribe(data => {

        this._iniciarVariables();

        if (data.length > 1) {
          data.forEach(item => {
            if (item.tipoCaja == "EB") { this.boxesEB = item.valorEnvio }
            if (item.tipoCaja == "HB") { this.boxesHB = item.valorEnvio }
            if (item.tipoCaja == "QB") { this.boxesQB = item.valorEnvio }
          });
        }


        for (let caja of datos.cajas) {

          for (let variedad of caja.variedades) {

            if (variedad.caja == 'EB') {
              if (caja.tipoCaja === 'S') {
                this.countBoxesTruckingEB += variedad.cantidadPorCaja
              }
              if (caja.tipoCaja === 'M') {
                this.countBoxesTruckingEB += variedad.cantidadPorBunche
                this._calcularCantidadPorCaja();
                break;
              }
            }

            if (variedad.caja == 'QB') {
              if (caja.tipoCaja === 'S') {
                this.countBoxesTruckingQB += variedad.cantidadPorCaja
              }
              if (caja.tipoCaja === 'M') {
                this.countBoxesTruckingQB += variedad.cantidadPorBunche
                this._calcularCantidadPorCaja();
                break;
              }
            }

            if (variedad.caja == 'HB') {
              if (caja.tipoCaja === 'S') {
                this.countBoxesTruckingHB += variedad.cantidadPorCaja
              }
              if (caja.tipoCaja === 'M') {
                this.countBoxesTruckingHB += variedad.cantidadPorBunche
                this._calcularCantidadPorCaja();
                break;
              }
            }

            if (caja.tipoCaja === 'S') {
              this._calcularCantidadPorCaja()
            }

          }

          this.appService.totalTuckingBoxes = this.boxesEBT + this.boxesQBT + this.boxesHBT
        }

      });
    }

    if (esFloristeria == 'S') {
      this.appService.esFloristeria = 'S'
      this.appService._getCargosPorFloristeria(datos.codigoCamion, datos.codigoMarcacion).subscribe(data => {

        this.cantidadPorLote = data[0].cantidadLote
        this.precioPorLote = data[0].precioLote
        this.precioPorCaja = data[0].precioCaja

        this.appService.totalValorFloristeria = 0
        this.appService.totalTuckingBoxes = 0
        this.contadorPorLote = 0
        this.countBoxesTruckingEB = 0
        this.countBoxesTruckingHB = 0
        this.countBoxesTruckingQB = 0

        for (let caja of datos.cajas) {

          for (let variedad of caja.variedades) {

            if (variedad.caja == 'EB') {
              if (caja.tipoCaja === 'S') {
                this.countBoxesTruckingEB += variedad.cantidadPorCaja
              }
              if (caja.tipoCaja === 'M') {
                this.countBoxesTruckingEB += variedad.cantidadPorBunche
                this._calcularCantidadPorCaja();
                break;
              }
            }

            if (variedad.caja == 'QB') {
              if (caja.tipoCaja === 'S') {
                this.countBoxesTruckingQB += variedad.cantidadPorCaja
              }
              if (caja.tipoCaja === 'M') {
                this.countBoxesTruckingQB += variedad.cantidadPorBunche
                this._calcularCantidadPorCaja();
                break;
              }
            }

            if (variedad.caja == 'HB') {
              if (caja.tipoCaja === 'S') {
                this.countBoxesTruckingHB += variedad.cantidadPorCaja
              }
              if (caja.tipoCaja === 'M') {
                this.countBoxesTruckingHB += variedad.cantidadPorBunche
                this._calcularCantidadPorCaja();
                break;
              }
            }

            if (caja.tipoCaja === 'S') {
              this._calcularCantidadPorCaja()
            }

          }

          this.contadorPorLote = datos.boxes

        }

        //logica por cargos cuando es floristeria depende la configuracion del cliente viene del florex
        if (this.contadorPorLote > this.cantidadPorLote) {
          let cajasAdicionalesPorCobrar = this.contadorPorLote - this.cantidadPorLote
          this.appService.totalValorFloristeria = this.precioPorLote
          for (let i = 0; i < cajasAdicionalesPorCobrar; i++) {
            this.appService.totalValorFloristeria += this.precioPorCaja
          }
        } else if (this.contadorPorLote <= this.cantidadPorLote && this.contadorPorLote > 0) {
          this.appService.totalValorFloristeria = this.precioPorLote
        }

        this.appService.totalTuckingBoxes = this.appService.totalValorFloristeria

      });
    }
  }

  _calcularCantidadPorCaja() {
    this.boxesEBT = this.boxesEB * this.countBoxesTruckingEB
    this.boxesQBT = this.boxesQB * this.countBoxesTruckingQB
    this.boxesHBT = this.boxesHB * this.countBoxesTruckingHB
  }

}
