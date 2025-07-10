import { ClienteDTO, ClientUserUpdate } from './../../../app.models';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AppService } from 'src/app/app.service';
import { Camion, Destino, Marcacion } from 'src/app/app.modelsWebShop';
import Swal from 'sweetalert2';
import { CarriersDialogComponent } from 'src/app/shared/products-carousel/carriers-dialog/carriers-dialog.component';
import { Router } from '@angular/router';
import { EnumMensajes, EnumTipoPersona } from 'src/app/enumeration/enumeration';
import { DeleteComponent } from '../../popus/delete/delete.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  cliente: any;
  nombre: any;
  clienteInformacionForm: FormGroup;
  userInformacionForm: FormGroup;
  show: boolean = false;
  value: string;
  viewValue: string;
  camion: Camion;
  destino: Destino;
  uploadImage: File;
  temporaryImage: any;
  clientUserUpdate: ClientUserUpdate;
  fileName: string;
  passwordType: string = 'password';
  passwordShow: boolean = true;
  camionesAll: Array<Camion> = [];
  camionSeleccionado: Camion;
  camiones: Array<Camion> = [];
  subclientes: Array<Marcacion> = [];
  marcacionSleccionada: Marcacion;
  carrierClient: any;
  numberAccountP: boolean = false;
  messageFormClient: string = '';
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private pattern = "[A-Za-z-0-9]{5,50}[0-9]{1,50}";
  viewUploadImage: boolean = true;
  directionClient: any;
  cityName: any;
  countryName: any;
  zipCode: any;
  phone: any;
  contactname: any;
  destinaty: any;
  tipoPersona: string;
  disabled: boolean;
  verImagen: boolean;
  contieneMayuscula: string = 'Must include at least 1 capital letter';
  contieneNumero: string = 'Must include at least 1 number';
  contieneLongitud: string = 'Must be between 6-8 characters';
  contieneEspacio: string = 'Cannot contain spaces';
  errorPassMayuscula = true;
  errorPassNumero = true;
  errorPassLongitud = true;
  errorPassEspacio = false;
  valuePassword: string = "";
  nombreImagen: string = '';
  public imageURL = '';
  public clienteLogueado: ClienteDTO;
  public logueado = false;
  public direccionSubcliente = 'prueba';
  public telefonoSubcliente = 'telf';

  constructor(public appService: AppService, public formBuilder: FormBuilder, public snackBar: MatSnackBar, private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getClienteLogueado();
    const cliente: any = JSON.parse(localStorage.getItem('Usuario'));
    if (cliente.codigoClientePadre != undefined || cliente.codigoClientePadre != null ){
      this.datosSubcliente();
    }
    if(cliente.imagenLogo == ''){
      this.imageURL = "../../../assets/images/recursos/sinFoto.jpg"
    } else {
      this.imageURL = cliente.imagenLogo
    }
    this.appService._botonMenuSeleccionado(this.router.url)
    this.clienteInformacionForm = this.formBuilder.group({
      'currentCliente': ['', Validators.compose([Validators.required])],
      'currentContactName': [''],
      'currentAdress': ['', Validators.compose([Validators.required])],
      'currentCity': ['', Validators.compose([Validators.required])],
      'currentState': ['', Validators.compose([Validators.required])],
      'currentZipcode': ['', Validators.compose([Validators.required])],
      'currentPhone': ['', Validators.compose([Validators.required])],
      'currentCarrier': ['', Validators.compose([Validators.required])],
      'numberAccount': [''],
      'currentPO': ['', Validators.required]
    });

    this.userInformacionForm = this.formBuilder.group({
      'currentNamePerson': ['', Validators.compose([Validators.required])],
      'currentUserName': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      'currentEmail': ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'currentPassword': [''],
      'currentConfirmPassword': ['', Validators.compose([])],
    });

    this.hideUploadImage();
    this.obtenerTodosCamiones();
    this.verImagen = true;
    this.loadPageFirst();

  }

  public obtenerTodosCamiones() {
    this.appService.getAllCamiones().subscribe((data: any) => {
      this.camionesAll = data;
    });
  }

  public loadPageFirst() {
    this.cliente = JSON.parse(localStorage.getItem('Usuario'));
    this.destino = JSON.parse(sessionStorage.getItem('Destino'));
    this.camion = JSON.parse(sessionStorage.getItem('Camion'));
    //Datos de Usuario 
    this.userInformacionForm.get('currentNamePerson').setValue(this.cliente.nombre);
    this.userInformacionForm.get('currentUserName').setValue(this.cliente.codigoUsuario);
    this.userInformacionForm.get('currentEmail').setValue(this.cliente.email);

    if (this.destino == null || this.destino == undefined) {
      this.destinaty = "NOTHING TO SHOW"
    } else {
      this.destinaty = this.destino.nombre
    }
    //Datos de Cliente
    // if (this.cliente.telefonos.length > 0) {
    //   this.phone = this.cliente.telefonos[0].telefono;
    // } else {
    //   this.phone = 'NOTHING TO SHOW';
    // }

    // if (this.camion != null ) {
    //   this.carrierClient = this.camion.nombre;
    // } else {
    //   this.carrierClient = 'NOTHING TO SHOW';
    // }

    // if (this.cliente.direcciones.length > 0) {
    //   this.directionClient = this.cliente.direcciones[0].direccion;
    //   this.cityName = this.cliente.direcciones[0].ciudad.nombre;
    //   this.countryName = this.cliente.direcciones[0].ciudad.pais.nombre;
    //   this.zipCode = this.cliente.direcciones[0].codigoPostal;
    // }
    // else {
    //   this.directionClient = 'NOTHING TO SHOW';
    //   this.cityName = 'NOTHING TO SHOW';
    //   this.countryName = 'NOTHING TO SHOW';
    //   this.zipCode = 'NOTHING TO SHOW';
    // }

    // if (this.cliente.contactos.length > 0) {
    //   this.contactname = this.cliente.contactos[0].persona;
    //   this.clienteInformacionForm.get('currentContactName').setValue(this.contactname);
    // } else {
      
    // }

    // this.clienteInformacionForm.get('currentCliente').setValue(this.cliente.nombrePersona);
    // this.clienteInformacionForm.get('currentAdress').setValue(this.directionClient);
    // this.clienteInformacionForm.get('currentCity').setValue(this.cityName);
    // this.clienteInformacionForm.get('currentState').setValue(this.countryName);
    // this.clienteInformacionForm.get('currentZipcode').setValue(this.zipCode);
    // this.clienteInformacionForm.get('currentPhone').setValue(this.phone);
    // this.clienteInformacionForm.get('currentCarrier').setValue(this.carrierClient);
    // this.clienteInformacionForm.get('currentPO').setValue(this.destinaty);
    // this.clienteInformacionForm.get('numberAccount').setValue('NOTHING TO SHOW');



  }

  public getClienteLogueado() {

    if (localStorage.getItem('Usuario') !== null) {
      this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
      this.logueado = true;

      this.appService.clientLogin = JSON.parse(localStorage.getItem('Usuario'))
    }
  }

  datosSubcliente() {
      if (sessionStorage.getItem('Marcacion') == 'undefined' || sessionStorage.getItem('Marcacion') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoClientePadre, 'C').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            const principal = this.subclientes.find(subcliente => subcliente.esPrincipal === 'S')
              this.marcacionSleccionada = this.subclientes[0];
          }
          sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacionSleccionada));
          this.appService._getCargasTransportePorMarcacion(this.marcacionSleccionada.codigoSeleccion).subscribe(data => {
            localStorage.setItem("ls_cargos", JSON.stringify(data));
          });
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"))
      }
      this.direccionSubcliente = this.marcacionSleccionada.direccionEtiqueta;
      this.telefonoSubcliente = this.marcacionSleccionada.telefonoEtiqueta;
    }

  public saveChanges() {
    if (this.userInformacionForm.valid) {
      this.clientUserUpdate = new ClientUserUpdate();
      this.clientUserUpdate.userName = this.userInformacionForm.get('currentNamePerson').value;
      this.clientUserUpdate.userCode = this.userInformacionForm.get('currentUserName').value;
      this.clientUserUpdate.userEmail = this.userInformacionForm.get('currentEmail').value;
      this.clientUserUpdate.userPassword = this.userInformacionForm.get('currentPassword').value;
      this.clientUserUpdate.userImage = this.temporaryImage;
      this.clientUserUpdate.clientName = this.clienteInformacionForm.get('currentCliente').value;
      this.clientUserUpdate.clientAdress = this.clienteInformacionForm.get('currentAdress').value;
      this.clientUserUpdate.clientCity = this.clienteInformacionForm.get('currentCity').value;
      this.clientUserUpdate.clientState = this.clienteInformacionForm.get('currentState').value;
      this.clientUserUpdate.clientZipCode = this.clienteInformacionForm.get('currentZipcode').value;
      this.clientUserUpdate.clientPhone = this.clienteInformacionForm.get('currentPhone').value;
      this.clientUserUpdate.clientCarrier = this.clienteInformacionForm.get('currentCarrier').value;
      this.clientUserUpdate.clientPO = this.clienteInformacionForm.get('currentPO').value;
      this.clientUserUpdate.fileName = this.fileName;
      this.clientUserUpdate.clientId = this.cliente.codigoPersona;
      this.clientUserUpdate.numberAccount = this.clienteInformacionForm.get('numberAccount').value;
      this.clientUserUpdate.contactName = this.clienteInformacionForm.get('currentContactName').value;
      if (this.clientUserUpdate.numberAccount != '' || this.clientUserUpdate.numberAccount != undefined) {
        this.clientUserUpdate.numberAccount = "0000";
      }
      const datos = JSON.parse(JSON.stringify([this.clientUserUpdate]));
      var modificar: any;
      var data = JSON.parse(localStorage.getItem("Usuario"));
      if (data.codigoClientePadre != null || data.codigoClientePadre != undefined) {
        this.tipoPersona = EnumTipoPersona.SUBCLIENTE;
        modificar = true;
      }
      else {
        this.tipoPersona = EnumTipoPersona.CLIENTE
        modificar = true;
      }
      this.appService.updateClientWS(datos, modificar, this.tipoPersona).subscribe((data: any) => {
        const dataImagen: string = data;
        if (dataImagen.includes("/fotos/")) {
          this.cliente.imagenLogo = dataImagen;
        }
        this.actualizarStorage(datos);
        const dialogRef = this.dialog.open(DeleteComponent, {
          data: { titulo: 'Alert', mensaje: EnumMensajes.INFOSUCCESS, mostrarBoton: true, imagen: 'S' },
          panelClass: 'delete-boxes'
        });
      },
        err => {
        }
      );
    }
    else {
      this.snackBar.open(EnumMensajes.REQUIREDFIELDS, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
    }
  }

  public actualizarStorage(data: any) {
    this.cliente.nombre = this.clientUserUpdate.userName;
    this.cliente.email = this.clientUserUpdate.userEmail;
    localStorage.removeItem('Usuario');
    localStorage.setItem('Usuario', JSON.stringify(this.cliente));
    this.appService.clientLogin = JSON.parse(localStorage.getItem('Usuario'));

  }

  public updateClient() {
    if (this.cliente.nombrePersona != this.clientUserUpdate.clientName
      || this.cliente.direcciones[0].direccion != this.clientUserUpdate.clientAdress
      || this.cliente.direcciones[0].ciudad.nombre != this.clientUserUpdate.clientCity
      || this.cliente.direcciones[0].ciudad.pais.nombre != this.clientUserUpdate.clientState
      || this.cliente.direcciones[0].codigoPostal != this.clientUserUpdate.clientZipCode
      || this.cliente.numeroTelefonico != this.clientUserUpdate.clientPhone
      || this.camion.nombre != this.clientUserUpdate.clientCarrier
      || this.destino.nombre != this.clientUserUpdate.clientPO) {
      return true;
    }
    return false;

  }

  public validaigualdad() {
    if (this.userInformacionForm.value.currentPassword != this.userInformacionForm.value.currentConfirmPassword) {
      this.snackBar.open(EnumMensajes.PASSWORDNOTEQUAL, '×', { panelClass: 'error', verticalPosition: 'top', duration: 2000 });
      return;
    }
  }

  public loadImage(file: File) {

    this.verImagen = false;
    this.nombreImagen = file.name;

    if (!file) {
      this.uploadImage = null;
      return;
    }

    if (file.type.indexOf('image') < 0) {
      Swal.fire('Image error', EnumMensajes.FILENOTIMAGE, 'error');
      this.uploadImage = null;
      return;
    }

    let reader = new FileReader();
    let urlImageTemp = reader.readAsDataURL(file);
    reader.onloadend = () => this.temporaryImage = reader.result;
    this.uploadImage = this.temporaryImage;
    this.fileName = file.name;
  }

  public openCarriersDialog() {
    const dialogRef = this.dialog.open(CarriersDialogComponent, {
      data: { carriers: this.camionesAll },
      panelClass: 'app-carriers-dialog'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (sessionStorage.getItem('Camion') == 'undefined' || sessionStorage.getItem('Camion') == null) {
        return
      }
      this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
      if (this.camionSeleccionado.codigoCamion == "AAX" || this.camionSeleccionado.codigoCamion == "FDX"
        || this.camionSeleccionado.codigoCamion == "FBE" || this.camionSeleccionado.codigoCamion == "PRT") {
        this.numberAccountP = true
      } else {
        this.numberAccountP = false
      }
      this.carrierClient = this.camionSeleccionado.nombre
    });
  }

  get currentNamePerson() { return this.userInformacionForm.get('currentNamePerson') }
  get currentPassword() { return this.userInformacionForm.get('currentPassword') }

  public hideUploadImage() {
    var data: any
    data = JSON.parse(localStorage.getItem("Usuario"))
    if (data.codigoClientePadre != null || data.codigoClientePadre != undefined) {
      this.viewUploadImage = false
      this.disabled = true
    }
    else {
      this.viewUploadImage = true
    }
  }

  public togglePassword() {
    if (this.passwordShow) {
      this.passwordShow = false;
      this.passwordType = 'string';
    }
    else {
      this.passwordShow = true;
      this.passwordType = 'password';
    }
  }

  public validarpassword(event) {
    if (this.userInformacionForm.value.currentPassword != this.userInformacionForm.value.currentConfirmPassword) {
      this.show = true;
    }
    else {
      this.show = false
    }
    // Validate capital letters
    var passUpperCase = new RegExp(/[A-Z]/g);
    if (passUpperCase.test(event.target.value)) {
      this.errorPassMayuscula = false;
    } else {
      this.errorPassMayuscula = true;
    }
    // Validate numbers
    var passNumber = new RegExp(/[0-9]/g);
    if (passNumber.test(event.target.value)) {
      this.errorPassNumero = false;
    } else {
      this.errorPassNumero = true;
    }
    // Validate space
    var containSpace = new RegExp(/\s/);
    if (containSpace.test(event.target.value)) {
      this.errorPassEspacio = true;
    } else {
      this.errorPassEspacio = false;
    }
    //Validate lenght
    if (event.target.value.length >= 6) {
      this.errorPassLongitud = false;
    } else {
      this.errorPassLongitud = true;
    }
  }

}
