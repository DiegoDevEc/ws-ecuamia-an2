import { AppService } from 'src/app/app.service';
import { Orden, NotaDeCredito } from '../../../app.modelsWebShop';
import { Component, OnInit } from '@angular/core';
import { ClienteDTO } from 'src/app/app.models';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-creditnote',
  templateUrl: './creditnote.component.html',
  styleUrls: ['./creditnote.component.scss']
})
export class CreditnoteComponent implements OnInit {

  public page: number = 1;
  public count: any;
  public clienteLogueado: ClienteDTO;
  public notasDeCredito: NotaDeCredito[] = [];
  public filterValue: string = '';
  public filterFechaSince: string = '';
  public filterFechaUntil: string = '';
  mostrarMensaje:boolean = false

  constructor(public appService: AppService, public datepipe: DatePipe) { }

  ngOnInit() {
    this.getNotasCredito();
  }

  // public getNotasCredito() {
  //   this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
  //   this.appService.getNotasDeCredito(this.clienteLogueado.codigoPersona, this.page).subscribe((data: any) => {
  //     this.notasDeCredito = data.map(nc => ({
  //       ...nc,
  //       creditDate: this.fomatDate(nc.creditDate)
  //     }));;
  //     this.notasDeCredito.reverse()
  //     if (this.notasDeCredito.length > 0) {
  //       this.count = this.notasDeCredito.reverse()[0].totalConsulta;
  //     }
  //   });
  // }

  getNotasCredito() {
    this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.getNotasDeCredito(this.clienteLogueado.codigoPersona, this.page).subscribe((data: any) => {
      this.notasDeCredito = data.map(nc => ({
        ...nc,
        creditDate: this.fomatDate(nc.creditDate)
      }));
      if (this.notasDeCredito.length > 0) {
        this.count = this.notasDeCredito[0].totalConsulta;
      }
    });
  }

  private fomatDate(fecha){
    const parts = fecha.split('-');
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));

  }

  public applyFilter(busquedaConEnter: any, busquedaConBoton: string) {


    if (busquedaConBoton === "S") {

      //this.page = 1

      if (this.filterFechaSince == null) {
        this.filterFechaSince = '';
      }
      if (this.filterFechaUntil == null) {
        this.filterFechaUntil = '';
      }

      if ((this.filterValue.length == 0 && this.filterFechaSince == null && this.filterFechaUntil == null)
      || (this.filterValue.length == 0 && (this.filterFechaSince.length == 0 && this.filterFechaUntil.length == 0))) {
      this.getNotasCredito();
      return;
      }

      if (this.filterValue.length == 0) {
        this.filterValue = 'xnullx'
      }

      this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
      this.appService.getNotasDeCreditoFiltro(this.clienteLogueado.codigoPersona, this.page,
        this.datepipe.transform(this.filterFechaSince, 'yyyy-MM-dd'),
        this.datepipe.transform(this.filterFechaUntil, 'yyyy-MM-dd'),
        this.filterValue.trim()).subscribe((data: any) => {
          if (this.filterValue == 'xnullx') {
            this.filterValue = '';
          }
          this.notasDeCredito = data.map(nc => ({
            ...nc,
            creditDate: this.fomatDate(nc.creditDate)
          }));

          //this.notasDeCredito = data;
          if (this.notasDeCredito.length > 0) {
            this.count = this.notasDeCredito[0].totalConsulta;
            this.mostrarMensaje = false
            return;
          }else{
            this.mostrarMensaje = true
          }
          this.count = 0;
        });

      return;

    }

    if (busquedaConEnter.keyCode === 13) {
      
      //this.page = 1

      if (this.filterFechaSince == null) {
        this.filterFechaSince = '';
      }
      if (this.filterFechaUntil == null) {
        this.filterFechaUntil = '';
      }

      if (this.filterValue.length == 0) {
        this.filterValue = 'xnullx'
      }

      this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
      this.appService.getNotasDeCreditoFiltro(this.clienteLogueado.codigoPersona, this.page,
        this.datepipe.transform(this.filterFechaSince, 'yyyy-MM-dd'),
        this.datepipe.transform(this.filterFechaUntil, 'yyyy-MM-dd'),
        this.filterValue.trim()).subscribe((data: any) => {
          if (this.filterValue == 'xnullx') {
            this.filterValue = '';
          }

          this.notasDeCredito = data;
          if (this.notasDeCredito.length > 0) {
            this.count = this.notasDeCredito[0].totalConsulta;
            this.mostrarMensaje = false
            return;
          }else{
            this.mostrarMensaje = true
          }
          this.count = 0;
        });

    }


  }

  public getPdfNotaCreditoSeleccionada(notaCredito: NotaDeCredito) {

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
    this.appService.generarPdfNotaCreditoPorCliente(this.clienteLogueado.codigoPersona, notaCredito.numeroNotaCredito, notaCredito.numero).subscribe((data: any) => {
    });
  }

  //  public onPageChanged(event) {
  //    this.page = event;
  //    window.scrollTo(0, 0);
  //    this.notasDeCredito = []
  //    this.getNotasCredito();
  //    //this.applyFilter(null, "S");
  //  }

  public onPageChanged(event: number) {
    this.page = event;
    window.scrollTo(0, 0);
    //this.notasDeCredito = [];
    this.getNotasCredito();
    console.log('Página actual:', this.page);
  }
  
  goToFirstPage() {
    this.page = 1;
    this.onPageChanged(this.page);
  }
  
  goToLastPage() {
    // Asumiendo que totalPaginas es la cantidad total de páginas
    this.page = this.notasDeCredito[0].totalConsulta;
    this.onPageChanged(this.page);
  }


  public _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  public _limpiarFiltros() {
    this.filterFechaSince = ""
    this.filterFechaUntil = ""
    this.filterValue = ""
    this.notasDeCredito = []
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
