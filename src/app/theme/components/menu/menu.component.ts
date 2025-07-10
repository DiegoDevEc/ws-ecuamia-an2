import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../../app.service';
import { ProductsMessageComponent } from 'src/app/shared/products-carousel/products-message/products-message.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import swal from 'sweetalert2';
import { Caja, MenuActivo } from 'src/app/app.modelsWebShop';
import { ClienteDTO } from 'src/app/app.models';
import { Router } from '@angular/router';
import { DeleteComponent } from 'src/app/pages/popus/delete/delete.component';
import { AppWebshopService } from 'src/app/app-webshop.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public rutaAnterior: string
  public webshop: MenuActivo;
  public promos: MenuActivo;
  public standingOrders: MenuActivo;
  public comboBox: MenuActivo;
  public dutchFlowers: MenuActivo;
  public freeSampleBoxes: MenuActivo;
  public myCostumers: MenuActivo;
  public orderStatus: MenuActivo;
  public files: MenuActivo;
  public settings: MenuActivo;
  public activoNormal = false;
  public activoSubNormal = false;
  public c: ClienteDTO;
  public seeTabCustomer: any

  public listadoMenu: any[];

  @Output() theHubClicked:EventEmitter<any>= new EventEmitter<any>();


  constructor(public appService: AppService, public dialog: MatDialog, private router: Router, public snackBar: MatSnackBar, public appWebService: AppWebshopService) {
  }

  ngOnInit() {
    this.menuSeleccionado();
    this.obtenerMenusActivos();
    this.appService._botonMenuSeleccionado(this.router.url)
    this.appService.codigosProveedorFinales = [];
    this.appService.codigosProveedorRespaldo = [];
    this.appService.codigosProveedorFinales = [];
    this.appService.codigosProveedorRespaldo = [];
    this.appService.CajaArmada.totalProcentajeLleno = 0;
    this.appService.countBunches = 0;
    this.appService.cajasConValor = [];
    this.appService.busquedaGeneralWs = "";
    this.appService.busquedaGeneralColorWS = [];
    this.appService.listaProductosBusquedaMezcla = [];
    this.appService.resultadoBusqueda == false;
  }

  menuSeleccionado() {
    this.c = JSON.parse(localStorage.getItem('Usuario'));
    if (this.c.codigoClientePadre) {
      this.activoSubNormal = true;
    } else {
      this.activoNormal = true;
    }
  }

  obtenerMenusActivos() {
    this.c = JSON.parse(localStorage.getItem('Usuario'));

    this.appService.menusActivos(this.c.codigoPersona).subscribe(data => {
      this.listadoMenu = data;

      for (let index = 0; index < this.listadoMenu.length; index++) {
        const element = this.listadoMenu[index];

        if (element.nombre === 'Webshop') {
          this.webshop = element;
        }
        if (element.nombre === 'Promos') {
          this.promos = element;
        }
        if (element.nombre === 'Standing Orders') {
          this.standingOrders = element;
        }
        if (element.nombre === 'Combo Box') {
          this.comboBox = element;
        }
        if (element.nombre === 'Dutch Flowers Box') {
          this.dutchFlowers = element;
        }
        if (element.nombre === 'Free Sample Boxes') {
          this.freeSampleBoxes = element;
        }
        if (element.nombre === 'My Customers') {
          this.myCostumers = element;
        }
        if (element.nombre === 'Orders Status') {
          this.orderStatus = element;
        }
        if (element.nombre === 'Files & Invoices') {
          this.files = element;
        }
        if (element.nombre === 'Setting') {
          this.settings = element;
        }

        if (element.mostrarCustomer == true) {
          this.seeTabCustomer = true
        } else {
          this.seeTabCustomer = false
        }

      }
    });

  }

  openMegaMenu() {
    const pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function (el) {
      if (el.children.length > 0) {
        if (el.children[0].classList.contains('mega-menu')) {
          el.classList.add('mega-menu-pane');
        }
      }
    });
  }

  validarHome() {
    this.appService.btnHub = 1
    this.appService.btnStading = 0
    this.appService.btnCombo = 0
    this.appService.btnCustomers = 0
    this.appService.btnOrders = 0
    this.appService.btnBilling = 0
    this.rutaAnterior = this.router.url
    var resultado = this._validarDiferenteRuta('/home')
    if (resultado === 0) {
      this.theHubClicked.emit();
      return
    }
    
    this.validarBotonesNavegacion('/home')
    
  }

  validarPromo() {
    this.rutaAnterior = this.router.url
    this.validarBotonesNavegacion(this.rutaAnterior)
  }

  validarStading() {
    this.appService.btnHub = 0
    this.appService.btnStading = 1
    this.appService.btnCombo = 0
    this.appService.btnCustomers = 0
    this.appService.btnOrders = 0
    this.appService.btnBilling = 0
    this.rutaAnterior = this.router.url
    var resultado = this._validarDiferenteRuta('/stading')
    if (resultado === 0) {
      return
    }
    this.validarBotonesNavegacion('/stading')
  }

  validarCombo() {
    this.appService.btnHub = 0
    this.appService.btnStading = 0
    this.appService.btnCombo = 1
    this.appService.btnCustomers = 0
    this.appService.btnOrders = 0
    this.appService.btnBilling = 0
    this.rutaAnterior = this.router.url
    var resultado = this._validarDiferenteRuta('/comboBox')
    if (resultado === 0) {
      return
    }
    this.validarBotonesNavegacion('/comboBox')
  }

  myCustomers() {
    if(this.appWebService.getCajaMixtaArmada().detalle.length > 0 ){
      this.snackBar.open('To move to another screen please complete your mix box or reset it and start again later.', '×', 
      { panelClass: 'warning', verticalPosition: 'top', duration: 3000 });
      return
    }
    this.appService.btnHub = 0
    this.appService.btnStading = 0
    this.appService.btnCombo = 0
    this.appService.btnCustomers = 1
    this.appService.btnOrders = 0
    this.appService.btnBilling = 0
    this.rutaAnterior = this.router.url
    var resultado = this._validarDiferenteRuta('/account/mycustomers')
    if (resultado === 0) {
      return
    }
    this.validarBotonesNavegacion('/account/mycustomers')
  }

  accountOrders() {
    if(this.appWebService.getCajaMixtaArmada().detalle.length > 0 ){
      this.snackBar.open('To move to another screen please complete your mix box or reset it and start again later.', '×', 
      { panelClass: 'warning', verticalPosition: 'top', duration: 3000 });
      return
    }
    this.appService.btnHub = 0
    this.appService.btnStading = 0
    this.appService.btnCombo = 0
    this.appService.btnCustomers = 0
    this.appService.btnOrders = 1
    this.appService.btnBilling = 0
    this.rutaAnterior = this.router.url
    /*var resultado = this._validarDiferenteRuta('/account/orders')
    if (resultado === 0) {
      return
    }*/
    this.validarBotonesNavegacion('/account/orders')
  }

  accountFiles() {
    if(this.appWebService.getCajaMixtaArmada().detalle.length > 0 ){
      this.snackBar.open('To move to another screen please complete your mix box or reset it and start again later.', '×', 
      { panelClass: 'warning', verticalPosition: 'top', duration: 3000 });
      return
    }
    this.appService.btnHub = 0
    this.appService.btnStading = 0
    this.appService.btnCombo = 0
    this.appService.btnCustomers = 0
    this.appService.btnOrders = 0
    this.appService.btnBilling = 1
    this.rutaAnterior = this.router.url
    var resultado = this._validarDiferenteRuta('/account/files')
    if (resultado === 0) {
      return
    }
    this.validarBotonesNavegacion('/account/files')
  }

  _validarDiferenteRuta(URL: string) {
    if (this.rutaAnterior === URL) {
      return 0;
    }
  }

  _files() {
    this.rutaAnterior = this.router.url
    this.validarBotonesNavegacion(this.rutaAnterior)
  }

  public validarBotonesNavegacion(URL: string) {
    localStorage.removeItem("_lsIndividualC")
    if (this.appService.CajaArmada.totalProcentajeLleno > 1 && this.appService.CajaArmada.totalProcentajeLleno <= 100) {
      const dialogRef = this.dialog.open(DeleteComponent, {
        data: { titulo: 'Caution', mensaje: 'You can loose the items you add to cart' },
        panelClass: 'delete-boxes'
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          for (let i = 0; i < this.appService.CajaArmada.variedades.length; i++) {
            this.appService.CajaArmada.variedades.splice(i, 1);
          }
          this.appService.CajaArmada.totalProcentajeLleno = 0
          this.appService.CajaArmada.totalPiezas = 0
          this.appService.activarBusquedaCuandoElimina = false
          this.appService.cambioMenu = false
          this.appService.CajaArmada.variedades = []
          this.router.navigate(['/' + URL]);
        }
        else {
          this.appService.cambioMenu = true
          this.appService._botonMenuSeleccionado(this.rutaAnterior);
          this.router.navigate(['/' + this.rutaAnterior]);
        }
      });
    } else {
      this.appService.cambioMenu = false
      this.appService.activarBusquedaCuandoElimina = false
      this.router.navigate(['/' + URL]);
    }

  }


}

