import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CargosAdicionales } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-cargos',
  templateUrl: './registrar-cargos.component.html',
  styleUrls: ['./registrar-cargos.component.scss']
})
export class RegistrarCargosComponent implements OnInit {

  public boxesEB: number = 0
  public boxesQB: number = 0
  public boxesHB: number = 0
  public cargos: CargosAdicionales
  public usuario: any
  public codigoUsuario: any


  constructor(public dialogRef: MatDialogRef<RegistrarCargosComponent>, @Inject(MAT_DIALOG_DATA)
  public data: any, public appService: AppService) {

  }

  ngOnInit() {

    if (this.data.accion === 'CREATE') {
      this._getRegistroCargosLocal()
    }

    if (this.data.accion === 'UPDATE') {
      this._getCargosAdicionalesPorMarcacion()
    }

  }

  public _getCargosAdicionalesPorMarcacion() {

    
    if (JSON.parse(localStorage.getItem("_lsIndividualC")) != null) {
      var resultado = JSON.parse(localStorage.getItem("_lsIndividualC"))[0]
      this.codigoUsuario = resultado.cliente.codigoPersona;
    }

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

    });

  }

  _getRegistroCargosLocal() {
    if (this.appService.cargosAdicionalesLocal != undefined || this.appService.cargosAdicionalesLocal != null) {
      this.boxesEB = this.appService.cargosAdicionalesLocal.EB
      this.boxesQB = this.appService.cargosAdicionalesLocal.QB
      this.boxesHB = this.appService.cargosAdicionalesLocal.HB
    }
  }

  public validateKey(event) {
    var e = event || window.event;
    var key = e.keyCode || e.which;
    if (key === 188 || key === 189) {
      e.preventDefault();
    }
  }

  public _cancelar(){
    this.dialogRef.close();
  }


  public _saveCargosAdicionales() {
    if (this.boxesEB == null || this.boxesQB == null || this.boxesHB == null) {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete the fields please'
      });
      return;
    }

    swal.fire({
      icon: 'success',
      title: 'Save Succesfully',
      showConfirmButton: false,
      timer: 1500
    });

    this.appService.cargosAdicionalesLocal = new CargosAdicionales(
      this.boxesEB,
      this.boxesQB,
      this.boxesHB
    )

    this.dialogRef.close();
  }

  public _updateCargosAdicionales() {

    if (this.boxesEB == null || this.boxesQB == null || this.boxesHB == null) {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete the fields please'
      });
      return;
    }

    swal.fire({
      icon: 'success',
      title: 'Save Succesfully',
      showConfirmButton: false,
      timer: 1500
    });

    this.cargos = new CargosAdicionales(
      this.boxesEB,
      this.boxesQB,
      this.boxesHB
    );

    this.usuario = JSON.parse(localStorage.getItem("Usuario"));

    if (JSON.parse(localStorage.getItem("_lsIndividualC")) != null) {
      var resultado = JSON.parse(localStorage.getItem("_lsIndividualC"))[0]
      this.codigoUsuario = resultado.cliente.codigoPersona;
    }

    this.appService._persistirCargosAdicionales(
      this.cargos,
      this.codigoUsuario,
      parseInt(this.usuario.codigoPersona)).subscribe(data => {
        console.log("exito");
      });

    this.appService.cargosAdicionalesLocal = this.cargos;

    this.dialogRef.close();
  }

}
