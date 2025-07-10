import { AppService } from 'src/app/app.service';
import { Orden, Factura } from './../../../app.modelsWebShop';
import { Component, OnInit } from '@angular/core';
import { EstadoCuenta } from '../../../app.modelsWebShop';
import { ClienteDTO } from 'src/app/app.models';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  public listaEstadoCuenta: Array<EstadoCuenta> = [];
  public clienteLogueado: ClienteDTO;
  public filterFechaSince: string = '';
  public filterFechaUntil: string = '';
  public facturas: Factura[] = [];
  public page: number = 1;
  public count: any;
  public filterValue: string = '';
  public balanceToClient: number = 0
  public balanceDate

  constructor(public appService: AppService, public datepipe: DatePipe, public router: Router) {
  }

  ngOnInit() {
    this.getEstadoCuenta();
    this.getfacturas()
    this.appService._botonMenuSeleccionado(this.router.url)
  }

  public getUser() {

  }

  public getEstadoCuenta() {
    this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
    if (this.filterFechaSince == null || this.filterFechaSince.length == 0) {
      this.filterFechaSince = 'null';
    }

    if (this.filterFechaUntil == null || this.filterFechaUntil.length == 0) {
      this.filterFechaUntil = 'null';
    }

    this.appService.getEstadoCuenta(this.clienteLogueado.codigoPersona, (this.filterFechaSince == 'null' ? 'null' :
      this.datepipe.transform(this.filterFechaSince, 'yyyy-MM-dd')), (this.filterFechaUntil == 'null' ? 'null' :
        this.datepipe.transform(this.filterFechaUntil, 'yyyy-MM-dd'))).subscribe((data: any) => {
          this.listaEstadoCuenta = data;
          this.balanceToClient = this.listaEstadoCuenta.reverse()[0].saldo
          this.balanceDate = this.fomatDate(this.listaEstadoCuenta[0].fecha)
        });
  }

  private fomatDate(fecha){
    const parts = fecha.split('-');
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));

  }

  public getfacturas() {
    this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.getfacturas(this.clienteLogueado.codigoPersona, 2).subscribe((data: any) => {
      this.facturas = data;
    });
  }

  public getPdfFacturaSeleccionada(factura: Factura) {
    this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.generarPdfFacturaPorCliente(this.clienteLogueado.codigoPersona, factura.secFactura).subscribe((data: any) => {
    });
  }

  applyFilter() {

    if (this.filterFechaSince == null) {
      this.filterFechaSince = '';
    }
    if (this.filterFechaUntil == null) {
      this.filterFechaUntil = '';
    }
    if ((this.filterValue.length == 0 && this.filterFechaSince == null && this.filterFechaUntil == null)
      || (this.filterValue.length == 0 && (this.filterFechaSince.length == 0 && this.filterFechaUntil.length == 0))) {
      this.getfacturas();
      return;
    }

    if (this.filterValue.length == 0) {
      this.filterValue = 'xnullx'
    }

    this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.getfacturasFiltro(this.clienteLogueado.codigoPersona, this.page,
      this.datepipe.transform(this.filterFechaSince, 'yyyy-MM-dd'),
      this.datepipe.transform(this.filterFechaUntil, 'yyyy-MM-dd'),
      this.filterValue).subscribe((data: any) => {
        if (this.filterValue == 'xnullx') {
          this.filterValue = '';
        }
        this.facturas = data;
        if (this.facturas.length > 0) {
          this.count = this.facturas[0].totalConsulta;
          return;
        }
        this.count = 0;
      });
  }

}
