import { CustomersNewComponent } from './customersNew/customersNew.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InformationComponent } from './information/information.component';
import { OrdersComponent } from './orders/orders.component';
import { FilesComponent } from './files/files.component';
import { CustomersComponent } from './customers/customers.component';
import { StatementsComponent } from './statements/statements.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { CreditnoteComponent } from './creditnote/creditnote.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { OrderDetailDialogComponent } from 'src/app/shared/products-carousel/order-detail-dialog/order-detail-dialog.component';
import { CustomersNewFormComponent } from './customersNewForm/customersNewForm.component';
//import { Statements2Component } from './statements2/statements2.component';

export const routes = [
  {
    path: '',
    component: AccountComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
      { path: 'information', component: InformationComponent, data: { breadcrumb: 'Information' } },
      { path: 'orders', component: OrdersComponent, data: { breadcrumb: 'Orders' } },
      { path: 'files', component: FilesComponent, data: { breadcrumb: 'My Account' } },
      { path: 'statements', component: StatementsComponent, data: { breadcrumb: 'Account Statement' } },
      { path: 'invoices', component: InvoicesComponent, data: { breadcrumb: 'Invoices' } },
      { path: 'creditnote', component: CreditnoteComponent, data: { breadcrumb: 'Credits' } },
      { path: 'mycustomers', component: CustomersComponent, data: { breadcrumb: 'Customers' } },
      { path: 'customers-form', component: CustomersNewComponent, data: { breadcrumb: 'New Customers' } },
      { path: 'customers-formNew', component: CustomersNewFormComponent, data: { breadcrumb: 'New Customers' } },
      { path: 'orders-details', component: OrderDetailDialogComponent},
      { path: 'statements', data: { breadcrumb: 'Account Statement2' } }
    ]
  }
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    PipesModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    AccountComponent,
    DashboardComponent,
    InformationComponent,
    OrdersComponent,
    FilesComponent,
    CustomersComponent,
    StatementsComponent,
    InvoicesComponent,
    CreditnoteComponent,
    CustomersNewComponent,
    OrderDetailDialogComponent,
    CustomersNewFormComponent,
    //Statements2Component
  ]
})
export class AccountModule { }

