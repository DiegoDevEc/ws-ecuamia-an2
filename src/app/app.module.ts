import { ProductDetailDialogComponent } from './shared/products-carousel/product-detail-dialog/product-detail-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';

import { OverlayContainer, Overlay } from '@angular/cdk/overlay';
import { MAT_MENU_SCROLL_STRATEGY, MatPaginatorModule, MatTooltipModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { } from '@angular/material/dialog';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { menuScrollStrategy } from './theme/utils/scroll-strategy';

import { SharedModule } from './shared/shared.module';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { TopMenuComponent } from './theme/components/top-menu/top-menu.component';
import { MenuComponent } from './theme/components/menu/menu.component';
import { SidenavMenuComponent } from './theme/components/sidenav-menu/sidenav-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';

import { AppSettings } from './app.settings';
import { AppService } from './app.service';
import { AppInterceptor } from './theme/utils/app-interceptor';
import { OptionsComponent } from './theme/components/options/options.component';
import { FooterComponent } from './theme/components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseCompletedComponent } from './pages/checkout/purchase-completed/purchase-completed.component';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { ControlServices } from './shared/controls/control.service';
import { CanActivateViaAuthGuard } from './guards/CanActivateViaAuthGuard';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NewPoComponent } from './shared/products-carousel/new-po/new-po.component';
import { DatePipe } from '@angular/common';
import { PresentationComponent } from './login/presentation/presentation.component';
import { MatTableModule } from '@angular/material/table';
import { MessageclientComponent } from './pages/popus/messageclient/messageclient.component';
import { SignupComponent } from './pages/popus/aboutus/signup.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './pages/popus/notification/notification.component';
import { ProfileComponent } from './pages/popus/profile/profile.component';
import { InformationComponent } from './pages/popus/information/information.component';

import { PopoverModule } from "ngx-smart-popover";
import { FiltersComponent } from './pages/popus/filters/filters.component';
import { AddedComponent } from './pages/popus/added/added.component';
import { EditComponent } from './pages/popus/edit/edit.component';
import { OrderPlacedComponent } from './pages/popus/order-placed/order-placed.component';
import { QuestionComponent } from './pages/popus/question/question.component';
import { DownloadComponent } from './pages/popus/download/download.component';
import { StadingInformationComponent } from './pages/popus/stading-information/stading-information.component';
import { NoteBoxesComponent } from './pages/popus/note-boxes/note-boxes.component';
import { DeleteComponent } from './pages/popus/delete/delete.component';
//import { CheckoutStandingComponent } from './pages/checkout/checkout-standing/checkout-standing.component';
import { CargosAdicionalesComponent } from './pages/popus/cargos-adicionales/cargos-adicionales.component';
import { RegistrarCargosComponent } from './pages/popus/registrar-cargos/registrar-cargos.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LocalStorageUpdateService } from './local-storage-update.service';
import { PipesModule } from './theme/pipes/pipes.module';
import { IncreaseboxComponent } from './pages/popus/increasebox/increasebox.component';
import { LoginpinnacleComponent } from './loginpinnacle/loginpinnacle.component';
import { LogineastcoastComponent } from './logineastcoast/logineastcoast.component';
import { LoginfleurametzofchesapeakeComponent } from './loginfleurametzofchesapeake/loginfleurametzofchesapeake.component';
import { LoginEcuamiaComponent } from './loginecuamia/loginecuamia.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { InformationFedexComponent } from './pages/popus/information-fedex/information-fedex.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0'
    }),
    SharedModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    DeviceDetectorModule.forRoot(),
    PopoverModule,
    AutocompleteLibModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    PipesModule
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    NotFoundComponent,
    TopMenuComponent,
    MenuComponent,
    SidenavMenuComponent,
    BreadcrumbComponent,
    OptionsComponent,
    FooterComponent,
    ProductDetailDialogComponent,
    PurchaseCompletedComponent,
    BusquedaComponent,
    NewPoComponent,
    PresentationComponent,
    MessageclientComponent,
    SignupComponent,
    CargosAdicionalesComponent,
    LoginComponent,
    NotificationComponent,
    ProfileComponent,
    InformationComponent,
    InformationFedexComponent,
    IncreaseboxComponent,
    FiltersComponent,
    AddedComponent,
    EditComponent,
    OrderPlacedComponent,
    QuestionComponent,
    DownloadComponent,
    StadingInformationComponent,
    NoteBoxesComponent,
    DeleteComponent,
    //CheckoutStandingComponent,
    CargosAdicionalesComponent,
    RegistrarCargosComponent,
    LoginpinnacleComponent,
    LogineastcoastComponent,
    LoginfleurametzofchesapeakeComponent,
    LoginEcuamiaComponent
  ],
  exports: [
    NewPoComponent,//modal para registrar
    MessageclientComponent,
    SignupComponent,
    CargosAdicionalesComponent,
    LoginComponent,
    NotificationComponent,
    ProfileComponent,
    InformationComponent,
    InformationFedexComponent,
    IncreaseboxComponent,
    FiltersComponent,
    AddedComponent,
    EditComponent,
    OrderPlacedComponent,
    QuestionComponent,
    DownloadComponent,
    StadingInformationComponent,
    NoteBoxesComponent,
    DeleteComponent,
    RegistrarCargosComponent,
    NgxPaginationModule,
    LoginpinnacleComponent,
    LogineastcoastComponent,
    LoginfleurametzofchesapeakeComponent,
    LoginEcuamiaComponent
  ],
  entryComponents: [
    NewPoComponent,
    MessageclientComponent,
    SignupComponent,
    CargosAdicionalesComponent,
    NotificationComponent,
    ProfileComponent,
    InformationComponent,
    InformationFedexComponent,
    IncreaseboxComponent,
    FiltersComponent,
    AddedComponent,
    EditComponent,
    OrderPlacedComponent,
    QuestionComponent,
    DownloadComponent,
    StadingInformationComponent,
    NoteBoxesComponent,
    DeleteComponent,
    RegistrarCargosComponent, 
    LoginComponent,
    LoginpinnacleComponent,
    LogineastcoastComponent,
    LoginfleurametzofchesapeakeComponent,
    LoginEcuamiaComponent
  ],
  providers: [
    AppSettings,
    DatePipe,
    AppService,
    ControlServices,
    CanActivateViaAuthGuard,
    LocalStorageUpdateService,
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: MAT_MENU_SCROLL_STRATEGY, useFactory: menuScrollStrategy, deps: [Overlay] },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}