import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Data, AppService } from '../../../app.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ambiente } from './../../../app.modelsWebShop'

@Component({
  selector: 'app-detail-product-image',
  templateUrl: './detail-product-image.component.html',
  styleUrls: ['./detail-product-image.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailProductImageComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  public datos: any
  public urlImagen: string

  constructor(public appService: AppService, public dialogRef: MatDialogRef<DetailProductImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.urlImagen = ambiente.urlFotos
    if (this.data.image.combo === "S") {
      this.datos = this.data.image.producto
      return
    }
    this.datos = this.data.image.nombreVariedad + ' -  ' + this.data.image.producto
  }

  public close(): void {
    this.dialogRef.close();
  }


}
