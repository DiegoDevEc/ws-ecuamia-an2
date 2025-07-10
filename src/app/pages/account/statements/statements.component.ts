import { AppService } from 'src/app/app.service';
import { Orden, EstadoCuenta, DireccionDTO } from '../../../app.modelsWebShop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ClienteDTO, Direccion } from 'src/app/app.models';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatDatepicker } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import swal from 'sweetalert2';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class StatementsComponent implements OnInit {

  public listaEstadoCuenta: Array<EstadoCuenta> = [];
  public clienteLogueado: ClienteDTO;
  public filterFechaSince: string = '';
  public filterFechaUntil: string = '';
  public page: any
  public registroFinal: number;
  public balanceToClient: number = 0
  public newEstateListClient: Array<EstadoCuenta> = []
  public Ciudad: DireccionDTO;

  public balanceDate

  public url='';

  constructor(public appService: AppService, public datepipe: DatePipe, translate: TranslateService, private sanitizer: DomSanitizer) {
    translate.addLangs(['en'])
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
    this.getEstadoCuenta();
    //this.getPdfEstadoCuenta('PDF');
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
          this.listaEstadoCuenta = data
          if(this.filterFechaUntil==""){ 
          this.listaEstadoCuenta;
          this.balanceToClient = this.listaEstadoCuenta[0].saldo
          this.balanceDate = this.fomatDate(this.listaEstadoCuenta[0].fecha)
          }
          
          this.balanceToClient = this.listaEstadoCuenta.reverse()[0].saldo
          this.balanceDate = this.fomatDate(this.listaEstadoCuenta[0].fecha)
          this.listaEstadoCuenta;              
          for (let itemList of this.listaEstadoCuenta) {
            this.newEstateListClient.push({
              fecha: this.fomatDate(itemList.fecha), descripcion: itemList.descripcion.trim(),
              referencia: itemList.referencia, tipo: itemList.tipo, valor: itemList.valor, saldo: itemList.saldo
            })
          };
        });
  }

  private fomatDate(fecha){
    const parts = fecha.split('-');
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));

  }

  public getPdfEstadoCuenta(tipo: string) {

    if (this.filterFechaSince == null || this.filterFechaSince.length == 0) {
      this.filterFechaSince = 'null';
    }

    if (this.filterFechaUntil == null || this.filterFechaUntil.length == 0) {
      this.filterFechaUntil = 'null';
    }

     this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
     this.appService.generarPdfEstadoCuentaUrl(this.clienteLogueado.codigoPersona, (this.filterFechaSince == 'null' ? 'null' :
     this.datepipe.transform(this.filterFechaSince, 'yyyy-MM-dd')), (this.filterFechaUntil == 'null' ? 'null' :
       this.datepipe.transform(this.filterFechaUntil, 'yyyy-MM-dd')),
       tipo).subscribe((data) => {
      //   this.url=data+'#toolbar=0&view=FitH&navpanes=0&scrollbar=0';
       });
   
  }

  public downloadStatementPDF(tipo: string){

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

    this.appService.generarPdfEstadoCuenta(this.clienteLogueado.codigoPersona,(this.filterFechaSince == 'null' ? 'null' :
    this.datepipe.transform(this.filterFechaSince, 'yyyy-MM-dd')), (this.filterFechaUntil == 'null' ? 'null' :
    this.datepipe.transform(this.filterFechaUntil, 'yyyy-MM-dd')),
      tipo).subscribe((data: any) => {
     });

  }

  // public onPageChanged(event) {
  //   this.page = event;
  //   window.scrollTo(0, 0);
  // }

  onPageChanged2(event: number) {
    this.page = event; // Actualiza el número de página actual
    window.scrollTo(0, 0);
    //this.applyFilter(null, "S");
    console.log('Página actual:', this.page);
  }

  goToFirstPage() {
    this.page = 1; 
    this.onPageChanged2(this.page);
  }

  goToLastPage() {
    this.page = this.listaEstadoCuenta.length; 
    this.onPageChanged2(this.page);
  }

  public _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  public _limpiarFiltros() {
    this.filterFechaSince = ""
    this.filterFechaUntil = ""
    this.listaEstadoCuenta = []
    this.newEstateListClient = []
    this.page = 1
    this.getEstadoCuenta();
  }

  public _updateDate(event) {
    if (this.filterFechaSince != "null" && this.filterFechaUntil != "null") {
      this.listaEstadoCuenta = []
      this.newEstateListClient = []
      this.page = 1
      this.getEstadoCuenta();
      //this.getPdfEstadoCuenta('PDF');
    }
  }


}
