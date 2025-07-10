
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterByIdPipe } from './filter-by-id.pipe';
import { FilterBrandsPipe } from './filter-brands.pipe';
import { BrandSearchPipe } from './brand-search.pipe';
import { TipoAgregaPipe } from './tipo-agrega.pipe';
import { SafePipe } from './safe.pipe';
import { ReverseDatePipe } from './reverse-date.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        FilterByIdPipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        TipoAgregaPipe,
        SafePipe,
        ReverseDatePipe
    ],
    exports: [
        FilterByIdPipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        TipoAgregaPipe,
        SafePipe
    ]
})
export class PipesModule { }