import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};

import { PipesModule } from '../theme/pipes/pipes.module';
import { RatingComponent } from './rating/rating.component';
import { ControlsComponent } from './controls/controls.component';
import { MainCarouselComponent } from './main-carousel/main-carousel.component';
import { BrandsCarouselComponent } from './brands-carousel/brands-carousel.component';
import { ProductsCarouselComponent } from './products-carousel/products-carousel.component';
import { ProductDialogComponent } from './products-carousel/product-dialog/product-dialog.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ControlsBoxComponent } from './controls-box/controls-box.component';
import { ControlsBoxCompletComponent } from './controls-box-complet/controls-box-complet.component';
import { ProductDetallesDialogComponent } from './products-carousel/product-detalles-dialog/product-detalles-dialog.component';
import { OrderDetailDialogComponent } from './products-carousel/order-detail-dialog/order-detail-dialog.component';
import { ProductsMessageComponent } from './products-carousel/products-message/products-message.component';
import { ProductDeleteBoxComponent } from './products-carousel/product-delete-box/product-delete-box.component';
import { CarriersDialogComponent } from './products-carousel/carriers-dialog/carriers-dialog.component';
import { ProductPoComponent } from './products-carousel/product-po/product-po.component';
import { DetailProductImageComponent } from './products-carousel/detail-product-image/detail-product-image.component';

import { DifferentdestinationComponent } from '../pages/differentdestination/differentdestination.component';
import { AboutusmodalComponent } from '../pages/popus/aboutusmodal/aboutusmodal.component';
import { CarritodetalleComponent } from '../pages/popus/carritodetalle/carritodetalle.component';
import { ViewposubclientComponent } from './products-carousel/viewposubclient/viewposubclient.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BoxProgressComponent } from '../theme/components/box-progress/box-progress.component';
import { PopoverModule } from "ngx-smart-popover";
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductControlsComponent } from './product-controls/product-controls.component';
import { FormsModule } from '@angular/forms';
import { ControlsFedexComponent } from './controls-fedex/controls-fedex.component';
import { ControlsBoxFedexComponent } from './controls-box-fedex/controls-box-fedex.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SwiperModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    PerfectScrollbarModule,
    PipesModule,
    NgxSpinnerModule,
    PopoverModule,
    NgxPaginationModule,
    FormsModule
  ],
  exports: [
    RouterModule,
    SwiperModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    PerfectScrollbarModule,
    PipesModule,
    RatingComponent,
    ControlsComponent,
    ControlsFedexComponent,
    ControlsBoxFedexComponent,
    MainCarouselComponent,
    BrandsCarouselComponent,
    ProductsCarouselComponent,
    ProductDialogComponent,
    ProductDetallesDialogComponent,
    CategoryListComponent,
    ControlsBoxComponent,
    ControlsBoxCompletComponent,
    ProductsMessageComponent,
    ProductDeleteBoxComponent,
    CarriersDialogComponent,
    ProductPoComponent,
    DetailProductImageComponent,
    DifferentdestinationComponent,
    AboutusmodalComponent,
    CarritodetalleComponent,
    ViewposubclientComponent,
    NgxSpinnerModule,
    BoxProgressComponent,
    PopoverModule,
    NgxPaginationModule,
    ProductControlsComponent
  ],
  declarations: [
    RatingComponent,
    ControlsComponent,
    ControlsFedexComponent,
    ControlsBoxFedexComponent,
    MainCarouselComponent,
    BrandsCarouselComponent,
    ProductsCarouselComponent,
    ProductDialogComponent,
    ProductDetallesDialogComponent,
    CategoryListComponent,
    ControlsBoxComponent,
    ControlsBoxCompletComponent,
    ProductsMessageComponent,
    ProductDeleteBoxComponent,
    CarriersDialogComponent,
    ProductPoComponent,
    DetailProductImageComponent,
    DifferentdestinationComponent,
    AboutusmodalComponent,
    CarritodetalleComponent,
    ViewposubclientComponent,
    BoxProgressComponent,
    ProductControlsComponent,
    ControlsFedexComponent,
    ControlsBoxFedexComponent,

  ],
  entryComponents: [
    ProductDialogComponent,
    ProductDetallesDialogComponent,
    ProductsMessageComponent,
    ProductDeleteBoxComponent,
    CarriersDialogComponent,
    ProductPoComponent,
    DetailProductImageComponent,
    DifferentdestinationComponent,
    AboutusmodalComponent,
    CarritodetalleComponent,
    ViewposubclientComponent
  ],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ]
})
export class SharedModule { }