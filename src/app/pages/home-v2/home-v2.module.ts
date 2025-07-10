import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { FiltrosPipe } from 'src/app/theme/pipes/filtros.pipe';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { HomeV2Component } from './home-v2.component';
import { CardProductComponent } from './card-product/card-product.component';
import { MessageClientComponent } from './message-client/message-client.component';
import { CardProductFedexComponent } from './card-product-fedex/card-product-fedex.component';

export const routes = [
  { path: '', component: HomeV2Component, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    NgxPaginationModule,
    AutocompleteLibModule,
    PipesModule
  ],
  exports: [
    FiltrosPipe
  ],
  declarations: [
    HomeV2Component,
    FiltrosPipe,
    CardProductComponent,
    MessageClientComponent,
    CardProductFedexComponent
  ],
  entryComponents: [MessageClientComponent]
})
export class HomeV2Module { }
