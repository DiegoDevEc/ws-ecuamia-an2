import { Component, ViewEncapsulation, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Data, AppService } from '../../../app.service';
import { Product } from '../../../app.models';

@Component({
  selector: 'app-products-message',
  templateUrl: './products-message.component.html',
  styleUrls: ['./products-message.component.scss'],
  encapsulation: ViewEncapsulation.None
})



export class ProductsMessageComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  @Output() cambiarCaja: EventEmitter<boolean> = new EventEmitter();

  constructor(public appService: AppService,
              public dialogRef: MatDialogRef<ProductsMessageComponent>,
              @Inject(MAT_DIALOG_DATA) public product: Product) { }

  ngOnInit( ) {
   }



  public close(): void {
    this.cambiarCaja.emit(false);
    this.dialogRef.close();
  }

  
}