import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
//import { HomeComponent } from "./home.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { PopoverModule } from "ngx-smart-popover";
import { FiltrosPipe } from 'src/app/theme/pipes/filtros.pipe';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';



export const routes = [
 // { path: '', component: HomeComponent, pathMatch: 'full' }
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
   // HomeComponent,
    FiltrosPipe
  ]
})
export class HomeModule { }
