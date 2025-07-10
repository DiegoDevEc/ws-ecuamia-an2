import { Component, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Data, AppService } from '../../../app.service';

@Component({
  selector: 'app-product-detalles-dialog',
  templateUrl: './product-detalles-dialog.component.html',
  styleUrls: ['./product-detalles-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDetallesDialogComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  public nombreCaja: string = ''
  // public editar = false;

  constructor(public appService: AppService,
    public dialogRef: MatDialogRef<ProductDetallesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.nombreCaja = this.data.caja.nombreCaja.toLowerCase()
    for (let index = 0; index < this.data.caja.variedades.length; index++) {
      const variedad = this.data.caja.variedades[index]
      variedad.producto = variedad.producto.toLowerCase()
      variedad.nombreVariedad = variedad.nombreVariedad.toLowerCase() 
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
