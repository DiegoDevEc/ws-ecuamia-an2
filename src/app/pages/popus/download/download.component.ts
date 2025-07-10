import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Factura } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';
import { ClienteDTO } from 'src/app/app.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  public clienteLogueado: ClienteDTO;

  constructor(public appService: AppService, public router: Router,
    public dialogRef: MatDialogRef<DownloadComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
  }

  close(){
    this.dialogRef.close()
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
          Swal.fire({
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
          Swal.fire({
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

}
