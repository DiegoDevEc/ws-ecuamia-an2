import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AppWebshopService } from 'src/app/app-webshop.service';
import { ClienteDTO } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';
import { EnumSiNo } from 'src/app/enumeration/enumeration';
import { WebsocketService } from 'src/app/websocket.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public currencies = ['USD'];
  public currency: any;
  public flags = [
    { name: 'English', image: 'assets/images/flags/gb.svg' }
  ];
  public flag: any;
  public clienteLogueado: ClienteDTO;
  public logueado = false;

  constructor(public appService: AppService, public dialog: MatDialog, public router: Router, public appWebShopService: AppWebshopService,
    public dialogRef: MatDialogRef<ProfileComponent>, private websocketService: WebsocketService) { }


  close(){
    this.dialogRef.close()
  }

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
   // this.appService.setRegistrarCarritoDetallePorCliente();
    this.dialogRef.close();
    this.appService.Data.cartListCaja = [];
    this.appService.CajaArmada.variedades = [];
    this.appService.cargosAdicionalesLocal = null;
    this.appService.activarBusquedaCuandoElimina = false;
    this.appService.ngOnDestroy();
    localStorage.clear();
    sessionStorage.clear();
    this.appWebShopService.data = this.appWebShopService.getCartLocalStorage();
    this.appWebShopService.paginador = this.appWebShopService.getPaginadorLocalStorage();
    this.appWebShopService.cajaMixtaArmada = this.appWebShopService.getCajaMixtaArmada();
    
    this.appWebShopService.paginador.filtroNombre = '';
    this.appWebShopService.paginador.cajaMixta = []
    this.appWebShopService.paginador.colores = []
    this.appWebShopService.paginador.filtroProducto = []
    this.appWebShopService.paginador.isPromo = false
    this.appWebShopService.paginador.isLimited = false
    this.appWebShopService.paginador.orden = 'PRO'
    this.appWebShopService.addPaginadorLocalStorage();
    this.appWebShopService.coloresWebShop.forEach(color => color.select = EnumSiNo.N)
    this.appWebShopService.productosWebShopFilter.forEach(producto => producto.select = EnumSiNo.N)
    this.appService.mostrarPromociones = false;
    this.appService.mostrarLimited = false;
    this.appService.mostrarTinted = false;
    this.appWebShopService.listaFiltrosSeleccionados = [];
    
    this.websocketService.close();

    this.router.navigate([""]);
  }

  public _settigns(){
    this.dialogRef.close()
    this.router.navigate(['/account/dashboard'])
  }

}
