import { Component, OnInit, HostListener, ViewChild, ContentChild, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from '../app.settings';
import { AppService } from '../app.service';
import { Category, ClienteDTO } from '../app.models';
import { SidenavMenuService } from '../theme/components/sidenav-menu/sidenav-menu.service';
import { CarritodetalleComponent } from './popus/carritodetalle/carritodetalle.component';
import { MatDialog } from '@angular/material';
import { NotificationComponent } from './popus/notification/notification.component';
import { ProfileComponent } from './popus/profile/profile.component';
//import { HomeComponent } from './home/home.component';
import { LocalStorageUpdateService } from '../local-storage-update.service';
import { Subscription } from 'rxjs';
import { Destino, Marcacion } from '../app.modelsWebShop';
import { SharedService } from '../shared/service/shared.service';
import { HomeV2Component } from './home-v2/home-v2.component';
import { AppWebshopService } from '../app-webshop.service';
import { ResponsiveService } from '../responsive.service';
import { WebsocketService } from '../websocket.service';
import { DeleteComponent } from './popus/delete/delete.component';
import { OrdenCompraWebShop } from '../app.modelsWebShopV2';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [SidenavMenuService, HomeV2Component]
})
export class PagesComponent implements OnInit {
  public showBackToTop = false;
  public categories: Category[];
  public category: Category;
  public sidenavMenuItems: Array<any>;
  public c: ClienteDTO;
  public destino: any;
  @ViewChild('sidenav') sidenav: any;
  @ContentChild(HomeV2Component)
  private hubComponent: HomeV2Component;
  public nameUser: any;
  public settings: Settings;
  openChatForm: boolean = false;
  public imageURL = 'CLI_PADRE';
  public marcacionStorage: Marcacion
  isMobile: boolean;

  constructor(public appSettings: AppSettings,
    public appService: AppService,
    public sidenavMenuService: SidenavMenuService,
    public router: Router, public dialog: MatDialog, public localStorageUpdateService: LocalStorageUpdateService,
    private sharedService: SharedService, public appWebShopService: AppWebshopService, private responsiveService: ResponsiveService, 
    private websocketService: WebsocketService) {
    this.settings = this.appSettings.settings;
    //setInterval(() => window.location.reload(), 600000); //10 minutos y se actualiza
  }

  ngOnInit() {

    this.responsiveService.getScreenWidth().subscribe(width => {
      this.isMobile = width < 768;
      console.log("isMobile", this.isMobile);
    });

    this.onImageSelected()
    this.sharedService.imageUpdated.subscribe((newImage: string) => {
      this.onImageSelected()
    });
    this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
    //para validar imagen
    if (JSON.parse(localStorage.getItem('Usuario')) != null || JSON.parse(localStorage.getItem('Usuario')) != undefined) {
      this.c = JSON.parse(localStorage.getItem('Usuario'));
      this.nameUser = this.c.nombrePersona
    }
    if (JSON.parse(localStorage.getItem('Destino')) != null || JSON.parse(localStorage.getItem('Destino')) != undefined) {
      this.destino = JSON.parse(localStorage.getItem('Destino'));
    }
    this.actualizarLocalStorageData();

  }

  onImageSelected() {
    const cliente: any = JSON.parse(localStorage.getItem('Usuario'));
    this.marcacionStorage = JSON.parse(sessionStorage.getItem('Marcacion'));
    const destinoStorage: any = JSON.parse(sessionStorage.getItem('Destino'));

    if (cliente.codigoClientePadre === undefined && !cliente.mostrarCustomer) {
      this.imageURL = 'CLI_PADRE'
      return
    }

    if (cliente.codigoClientePadre === undefined && this.marcacionStorage !== null && this.marcacionStorage.esPrincipal === 'S') {
      if (destinoStorage != null && destinoStorage.subcliente != null) {
        this.imageURL = 'CLI_PADRE'
        return
      }
    }

    if (cliente.codigoClientePadre === undefined && this.marcacionStorage !== null && this.marcacionStorage.esPrincipal === 'N') {
      if (cliente.imagenLogo.length > 0) {
        this.imageURL = cliente.imagenLogo
        return
      } else {
        this.imageURL = 'CLI_PADRE'
        return
      }
    }

    if (cliente.codigoClientePadre !== undefined && cliente.imagenLogo !== '') {
      if (cliente.imagenLogo.length > 0) {
        this.imageURL = cliente.imagenLogo
        return
      } else {
        this.imageURL = 'CLI_PADRE'
        return
      }
    }

    if (cliente.codigoClientePadre !== undefined) {
      return
    }

    if (this.marcacionStorage == null || destinoStorage == null) {
      return
    }

  }


  private actualizarLocalStorageData() {
    //this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
    //para validar imagen
    console.log("Actulizando Storage desde menu");

    if (JSON.parse(localStorage.getItem('Destino')) != null || JSON.parse(localStorage.getItem('Destino')) != undefined) {
      this.destino = JSON.parse(localStorage.getItem('Destino'));
    }
  }

  changeCategory(event) {
    if (event.target) {
      this.category = this.categories.filter(category => category.name === event.target.innerText)[0];
    }
    if (window.innerWidth < 960) {
      this.stopClickPropagate(event);
    }
  }

  clear() {
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }

  changeTheme(theme) {
    this.settings.theme = theme;
  }

  stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  search() { }

  scrollToTop() {
    const scrollDuration = 200;
    const scrollStep = -window.pageYOffset / (scrollDuration / 20);
    const scrollInterval = setInterval(() => {
      if (window.pageYOffset !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => { window.scrollTo(0, 0); });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    //($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
    ($event.target.documentElement.scrollTop > 300) ? this.appService.showBoxProgress = true : this.appService.showBoxProgress = false;
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });
    this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
  }

  closeSubMenus() {
    if (window.innerWidth < 960) {
      this.sidenavMenuService.closeAllSubMenus();
    }
  }

  shippingCarsDetail() {

    var usuario = JSON.parse(localStorage.getItem('Usuario'));

    this.appService._obtenerCarritoPorCliente(usuario.codigoPersona, this.appWebShopService.getPaginadorLocalStorage()).subscribe(data => {
      
      if (data.length > 0) {

        const dialogRef = this.dialog.open(DeleteComponent, {
          data: {
            titulo: 'Welcome Back! We’re happy to see you again!',
            mensaje: 'You have carts pending to be confirmed. <br> Would you like to continue to work where you left off or start a new order?',
            mensajeDos: 'Please click new or select one of your pending carts.',
            imagen: 'C',
            starbuttons: 'S',
            carritos: data
          },
          panelClass: 'delete-boxes'
        });
        dialogRef.afterClosed().subscribe(res => {
          console.log(res);
          if (res || res == undefined) {
            sessionStorage.setItem('selectContinueBuying', 'S');
            this.sharedService.actulizarProductosHome('OK');
            return;
          }
        });
      }

    })

  }

  shippingCartDetail() {
    var height = '';
    if (this.appService.Data.cartListCaja.length > 0) {
      var height = '100vh';
    }
    const dialogRef = this.dialog.open(CarritodetalleComponent, {
      data: {
        null: null,
        editar: false
      },
      panelClass: 'carrito-detalle',
      height: height
    });
  }

  _notificacion() {
    const dialogRef = this.dialog.open(NotificationComponent, {
      data: { null: null, editar: false },
      panelClass: 'notificacion'
    });
  }

  _profile() {
    const dialogRef = this.dialog.open(ProfileComponent, {
      data: { null: null, editar: false },
      panelClass: 'profile'
    });
  }

  home() {
    this.router.navigate(['home']);
  }
  _theHubEvent() {
    this.appService.changeName("hub");

  }
}
