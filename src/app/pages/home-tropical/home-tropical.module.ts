import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeTropicalComponent } from './home-tropical.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { CardProductTropicalComponent } from './card-product-tropical/card-product-tropical.component';
//import { FiltrosPipe } from 'src/app/theme/pipes/filtros.pipe';
//import { CardProductComponent } from '../home-v2/card-product/card-product.component';

export const routes = [
  { path: '', component: HomeTropicalComponent, pathMatch: 'full' }
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
   // FiltrosPipe
  ],
  declarations: [
    HomeTropicalComponent,
   // FiltrosPipe,
   CardProductTropicalComponent
  ]
})

export class HomeTropicalModule { }
