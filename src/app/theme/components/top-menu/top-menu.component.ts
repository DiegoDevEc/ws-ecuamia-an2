import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../../app.service';
import { ClienteDTO } from 'src/app/app.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent implements OnInit {
  public currencies = ['USD'];
  public currency: any;
  public flags = [
    { name: 'English', image: 'assets/images/flags/gb.svg' }
  ];
  public flag: any;
  public clienteLogueado: ClienteDTO;
  public logueado = false;

  constructor(public appService: AppService, public router: Router) { }

  ngOnInit() {
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
    this.getClienteLogueado();
  }

  public changeCurrency(currency) {
    this.currency = currency;
  }

  public changeLang(flag) {
    this.flag = flag;
  }

  public getClienteLogueado() {

    if (localStorage.getItem('Usuario') !== null) {
      this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
      this.logueado = true;

      this.appService.clientLogin = JSON.parse(localStorage.getItem('Usuario'))
    }
  }

  public cerrarSesion() {
    //this.appService.Data.cartListCaja = []
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate([""])
    //this.appService.ngOnDestroy();
  }

}

