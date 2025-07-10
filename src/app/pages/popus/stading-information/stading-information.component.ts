import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Camion, ClienteUsuario, Destino, Marcacion } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';
import { InformationComponent } from '../information/information.component';

@Component({
  selector: 'app-stading-information',
  templateUrl: './stading-information.component.html',
  styleUrls: ['./stading-information.component.scss']
})
export class StadingInformationComponent implements OnInit {

  public datePipe
  public dateChange
  public date
  public dateNowInit: string
  public marcacionSleccionada: Marcacion;
  public subclientes: Array<Marcacion> = [];
  public clienteSeLeccionado: ClienteUsuario;
  public destinoSeleccionado: Destino;
  public destinos: Array<Destino> = [];
  public camionSeleccionado: Camion;
  public camiones: Array<Camion> = [];
  public dias = [];
  public diaSemana = '';
  public zonaHorariaEcuador;
  public horarioDeEcuador = new Date();
  public mostrarFecha: string;

  constructor(public appService: AppService, public dialog: MatDialog,
    public router: Router, public dialogRef: MatDialogRef<StadingInformationComponent>) {

  }

  ngOnInit() {
    this._getDiaEntrega()
    this._seleccionarMarcacion();
    this._obtnerCamiones();
  }


  _getDiaEntrega() {

    var dia = this._getDiaSemana();
    var hora = this._getHoraDia();
    var minutos = this._getMinutos()

    switch (dia) {
      case 'Monday': {
        if (hora < 10 && minutos <= 59) {
          this._getFechaFlorex();
        }

        if (hora >= 10 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Monday');
        }
        break;
      }
      case 'Tuesday': {
        if (hora < 10 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 10 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Tuesday');
        }
        break;
      }
      case 'Wednesday': {
        if (hora < 10 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 10 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Wednesday');
        }
        break;
      }
      case 'Thursday': {
        if (hora < 10 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 10 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Thursday');
        }
        break;
      }
      case 'Friday': {
        if (hora < 10 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 10 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Friday');
        }
        break;
      }
      case 'Saturday': {
        this._getFechaFlorex();
        break;
      }
      case 'Sunday': {
        this._getFechaFlorex();
        break;
      }
    }

  }

  public _getFechaFlorex() {

    var fechaInicia = new Date();
    var fechaMostrar = new Date();
    var datePipe = new DatePipe("en-US");
    var tipoFecha: string = "_ls_dateConecctionStading"


    if (localStorage.getItem(tipoFecha) != null || localStorage.getItem(tipoFecha) != undefined) {

      this.date = new FormControl(new Date(localStorage.getItem(tipoFecha)));

      if (this.diaSemana === 'Monday' ||
        this.diaSemana === 'Tuesday' ||
        this.diaSemana === 'Wednesday' ||
        this.diaSemana === 'Thursday' ||
        this.diaSemana === 'Friday') {
        fechaInicia.setDate(fechaInicia.getDate() + 4);
      }


      if (this.diaSemana === 'Saturday') {
        fechaInicia.setDate(fechaInicia.getDate() + 6);
      }

      if (this.diaSemana === 'Sunday') {
        fechaInicia.setDate(fechaInicia.getDate() + 5);
      }

      this.dateChange = new FormControl(new Date(fechaInicia));
      this.dateNowInit = datePipe.transform(this.dateChange.value, 'yyyy-MM-dd');

      return;
    }

    if (this.diaSemana === 'Monday' ||
      this.diaSemana === 'Tuesday' ||
      this.diaSemana === 'Wednesday' ||
      this.diaSemana === 'Thursday' ||
      this.diaSemana === 'Friday') {
      fechaInicia.setDate(fechaInicia.getDate() + 4);
    }


    if (this.diaSemana === 'Saturday') {
      fechaInicia.setDate(fechaInicia.getDate() + 6);
    }

    if (this.diaSemana === 'Sunday') {
      fechaInicia.setDate(fechaInicia.getDate() + 5);
    }


    this.date = new FormControl(new Date(fechaInicia));
    this.dateChange = new FormControl(new Date(fechaMostrar));
    this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');

    localStorage.setItem(tipoFecha, this.date.value);

  }

  _calcularDiasEntregaPedido(dia: string) {


    var fechaInicia = new Date();
    var fechaMostrar = new Date();
    var datePipe = new DatePipe("en-US");
    var tipoFecha: string = tipoFecha = "_ls_dateConecctionStading"

    if (localStorage.getItem(tipoFecha) != null || localStorage.getItem(tipoFecha) != undefined) {

      this.date = new FormControl(new Date(localStorage.getItem(tipoFecha)));

      if (dia === 'Monday' || dia === 'Tuesday' || dia === 'Wednesday' || dia === 'Thursday') {
        fechaInicia.setDate(fechaInicia.getDate() + 5);
      }

      if (dia === 'Friday') {
        fechaInicia.setDate(fechaInicia.getDate() + 7);
      }

      this.dateChange = new FormControl(new Date(fechaInicia));
      this.dateNowInit = datePipe.transform(this.dateChange.value, 'yyyy-MM-dd');

      return;
    }

    if (dia === 'Monday' || dia === 'Tuesday' || dia === 'Wednesday' || dia === 'Thursday') {
      fechaInicia.setDate(fechaInicia.getDate() + 5);
     
    }

    if (dia === 'Friday') {
      fechaInicia.setDate(fechaInicia.getDate() + 6);
    }

    this.date = new FormControl(new Date(fechaInicia));
    this.dateChange = new FormControl(new Date(fechaMostrar));
    this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');

  }

  public _getDiaSemana(): string {

    this.dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.zonaHorariaEcuador = new Date().toLocaleString('en-US', { timeZone: 'America/Guayaquil' });
    this.horarioDeEcuador = new Date(this.zonaHorariaEcuador);
    this.horarioDeEcuador.setHours(this.horarioDeEcuador.getHours());
    this.horarioDeEcuador.setMinutes(this.horarioDeEcuador.getMinutes());
    this.diaSemana = this.dias[this.horarioDeEcuador.getDay()];

    return this.diaSemana;

  }

  _getHoraDia(): number {
    return this.horarioDeEcuador.getHours();
  }

  _getMinutos(): number {
    return this.horarioDeEcuador.getMinutes();
  }

  public _informationDialog() {
    const dialogRef = this.dialog.open(InformationComponent, {
      data: { data: 'S', editar: false },
      panelClass: 'information'
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta != null) {
        this.dialogRef.close(respuesta)
        //this._actualizarDatos(respuesta)
      }
    });
  }

  public _actualizarDatos(respuesta) {
    if (respuesta[0].marcacion != '') {
      this._seleccionarMarcacion()
      this._obtnerCamiones()
    }
    if (sessionStorage.getItem('CamionStading') == 'undefined' || sessionStorage.getItem('CamionStading') == null) {
      return
    }
    if (sessionStorage.getItem('CamionStading') == 'undefined' || sessionStorage.getItem('CamionStading') == null) {
      return
    }
    this.camionSeleccionado = JSON.parse(sessionStorage.getItem('CamionStading'));
    this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("CamionStading"))
    this._getDiaEntrega();
  }

  public _obtnerCamiones() {
    var data: any
    data = JSON.parse(localStorage.getItem("Usuario"))
    //se valida si es cliente o subcliente
    if (data.codigoClientePadre != null || data.codigoClientePadre != undefined) {
      if (sessionStorage.getItem('MarcacionStading') == 'undefined' || sessionStorage.getItem('MarcacionStading') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'S').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.marcacionSleccionada = this.subclientes[0];
            sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
            this._seleccionarCamion(this.marcacionSleccionada.codigoSeleccion);
          }
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem('MarcacionStading'));
        this._seleccionarCamion(this.marcacionSleccionada.codigoSeleccion);
      }
    }
    else {
      if (sessionStorage.getItem('MarcacionStading') == 'undefined' || sessionStorage.getItem('MarcacionStading') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.marcacionSleccionada = this.subclientes[0];
            sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
            this._seleccionarCamion(this.marcacionSleccionada.codigoSeleccion);
          }
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem('MarcacionStading'));
        this._seleccionarCamion(this.marcacionSleccionada.codigoSeleccion);
      }
    }


  }

  public _seleccionarCamion(codigoMarcacion) {
    this.appService.getCamionSeleccionado(codigoMarcacion).subscribe((data: any) => {
      this.camiones = data;
      if (this.camiones.length > 0) {
        this.camionSeleccionado = this.camiones[0];
        sessionStorage.setItem('CamionStading', JSON.stringify(this.camionSeleccionado));
      }
    });
  }

  public _seleccionarMarcacion() {

    //se valida si es cliente o subcliente : C = CLIENTE,  S = SUBCLIENTE, 
    var data: any
    data = JSON.parse(localStorage.getItem("Usuario"))
    if (data.codigoClientePadre != null || data.codigoClientePadre != undefined) {
      if (sessionStorage.getItem('MarcacionStading') == 'undefined' || sessionStorage.getItem('MarcacionStading') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.marcacionSleccionada = this.subclientes[0];
            sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
            this._seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
            return;
          }
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem('MarcacionStading'));
        this._seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
      }
    }
    else {
      if (sessionStorage.getItem('MarcacionStading') == 'undefined' || sessionStorage.getItem('MarcacionStading') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.marcacionSleccionada = this.subclientes[0];
            sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
            this._seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
            return;
          }
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem('MarcacionStading'));
        this._seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
      }
    }
  }

  public _seleccionarDestino(codigoMarcacion) {
    this.appService.getDestinos(codigoMarcacion).subscribe((data: any) => {
      this.destinos = data;
      this.destinoSeleccionado = this.destinos[0];
      sessionStorage.setItem('DestinoStading', JSON.stringify(this.destinoSeleccionado));
    });
  }

  _guardar() {
    this.dialogRef.close()
  }

}
