import { Component, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Data, AppService } from '../../../app.service';
import { Product } from '../../../app.models';

@Component({
  selector: 'app-product-detail-dialog',
  templateUrl: './product-detail-dialog.component.html',
  styleUrls: ['./product-detail-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDetailDialogComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  constructor(public appService: AppService,
    public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product) { }

  ngOnInit() { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      }
    };
  }

  public close(): void {
    this.dialogRef.close();
  }
}
