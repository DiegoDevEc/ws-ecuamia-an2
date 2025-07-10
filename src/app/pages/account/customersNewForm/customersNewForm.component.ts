import { AppService } from 'src/app/app.service';
import { Marcacion, Camion, SubClientInformation, CargosAdicionales, UsuarioMarcacionSubcliente, Destino } from '../../../app.modelsWebShop';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { QuestionComponent } from '../../popus/question/question.component';
import { NewPoComponent } from 'src/app/shared/products-carousel/new-po/new-po.component';
import { RegistrarCargosComponent } from '../../popus/registrar-cargos/registrar-cargos.component';
import { EnumAccion, EnumCodigoCamion, EnumMensajes } from 'src/app/enumeration/enumeration';
import { filter, map, startWith } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { CamionMarcacionDiasDTO } from 'src/app/app.models';

export interface estadoCliente {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-customersNewForm',
  templateUrl: './customersNewForm.component.html',
  styleUrls: ['./customersNewForm.component.scss']
})
export class CustomersNewFormComponent implements OnInit {

  estadosCliente: estadoCliente[] = [
    { value: 'ACT', viewValue: "Yes" },
    { value: 'INA', viewValue: 'No' }
  ];
  orders: estadoCliente[] = [
    { value: 'ACT', viewValue: "Yes" },
    { value: 'INA', viewValue: 'No' }
  ];

  clientInformationForm: FormGroup;
  estadoCliente: string;
  subClient: UsuarioMarcacionSubcliente;
  users: any;
  clientes: any;
  value: string;
  viewValue: string;
  show: boolean = false;
  camionesAll: Array<Camion> = [];
  camionSeleccionado: Camion;
  camiones: Array<Camion> = [];
  marcacionSleccionada: Marcacion;
  carrierClient: any;
  numberAccountP: boolean = false;
  messageFormClient: string = '';
  subCliente: Array<Marcacion> = [];
  accountNumber: string = '';
  subClientPo: any;
  codeClientFather: any;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private pattern = "[A-Za-z-0-9]{5,50}[0-9]{1,50}";
  activeValue: boolean = false;
  dialingCode: any;
  valuePassword: string = "";
  passwordType: string = 'password';
  passwordShow: boolean = true;
  activarUserInformation: boolean = false;
  orderValor: boolean = true;
  activeValor: boolean = true;
  destinos: Destino[] = [];
  contieneMayuscula: string = 'Must include at least 1 capital letter';
  contieneNumero: string = 'Must include at least 1 number';
  contieneLongitud: string = 'Must be between 6-8 characters';
  contieneEspacio: string = 'Cannot contain spaces';
  errorPassMayuscula = true;
  errorPassNumero = true;
  errorPassLongitud = true;
  errorPassEspacio = false;
  previousUrl: string = null;
  currentUrl: string = null;
  filteredOptionsStates: Observable<string[]>;
  optionsStates: string[] = ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
  camionMarcacionDiasDTO: CamionMarcacionDiasDTO = new CamionMarcacionDiasDTO(null, null, '', 'N', 'N', 'N', 'N', 'N', 'N', 'N', '', []);
  constructor(public appService: AppService, public formBuilder: FormBuilder, public snackBar: MatSnackBar, public dialog: MatDialog,
    public router: Router, private _location: Location) {

    this.clientInformationForm = this.formBuilder.group({
      'subClientName': ['', Validators.compose([Validators.required])],
      'subClientAdress': ['', Validators.compose([Validators.required])],
      'subClientCity': ['', Validators.compose([Validators.required])],
      'subClientState': ['', Validators.compose([Validators.required])],
      'subClientZipCode': ['', Validators.compose([Validators.required])],
      'subClienContactName': ['', Validators.compose([Validators.required])],
      'subClientPhone': ['', Validators.compose([Validators.required])],
      'subClientCarrier': ['', Validators.compose([Validators.required])],
      'subClientPo': ['', Validators.compose([Validators.required])],
      'subClientAccount': [''],
      //'subClientUserAllName': ['', Validators.compose([Validators.required])],
      //'subClientUserLastName': ['', Validators.compose([Validators.required])],
      'subClientUserName': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      //'subClientUserEmail': ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'subClientUserPassword': [''],
      'subClientUserConfirmPassword': ['', Validators.compose([])],
      'subClientUserMargin': ['', Validators.compose([Validators.required])],
      'subClientUserTruckingCharges': [''],
      'subClientUserOrder': [''],
      'subClientUserActive': ['']
    });

  }

  ngOnInit() {
    this.initPage();
    this.obtenerTodosCamiones();
    if (JSON.parse(localStorage.getItem("_lsIndividualC")) != null) {
      this.appService.dataFormCustomer = EnumMensajes.CUSTOMERINFO;
      this.messageFormClient = this.appService.dataFormCustomer;
      this.appService.createSubClient = false;
      this.appService.updateSubClient = true;
      this.appService.deleteSubClient = true;
    }
    else if (JSON.parse(localStorage.getItem("_lsIndividualC")) == null) {
      this.appService.dataFormCustomer = EnumMensajes.NEWCUSTOMER;
      this.messageFormClient = this.appService.dataFormCustomer
      this.appService.createSubClient = true
      this.appService.updateSubClient = false
      this.appService.deleteSubClient = false
    }
    console.log("router:", this.router);
    this.filteredOptionsStates = this.subClientState.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value))
    );

  }

  private _filterStates(value) {
    const filterValue = value.toLowerCase();
    return this.optionsStates.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  public changeEstado(estado) {
    this.estadoCliente = estado;
  }

  public initPage() {
    this.subClient = JSON.parse(localStorage.getItem("_lsIndividualC"));
    if (this.subClient != null) {
      this.dialingCode = this.subClient
      this.activarUserInformation = true
      //camiones
      if (this.dialingCode[0].marcacion.pk.codigoMarcacion != null || this.dialingCode[0].marcacion.pk.codigoMarcacion != undefined) {

        this.camionMarcacionDiasDTO.codigoMarcacion = this.dialingCode[0].marcacion.pk.codigoMarcacion
        this.appService.getCarrierSubclient(this.dialingCode[0].marcacion.pk.codigoMarcacion).subscribe(data => {
          if (data != null || data != undefined) {
            this.clientInformationForm.get('subClientCarrier').setValue(data[0].nombreSeleccion);
          }
        });

        this.appService.getCarrierSubclienteDias(this.dialingCode[0].marcacion.pk.codigoMarcacion).subscribe(data => {
          if (data != null || data != undefined) {
            this.camionMarcacionDiasDTO = data[0].nombreSeleccion;
          }
        });

        //destinos
        this.getPoSubclient(this.subClient[0].marcacion.pk.codigoMarcacion, 'E')
      }
      this.clientInformationForm.get('subClientName').setValue(this.subClient[0].marcacion.nombreEtiqueta);
      this.clientInformationForm.get('subClientAdress').setValue(this.subClient[0].marcacion.direccionEtiqueta);
      this.clientInformationForm.get('subClientCity').setValue(this.subClient[0].marcacion.ciudad);
      this.clientInformationForm.get('subClientState').setValue(this.subClient[0].marcacion.destino);
      this.clientInformationForm.get('subClientZipCode').setValue(this.subClient[0].marcacion.codigoPostal);
      this.clientInformationForm.get('subClientPhone').setValue(this.subClient[0].marcacion.telefonoEtiqueta);
      //this.clientInformationForm.get('subClientAccount').setValue(this.subClient[0].marcacion.nombre);
      //this.clientInformationForm.get('subClientUserAllName').setValue(this.subClient[0].usuario.codigoSeleccion);
      //this.clientInformationForm.get('subClientUserLastName').setValue(this.subClient[0].usuario.nombre);
      this.clientInformationForm.get('subClientUserName').setValue(this.subClient[0].usuario.codigoUsuario);
      //this.clientInformationForm.get('subClientUserEmail').setValue(this.subClient[0].usuario.email);
      this.clientInformationForm.get('subClientUserMargin').setValue(this.subClient[0].cliente.marginSubcliente);
      if (this.subClient[0].cliente.orderSubcliente === 'S') { this.orderValor = true } else { this.orderValor = false }
      if (this.subClient[0].cliente.activeWebshop === 'S') { this.activeValor = true } else { this.activeValor = false }
      this.clientInformationForm.get('subClientUserOrder').setValue(this.orderValor);
      this.clientInformationForm.get('subClientUserActive').setValue(this.activeValor);
    }
    else {
      this.clientInformationForm.get('subClientName').setValue(null);
      this.clientInformationForm.get('subClientAdress').setValue(null);
      this.clientInformationForm.get('subClientCity').setValue(null);
      this.clientInformationForm.get('subClientState').setValue(null);
      this.clientInformationForm.get('subClientZipCode').setValue(null);
      this.clientInformationForm.get('subClientPhone').setValue(null);
      this.clientInformationForm.get('subClientCarrier').setValue(null);
      this.clientInformationForm.get('subClientPo').setValue("");
      this.clientInformationForm.get('subClientAccount').setValue("");
      var marcacion = JSON.parse(sessionStorage.getItem("Marcacion"));
      this.getPoSubclient(marcacion.pk.codigoMarcacion, 'N');
    }
  }

  get subClientName() { return this.clientInformationForm.get('subClientName') }
  get subClientAdress() { return this.clientInformationForm.get('subClientAdress') }
  get subClientCity() { return this.clientInformationForm.get('subClientCity') }
  get subClientState() { return this.clientInformationForm.get('subClientState') }
  get subClientZipCode() { return this.clientInformationForm.get('subClientZipCode') }
  get subClienContactName() { return this.clientInformationForm.get('subClienContactName') }
  get subClientPhone() { return this.clientInformationForm.get('subClientPhone') }
  get subClientCarrier() { return this.clientInformationForm.get('subClientCarrier') }
  get subClientDestino() { return this.clientInformationForm.get('subClientPo') }
  //get subClientUserAllName() { return this.clientInformationForm.get('subClientUserAllName') }
  //get subClientUserLastName() { return this.clientInformationForm.get('subClientUserLastName') }
  get subClientUserName() { return this.clientInformationForm.get('subClientUserName') }
  //get subClientUserEmail() { return this.clientInformationForm.get('subClientUserEmail') }
  get subClientUserPassword() { return this.clientInformationForm.get('subClientUserPassword') }
  get subClientUserConfirmPassword() { return this.clientInformationForm.get('subClientUserConfirmPassword') }
  get subClientUserMargin() { return this.clientInformationForm.get('subClientUserMargin') }

  public validatePassword(event) {
    if (this.clientInformationForm.value.subClientUserPassword != this.clientInformationForm.value.subClientUserConfirmPassword) {
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
  validateEqual() {
    if (this.clientInformationForm.value.subClientUserPassword != this.clientInformationForm.value.subClientUserConfirmPassword) {
      //this.snackBar.open('Passwords are not equal', '×', { panelClass: 'error', verticalPosition: 'top', duration: 2000 });
      return;
    }
  }

  obtenerTodosCamiones() {
    this.appService.getAllCamiones().subscribe((data: any) => {
      this.camionesAll = data;
    });
  }

  seleccionarCamion(codigoMarcacion) {
    this.appService.getCamionSeleccionado(codigoMarcacion).subscribe((data: any) => {
      this.camiones = data;
      this.camionSeleccionado = this.camiones[0];
      sessionStorage.setItem('Camion', JSON.stringify(this.camionSeleccionado));
    });
  }

  _seleccionarCamionCliente(camion) {
    if (camion.codigoCamion == EnumCodigoCamion.ARM || camion.codigoCamion == EnumCodigoCamion.FDX
      || camion.codigoCamion == EnumCodigoCamion.FBE || camion.codigoCamion == EnumCodigoCamion.PRT) {
      this.numberAccountP = true;
    } else {
      this.numberAccountP = false;
    }
  }

  _verCargosAdiconales() {
    var accion = "";
    if (this.subClient != null) {
      accion = EnumAccion.UPDATE;
    } else {
      accion = EnumAccion.CREATE;
    }
    if (accion == EnumAccion.UPDATE) {
      localStorage.setItem("_lsIndividualC", JSON.stringify(this.subClient))
      const dialogRef = this.dialog.open(RegistrarCargosComponent, {
        data: { value: EnumMensajes.TRUCKING, accion: accion },
        panelClass: 'costo-envio'
      });
    }
    if (accion == EnumAccion.CREATE) {
      const dialogRef = this.dialog.open(RegistrarCargosComponent, {
        data: { value: EnumMensajes.TRUCKING, accion: accion },
        panelClass: 'costo-envio'
      });
    }
  }

  saveChanges(action: string): void {
    if (this.valuePassword == EnumMensajes.EMPTY) {
      this.valuePassword = undefined
    }
    if (action == EnumAccion.C) {
      if (this.clientInformationForm.valid) {
        this.codeClientFather = JSON.parse(localStorage.getItem("Usuario"))
        if (this.clientInformationForm.value.subClientUserPassword != this.clientInformationForm.value.subClientUserConfirmPassword) {
          this.snackBar.open(EnumMensajes.PASSWORDNOTEQUAL, '×', { panelClass: 'error', verticalPosition: 'top', duration: 2000 });
          return;
        }
        if (this.clientInformationForm.value.subClientAccount == null) {
          this.accountNumber = EnumMensajes.EMPTY;
        }
        else {
          this.accountNumber = this.clientInformationForm.value.subClientAccount;
        }

        if (this.clientInformationForm.value.subClientPo == null || this.clientInformationForm.value.subClientPo == '') {
          this.subClientPo = '0000';
        }
        else {
          this.subClientPo = this.clientInformationForm.value.subClientPo;
        }


        let subClientInformation: SubClientInformation = new SubClientInformation(
          this.codeClientFather.codigoPersona,
          this.codeClientFather.codigoUsuario,
          0,
          this.codeClientFather.nombre,
          this.clientInformationForm.value.subClientName,
          this.clientInformationForm.value.subClientAdress,
          this.clientInformationForm.value.subClientCity,
          this.clientInformationForm.value.subClientState,
          this.clientInformationForm.value.subClientZipCode,
          this.clientInformationForm.value.subClientPhone,
          this.clientInformationForm.value.subClientCarrier,
          this.subClientPo,
          this.accountNumber,
          /*this.clientInformationForm.value.subClientUserAllName*/'',
          /*this.clientInformationForm.value.subClientUserLastName*/'',
          //this.clientInformationForm.value.subClientUserName.toUpperCase(),
          ///*this.clientInformationForm.value.subClientUserEmail*/'',
          //this.clientInformationForm.value.subClientUserPassword,
          //this.clientInformationForm.value.subClientUserConfirmPassword,
          this.clientInformationForm.value.subClientUserMargin,
          [this.appService.cargosAdicionalesLocal],
          this.orderValor,
          this.activeValor,
          this.camionMarcacionDiasDTO)
        var datos: Array<SubClientInformation> = [];
        datos = JSON.parse(JSON.stringify([subClientInformation]))
        this.appService.getRegisterSubClient(datos).subscribe(() => {
          const mensaje = EnumMensajes.NEWCUSTOMERADD
          const timeout = 1500
          const dialogRef = this.dialog.open(QuestionComponent, {
            data: { question: mensaje, tipoMensaje: 'C' },
            panelClass: 'question'
          });
          dialogRef.afterOpened().subscribe(res => {
            setTimeout(() => {
              dialogRef.close();
            }, timeout)
          });

          this.clientInformationForm.reset();
          this.router.navigate(['/account/mycustomers']);
        },
          (err: any) => {
            if (err.status === 401) {
              this.snackBar.open(EnumMensajes.USEREXITS, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
            else {
              this.snackBar.open(EnumMensajes.NOCONNECTSERVER, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
          }
        )
      } else {
        this.snackBar.open(EnumMensajes.REQUIREDFIELDS, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
      }
      return;
    }

    if (action == EnumAccion.U && this.valuePassword != undefined) {
      this._updateSubCliente();
      return;
    }

    if (action == EnumAccion.U && this.valuePassword == undefined) {
      this.valuePassword = EnumMensajes.EMPTY;
      this._updateSubCliente();
    }

  }

  _updateSubCliente() {
    const preguntaUpdate = EnumMensajes.QUESTIONUPDATE;
    const dialogRef = this.dialog.open(QuestionComponent, {
      data: { question: preguntaUpdate, tipoMensaje: 'P', mostrarImagen: 'NO' },
      panelClass: 'question'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.codeClientFather = JSON.parse(localStorage.getItem("Usuario"))
        if (this.clientInformationForm.value.subClientAccount == null) {
          this.accountNumber = EnumMensajes.EMPTY;
        }
        else {
          this.accountNumber = this.clientInformationForm.value.subClientAccount;
        }
        if (this.clientInformationForm.value.subClientPo == null || this.clientInformationForm.value.subClientPo == '') {
          this.subClientPo = '0000';
        }
        else {
          this.subClientPo = this.clientInformationForm.value.subClientPo;
        }

        if (this.appService.cargosAdicionalesLocal == null) {
          this.appService.cargosAdicionalesLocal = new CargosAdicionales(
            0, 0, 0
          )
        }

        var subClientInformation: SubClientInformation = new SubClientInformation(
          this.codeClientFather.codigoPersona,
          this.subClient[0].usuario.codigoUsuario,
          this.subClient[0].cliente.codigoPersona,
          this.codeClientFather.nombre,
          this.clientInformationForm.value.subClientName,
          this.clientInformationForm.value.subClientAdress,
          this.clientInformationForm.value.subClientCity,
          this.clientInformationForm.value.subClientState,
          this.clientInformationForm.value.subClientZipCode,
          this.clientInformationForm.value.subClientPhone,
          this.clientInformationForm.value.subClientCarrier,
          this.subClientPo,
          this.accountNumber,
          /*this.clientInformationForm.value.subClientUserAllName*/'',
          /*this.clientInformationForm.value.subClientUserLastName*/'',
          //this.clientInformationForm.value.subClientUserName.toUpperCase(),
          ///*this.clientInformationForm.value.subClientUserEmail*/'',
          //this.valuePassword,
          //this.valuePassword,
          this.clientInformationForm.value.subClientUserMargin,
          [this.appService.cargosAdicionalesLocal],
          this.orderValor,
          this.activeValor,
          this.camionMarcacionDiasDTO
        )
        var datos: Array<SubClientInformation> = [];
        datos = JSON.parse(JSON.stringify([subClientInformation]))
        this.appService.getUpdateSubclient(datos).subscribe(() => {
          this.clientInformationForm.reset();
          const mensaje = EnumMensajes.UPDATESUCCESS;
          const timeout = 1500;
          const dialogRef = this.dialog.open(QuestionComponent, {
            data: { question: mensaje, tipoMensaje: 'C' },
            panelClass: 'question'
          });
          dialogRef.afterOpened().subscribe(res => {
            setTimeout(() => {
              dialogRef.close();
            }, timeout)
          });
          this.router.navigate(['/account/mycustomers'])
        },
          (err: any) => {
            if (err.status === 401) {
              this.snackBar.open(EnumMensajes.ERRORSERVER, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
            else {
              this.snackBar.open(EnumMensajes.ERRORSERVER, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
          }
        )
      }
    });
  }

  deleteSubclient() {
    const preguntaDelete = EnumMensajes.QUESTIONDELETE;
    const dialogRef = this.dialog.open(QuestionComponent, {
      data: { question: preguntaDelete, tipoMensaje: 'P', mostrarImagen: 'SI' },
      panelClass: 'question'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.codeClientFather = JSON.parse(localStorage.getItem("Usuario"));
        var subClientInformation: SubClientInformation = new SubClientInformation(
          this.codeClientFather.codigoPersona,
          this.codeClientFather.codigoUsuario,
          this.subClient[0].cliente.codigoPersona,
          this.codeClientFather.nombre,
          this.clientInformationForm.value.subClientName,
          this.clientInformationForm.value.subClientAdress,
          this.clientInformationForm.value.subClientCity,
          this.clientInformationForm.value.subClientState,
          this.clientInformationForm.value.subClientZipCode,
          this.clientInformationForm.value.subClientPhone,
          this.clientInformationForm.value.subClientCarrier,
          this.subClientPo,
          this.accountNumber,
          /*this.clientInformationForm.value.subClientUserAllName*/'',
          /*this.clientInformationForm.value.subClientUserLastName*/'',
          //this.clientInformationForm.value.subClientUserName.toUpperCase(),
          ///*this.clientInformationForm.value.subClientUserEmail*/'',
          //this.clientInformationForm.value.subClientUserPassword,
          //this.clientInformationForm.value.subClientUserConfirmPassword,
          this.clientInformationForm.value.subClientUserMargin,
          [],
          this.orderValor,
          this.activeValor,
          null
        );

        var datos: Array<SubClientInformation> = [];
        datos = JSON.parse(JSON.stringify([subClientInformation]))
        this.appService.getDeleteSubclient(datos).subscribe(() => {
          const mensaje = EnumMensajes.DELETESUCCESS;
          const timeout = 1500;
          const dialogRef = this.dialog.open(QuestionComponent, {
            data: { question: mensaje, tipoMensaje: 'C' },
            panelClass: 'question'
          });
          dialogRef.afterOpened().subscribe(res => {
            setTimeout(() => {
              dialogRef.close();
            }, timeout)
          });
          this.clientInformationForm.reset();
          this.router.navigate(['/account/mycustomers'])
        },
          (err: any) => {
            if (err.status === 401) {
              this.snackBar.open(EnumMensajes.ERRORSERVER, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
            else {
              this.snackBar.open(EnumMensajes.ERRORSERVER, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
          }
        )
      }
    });
  }

  getPoSubclient(codigoMarcacion: string, tipoBusqueda: string) {
    this.appService.getPoSubclient(codigoMarcacion).subscribe(data => {
      if (tipoBusqueda == "N") {
        this.destinos = data;
      } else {
        if (data != null || data != undefined) {
          this.clientInformationForm.get('subClientPo').setValue(data[0].nombre);
          for (let code of data) {
            this.clientInformationForm.get('subClientPo').setValue(code.nombre);
          }
        }
        this.destinos = data;
      }
    });
  }

  togglePassword() {
    if (this.passwordShow) {
      this.passwordShow = false;
      this.passwordType = 'string';
    }
    else {
      this.passwordShow = true;
      this.passwordType = 'password';
    }
  }

  _activarUserInformation(event) {
    if (this.activarUserInformation == true) {
      this.activarUserInformation = false;
    } else if (this.activarUserInformation == false) {
      this.activarUserInformation = true;
    }
  }

  _orderValor() {
    if (this.orderValor == true) {
      this.orderValor = false;
    } else if (this.orderValor == false) {
      this.orderValor = true;
    }
  }

  _activeValor() {
    if (this.activeValor == true) {
      this.activeValor = false;
    } else if (this.activeValor == false) {
      this.activeValor = true;
    }
  }

  _nuevoDestino(marcacion) {
    const dialogRef = this.dialog.open(NewPoComponent, {
      data: { marcacion: marcacion[0].marcacion.pk.codigoMarcacion, tipo: 'NEW', tipoBoton: 'B2' },
      panelClass: 'nuevo-destino'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.destinos = [];
        this.getPoSubclient(this.subClient[0].marcacion.pk.codigoMarcacion, 'E');
      }
    });
  }

  routeCostumer() {
    this._location.back();

  }


  onKeyPo(event: any) {
    this.clientInformationForm.get('subClientUserName').setValue(event.target.value);
  }

  changeValueDay(day: string) {

    switch (day) {
      case 'lunes':
        this.camionMarcacionDiasDTO.lunes = this.changeValueDayCheck(this.camionMarcacionDiasDTO.lunes)
        break;
      case 'martes':
        this.camionMarcacionDiasDTO.martes = this.changeValueDayCheck(this.camionMarcacionDiasDTO.martes)
        break;
      case 'miercoles':
        this.camionMarcacionDiasDTO.miercoles = this.changeValueDayCheck(this.camionMarcacionDiasDTO.miercoles)
        break;
      case 'jueves':
        this.camionMarcacionDiasDTO.jueves = this.changeValueDayCheck(this.camionMarcacionDiasDTO.jueves)
        break;
      case 'viernes':
        this.camionMarcacionDiasDTO.viernes = this.changeValueDayCheck(this.camionMarcacionDiasDTO.viernes)
        break;
      case 'sabado':
        this.camionMarcacionDiasDTO.sabado = this.changeValueDayCheck(this.camionMarcacionDiasDTO.sabado)
        break;
      case 'domingo':
        this.camionMarcacionDiasDTO.domingo = this.changeValueDayCheck(this.camionMarcacionDiasDTO.domingo)
        break;
      default:
        console.log('Contenido por defecto en dias favor revisar parametros');
        break;
    }

  }

  changeValueDayCheck(value: string): string {
    return value === 'N' ? 'S' : 'N'
  }

}
