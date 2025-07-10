import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ambiente, BuzonClient, Caja, Usuario } from '../app.modelsWebShop';
import { AppService, Data } from '../app.service';
import { AppWebshopService } from '../app-webshop.service';
import { DeleteComponent } from '../pages/popus/delete/delete.component';
import { WebsocketService } from '../websocket.service';
import { DeviceSessionService } from '../device-session.service';

@Component({
  selector: 'app-loginfleurametzofchesapeake',
  templateUrl: './loginfleurametzofchesapeake.component.html',
  styleUrls: ['./loginfleurametzofchesapeake.component.scss']
})
export class LoginfleurametzofchesapeakeComponent implements OnInit {
  public mostrarLoginForm: number = 1
  public mostrarRecordarPassword: number = 0
  public mostrarlookingPartner: number = 0
  public enviarMensaje = 0
  deviceSession: any;

  //login
  public loginForm: FormGroup;
  public ipAddress: string


  public errorServidor: boolean = false
  public emailEnviarPassword: string = ""
  public enviarPasswordForm: FormGroup


  //contact register
  //contact register
  public signupForm: FormGroup
  public dateNow: Date
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  //validarFormularios
  public botonDisabledLogin: boolean = true
  public botonDisabledReset: boolean = true
  public botonDisabledLook: boolean = true

  public mensaje: string = ''
  public loading: boolean = false

  constructor(public router: Router, public dialog: MatDialog, public snackBar: MatSnackBar,
    public _appService: AppService, public formBuilder: FormBuilder, public dialogRef: MatDialogRef<LoginfleurametzofchesapeakeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public appService: AppService, private deviceSessionService: DeviceSessionService, 
    public appWebshopService: AppWebshopService, private websocketService: WebsocketService) {
      this.websocketService.connect()
     }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'nameUser': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.compose([Validators.required])]
    });

    this.enviarPasswordForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
    });

    this.signupForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required])],
      'phone': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'message': ['', Validators.compose([Validators.required])]
    });

    if (this.data.login == 1) {
      this.mostrarLoginForm = 0
      this.enviarMensaje = 1
      this.mostrarlookingPartner = 0
    }

    this._appService.Data.cartListCaja = []
    this.appService.Data.totalCartCount = 0
  }

  _recordarPassword() {
    this.mostrarLoginForm = 0
    this.mostrarRecordarPassword = 1
    this.mostrarlookingPartner = 0
  }

  _mostrarLokingPartner() {
    this.mostrarLoginForm = 0
    this.mostrarRecordarPassword = 0
    this.mostrarlookingPartner = 1
  }

  public validarFormularioLogin(evento) {
    if (this.loginForm.valid) {
      this.botonDisabledLogin = false
    } else {
      this.botonDisabledLogin = true
      return
    }
  }

  public validarFormularioReset(evento) {
    if (this.enviarPasswordForm.valid) {
      this.botonDisabledReset = false
    } else {
      this.botonDisabledReset = true
      return
    }
  }

  public validarFormularioLook(evento) {
    if (this.signupForm.valid) {
      this.botonDisabledLook = false
    } else {
      this.botonDisabledLook = true
      return
    }
  }

  public loginByUserName() {
    this.appWebshopService.cajaMixtaArmada = this.appWebshopService.getCajaMixtaArmada()
    try {
      if (this.loginForm.valid) {
        // tslint:disable-next-line:no-unused-expression
        const user: Usuario = new Usuario(
          this.loginForm.value.password,
          this.loginForm.value.nameUser,
          null,
          null
        );

        this._appService.loginUsuarioPorPerfil(user, this.ipAddress).subscribe(
          (data: any) => {
            if (data.pk.codigoPerfil == undefined || data.pk.codigoPerfil == null) {
              this._appService.loginUsuario(user, 'web', this.ipAddress).subscribe(
                (data: any) => {

                  if (data.activeWebShop === 'N') {
                    this.mensaje = 'Your account has been blocked, to unlock please contact with your sales manager.'
                    return;
                  }

                  localStorage.setItem('Usuario', JSON.stringify(data));
                  this.appWebshopService.estadoPadre = data.estadoPadre;
                  this._getCarritoDetallePorCliente();
                  if (this.data.mode !== 'login') {
                    this.router.navigate(['home']);
                  } else {
                    window.open('https://florexsales.com/home', '_blank');
                  }
                },
                (err: any) => {
                  this.websocketService.close();
                  this.websocketService.connect();
                  if (err.status === 404) {
                    this.snackBar.open('Error: Could not connect to server, try later', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
                  }
                  else if (err.status === 401) {
                    if (err.error === 'error.seg.0018') {
                      this.mensaje = 'Your account has been blocked, to unlock please click "Forgot password"'
                    }
                    if (err.error === 'Usuario suspendido') {
                      this.mensaje = 'Your account is disabled, please contact your account manager for help.'
                    } else {
                      this.mensaje = 'The Username or password you entered is incorrect'
                    }
                  }
                  else {
                    this.snackBar.open('Error: Could not connect to server, try later', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
                  }

                }
              );
              return;
            }


            this._appService.loginUsuario(user, 'flo', this.ipAddress).subscribe(
              (data: any) => {
                let token = data.token;
                //window.open(ambiente.urlFlorex + token, '_self');

                if (this.data.mode !== 'login') {
                  window.open(ambiente.urlFlorex + token, '_self');
                } else {
                  window.open(ambiente.urlFlorex + token, '_blank');
                }

                return;
              }, (err: any) => {
                this.websocketService.close();
                this.websocketService.connect();
                if (err.status === 404) {
                  this.snackBar.open('Error: Could not connect to server, try later', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
                }
                else if (err.status === 401) {
                  this.mensaje = 'The Username or password you entered is incorrect'
                }
                else {
                  this.snackBar.open('Error: Could not connect to server, try later', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
                }
              });
          });
      }
      else {
        this.botonDisabledLogin = true
        return
        //this.snackBar.open('Fill in the credentials please', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
      }
    } catch (error) {
      this.snackBar.open('Error: Could not connect to server, try later', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
    }

  }

  public onLoginFormSubmit(): void {
    
    localStorage.clear();
    sessionStorage.clear(); 
    
    
    this.loading = true;

    //this.deviceSessionService.deviceAndConectivity();
    this.deviceSessionService.deviceAndConectivity().then((session) => {
      this.deviceSession = session;
      this.deviceSession.typeMessage = 'LOGIN_MSJ_';
      this.deviceSession.user = this.loginForm.value.nameUser;

      this.websocketService.sendMessage(this.deviceSession);

      let cantidadPeticion = 0;

      // Puedes suscribirte a la respuesta del servidor aquí
      this.websocketService.socket$.subscribe(
        (response) => {
          cantidadPeticion = cantidadPeticion + 1

          if (cantidadPeticion == 1) {
            this.loginByUserName();
            cantidadPeticion = 0;
          }
        },
        (error) => {
          console.error('Error al recibir la respuesta del servidor:', error);
          return
        }
      );



    }).catch((error) => {
      console.error('Error obteniendo la información del dispositivo y conectividad:', error);
    });

    //this.deviceSession = this.deviceSessionService.deviceAndConectivity();

    // this.deviceSession.typeMessage = 'LOGIN_MSJ_';
    // this.deviceSession.user = this.loginForm.value.nameUser;

    // const userName = `LOGIN_MSJ_${this.loginForm.value.nameUser}`;


  }

  getIP() {
    this._appService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  _resetearPassword() {
    if (this.enviarPasswordForm.value.email == "" || this.enviarPasswordForm.value.email == null) { return }
    //if (this.emailEnviarPassword == "") { return }
    this._appService.resetearPassword(this.enviarPasswordForm.value.email).subscribe(data => {
      this.enviarPasswordForm.reset()
      this.snackBar.open('An email has been sent with your new password', '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
    }, (err) => {
      this.snackBar.open('Email not found', '×', { panelClass: 'error', verticalPosition: 'top', duration: 1000 });
    });
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
        this.signupForm.reset()
        this.mostrarlookingPartner = 0
        this.enviarMensaje = 1
      });
    }
    else {
      this.snackBar.open('Fill in the credentials please', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
    }
  }

  get email() { return this.signupForm.get('email') }

  cerrar() {
    this.dialogRef.close()
  }


  _getCarritoDetallePorCliente() {
    var usuario = JSON.parse(localStorage.getItem('Usuario'));
    var codigoCliente = parseInt(usuario.codigoPersona);
    this.appWebshopService.getCartLocalStorage();
    this.appWebshopService.data.cartListCaja = [];
    this.appWebshopService.data.totalCartCount = 0;
    
    /*this.appService._obtenerCarritoPorCliente(codigoCliente).subscribe(data => {
      if (data[0].carritoDetalle != "0") {
        var carrito = JSON.parse(data[0].carritoDetalle);

        if (carrito !== null && carrito.cartListCaja.length > 0) {
          sessionStorage.setItem("Destino", JSON.stringify(carrito.destinoSeleccionado));
          sessionStorage.setItem("Camion", JSON.stringify(carrito.camionSeleccionado));
          localStorage.setItem("_ls_dateConecction" , carrito.fecha)
        }
        this.appWebshopService.data.cartListCaja = carrito.cartListCaja;
        this.appWebshopService.data.totalCartCount = 0;
        this.appWebshopService.data.cartListCaja.forEach(caja => {

          if (caja.tipoCaja === 'M') {
            caja.detalle.forEach(cajaMixta => {
              this.appWebshopService.data.totalPrice += cajaMixta.precio
            })
          } else {
            this.appWebshopService.data.totalPrice += caja.precioTotalCaja
          }

          this.appWebshopService.data.totalCartCount += caja.cantidadCajas;
        });
        this.appWebshopService.addCartLocalStorage();
      }
    })*/

  }

}
