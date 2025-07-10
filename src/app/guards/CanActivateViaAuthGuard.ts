import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AppService } from '../app.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

    constructor(private authService: AppService, private router: Router) { }

    canActivate(
        route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("rxjs").Observable<boolean> | Promise<boolean> {

                // If the user is not logged in we'll send them back to the home page
                if (!this.authService.isLogged()) {
                    this.router.navigate(['/']);
                    return false;
                }
        
                return true;
        
    }

  
}