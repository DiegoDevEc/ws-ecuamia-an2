import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppService } from '../../../app.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { CargosAdicionalesComponent } from 'src/app/pages/popus/cargos-adicionales/cargos-adicionales.component';
import * as jsPDF from 'jspdf';
import { ambiente } from 'src/app/app.modelsWebShop';
import { ResponsiveService } from 'src/app/responsive.service';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailDialogComponent implements OnInit {

  public detalleOrdenSeleccionado: any
  urlImagen = ''
  isMobile: boolean;

  constructor(public appService: AppService, public dialog: MatDialog, translate: TranslateService, private router: Router,
  public responsive: ResponsiveService
  ) {
    translate.addLangs(['en'])
    translate.setDefaultLang('en');
    translate.use('en');
    this.isMobile = this.responsive.isMobile();
    if (this.appService.detalleOrdenSeleccionado == null || this.appService.detalleOrdenSeleccionado == undefined) {
      this.router.navigate(['/account/orders']);
    }
    this.detalleOrdenSeleccionado = this.appService.detalleOrdenSeleccionado;
    console.log(JSON.stringify(this.detalleOrdenSeleccionado));
    
  }

  ngOnInit() {
    this.urlImagen = ambiente.urlFotos
  }

  _cargosAdicionales() {
    var dataValue = "ORDER STATUS"
    const dialogRef = this.dialog.open(CargosAdicionalesComponent, {
      data: { value: dataValue, cajas: this.appService.detalleOrdenSeleccionado, condicion: null },
      panelClass: 'costo-envio'
    });
  }

  public imprimirOrdenPdf() {
  
    var data = document.getElementById('data');
    var width = data.scrollWidth; 
    var height = data.scrollHeight; 

    html2canvas(data, { width: width, height: height }).then(canvas => {
      var imgData = canvas.toDataURL('image/png');
      var imgWidth = 210; 
      var pageHeight = 295;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jsPDF('p', 'mm');
      var position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      var nombrePdf = 'orden' + this.detalleOrdenSeleccionado.id + '.pdf'
      doc.save(nombrePdf);
    });
  }


}

