import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Camion, Destino, Marcacion } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';
import { InformationService } from 'src/app/core/services/information-service';

@Component({
  selector: 'app-information-fedex',
  templateUrl: './information-fedex.component.html',
  styleUrls: ['./information-fedex.component.scss']
})
export class InformationFedexComponent implements OnInit {
  formHasErrors = false;
  diaFecha: string = 'Hoy'; // o el día calculado como texto
  mostrarFecha: string = ''; // Ej: '06/05/2025'
  date: Date = new Date();
  dateNowInit: Date = new Date(localStorage.getItem('_ls_dateConecction'));
  fechaMaximaCalendario: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // por ejemplo
  nameInfo: string = '';
  phoneInfo: string = '';
  addressInfo: string = '';
  addressInfo2: string = '';
  cityInfo: string = '';
  stateInfo: string = '';
  zipInfo: string = '';
  mostrarCarrier = [];
  carrier: Camion[] = [];
  destinos: Destino[] = [];
  marcaciones: Marcacion[] = [];
  destino: Destino;
  marcacion: Marcacion;

  marcacionesFiltradas: any[] = [];
  marcacionControl = new FormControl('');
  aplicaDestinatarioPedidoCompleto: boolean = false;

  optionsStates: string[] = ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
  get filteredOptionsStates(): string[] {
    const filter = this.stateInfo ? this.stateInfo.toLowerCase() || '' : '';
    return this.optionsStates.filter(option =>
      option.toLowerCase().includes(filter)
    );
  }

  constructor(private informationService: InformationService, private appService: AppService,
    public dialogRef: MatDialogRef<InformationFedexComponent>
  ) { }

  async ngOnInit() {
    this.mostrarCarrier.push('DOOR TO DOOR (FEDEX)');
    this.mostrarFecha = this.informationService.dateConnection;
    this.destino = this.informationService.destino;
    this.marcacion = this.informationService.marcacion;

    await this.obtenerMarcacion();

    await this.getDestinos(this.marcacion.codigoSeleccion);
    this.getDataClienteDestino(this.destino);

  }

  getDataClienteDestino(destino) {
    this.nameInfo = this.informationService.nameInfo ? this.informationService.nameInfo : destino.nombreCliente;
    this.phoneInfo = this.informationService.phoneInfo ? this.informationService.phoneInfo : destino.telefono;
    this.addressInfo = this.informationService.addressInfo ? this.informationService.addressInfo : destino.direccion;
    this.addressInfo2 = this.informationService.addressInfo2 ? this.informationService.addressInfo2 : destino.direccion2;
    this.cityInfo = this.informationService.cityInfo ? this.informationService.cityInfo : destino.ciudad;
    this.stateInfo = this.informationService.stateInfo ? this.informationService.stateInfo : destino.estado;
    this.zipInfo = this.informationService.zipInfo ? this.informationService.zipInfo : destino.codigoPostal;
  }

  validateForm(): boolean {
    this.formHasErrors = !this.nameInfo || !this.phoneInfo || !this.addressInfo ||
      !this.cityInfo || !this.stateInfo || !this.zipInfo;
    return !this.formHasErrors;
  }

  _openCalendar(picker: any): void {
    picker.open();
  }

  _updateDate(event: MatDatepickerInputEvent<Date>): void {
    this.date = event.value;
    this.mostrarFecha = this.date ? this.date.toLocaleDateString('en-US') : '';
    this.diaFecha = this._obtenerDia(this.date);
  }

  dateFilterNotTropical = (d: Date | null): boolean => {
    const date = d || new Date();
    return date.getDay() !== 0;
  };

  private _obtenerDia(fecha: Date): string {
    const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dias[fecha.getDay()];
  }

  async getDestinos(codigoMarcacion) {
    this.appService.getDestinos(codigoMarcacion).subscribe((data: any) => {
      this.destinos = data
    });
  }


  _seleccionarDestino(event: Event) {
    const nombreSeleccionado = (event.target as HTMLSelectElement).value;
    this.destino = this.destinos.find(dest => dest.nombre === nombreSeleccionado);
    this.initDatosServices();
    this.getDataClienteDestino(this.destino);

    if (this.destino) {
      sessionStorage.setItem('Destino', JSON.stringify(this.destino));
    }
  }

  obtenerMarcacion() {
    const usuario = JSON.parse(localStorage.getItem('Usuario') || '{}');
    const tipo = usuario.codigoClientePadre ? 'S' : 'C';
    const marcacionGuardada = sessionStorage.getItem('Marcacion');

    this.appService.getMarcacionesPrincipal(usuario.codigoPersona, tipo).subscribe((data: any[]) => {
      this.marcaciones = data;
      if (this.marcaciones.length > 0) {
        this.marcacion = marcacionGuardada
          ? JSON.parse(marcacionGuardada)
          : this.marcaciones[0];

        sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacion));

        this.appService._getCargasTransportePorMarcacion(this.marcacion.codigoSeleccion)
          .subscribe(data => {
            localStorage.setItem('ls_cargos', JSON.stringify(data));
          });
      }
    });
  }

  async seleccionarMarcacion(event: any) {
    const codigoSeleccionado = event.target.value;
    this.marcacion = this.marcaciones.find(m => m.codigoSeleccion === codigoSeleccionado);
    sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacion));

    // Si necesitas volver a cargar cargas y destinos
    this.appService._getCargasTransportePorMarcacion(this.marcacion.codigoSeleccion)
      .subscribe(data => {
        localStorage.setItem('ls_cargos', JSON.stringify(data));
      });

    this.appService.getDestinos(this.marcacion.codigoSeleccion).subscribe((data: any) => {
      this.destinos = data
      this.destino = this.destinos[0];
      sessionStorage.setItem('Destino', JSON.stringify(this.destino));
      this.initDatosServices();
      this.getDataClienteDestino(this.destino);
    });
  }

  _guardarCambios() {
    if (this.validateForm()) {
    this.informationService.aplicaDestinatarioPedidoCompleto = this.aplicaDestinatarioPedidoCompleto;
    this.informationService.nameInfo = this.nameInfo;
    this.informationService.phoneInfo = this.phoneInfo;
    this.informationService.addressInfo = this.addressInfo;
    this.informationService.addressInfo2 = this.addressInfo2;
    this.informationService.cityInfo = this.cityInfo;
    this.informationService.stateInfo = this.stateInfo;
    this.informationService.zipInfo = this.zipInfo;
    this.dialogRef.close();
    } 
  }

  initDatosServices() {
    this.informationService.nameInfo = undefined;
    this.informationService.phoneInfo = undefined;
    this.informationService.addressInfo = undefined;
    this.informationService.addressInfo2 = undefined;
    this.informationService.cityInfo = undefined;
    this.informationService.stateInfo = undefined;
    this.informationService.zipInfo = undefined;
  }


}
