import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PurchaseCompletedComponent } from './pages/checkout/purchase-completed/purchase-completed.component';
import { CanActivateViaAuthGuard } from './guards/CanActivateViaAuthGuard';
import { PresentationComponent } from './login/presentation/presentation.component';
//import { CheckoutStandingComponent } from './pages/checkout/checkout-standing/checkout-standing.component';
import { LoginpinnacleComponent } from './loginpinnacle/loginpinnacle.component';
import { LogineastcoastComponent } from './logineastcoast/logineastcoast.component';
import { LoginfleurametzofchesapeakeComponent } from './loginfleurametzofchesapeake/loginfleurametzofchesapeake.component';
import { LoginEcuamiaComponent } from './loginecuamia/loginecuamia.component';

export const routes: Routes = [
    { path: '', component: PresentationComponent, pathMatch: 'full' },
    { path: 'login', component: PresentationComponent, pathMatch: 'full' },
    { path: 'loginpinnacle', component: LoginpinnacleComponent },
    { path: 'logineastcoast', component: LogineastcoastComponent },
    { path: 'loginfleurametzofchesapeake', component: LoginfleurametzofchesapeakeComponent },
    { path: 'loginecuamia', component: LoginEcuamiaComponent},
    {
        path: '',
        component: PagesComponent, children: [
            { path: 'home', loadChildren: './pages/home-v2/home-v2.module#HomeV2Module', data: { breadcrumb: 'All Products' }, canActivate: [CanActivateViaAuthGuard] },
           { path: 'homeTropical', loadChildren: './pages/home-tropical/home-tropical.module#HomeTropicalModule', data: { breadcrumb: 'All Products Tropical' }, canActivate: [CanActivateViaAuthGuard] },
           // { path: 'home/:edit', loadChildren: './pages/home/home.module#HomeModule', data: { breadcrumb: 'All Products' }, canActivate: [CanActivateViaAuthGuard] },
            //{ path: 'stading', loadChildren: './pages/stading/stading.module#StadingModule', data: { breadcrumb: 'Stading' }, canActivate: [CanActivateViaAuthGuard] },
            //{ path: 'comboBox', loadChildren: './pages/comboBox/comboBox.module#ComboBoxModule', data: { breadcrumb: 'Combo Box' }, canActivate: [CanActivateViaAuthGuard] },
            //{ path: 'free', loadChildren: './pages/free/free.module#FreeModule', data: { breadcrumb: 'Rose Mixer' }, canActivate: [CanActivateViaAuthGuard] },
            { path: 'account', loadChildren: './pages/account/account.module#AccountModule', data: { breadcrumb: 'Account Settings' }, canActivate: [CanActivateViaAuthGuard] },
            { path: 'compare', loadChildren: './pages/compare/compare.module#CompareModule', data: { breadcrumb: 'Compare' }, canActivate: [CanActivateViaAuthGuard] },
            { path: 'checkout', loadChildren: './pages/checkout/checkout.module#CheckoutModule', data: { breadcrumb: 'Checkout' }, canActivate: [CanActivateViaAuthGuard] },
            { path: 'check-in', loadChildren: './pages/check-in/check-in.module#CheckInModule', data: { breadcrumb: 'Check In' }, canActivate: [CanActivateViaAuthGuard] },
            { path: 'purchase', component: PurchaseCompletedComponent, canActivate: [CanActivateViaAuthGuard] },
           // { path: 'checkout/standing', component: CheckoutStandingComponent, canActivate: [CanActivateViaAuthGuard] },
            
        ]
    },
    { path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
    // useHash: true 
});
