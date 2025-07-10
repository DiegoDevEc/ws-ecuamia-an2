import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  timeout: any;
  readonly timeoutDuration = 1800000;

  constructor(private router: Router) {
    this.resetTimeout();
    this.setListeners();
  }

  private setListeners() {
    console.log('Escuchando eventos de inactividad...');
    
    window.addEventListener('mousemove', () => this.resetTimeout());
    window.addEventListener('click', () => this.resetTimeout());
    window.addEventListener('keypress', () => this.resetTimeout());
    window.addEventListener('scroll', () => this.resetTimeout());
  }

  private resetTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.logout(), this.timeoutDuration);
  }

  private logout() {
    console.log('Cerrando sesion automaticamente por inactividad o Logout');
    localStorage.clear();
    localStorage.removeItem('token');
    this.router.navigate(['/']); 
  }
}