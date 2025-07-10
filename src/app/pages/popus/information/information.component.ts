import { Observable, of } from 'rxjs';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteTrigger, MatDatepicker, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { VERSION } from '@angular/material';
import { DatePipe, WeekDay, Location } from '@angular/common';
import { Camion, Destino, Marcacion } from 'src/app/app.modelsWebShop';
import { NewPoComponent } from 'src/app/shared/products-carousel/new-po/new-po.component';
import { EnumSiNo } from 'src/app/enumeration/enumeration';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, startWith } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/service/shared.service';
import { AppWebshopService } from 'src/app/app-webshop.service';


interface Data {
  marcacion: string,
  camion: string,
  destino: string,
  destinoGuardado: any,
  seleccionoFecha: any
}

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  version = VERSION;
  dateNowInit: string;
  dateChange: any;
  date: any;
  datePipe;
  dateFormat;
  mostrarFecha: string;
  marcacionSleccionada: Marcacion;
  dataInfo: Data[] = [];
  valueMarcacion = '';
  valueCamion = '';
  valueDestino = '';
  subclientes: Marcacion[] = [];
  carrier: Camion[] = [];
  po: Destino[] = [];
  marcacionFinal: Marcacion[] = [];
  mostrarSubCliente = [];
  carrierFinal: Camion[] = [];
  mostrarCarrier = [];
  destinoFinal: Destino[] = [];
  mostrarDestino = [];
  diaFecha: string = '';
  dias = [];
  diaSemana = '';
  zonaHorariaEcuador;
  horarioDeEcuador = new Date();
  bloquearHub: boolean = false;
  bloquearStading: boolean = false;
  keyMarcacion = "nombreEtiqueta";
  keyCarrier = "nombre";
  keyDestino = "nombre";
  shiptoControl = new FormControl();
  currentpage: any;
  filteredOptions: Observable<Marcacion[]>;
  icon = 'keyboard_arrow_down';
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger }) inputAutoComplete: MatAutocompleteTrigger;
  isTropical = false;
  seleccionoFecha: boolean = false;
  seleccionoCamion: boolean = false;
  seleccionoPo: boolean = false;
  canOrder: boolean = false;

  loadingPo: boolean = true;

  nameInfo: string = '';
  addressInfo: string = '';
  addressInfo2: string = '';
  cityInfo: string = '';
  stateInfo: string = '';
  zipInfo: string = '';
  phoneInfo: string = '';
  errorInfoTropical = false;

  dateFilter;
  dateFilterNotTropical;
  diasDeshabilitados: number[] = [];
  fechaMaximaCalendario: Date = new Date();

  optionsStates: string[] = ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
  filteredOptionsStates: Observable<string[]>;
  stateInfoControl = new FormControl();
  WeekDay = [];
  poCreado;
  loadingFecha: boolean = false;
  constructor(private builder: FormBuilder, public appService: AppService, public dialog: MatDialog, public router: Router,
    public dialogRef: MatDialogRef<InformationComponent>, @Inject(MAT_DIALOG_DATA)
    public data: any, private spinner: NgxSpinnerService, private location: Location, private sharedService: SharedService,
    public appWebService: AppWebshopService) {
  }

  ngOnInit() {
    this.getseleccionPo();
    if (this.data.tipo == 'T') {
      this.isTropical = true;
    }
    for (const [propertyKey, propertyValue] of Object.entries(WeekDay)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }
      this.WeekDay.push({ id: propertyValue, name: propertyKey });
    }
    setTimeout(() => {

      this.appService.getFechaListaPreciosActiva().subscribe(res => {
        this.datePipe = new DatePipe('en-US');
        this.fechaMaximaCalendario = this.datePipe.transform(res, 'yyyy-MM-dd');
      });

      this.currentpage = this.router.url.replace('/', '');
      this.currentpage == 'home' || this.currentpage == 'checkout' ? this.currentpage = 'HUB' : this.currentpage = 'STD';

      if (this.data.data == EnumSiNo.N) {
        this.getSubclientes();
        this.getCamiones();
        this.obtenerMarcacion();
        this._getDiaEntrega(EnumSiNo.N)
      }
      if (this.data.data == EnumSiNo.S) {
        this.getSubclientes();
        this.obtenerMarcacionStading();
        this._getDiaEntrega(EnumSiNo.S)
      }

      if (this.isTropical) {
        this.data.marcacion = this._getMarcacionTropical(this.data.marcacion);
      }

      this._setInformacionMarcacion(this.data.marcacion, this.data.pagina)  
      this._setDestinoSeleccionado(this.poCreado != null ? this.poCreado : this.data.destino )
     
      var contadorHub = 0;
      var contadorStading = 0;
      var contadorTHub = 0;
      var contadorTStanding = 0;
      this.appService.Data.cartListCaja.forEach(data => {
        if (data.stadingOrder == false) {
          contadorHub++;
          this.appService.tropfilter.includes(data.variedades[0].producto) ? contadorTHub++ : '';
        }
        if (data.stadingOrder) {
          contadorStading++;
          this.appService.tropfilter.includes(data.variedades[0].producto) ? contadorTStanding++ : '';
        }

      });
      if (contadorHub > 0) {
        this.bloquearHub = true;
      }
      if (contadorStading > 0) {
        this.bloquearStading = true;
      }
      
      if (this.isTropical) {
        this.bloquearHub = false;
        this.bloquearStading = false;
        if (this.currentpage == 'HUB' && contadorTHub > 0) { this.bloquearHub = true; }
        if (this.currentpage == 'STD' && contadorTStanding > 0) { this.bloquearStading = true; }
      }

      this.shiptoControl.setValue(this.mostrarSubCliente[0]);

      this.filteredOptions = this.shiptoControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      if (this.data.tipo == 'T') {
        this.isTropical = true;
      } else { this.isTropical == false; }
    }, 20)

    this.filteredOptionsStates = this.stateInfoControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value))
    );    
  }

  private _filter(value) {
    const filterValue = value.toLowerCase();
    return this.marcacionFinal.filter(option => option.nombreEtiqueta.toLowerCase().includes(filterValue));
  }

  private _filterStates(value) {
    const filterValue = value.toLowerCase();
    return this.optionsStates.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  _getDiaEntrega(esStadingOrder: string) {
    var dia = this._getDiaSemana();
    var hora = this._getHoraDia();
    var minutos = this._getMinutos();
    switch (dia) {
      case 'Monday': {
        if (hora < 10 && minutos <= 59) {
          this._getFechaFlorex(esStadingOrder);
        }

        if (hora >= 10 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Monday', esStadingOrder);
        }
        break;
      }
      case 'Tuesday': {
        if (hora < 10 && minutos <= 59) {
          this._getFechaFlorex(esStadingOrder);
        }
        if (hora >= 10 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Tuesday', esStadingOrder);
        }
        break;
      }
      case 'Wednesday': {
        if (hora < 10 && minutos <= 59) {
          this._getFechaFlorex(esStadingOrder);
        }
        if (hora >= 10 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Wednesday', esStadingOrder);
        }
        break;
      }
      case 'Thursday': {
        if (hora < 10 && minutos <= 59) {
          this._getFechaFlorex(esStadingOrder);
        }
        if (hora >= 10 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Thursday', esStadingOrder);
        }
        break;
      }
      case 'Friday': {
        if (hora < 10 && minutos <= 59) {
          this._getFechaFlorex(esStadingOrder);
        }
        if (hora >= 10 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Friday', esStadingOrder);
        }
        break;
      }
      case 'Saturday': {
        if (!this.isTropical) { this._getFechaFlorex(esStadingOrder); }
        //if (this.data.tipo == 'T') {
        if (this.isTropical == true) {
          if (hora < 10 && minutos <= 59) {
            this._getFechaFlorex(esStadingOrder);
          }
          if (hora >= 10 && minutos >= 0) {
            this._calcularDiasEntregaPedido('Saturday', esStadingOrder);
          }
        }
        break;
      }
      case 'Sunday': {
        if (!this.isTropical) { this._getFechaFlorex(esStadingOrder); }
        if (this.data.tipo == 'T') {
          if (hora < 10 && minutos <= 59) {
            this._getFechaFlorex(esStadingOrder);
          }
          if (hora >= 10 && minutos >= 0) {
            this._calcularDiasEntregaPedido('Sunday', esStadingOrder);
          }
        }
        break;
      }
    }
  }

  _getFechaFlorex(stadingOrder: string) {
    var fechaInicia = new Date();
    var fechaMostrar = new Date();
    var datePipe = new DatePipe("en-US");
    var tipoFecha: string = "";
    if (stadingOrder === "N") {
      !this.isTropical ? tipoFecha = "_ls_dateConecction" : tipoFecha = "_ls_dateConecctionT";
    } else {
      !this.isTropical ? tipoFecha = "_ls_dateConecctionStading" : tipoFecha = "_ls_dateConecctionStadingT";
    }
    if (localStorage.getItem(tipoFecha) != null || localStorage.getItem(tipoFecha) != undefined) {
      this.date = new FormControl(new Date(localStorage.getItem(tipoFecha)));
      if (!this.isTropical) {
        if (this.diaSemana === 'Monday' ||
          this.diaSemana === 'Tuesday' ||
          this.diaSemana === 'Wednesday' ||
          this.diaSemana === 'Thursday' ||
          this.diaSemana === 'Friday') {
          fechaInicia.setDate(fechaInicia.getDate() + 3);
        }
        if (this.diaSemana === 'Saturday') {
          fechaInicia.setDate(fechaInicia.getDate() + 5);
        }
        if (this.diaSemana === 'Sunday') {
          fechaInicia.setDate(fechaInicia.getDate() + 4);
        }
      }
      if (this.data.tipo == 'T') {
        if (this.diaSemana === 'Monday') {
          fechaInicia.setDate(fechaInicia.getDate() + 0);
        }
        if (this.diaSemana === 'Tuesday' ||
          this.diaSemana === 'Wednesday') {
          fechaInicia.setDate(fechaInicia.getDate() + 0);
        }
        if (this.diaSemana === 'Thursday' ||
          this.diaSemana === 'Friday' ||
          this.diaSemana === 'Saturday' ||
          this.diaSemana === 'Sunday') {
          //fechaInicia = this._ajustTropicalDate(fechaInicia);
          fechaInicia.setDate(fechaInicia.getDate() + 0);
        }
      }
      fechaInicia.setDate(fechaInicia.getDate() + 1);
      this.dateChange = new FormControl(new Date(fechaInicia));
      this.dateNowInit = datePipe.transform(this.dateChange.value, 'yyyy-MM-dd');
      this.mostrarFecha = datePipe.transform(this.date.value, 'MMM-dd-yyyy');
      return;
    }else{
      this.date = new FormControl(new Date(localStorage.getItem(tipoFecha)));
      if (!this.isTropical) {
        if (this.diaSemana === 'Monday' ||
          this.diaSemana === 'Tuesday' ||
          this.diaSemana === 'Wednesday' ||
          this.diaSemana === 'Thursday' ||
          this.diaSemana === 'Friday') {
          fechaInicia.setDate(fechaInicia.getDate() + 3);
          fechaMostrar.setDate(fechaMostrar.getDate() + 3);//-1
        }
        if (this.diaSemana === 'Saturday') {
          fechaInicia.setDate(fechaInicia.getDate() + 5);
          fechaMostrar.setDate(fechaMostrar.getDate() + 5);
        }
        if (this.diaSemana === 'Sunday') {
          fechaInicia.setDate(fechaInicia.getDate() + 4);
          fechaMostrar.setDate(fechaMostrar.getDate() + 4);
        }
      }
      if (this.data.tipo == 'T') {
        if (this.diaSemana === 'Monday' || this.diaSemana === 'Tuesday') {
          fechaInicia.setDate(fechaInicia.getDate() + 7);
          fechaMostrar.setDate(fechaMostrar.getDate() + 7);
          this.diasDeshabilitados.push(6);
          this.diasDeshabilitados.push(0);
        }
        if (this.diaSemana === 'Wednesday' || this.diaSemana === 'Thursday' || 
          this.diaSemana === 'Friday' || this.diaSemana === 'Saturday') {
          fechaInicia.setDate(fechaInicia.getDate() + 6);
          fechaMostrar.setDate(fechaMostrar.getDate() + 6);
          this.diasDeshabilitados.push(6);
          this.diasDeshabilitados.push(0);
        }
        if (this.diaSemana === 'Sunday') {
          //fechaInicia = this._ajustTropicalDate(fechaInicia);
          fechaInicia.setDate(fechaInicia.getDate() + 5);
          ///fechaMostrar = this._ajustTropicalDate(fechaMostrar);
          fechaMostrar.setDate(fechaMostrar.getDate() + 5);
          this.diasDeshabilitados.push(6);
          this.diasDeshabilitados.push(0);
        }
  
      }
      fechaInicia.setDate(fechaInicia.getDate() + 1);
      this.dateChange = new FormControl(new Date(fechaInicia));
      this.dateNowInit = datePipe.transform(this.dateChange.value, 'yyyy-MM-dd');
      this.mostrarFecha = datePipe.transform(this.date.value, 'MMM-dd-yyyy');
      //return;
    }
    fechaMostrar.setDate(fechaMostrar.getDate() + 1);
    this.dateChange = new FormControl(new Date(fechaMostrar));
    this.dateNowInit = datePipe.transform(this.dateChange.value, 'yyyy-MM-dd');
    this.date = new FormControl(new Date(fechaInicia));
    this.mostrarFecha = datePipe.transform(this.date.value, 'MMM-dd-yyyy');
    localStorage.setItem(tipoFecha, this.date.value);
  }

  _calcularDiasEntregaPedido(dia: string, stadingOrder: string) {
    this.diasDeshabilitados = [];
    var fechaInicia = new Date();
    var fechaMostrar = new Date();
    var datePipe = new DatePipe("en-US");
    var tipoFecha: string = "";
    if (stadingOrder === "N") {
      !this.isTropical ? tipoFecha = "_ls_dateConecction" : tipoFecha = "_ls_dateConecctionT";
    } else {
      !this.isTropical ? tipoFecha = "_ls_dateConecctionStading" : tipoFecha = "_ls_dateConecctionStadingT";
    }
    if (localStorage.getItem(tipoFecha) != null || localStorage.getItem(tipoFecha) != undefined) {
      this.date = new FormControl(new Date(localStorage.getItem(tipoFecha)));
      if (!this.isTropical) {
        if (dia === 'Monday' || dia === 'Tuesday' || dia === 'Wednesday' || dia === 'Thursday') {
          fechaInicia.setDate(fechaInicia.getDate() + 4);
        }
        if (dia === 'Friday') {
          fechaInicia.setDate(fechaInicia.getDate() + 6);
        }
      }
      if (this.data.tipo == 'T') {
        if (dia === 'Monday' || dia === 'Tuesday') {
          fechaInicia.setDate(fechaInicia.getDate() + 0);
          fechaInicia.setDate(fechaInicia.getDate() + 7);
          this.diasDeshabilitados.push(6);
          this.diasDeshabilitados.push(0);
        }
        if (dia === 'Wednesday' || dia === 'Thursday' || dia === 'Friday' || dia === 'Saturday') {
          fechaInicia.setDate(fechaInicia.getDate() + 0);
          //fechaInicia = this._ajustTropicalDate(fechaInicia);
          fechaInicia.setDate(fechaInicia.getDate() + 6);
          this.diasDeshabilitados.push(6);
          this.diasDeshabilitados.push(0);
        }
        if (dia === 'Sunday') {
          fechaInicia.setDate(fechaInicia.getDate() + 0);
          //fechaInicia = this._ajustTropicalDate(fechaInicia);
          fechaInicia.setDate(fechaInicia.getDate() + 5);
          this.diasDeshabilitados.push(6);
          this.diasDeshabilitados.push(0);
        }
      }
      fechaInicia.setDate(fechaInicia.getDate() + 1);
      this.dateChange = new FormControl(new Date(fechaInicia));
      this.dateNowInit = datePipe.transform(this.dateChange.value, 'yyyy-MM-dd');
      this.diaFecha = this.dias[this.date.value.getDay()];
      this.mostrarFecha = datePipe.transform(this.date.value, 'MMM-dd-yyyy');
      return;
    }else{
      this.date = new FormControl(new Date(localStorage.getItem(tipoFecha)));
      if (!this.isTropical) {
        if (dia === 'Monday' || dia === 'Tuesday' || dia === 'Wednesday' || dia === 'Thursday') {
          fechaInicia.setDate(fechaInicia.getDate() + 4);
          fechaMostrar.setDate(fechaMostrar.getDate() + 4);
        }
        if (dia === 'Friday') {
          fechaInicia.setDate(fechaInicia.getDate() + 6);
          fechaMostrar.setDate(fechaMostrar.getDate() + 6);
        }
      }
      if (this.data.tipo == 'T') {
        if (dia === 'Monday' || dia === 'Tuesday') {
          fechaInicia.setDate(fechaInicia.getDate() + 0);
          fechaInicia.setDate(fechaInicia.getDate() + 7);
          this.diasDeshabilitados.push(6);
          this.diasDeshabilitados.push(0);
        }
        if (dia === 'Wednesday' || dia === 'Thursday' || dia === 'Friday' || dia === 'Saturday') {
          fechaInicia.setDate(fechaInicia.getDate() + 0);
          //fechaInicia = this._ajustTropicalDate(fechaInicia);
          fechaInicia.setDate(fechaInicia.getDate() + 6);
          this.diasDeshabilitados.push(6);
          this.diasDeshabilitados.push(0);
        }
        if (dia === 'Sunday') {
          fechaInicia.setDate(fechaInicia.getDate() + 0);
          //fechaInicia = this._ajustTropicalDate(fechaInicia);
          fechaInicia.setDate(fechaInicia.getDate() + 5);
          this.diasDeshabilitados.push(6);
          this.diasDeshabilitados.push(0);
        }
      }
      fechaInicia.setDate(fechaInicia.getDate() + 1);
      this.dateChange = new FormControl(new Date(fechaInicia));
      this.dateNowInit = datePipe.transform(this.dateChange.value, 'yyyy-MM-dd');
      this.diaFecha = this.dias[this.date.value.getDay()];
      this.mostrarFecha = datePipe.transform(this.date.value, 'MMM-dd-yyyy');
      console.log(this.diasDeshabilitados);
      return;
    }
    // fechaMostrar.setDate(fechaMostrar.getDate() + 1);
    // this.dateChange = new FormControl(new Date(fechaMostrar));
    // this.dateNowInit = datePipe.transform(this.dateChange.value, 'yyyy-MM-dd');
    // this.date = new FormControl(new Date(fechaInicia));
    // this.diaFecha = this.dias[this.date.value.getDay()];
    // this.mostrarFecha = datePipe.transform(this.date.value, 'MMM-dd-yyyy');
    // localStorage.setItem(tipoFecha, this.date.value);
  }

  _ajustTropicalDate(fechaInicia) {
    let dia = fechaInicia.getDay();
    if (dia == 5) { fechaInicia.setDate(fechaInicia.getDate() - 1) }
    if (dia == 6) { fechaInicia.setDate(fechaInicia.getDate() - 2) }
    if (dia == 0) { fechaInicia.setDate(fechaInicia.getDate() - 3) }
    return fechaInicia;
  }

  _getDiaSemana(): string {
    this.dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.zonaHorariaEcuador = new Date().toLocaleString('en-US', { timeZone: 'America/Guayaquil' });
    this.horarioDeEcuador = new Date(this.zonaHorariaEcuador);
    this.horarioDeEcuador.setHours(this.horarioDeEcuador.getHours());
    this.horarioDeEcuador.setMinutes(this.horarioDeEcuador.getMinutes());
    this.diaSemana = this.dias[this.horarioDeEcuador.getDay()];
    return this.diaSemana;
  }

  _getHoraDia(): number {
    return this.horarioDeEcuador.getHours();
  }

  _getMinutos(): number {
    return this.horarioDeEcuador.getMinutes();
  }

  public getSubclientes() {
    const cli = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
      this.subclientes = data;

      if (this.subclientes.length > 0) {
        this.mostrarSubCliente.push(this.subclientes[0].nombreEtiqueta);
        this.marcacionFinal.push(...this.subclientes);
      }
    });
  }

  public getseleccionPo() {
    const cli = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
      this.subclientes = data;
      if (this.subclientes.length > 0) {
        this.seleccionoPo = true;
      } else {
        this.seleccionoPo = false;
      }
    });
  }


  getCamiones() {
    var data = JSON.parse(localStorage.getItem("Usuario"))
    var codigoClientePadre = data.codigoClientePadre;

    var marcacionStorage = JSON.parse(sessionStorage.getItem('Marcacion'))
    var codigoMarcacionStorage = marcacionStorage.codigoSeleccion

    if (!codigoClientePadre && marcacionStorage.esPrincipal == 'S') {
      this.getAllCarriers()

      this.habilitarDiasSegunCamionAll();

      this.dateFilterNotTropical = (date: Date) => {
        const day = date.getDay();
        return !this.diasDeshabilitados.includes(day);
      };
      return
    }

    if (codigoClientePadre || (!codigoClientePadre && marcacionStorage.esPrincipal == 'N')) {
      if (this.isTropical) {
        this.getAllCarriers()
              this.dateFilterNotTropical = (date: Date) => {
        const day = date.getDay();
        this.diasDeshabilitados.push(0);
        this.diasDeshabilitados.push(6);
        return !this.diasDeshabilitados.includes(day);
      };
      }else {
        this._obtenerCamionPorMarcacion(codigoMarcacionStorage)
      }
    }
  }


  seleccionarCarrier(event: any) {
    const valorSeleccionado = event.target.value;
    var carrierSelections = this.carrier.find(item => item.nombre === valorSeleccionado);
    sessionStorage.setItem('Camion', JSON.stringify(carrierSelections));
    this.habilitarDiasSegunCamion(carrierSelections);
    this.seleccionoCamion = true;
  }

  getAllCarriers() {
    sessionStorage.removeItem('Camion')
    var camionStorage = JSON.parse(sessionStorage.getItem('Camion'))
    this.appService.getAllCamiones().subscribe((data: any) => {

      this.carrier = data;
      this.seleccionoCamion = true;

      if (camionStorage != null) {

        var indexcamion = this.carrier.findIndex(item => item.nombre === camionStorage.nombre)

        if (indexcamion !== -1) {
          // Encuentra el índice del elemento que deseas mover

          const camion = this.carrier.splice(indexcamion, 1); // Elimina el elemento del array
          this.carrier.unshift(camion[0]); // Agrega el elemento al principio del array
        }

      }

      if (!this.isTropical) {
        sessionStorage.setItem('Camion', JSON.stringify(this.carrier[0]));
        this.mostrarCarrier = [];
        this.carrier.forEach(carrier => {
          if (this.carrier.length === 1) {
            this.seleccionoCamion = true;
          }
          this.mostrarCarrier.push(carrier.nombre);
        })
        // Establecer el primer elemento como seleccionado directamente en el DOM
        setTimeout(() => {
          const selectElement = document.querySelector('.form-select') as HTMLSelectElement;
          if (selectElement) {
            selectElement.selectedIndex = 0;
          }
        }, 0);

      }
      else {
        this.mostrarCarrier.push('DOOR TO DOOR (FEDEX)');
        this.carrier = this.carrier.filter(item => item.codigoCamion === 'FDX');
        sessionStorage.setItem('Camion', JSON.stringify(this.carrier[0]));
      }
      this.carrierFinal.push(...this.carrier);
    });
  }

  _obtenerCamionPorMarcacion(codigoMarcacion) {
    var camionStorage = JSON.parse(sessionStorage.getItem('Camion'))
    this.seleccionoCamion = true;
    this.appService.getCamionSeleccionado(codigoMarcacion).subscribe((data: any) => {
      this.mostrarCarrier = [];
      this.carrier = data;

      if (camionStorage != null) {

        var indexcamion = this.carrier.findIndex(item => item.nombre === camionStorage.nombre)

        if (indexcamion !== -1) {
          // Encuentra el índice del elemento que deseas mover

          const camion = this.carrier.splice(indexcamion, 1); // Elimina el elemento del array
          this.carrier.unshift(camion[0]); // Agrega el elemento al principio del array
        }

      }

      if (!this.isTropical) {
        if (this.carrier.length === 1) {
          this.seleccionoCamion = true;
        }

        this.carrier.forEach(element => {
          this.mostrarCarrier.push(element.nombre);
        });

        //this.mostrarCarrier.push(this.carrier[0].nombre);dsfdf

        this.habilitarDiasSegunCamion(this.carrier[0]);

        this.dateFilterNotTropical = (date: Date) => {
          const day = date.getDay();
          return !this.diasDeshabilitados.includes(day);
        };

      }
      else {
         this.mostrarCarrier.push('DOOR TO DOOR (FEDEX)'); 
        }
      if (!this.isTropical) { sessionStorage.setItem('Camion', JSON.stringify(this.carrier[0])); }
      this.valueCamion = 'C'
    });
  }

  habilitarDiasSegunCamionAll() {
    this.diasDeshabilitados = [];
    //this.fechaMaximaCalendario = new Date();

  }

  habilitarDiasSegunCamion(camion: Camion) {
    this.diasDeshabilitados = camion.camionMarcacionDiasDTO.diasDeshabilitados;
    //this.fechaMaximaCalendario = new Date();
  }


  public getDestinos(codigoMarcacion) {
    this.appService.getDestinos(codigoMarcacion).subscribe((data: any) => {
      this.po = data
      this.mostrarDestino.push(this.po[0].nombre);
      this.destinoFinal.push(...this.po);
      
      this.nameInfo = this.po[0].nombreCliente;
      this.addressInfo = this.po[0].direccion;
      this.addressInfo2 = this.po[0].direccion2;
      this.cityInfo = this.po[0].ciudad;
      this.stateInfo = this.po[0].estado;
      this.zipInfo = this.po[0].codigoPostal;
      this.phoneInfo = this.po[0].telefono;

    });
  }

  public _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  public _updateDate(event) {
    localStorage.removeItem("_ls_dateConecction");
 //   localStorage.removeItem("_ls_dateConecctionT");
    var datePipe = new DatePipe("en-US");
    this.date = event;
    this.mostrarFecha = datePipe.transform(this.date.value, 'MMM-dd-yyyy');
    this.diaFecha = this.dias[this.date.value.getDay()];
  //  if (!this.isTropical) {
      localStorage.removeItem("_ls_dateConecction");
      localStorage.setItem("_ls_dateConecction", event.value);
   // }
   /// if (!this.isTropical) {
   //   localStorage.removeItem("_ls_dateConecctionT");
  //    localStorage.setItem("_ls_dateConecctionT", event.value);
   // }
    this.seleccionoFecha = true;
    this.sharedService.dateUpdate.emit();
  }

  public _updateDateStading(event) {
    var datePipe = new DatePipe("en-US");
    this.date = event;
    this.mostrarFecha = datePipe.transform(this.date.value, 'MMM-dd-yyyy');
    this.diaFecha = this.dias[this.date.value.getDay()];
    if (!this.isTropical) {
      localStorage.removeItem("_ls_dateConecctionStading");
      localStorage.setItem("_ls_dateConecctionStading", event.value);
    }
    if (this.data.tipo == 'T') {
      localStorage.removeItem("_ls_dateConecctionStadingT");
      localStorage.setItem("_ls_dateConecctionStadingT", event.value);
    }
  }


  public obtenerMarcacion() {
    //C = CLIENTE,  S = SUBCLIENTE, 
    var data = JSON.parse(localStorage.getItem("Usuario"))
    if (data.codigoClientePadre != null || data.codigoClientePadre != undefined) {
      if (sessionStorage.getItem('Marcacion') == 'undefined' || sessionStorage.getItem('Marcacion') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'S').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.marcacionSleccionada = this.subclientes[0];
            sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacionSleccionada));
            this.appService._getCargasTransportePorMarcacion(this.marcacionSleccionada.codigoSeleccion).subscribe(data => {
              localStorage.setItem("ls_cargos", JSON.stringify(data));
            });
            this.getDestinos(this.marcacionSleccionada.codigoSeleccion);
            return;
          }
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem('Marcacion'));
        this.getDestinos(this.marcacionSleccionada.codigoSeleccion);
        if(this.marcacionSleccionada.orderWebShop === 'N'){
          this.canOrder = true;
        }else{
          this.canOrder = false;
        }
      }
    }
    else {
      if (sessionStorage.getItem('Marcacion') == 'undefined' || sessionStorage.getItem('Marcacion') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.marcacionSleccionada = this.subclientes[0];
            sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacionSleccionada));
            this.appService._getCargasTransportePorMarcacion(this.marcacionSleccionada.codigoSeleccion).subscribe(data => {
              localStorage.setItem("ls_cargos", JSON.stringify(data));
            });
            this.getDestinos(this.marcacionSleccionada.codigoSeleccion);
            return;
          }
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem('Marcacion'));
        this.getDestinos(this.marcacionSleccionada.codigoSeleccion);
        if(this.marcacionSleccionada.orderWebShop === 'N'){
          this.canOrder = true;
        }else{
          this.canOrder = false;
        }
      }
    }
  }


  public obtenerMarcacionStading() {
    //se valida si es cliente o subcliente : C = CLIENTE,  S = SUBCLIENTE, 
    var data = JSON.parse(localStorage.getItem("Usuario"))
    if (data.codigoClientePadre != null || data.codigoClientePadre != undefined) {
      if (sessionStorage.getItem('MarcacionStading') == 'undefined' || sessionStorage.getItem('MarcacionStading') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'S').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.marcacionSleccionada = this.subclientes[0];
            sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
            this.getDestinos(this.marcacionSleccionada.codigoSeleccion);
            return;
          }
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem('MarcacionStading'));
        this.getDestinos(this.marcacionSleccionada.codigoSeleccion);
      }
    }
    else {
      if (sessionStorage.getItem('MarcacionStading') == 'undefined' || sessionStorage.getItem('MarcacionStading') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.marcacionSleccionada = this.subclientes[0];
            sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
            this.getDestinos(this.marcacionSleccionada.codigoSeleccion);
            return;
          }
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem('MarcacionStading'));
        this.getDestinos(this.marcacionSleccionada.codigoSeleccion);
      }
    }
  }

  public async _seleccionarMarcacion(argumento: any, tipo: string) {
    
    this.loadingFecha = true;
    this.seleccionoFecha = false;
    this.canOrder = false;
    this.date = undefined

    setTimeout(() => {
    this.loadingFecha = false;
    }, 200)
    
    if (argumento.pk === undefined) { return }
    this.valueMarcacion = 'M'
    await this._obtenerDestinosPorMarcacion(argumento.pk.codigoMarcacion, 'HUB');
    if (!this.isTropical) {
      this.appService.marcacionSeleccionada(argumento);
      sessionStorage.setItem('Marcacion', JSON.stringify(argumento));
      if(argumento.orderWebShop == 'S'){
        this.appService._getCargasTransportePorMarcacion(argumento.codigoSeleccion).subscribe(data => {
          localStorage.setItem("ls_cargos", JSON.stringify(data));
        });
        this.canOrder = false;
      }else{
        this.canOrder = true;}
    } else {
      sessionStorage.setItem('MarcacionT', JSON.stringify(argumento));
      this.data.marcacion = argumento;
    }
      this.seleccionoCamion = true;
      this.seleccionoPo = true;
      await this.getCamiones()
      await this.getseleccionPo();
      this.sharedService.imageUpdated.emit("logo");
  }

  public _seleccionarCarrier(arg: any, tipo: string) {
    if (arg.nombre === undefined) { return }
    this.valueCamion = 'C'
    if (tipo == 'H') {
      sessionStorage.setItem('Camion', JSON.stringify(arg));
    } else {
      sessionStorage.setItem('CamionStading', JSON.stringify(arg));
    }
  }

  public arg: Destino;
  public tipo: any;
  public _seleccionarPo(arg: any, tipo: string) {
    const valorSeleccionado = arg.target.value;
    var poSelections = this.po.find(item => item.nombre === valorSeleccionado);
    sessionStorage.setItem("Destino", JSON.stringify(poSelections));
    this.seleccionoPo = true;
    // this.po = [];
    if (arg.nombre === undefined) { return }
    this.valueDestino = 'D';
    this.arg = arg;
    this.tipo = tipo;
    this._setAditionalInfo(arg);
    this.seleccionoPo = true;
  }

  public _guardarCambios() {
    if (this.seleccionoCamion === true && this.seleccionoFecha === true) {
      this.dataInfo = []
      if (this.arg != null) {
        if (this.tipo == 'H') {
          if (!this.isTropical) { sessionStorage.setItem("Destino", JSON.stringify(this.arg)); }
          if (this.data.tipo == 'T') { sessionStorage.setItem("DestinoT", JSON.stringify(this.arg)); }
        } else {
          if (!this.isTropical) { sessionStorage.setItem("DestinoStading", JSON.stringify(this.arg)); }
          if (this.data.tipo == 'T') { sessionStorage.setItem("DestinoStadingT", JSON.stringify(this.arg)); }
        }
      }

      if (!this.isTropical) {
        this.dataInfo.push({
          marcacion: this.valueMarcacion,
          camion: this.valueCamion,
          destino: this.valueDestino,
          destinoGuardado: JSON.stringify(this.arg),
          seleccionoFecha: this.seleccionoFecha
        })
        this.appWebService.paginador.pagina = 1
        this.appWebService.addPaginadorLocalStorage();
        this.dialogRef.close(this.dataInfo)

        this.sharedService.dataProductUpdate.emit("argumento");
      }
      else {
        this._setTropicalInfo();
        this.appWebService.paginador.pagina = 1
        this.appWebService.addPaginadorLocalStorage();
        this.sharedService.dataProductUpdate.emit("argumento");
        this.dialogRef.close(this.dataInfo)
        if (!this.errorInfoTropical) {
          this.dialogRef.close('save')
        }
      }
    } else { return }
  }

  public _skip() {
    sessionStorage.removeItem('Camion');
    //this._seleccionarMarcacion;
    this.canOrder = false;
    window.location.reload();
    this.dialogRef.close();
  }

  public _nuevoDestino(tipoDestino: string) {
    const dialogRef = this.dialog.open(NewPoComponent, {
      panelClass: 'nuevo-destino',
      data: { tipo: 'NEW', tipoBoton: 'B1', tipoDestino: tipoDestino, destinos: this.po }
    });

    dialogRef.afterClosed().subscribe(async result => {

      if (result != null) {
        this.poCreado = result.nombre
        this.ngOnInit()
        setTimeout(() => {
          this.poCreado = null
        }, 1000)
        
        this.valueDestino = "D"
        this._guardarCambios()
      }
    });
  }

  public close(): void {
    this.dialogRef.close();
  }


  _obtenerDestinosPorMarcacion(codigoMarcacion, tipoPagina: string) {
    this.appService.getDestinos(codigoMarcacion).subscribe((data: any) => {

      this.mostrarDestino = []; //PO Inicial Value
      this.destinoFinal = []; //PO Array
      this.po = data;
      //console.log(data);

      this.po.forEach(item => {
        this.mostrarDestino.push(item.nombre)
      })


      // this.mostrarDestino.push(this.po[0].nombre);

      var destino: Destino[] = [];
      destino = this._getDestinoSession(destino);

      if (destino != null && destino[0] != null) { destino = data.filter(x => x.nombre == destino[0].nombre); }
      if (destino.length > 0) {
        //this.mostrarDestino = [];
        // this.mostrarDestino.push(destino[0].nombre);
        this.seleccionoPo = true;
      } else {
        destino = [];
        destino.push(this.po[0]);
      }
     
      
      this.destinoFinal.push(...this.po);
      if (tipoPagina == 'HUB') {
        if (!this.isTropical) { sessionStorage.setItem('Destino', JSON.stringify(destino[0])); }
        if (this.data.tipo == 'T') { sessionStorage.setItem('DestinoT', JSON.stringify(destino[0])); }
      }
      if (tipoPagina == 'STD') {
        if (!this.isTropical) { sessionStorage.setItem('DestinoStading', JSON.stringify(destino[0])); }
        if (this.data.tipo == 'T') { sessionStorage.setItem('DestinoStadingT', JSON.stringify(destino[0])); }
      }
      if (this.data.tipo == 'T' && destino[0] != null) {
        this._setAditionalInfo(destino[0]);
      }
    });
  }


  _setInformacionMarcacion(marcacion, tipoPagina: string) {
    this._obtenerDestinosPorMarcacion(marcacion.pk === undefined ? marcacion : marcacion.pk.codigoMarcacion, tipoPagina);
    this.mostrarSubCliente.push(marcacion.nombreEtiqueta);
  }

  _setDestinoSeleccionado(destino: string) {
    if (destino == "SN") {
      destino = 'PENDING INSTRUCTION'
    }
    this.mostrarDestino = [];
    if (!this.isTropical) {
      this.mostrarDestino.push(destino);
      if (destino != 'PENDING INSTRUCTION') {
        this.valueDestino = "D"
      }
    }
    else {
      this.mostrarDestino.push('DOOR TO DOOR (FEDEX)');
    }
  }

  _registrarMarcacion() {
    this.appService.btnHub = 0;
    this.appService.btnStading = 0;
    this.appService.btnCustomers = 1;
    localStorage.removeItem("_lsIndividualC");
    localStorage.removeItem("_lsBoxesTrucking");
    this.dialogRef.close();
    this.router.navigate(['/account/customers-formNew']);
    window.location.reload();
  }

  public openPanel(evt): void {
    this.shiptoControl.setValue("");
    evt.stopPropagation();
    this.inputAutoComplete.openPanel();
    
  }

  _getMarcacionTropical(marcacion) {
    var marcacionTropical;
    if (this.currentpage == 'HUB') {
      marcacionTropical = JSON.parse(sessionStorage.getItem("MarcacionT"));
    }
    if (this.currentpage == 'STD') {
      marcacionTropical = JSON.parse(sessionStorage.getItem("MarcacionStadingT"));
    }
    if (marcacionTropical != undefined || marcacionTropical != null) {
      marcacion = marcacionTropical;
    } else {
      this.currentpage == 'HUB' ?
        sessionStorage.setItem('MarcacionT', JSON.stringify(marcacion)) :
        sessionStorage.setItem('MarcacionStadingT', JSON.stringify(marcacion));
    }
    this.getDestinos(marcacion.codigoSeleccion);
    return marcacion;
  }

  _getDestinoSession(destino) {
    var des;
    if (this.currentpage == 'HUB') {
      if (!this.isTropical) { des = JSON.parse(sessionStorage.getItem("Destino")); }
      if (this.data.tipo == 'T') { des = JSON.parse(sessionStorage.getItem("DestinoT")); }
    }
    if (this.currentpage == 'STD') {
      if (!this.isTropical) { des = JSON.parse(sessionStorage.getItem("DestinoStading")); }
      if (this.data.tipo == 'T') { des = JSON.parse(sessionStorage.getItem("DestinoStadingT")); }
    }
    if (this.data.tipo == 'T') {
      if (des == null || des == undefined) {
        if (this.currentpage == 'HUB') { des = JSON.parse(sessionStorage.getItem("Destino")); sessionStorage.setItem('DestinoT', des); }
        if (this.currentpage == 'STD') { des = JSON.parse(sessionStorage.getItem("DestinoStading")); sessionStorage.setItem('DestinoStadingT', des); }
      }
    }
    destino.push(des);
    return destino;
  }
  _setTropicalInfo() {
    if (this.nameInfo == '' ||
      this.addressInfo == '' ||
      this.addressInfo2 == '' ||
      this.cityInfo == '' ||
      this.stateInfo == '' ||
      this.zipInfo == '' ||
      this.phoneInfo == '') { this.errorInfoTropical = true; return; } else { this.errorInfoTropical = false; }
    let str: any;
    str = {
      nombreEtiqueta: this.nameInfo,
      direccionEtiqueta: this.addressInfo,
      direccionEtiqueta2: this.addressInfo2,
      ciudad: this.cityInfo,
      destino: this.stateInfo,
      codigoPostal: this.zipInfo,
      telefonoEtiqueta: this.phoneInfo,
    }

    if (this.currentpage == 'HUB') { sessionStorage.setItem('AditionalInfoT', JSON.stringify(str)); }
    if (this.currentpage == 'STD') { sessionStorage.setItem('AditionalInfoStadingT', JSON.stringify(str)); }

    //Guardar PO
    let marcacionTropical;
    let destinoTropical: any = {};
    if (this.currentpage == 'HUB') {
      marcacionTropical = JSON.parse(sessionStorage.getItem("MarcacionT"));
      destinoTropical = JSON.parse(sessionStorage.getItem("DestinoT"));
    }
    if (this.currentpage == 'STD') {
      marcacionTropical = JSON.parse(sessionStorage.getItem("MarcacionStadingT"));
      destinoTropical = JSON.parse(sessionStorage.getItem("DestinoStadingT"));
    }

    this.appService.persistirDestinoTropical(this.data.destino, marcacionTropical, 
      str.nombreEtiqueta, str.direccionEtiqueta, str.direccionEtiqueta2, str.ciudad, str.destino, str.codigoPostal, str.telefonoEtiqueta).subscribe(
      (data: any) => {
        console.log("PO save:", data);
      });
  }

  _setAditionalInfo(destino) {
    this.nameInfo = destino.nombreCliente;
    this.addressInfo = destino.direccion;
    this.addressInfo2 = destino.direccion2;
    this.cityInfo = destino.ciudad;
    this.stateInfo = destino.estado;
    this.zipInfo = destino.codigoPostal;
    this.phoneInfo = destino.telefono;
    if (destino.nombreCliente == '' || destino.nombreCliente == undefined) {
      this.nameInfo = this.data.marcacion.nombreEtiqueta;
      this.addressInfo = this.data.marcacion.direccionEtiqueta;
      this.addressInfo = this.data.marcacion.direccionEtiqueta2;
      this.cityInfo = this.data.marcacion.ciudad;
      this.stateInfo = this.data.marcacion.destino;
      this.zipInfo = this.data.marcacion.codigoPostal;
      this.phoneInfo = this.data.marcacion.telefonoEtiqueta;
    }
  }

  selectDayWeekStanding(dayweek: any) {
    this.dateFilter = (d: Date): boolean => {
      const day = d.getDay();
      // return every day selected
      return day == dayweek.id;
    }

    var datePipe = new DatePipe("en-US");
    var fecha = new Date(this.date.value);

    var presentDay = this.date.value.getDay();
    var add = dayweek.id - presentDay;

    add >= 0 ? fecha.setDate(fecha.getDate() + add) : fecha.setDate(fecha.getDate() + (add + 7));

    this.date = new FormControl(new Date(fecha));
    this.diaFecha = this.dias[this.date.value.getDay()];
    this.mostrarFecha = datePipe.transform(this.date.value, 'MMM-dd-yyyy');

  }
}
