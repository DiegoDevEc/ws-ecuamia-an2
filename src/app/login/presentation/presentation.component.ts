import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BuzonClient } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';
import { SignupComponent } from 'src/app/pages/popus/aboutus/signup.component';
import { AboutusmodalComponent } from 'src/app/pages/popus/aboutusmodal/aboutusmodal.component';
import { LoginComponent } from '../login.component';
import { AppWebshopService } from 'src/app/app-webshop.service';



@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {

  public over = 0;
  public providers = 0;
  public varieties = 0;
  public signupForm: FormGroup;
  public dateNow: Date;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public botonSeleccionadoHome = 1;
  public botonSeleccionadoVideo = 0;
  public botonSeleccionadoAbout = 0;
  public botonSeleccionadoPartner = 0;
  public botonSeleccionadoContact = 0;
  public botonDisabled: boolean = true;
  public showLoader = true;
  public mode;
  public partnersEcuamia: any[] = [];
  @HostListener("document:scroll", ['$event'])
  doSomethingOnWindowsScroll($event: any) {
    let scrollOffset = $event.srcElement.children[0].scrollTop;
    if (scrollOffset >= 0 && scrollOffset < 200) {
      this.homeSroll();
    }
    if (scrollOffset >= 200 && scrollOffset < 1000) {
      this.aboutSroll();
    }
    if (scrollOffset >= 1000 && scrollOffset < 1500) {
      this.partnersSroll();
    }
    if (scrollOffset >= 1500) {
      this.contactSroll();
    }
  }

  constructor(public router: Router, public dialog: MatDialog, public snackBar: MatSnackBar,
    public _appService: AppService, public formBuilder: FormBuilder,
    private spinner: NgxSpinnerService, public activatedRoute: ActivatedRoute, private appWEbShopService: AppWebshopService) { }

    token: string


  ngOnInit() {
    this._appService.obtenerPartners().subscribe((data: any) =>{
      
      this.partnersEcuamia = data;
    });
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token') 
    console.log(this.token);
  
    if(this.token){
     this.loginSuplantar(this.token);
    }
    
    //this.spinner.show();
    setTimeout(() => {
      //this.spinner.hide();
      this.showLoader = false;
    }, 2000);

    this.signupForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required])],
      'phone': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'message': ['', Validators.compose([Validators.required])]
    });
    localStorage.removeItem("_ls_dateConecction");
    localStorage.removeItem("_ls_dateConecctionStading");
    localStorage.removeItem("_ls_dateConecctionT");
    localStorage.removeItem("_ls_dateConecctionStadingT");
    localStorage.removeItem("selectContinueBuying");

    setTimeout(() => {
     // console.log(this.router.url);
      if (this.router.url === '/login') {
        this.mode = 'login';
        this._login();
      }
    }, 5);


  }

  public loginSuplantar(token: string ){
    this._appService.loginUsuarioSuplantar(token).subscribe(
      (data: any) => {
       // debugger
        localStorage.setItem('Usuario', JSON.stringify(data));
        this._getCarritoDetallePorCliente();
          this.router.navigate(['home']);
      },
      (err: any) => {
        if (err.status === 404) {
          this.snackBar.open('Error: Could not connect to server, try later', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }
    
        else {
          this.snackBar.open('Error: Could not connect to server, try later', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }

      }
    );
  }

  _getCarritoDetallePorCliente() {
    var usuario = JSON.parse(localStorage.getItem('Usuario'));
    var codigoCliente = parseInt(usuario.codigoPersona);
    this._appService.Data = this._appService.getCartLocalStorage();
    this._appService.Data.cartListCaja = [];
    this._appService.Data.totalCartCount = 0;
    this._appService._obtenerCarritoPorCliente(codigoCliente, this.appWEbShopService.getPaginadorLocalStorage()).subscribe(data => {
      console.log("data-PResentation", data);
      /*if (data[0].carritoDetalle != "0") {
        var carrito = JSON.parse(data[0].carritoDetalle);
        localStorage.setItem("Data", JSON.stringify(carrito));
        this._appService.Data.cartListCaja = carrito.cartListCaja;
        this._appService.Data.totalCartCount = 0;
        this._appService.Data.cartListCaja.forEach(caja => {
          this._appService.Data.totalCartCount += caja.cantidadIngresada;
        });
      }*/
    });
  }

  public signUp() {
    const dialogRef = this.dialog.open(SignupComponent, {
      data: { null: null, editar: false },
      panelClass: 'app-aboutus'
    });
  }

  public aboutUs() {
    const dialogRef = this.dialog.open(AboutusmodalComponent, {
      data: { null: null, editar: false },
      panelClass: 'at-item',
      width: '900px'
    });
  }

  public validarFormulario(evento) {
    if (this.signupForm.valid) {
      this.botonDisabled = false
    } else {
      this.botonDisabled = true
      return
    }
  }

  public registrarNuevoContacto() {
    if (this.signupForm.valid) {
      const user: BuzonClient = new BuzonClient(
        this.signupForm.value.name,
        "",
        this.dateNow = new Date(),
        this.signupForm.value.phone,
        this.signupForm.value.email,
        this.signupForm.value.message + ' (message from florexsales.com)',
        'PENDIENTE'
      );
      var datos: Array<BuzonClient> = [];
      datos = JSON.parse(JSON.stringify([user]))
      this._appService.registrarNuevoContacto(datos).subscribe(data => {
        this.snackBar.open('The information has been sent!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
        this.signupForm.reset()
        this.botonDisabled = true
        const dialogRef = this.dialog.open(LoginComponent, {
          data: { login: 1 },
          panelClass: 'login-dialog',
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        });
      });
    }
    else {
      //this.snackBar.open('Fill in the credentials please', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
      return;
    }
  }

  get email() { return this.signupForm.get('email') }

  _login() {

    localStorage.clear();
    let clase = '';
    if (this.mode == 'login') { clase = 'login-dialog-nobg' }
    else { clase = 'login-dialog' }
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { login: 0, mode: this.mode },
      panelClass: clase,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: this.mode !== 'login' ? '100%' : 'auto',
      width: '100%'
    });
  }


  home() {
    document.getElementById("home").scrollIntoView({ behavior: "smooth", block: "center" })
    this.botonSeleccionadoHome = 1
    this.botonSeleccionadoVideo = 0
    this.botonSeleccionadoAbout = 0
    this.botonSeleccionadoPartner = 0
    this.botonSeleccionadoContact = 0
  }

  video() {
    document.getElementById("video").scrollIntoView({ behavior: "smooth", block: "center" })
    this.botonSeleccionadoHome = 0
    this.botonSeleccionadoVideo = 1
    this.botonSeleccionadoAbout = 0
    this.botonSeleccionadoPartner = 0
    this.botonSeleccionadoContact = 0
  }

  about() {
    document.getElementById("about").scrollIntoView({ behavior: "smooth", block: "center" })
    this.botonSeleccionadoHome = 0
    this.botonSeleccionadoVideo = 0
    this.botonSeleccionadoAbout = 1
    this.botonSeleccionadoPartner = 0
    this.botonSeleccionadoContact = 0
  }

  partners() {
    document.getElementById("partners").scrollIntoView({ behavior: "smooth", block: "center" })
    this.botonSeleccionadoHome = 0
    this.botonSeleccionadoVideo = 0
    this.botonSeleccionadoAbout = 0
    this.botonSeleccionadoPartner = 1
    this.botonSeleccionadoContact = 0
  }

  contact() {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth", block: "center" })
    this.botonSeleccionadoHome = 0
    this.botonSeleccionadoVideo = 0
    this.botonSeleccionadoAbout = 0
    this.botonSeleccionadoPartner = 0
    this.botonSeleccionadoContact = 1
  }

  public _pageInstagram() {
    window.open("https://www.instagram.com/florexsales/")
  }

  public _pageFacebook() {
    window.open("https://www.facebook.com/florexmarketplace/")

  }
  homeSroll() {
    this.botonSeleccionadoHome = 1
    this.botonSeleccionadoVideo = 0
    this.botonSeleccionadoAbout = 0
    this.botonSeleccionadoPartner = 0
    this.botonSeleccionadoContact = 0
  }

  videoSroll() {

    this.botonSeleccionadoHome = 0
    this.botonSeleccionadoVideo = 1
    this.botonSeleccionadoAbout = 0
    this.botonSeleccionadoPartner = 0
    this.botonSeleccionadoContact = 0
  }

  aboutSroll() {

    this.botonSeleccionadoHome = 0
    this.botonSeleccionadoVideo = 0
    this.botonSeleccionadoAbout = 1
    this.botonSeleccionadoPartner = 0
    this.botonSeleccionadoContact = 0
  }

  partnersSroll() {

    this.botonSeleccionadoHome = 0
    this.botonSeleccionadoVideo = 0
    this.botonSeleccionadoAbout = 0
    this.botonSeleccionadoPartner = 1
    this.botonSeleccionadoContact = 0
  }

  contactSroll() {

    this.botonSeleccionadoHome = 0
    this.botonSeleccionadoVideo = 0
    this.botonSeleccionadoAbout = 0
    this.botonSeleccionadoPartner = 0
    this.botonSeleccionadoContact = 1
  }

}
