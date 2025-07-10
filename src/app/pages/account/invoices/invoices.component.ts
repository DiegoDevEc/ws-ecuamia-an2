import { Factura } from './../../../app.modelsWebShop';
import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDatepicker, MatDialog } from '@angular/material';
import { ClienteDTO } from 'src/app/app.models';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import { DownloadComponent } from '../../popus/download/download.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  public facturas: Factura[] = [];
  public clienteLogueado: ClienteDTO;
  public page: number = 1;
  public count: number = 0;
  public filterValue: string = '';
  public filterFechaSince: string = '';
  public filterFechaUntil: string = '';
  public mostrarMensaje: boolean = false;

  constructor(public appService: AppService, public datepipe: DatePipe, public snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {
    this._getfacturas();
  }

  public _getfacturas() {
    this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.getfacturas(this.clienteLogueado.codigoPersona, this.page)
      .subscribe(data => {
        this.facturas = data.map(factura => ({
          ...factura,
          connectionDate: this.fomatDate(factura.connectionDate)
        }));
        for (let index = 0; index < this.facturas.length; index++) {
          const detalle = this.facturas[index]
          if (detalle.po.length > 1) {
            detalle.po = []
            detalle.po = ['Multiple PO']
          }
        }
        if (this.facturas.length > 0) {
          this.count = this.facturas[0].totalConsulta;
        }
      });
  }

  private fomatDate(fecha){
    const parts = fecha.split('-');
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));

  }

  public _listaDescargas(factura: Factura) {
    const dialogRef = this.dialog.open(DownloadComponent, {
      data: { factura: factura },
      panelClass: 'download'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) { }
    });
  }


  public getPdfFacturaSeleccionada(factura: Factura) {

    var adBlockEnabled = false;
    var testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    document.body.appendChild(testAd);
    window.setTimeout(function () {
      if (testAd.offsetHeight === 0) {
        adBlockEnabled = true;
      }
      testAd.remove();
      setTimeout(() => {
        if (adBlockEnabled) {
          swal.fire({
            imageUrl: 'https://www.1spotmedia.com/assets/common/images/adblock.jpg',
            title: 'You have activated adblock ',
            text: 'Disable adblock to be able to document!',
          })
        }
      }, 200);
    }, 100);

    this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.generarPdfFacturaPorCliente(
      this.clienteLogueado.codigoPersona, factura.secFactura)
      .subscribe(() => {
      });
  }

  public getPdfPackingSeleccionada(factura: Factura, tipo: number) {

    var adBlockEnabled = false;
    var testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    document.body.appendChild(testAd);
    window.setTimeout(function () {
      if (testAd.offsetHeight === 0) {
        adBlockEnabled = true;
      }
      testAd.remove();
      setTimeout(() => {
        if (adBlockEnabled) {
          swal.fire({
            imageUrl: 'https://www.1spotmedia.com/assets/common/images/adblock.jpg',
            title: 'You have activated adblock ',
            text: 'Disable adblock to be able to document!',
          })
        }
      }, 200);
    }, 100);

    this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.generarPdfPackingPorCliente(
      this.clienteLogueado.codigoPersona, factura.secFactura, tipo)
      .subscribe(() => {
      });
  }

  public applyFilter(busquedaConEnter: any, busquedaConBoton: string) {


    if (busquedaConBoton === "S") {
      if (this.filterFechaSince == null) {
        this.filterFechaSince = '';
      }
      if (this.filterFechaUntil == null) {
        this.filterFechaUntil = '';
      }
      if ((this.filterValue.length == 0 && this.filterFechaSince == null && this.filterFechaUntil == null)
        || (this.filterValue.length == 0 && (this.filterFechaSince.length == 0 && this.filterFechaUntil.length == 0))) {
        this._getfacturas();
        return;
      }

      if (this.filterValue.length == 0) {
        this.filterValue = 'xnullx'
      }

      this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
      this.appService.getfacturasFiltro(this.clienteLogueado.codigoPersona, this.page,
        this.datepipe.transform(this.filterFechaSince, 'yyyy-MM-dd'),
        this.datepipe.transform(this.filterFechaUntil, 'yyyy-MM-dd'),
        this.filterValue.trim()).subscribe((data: any) => {
          if (this.filterValue == 'xnullx') {
            this.filterValue = '';
          }
          this.facturas = data.map(factura => ({
            ...factura,
            connectionDate: this.fomatDate(factura.connectionDate)
          }));
          if (this.facturas.length > 0) {
            this.count = this.facturas[0].totalConsulta;
            this.mostrarMensaje = false
            return;
          } else {
            this.mostrarMensaje = true
          }
          this.count = 0;
        });

      return;
    }

    if (busquedaConEnter.keyCode === 13) {
      if (this.filterFechaSince == null) {
        this.filterFechaSince = '';
      }
      if (this.filterFechaUntil == null) {
        this.filterFechaUntil = '';
      }
      if ((this.filterValue.length == 0 && this.filterFechaSince == null && this.filterFechaUntil == null)
        || (this.filterValue.length == 0 && (this.filterFechaSince.length == 0 && this.filterFechaUntil.length == 0))) {
        this._getfacturas();
        return;
      }

      if (this.filterValue.length == 0) {
        this.filterValue = 'xnullx'
      }

      this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
      this.appService.getfacturasFiltro(this.clienteLogueado.codigoPersona, this.page,
        this.datepipe.transform(this.filterFechaSince, 'yyyy-MM-dd'),
        this.datepipe.transform(this.filterFechaUntil, 'yyyy-MM-dd'),
        this.filterValue.trim()).subscribe((data: any) => {
          if (this.filterValue == 'xnullx') {
            this.filterValue = '';
          }

          this.facturas = data.map(factura => ({
            ...factura,
            connectionDate: this.fomatDate(factura.connectionDate)
          }));
          if (this.facturas.length > 0) {
            this.count = this.facturas[0].totalConsulta;
            this.mostrarMensaje = false
            return;
          } else {
            this.mostrarMensaje = true
          }
          this.count = 0;
        });
    }

  }

  // public onPageChanged(event) {
  //   this.page = event;
  //   window.scrollTo(0, 0);
  //   this.applyFilter(null, "S");
  // }

  onPageChanged2(event: number) {
    this.page = event; // Actualiza el número de página actual
    window.scrollTo(0, 0);
    this.applyFilter(null, "S");
    console.log('Página actual:', this.page);
  }

  goToFirstPage() {
    this.page = 1; 
    this.onPageChanged2(this.page);
  }

  goToLastPage() {
    this.page = (this.facturas[0].totalConsulta)-2; 
    this.onPageChanged2(this.page);
  }

  public _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }


  public _limpiarFiltros() {
    this.filterFechaSince = ""
    this.filterFechaUntil = ""
    this.filterValue = ""
    this.facturas = []
    this.page = 1
    this.ngOnInit();

  }

  public _updateDate(event) {
    if (this.filterFechaSince != "" && this.filterFechaUntil != "") {
      this.page = 1
      this.applyFilter(null, "S");
    }
  }

}

