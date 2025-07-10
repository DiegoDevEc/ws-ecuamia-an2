// import { Filtro, Marcacion, ClienteUsuario, Destino, Camion, Talla, FiltroColores, Cajas, Colores } from './../../app.modelsWebShop';
// import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
// import { AppService } from '../../app.service';
// import { ClienteDTO } from '../../app.models';
// import { FormBuilder, FormControl } from '@angular/forms';
// import { Caja, Variedad } from 'src/app/app.modelsWebShop';
// import { ActivatedRoute, Router } from '@angular/router';
// import { MatDialog, MatSnackBar, MatDatepicker } from '@angular/material';
// import { DetailProductImageComponent } from 'src/app/shared/products-carousel/detail-product-image/detail-product-image.component';
// import { DifferentdestinationComponent } from '../differentdestination/differentdestination.component';
// import { startWith, map } from 'rxjs/operators';
// import { Observable } from 'rxjs';
// import { DatePipe } from '@angular/common';
// import { EditComponent } from '../popus/edit/edit.component';
// import { FiltersComponent } from '../popus/filters/filters.component';
// import { InformationComponent } from '../popus/information/information.component';
// import { StadingInformationComponent } from '../popus/stading-information/stading-information.component';
// import { AddedComponent } from '../popus/added/added.component';
// import { DeleteComponent } from '../popus/delete/delete.component';
// import { NoteBoxesComponent } from '../popus/note-boxes/note-boxes.component';
// import { EnumMensajes, EnumPagina, EnumSiNo, EnumTipoCaja } from 'src/app/enumeration/enumeration';

// @Component({
//   selector: 'app-stading',
//   templateUrl: './stading.component.html',
//   styleUrls: ['./stading.component.scss']
// })
// export class StadingComponent implements OnInit {
//   @ViewChild('sidenav') sidenav: any;
//   @Input() variedad: Variedad;
//   sidenavOpen = true;
//   sidenavClose = true;
//   sub: any;
//   viewCol = 25;
//   colors: FiltroColores[] = [];
//   color: any;
//   page: any;
//   cajaSeleccionada: string;
//   filtroProveedor: string;
//   date: any;
//   productos: Array<Caja> = [];
//   cajaArmada: Caja;
//   listaFiltrosSeleccionados: Filtro[] = [];
//   listaFiltrosSeleccionadosColor = [];
//   listaFiltrosSeleccionadosProducto = [];
//   DatosProductos = [];
//   productFilter = [];
//   marcacionSleccionada: Marcacion;
//   subclientes: Array<Marcacion> = [];
//   clienteSeLeccionado: any;
//   destinoSeleccionado: Destino;
//   destinos: Array<Destino> = [];
//   camionSeleccionado: Camion;
//   camiones: Array<Camion> = [];
//   camionesAll: Array<Camion> = [];
//   c: ClienteDTO;
//   cajaInput = null;
//   myControl = new FormControl();
//   filteredOptions: Observable<string[]>;
//   nameVariety: string[] = [];
//   filterValue = '';
//   resultProductsFilter: Array<Caja> = [];
//   dateNowInit: string;
//   listaFiltrosFinales: Array<Filtro> = [];
//   nombreValorProducto: string;
//   mensajeValorProducto: boolean;
//   categorias: string[] = [];
//   categoriasControl = new FormControl();
//   filtrosOpcionesCat: Observable<string[]>;
//   colores: string[] = [];
//   coloresControl = new FormControl();
//   filtrosOpcionesColores: Observable<string[]>;
//   mostrarFiltrosAll: boolean = false;
//   productoNoEncontrado: boolean = false;
//   buscarColoresPorProducto: string = "";
//   filtroAnterior: string = '';
//   valorBusquedaCol: string = '';
//   valorBusquedaCat: string = '';
//   paginaProductos: any;
//   filtroRepetido: string = '';
//   nombreVariedadSeleccionada = [{ valorVariedad: '', valorProducto: '' }];
//   productosProveedor: Array<Caja> = [];
//   listaFiltros: Filtro[] = [];
//   coloresWebShop: Colores[] = [];
//   coloresEncontrados: number = 0;
//   dias = [];
//   diaSemana = '';
//   zonaHorariaEcuador;
//   horarioDeEcuador = new Date();
//   pageNumbers = [];
//   itemsPorPagina: number;
//   mensajeTropical = EnumMensajes.EMPTY;
//   interval: any;
//   usuario: any;

//   constructor(private activatedRoute: ActivatedRoute, public appService: AppService,
//     public dialog: MatDialog, private router: Router, public formBuilder: FormBuilder,
//     public snackBar: MatSnackBar) {

//     this.usuario = JSON.parse(localStorage.getItem('Usuario'));

//     if (this.appService.cambioMenu) {
//       this._recuperarProductosPorCambioDeMenu()
//     }
//     if (this.appService.cambioMenu == false) {
//       this.getproductosWebShop();
//     }
//     this.clienteLogueado();
//     this._seleccionarMarcacion();
//     this._getCalcularDiaEntrega();
//     this._obtnerCamiones();
//   }

//   ngOnInit() {

//     this.interval = setInterval(() => {
//       if (this.appService.cambioMenu) {
//         this._recuperarProductosPorCambioDeMenu();
//       } console.log("standing reload")
//     }, 600000);

//     this.itemsPorPagina = 96;
//     this.pageNumbers = [24, 48, 96, 600];
//     this.filtroProveedor = '';
//     this.cajaSeleccionada = 'EB';
//     this.sub = this.activatedRoute.params.subscribe(() => {
//     });
//     if (window.innerWidth < 960) {
//       this.sidenavOpen = false;
//       this.sidenavClose = false;
//     }
//     if (window.innerWidth < 1280) {
//       this.viewCol = 80;
//     }
//     this.cajaArmada = this.appService.CajaArmada;
//     this.appService.CajaArmada.totalPiezas = 0;
//     if (this.appService.Data.cartListCaja.length == 0) { this.appService.Data.totalPrice = 0.00 }
//     if (this.appService.CajaArmada.variedades.length > 0) {
//       this.appService.cajaSeleccionada = this.appService.CajaArmada.tipoCaja;
//     } else {
//       this.appService.cajaSeleccionada = EnumTipoCaja.EB;
//       this.cajaArmada.totalCantidadPorBunche = 0;
//     }
//     this.appService.codigosProveedorFinales = [];
//     this.appService.codigosProveedorRespaldo = [];
//     this.appService.activarQueryRoses = false;
//     this.appService.realizoBusquedaProducto = false;
//     this.appService.resultadoBusqueda = false;
//     this.buscarColoresPorProducto = "";
//     this.appService.contadorCarrito();
//     this.appService._botonMenuSeleccionado(this.router.url);
//     this._verFiltros('S');
//   }

//   ngOnDestroy() {
//     this.sub.unsubscribe();
//     if (this.interval) {
//       clearInterval(this.interval);
//     }
//   }

//   /*ngAfterViewInit() {
//     if (JSON.parse(localStorage.getItem("_lsDialogInformationStading")) == undefined
//       || JSON.parse(localStorage.getItem("_lsDialogInformationStading")) == null) {
//       setTimeout(() => {
        
//         localStorage.setItem("_lsDialogInformationStading", "1")
//       }, 20);
//     }
//   }*/

//   @HostListener('window:resize')
//   onWindowResize(): void {
//     (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
//     (window.innerWidth < 960) ? this.sidenavClose = false : this.sidenavClose = true;
//   }

//   changeCount(count) {
//     //  this.getAllProducts();
//   }

//   _filterOptions() {
//     this.filteredOptions = null
//     this.filteredOptions = this.myControl.valueChanges
//       .pipe(
//         startWith(''),
//         map(value => this._filter(value))
//       );
//   }

//   _filter(value: string): string[] {
//     this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//       const cajas: Caja[] = JSON.parse(data.json);
//       this.nameVariety = [];
//       for (let item of cajas.filter(x => x.variedades.find(y => y.precioSO > 0))) {
//         this.nameVariety.push(item.variedades[0].producto.trim())
//         this.nameVariety.push(item.variedades[0].nombreVariedad.trim())
//       }
//     });
//     var hash = {};
//     this.nameVariety = this.nameVariety.filter(function (current) {
//       var exists = !hash[current] || false;
//       hash[current] = true;
//       return exists;
//     });
//     const filterValue = value.toLowerCase();
//     return this.nameVariety.filter(option => option.toLowerCase().includes(filterValue));
//   }

//   _seleccionarMarcacion() {
//     //se valida si es cliente o subcliente : C = CLIENTE,  S = SUBCLIENTE, 
//     var data = JSON.parse(localStorage.getItem("Usuario"))
//     if (data.codigoClientePadre != null || data.codigoClientePadre != undefined) {
//       if (sessionStorage.getItem('MarcacionStading') == 'undefined' || sessionStorage.getItem('MarcacionStading') == null) {
//         const cli = JSON.parse(localStorage.getItem('Usuario'));
//         this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'S').subscribe((data: any) => {
//           this.subclientes = data;
//           this.getInfoShipping();
//           if (this.subclientes.length > 0) {
//             this.marcacionSleccionada = this.subclientes[0];
//             sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
//             this._seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
//             return;
//           }
//         });
//       }
//       else {
//         this.camionSeleccionado = JSON.parse(sessionStorage.getItem('CamionStading'));
//         this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("DestinoStading"))
//         this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("MarcacionStading"))
//       }
//     }
//     else {
//       if (sessionStorage.getItem('MarcacionStading') == 'undefined' || sessionStorage.getItem('MarcacionStading') == null) {
//         const cli = JSON.parse(localStorage.getItem('Usuario'));
//         this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
//           this.subclientes = data;
//           this.getInfoShipping();
//           if (this.subclientes.length > 0) {
//             this.marcacionSleccionada = this.subclientes[0];
//             sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
//             this._seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
//             return;
//           }
//         });
//       }
//       else {
//         this.camionSeleccionado = JSON.parse(sessionStorage.getItem('CamionStading'));
//         this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("DestinoStading"))
//         this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("MarcacionStading"))
//       }
//     }
//   }

//   _seleccionarDestino(codigoMarcacion) {
//     this.appService.getDestinos(codigoMarcacion).subscribe((data: any) => {
//       this.destinos = data;
//       this.destinoSeleccionado = this.destinos[0];
//       sessionStorage.setItem('DestinoStading', JSON.stringify(this.destinoSeleccionado));
//     });
//   }

//   clienteLogueado() {
//     const cli = JSON.parse(localStorage.getItem('Usuario'));
//     this.clienteSeLeccionado = cli;
//   }

//   _obtnerCamiones() {
//     var data: any
//     data = JSON.parse(localStorage.getItem("Usuario"))
//     //se valida si es cliente o subcliente
//     if (data.codigoClientePadre != null || data.codigoClientePadre != undefined) {
//       if (sessionStorage.getItem('MarcacionStading') == 'undefined' || sessionStorage.getItem('MarcacionStading') == null) {
//         const cli = JSON.parse(localStorage.getItem('Usuario'));
//         this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'S').subscribe((data: any) => {
//           this.subclientes = data;
//           this.getInfoShipping();
//           if (this.subclientes.length > 0) {
//             this.marcacionSleccionada = this.subclientes[0];
//             sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
//             this._seleccionarCamion(this.marcacionSleccionada.codigoSeleccion);
//           }
//         });
//       }
//       else {
//         this.camionSeleccionado = JSON.parse(sessionStorage.getItem('CamionStading'));
//         this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("DestinoStading"))
//         this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("MarcacionStading"))
//       }
//     }
//     else {
//       if (sessionStorage.getItem('MarcacionStading') == 'undefined' || sessionStorage.getItem('MarcacionStading') == null) {
//         const cli = JSON.parse(localStorage.getItem('Usuario'));
//         this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
//           this.subclientes = data;
//           this.getInfoShipping();
//           if (this.subclientes.length > 0) {
//             this.marcacionSleccionada = this.subclientes[0];
//             sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
//             this._seleccionarCamion(this.marcacionSleccionada.codigoSeleccion);
//           }
//         });
//       }
//       else {
//         this.camionSeleccionado = JSON.parse(sessionStorage.getItem('CamionStading'));
//         this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("DestinoStading"))
//         this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("MarcacionStading"))
//       }
//     }
//   }

//   _seleccionarCamion(codigoMarcacion) {
//     this.appService.getCamionSeleccionado(codigoMarcacion).subscribe((data: any) => {
//       this.camiones = data;
//       if (this.camiones.length > 0) {
//         this.camionSeleccionado = this.camiones[0];
//         sessionStorage.setItem('CamionStading', JSON.stringify(this.camionSeleccionado));
//       }
//     });
//   }

//   obtenerTodosCamiones() {
//     this.appService.getAllCamiones().subscribe((data: any) => {
//       this.camionesAll = data;
//     });
//   }

//   _getCalcularDiaEntrega() {

//     var dia = this._getDiaSemana();
//     var hora = this._getHoraDia();
//     var minutos = this._getMinutos()

//     switch (dia) {
//       case 'Monday': {

//         if (hora < 10 && minutos <= 59) {
//           this._getFechaFlorex();
//         }

//         if (hora >= 10 && minutos >= 0) {
//           this._calcularDiasEntregaPedido('Monday');
//         }

//         break;
//       }
//       case 'Tuesday': {

//         if (hora < 10 && minutos <= 59) {
//           this._getFechaFlorex();
//         }

//         if (hora >= 10 && minutos >= 0) {
//           this._calcularDiasEntregaPedido('Tuesday');
//         }

//         break;
//       }
//       case 'Wednesday': {

//         if (hora < 10 && minutos <= 59) {
//           this._getFechaFlorex();
//         }

//         if (hora >= 10 && minutos >= 0) {
//           this._calcularDiasEntregaPedido('Wednesday');
//         }

//         break;
//       }
//       case 'Thursday': {

//         if (hora < 10 && minutos <= 59) {
//           this._getFechaFlorex();
//         }

//         if (hora >= 10 && minutos >= 0) {
//           this._calcularDiasEntregaPedido('Thursday');
//         }

//         break;
//       }
//       case 'Friday': {

//         if (hora < 10 && minutos <= 59) {
//           this._getFechaFlorex();
//         }

//         if (hora >= 10 && minutos >= 0) {
//           this._calcularDiasEntregaPedido('Friday');
//         }

//         break;
//       }
//       case 'Saturday': {

//         this._getFechaFlorex();

//         break;
//       }
//       case 'Sunday': {

//         this._getFechaFlorex();

//         break;
//       }

//     }

//   }

//   _getFechaFlorex() {

//     var fechaInicia = new Date();
//     var datePipe = new DatePipe("en-US");

//     if (localStorage.getItem("_ls_dateConecctionStading") != null || localStorage.getItem("_ls_dateConecctionStading") != undefined) {
//       this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecctionStading')));
//       this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
//       localStorage.setItem("_ls_dateConecctionStading", this.date.value);
//       return;
//     }
//     if (this.usuario.codigoClientePadre == 1940) { //Si es FLOWERFULL
//       if (this.diaSemana === 'Sunday' ||
//         this.diaSemana === 'Monday' ||
//         this.diaSemana === 'Tuesday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 4);
//       }
//       if (this.diaSemana === 'Wednesday' ||
//         this.diaSemana === 'Thursday' ||
//         this.diaSemana === 'Friday' ||
//         this.diaSemana === 'Saturday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 5);
//       }
//     } else { //Si no es FLOWERFULL
//       if (this.diaSemana === 'Monday' ||
//         this.diaSemana === 'Tuesday' ||
//         this.diaSemana === 'Wednesday' ||
//         this.diaSemana === 'Thursday' ||
//         this.diaSemana === 'Friday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 4);
//       }

//       if (this.diaSemana === 'Saturday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 5);
//       }

//       if (this.diaSemana === 'Sunday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 4);
//       }
//     }


//     this.date = new FormControl(new Date(fechaInicia));
//     this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');

//     localStorage.setItem("_ls_dateConecctionStading", this.date.value);
//   }

//   _calcularDiasEntregaPedido(dia: string) {

//     var fechaInicia = new Date();
//     var datePipe = new DatePipe("en-US");


//     if (localStorage.getItem("_ls_dateConecctionStading") != null || localStorage.getItem("_ls_dateConecctionStading") != undefined) {
//       this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecctionStading')));
//       this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
//       localStorage.setItem("_ls_dateConecctionStading", this.date.value);
//       return;
//     }
//     if (this.usuario.codigoClientePadre == 1940) { //Si es FLOWERFULL
//       if (dia === 'Saturday' || dia === 'Sunday' || dia === 'Monday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 5);
//       }
//       if (dia === 'Tuesday' || dia === 'Wednesday' || dia === 'Thursday' || dia === 'Friday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 6);
//       }
//     }
//     else { //Si no es FLOWERFULL
//       if (dia === 'Monday' || dia === 'Tuesday' || dia === 'Wednesday' || dia === 'Thursday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 5);
//       }

//       if (dia === 'Friday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 6);
//       }
//     }


//     this.date = new FormControl(new Date(fechaInicia));
//     this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
//     localStorage.setItem("_ls_dateConecctionStading", this.date.value);
//   }

//   _getDiaSemana(): string {

//     this.dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     this.zonaHorariaEcuador = new Date().toLocaleString('en-US', { timeZone: 'America/Guayaquil' });
//     this.horarioDeEcuador = new Date(this.zonaHorariaEcuador);
//     this.horarioDeEcuador.setHours(this.horarioDeEcuador.getHours());
//     this.horarioDeEcuador.setMinutes(this.horarioDeEcuador.getMinutes());
//     this.diaSemana = this.dias[this.horarioDeEcuador.getDay()];

//     return this.diaSemana;

//   }

//   _getHoraDia(): number {
//     return this.horarioDeEcuador.getHours();
//   }

//   _getMinutos(): number {
//     return this.horarioDeEcuador.getMinutes();
//   }

//   public getColoresWebShop(numero: number) {
//     this.appService.getColoresWebShop().subscribe(colores => {
//       this.coloresEncontrados = colores.length
//       this.coloresWebShop = colores.slice(0, numero)
//       this.coloresWebShop.forEach(x => { x.color = x.color.toLowerCase(); })
//       // for (let index = 0; index < numero; index++) {
//       //   const colores = this.coloresWebShop[index];
//       //   colores.color = colores.color.toLowerCase();
//       // }
//       this.coloresWebShop = this.coloresWebShop.sort(function (a, b) {
//         return a.color.localeCompare(b.color);
//       });
//     });
//   }

//   public getColoresFiltrados() {

//     for (let index = 0; index < this.coloresWebShop.length; index++) {
//       const colores = this.coloresWebShop[index];
//       colores.color = colores.color.toLowerCase();
//     }

//     var hash = {};
//     this.coloresWebShop = this.coloresWebShop.filter(function (current) {
//       var exists = !hash[current.color];
//       hash[current.color] = true;
//       return exists;
//     });

//     this.mostrarFiltrosAll = null
//     this.coloresEncontrados = this.coloresWebShop.length
//     this.coloresWebShop = this.coloresWebShop.sort(function (a, b) {
//       return a.color.localeCompare(b.color);
//     });

//     return;

//   }

//   public getproductosWebShop() {
//     this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//       const cajas: Caja[] = JSON.parse(data.json);
//       this.productos = cajas.filter(x => x.variedades.find(y => y.precioSO > 0) && x.combo != 'S');
//       this.productos.sort(function (a, b) {
//         return a.variedades[0].nombreVariedad.localeCompare(b.variedades[0].nombreVariedad);
//       });
//       const c: any = JSON.parse(localStorage.getItem('Usuario'));
//       if (c.orderWebShop === EnumSiNo.N) {
//         this.appService.orderWebShop = EnumSiNo.N
//       } else {
//         this.appService.orderWebShop = EnumSiNo.S
//       }
//       for (let index = 0; index < this.productos.length; index++) {
//         const element = this.productos[index];
//         element.tallasDeCaja = [];
//         element.tallasCajaCm = [];
//         element.tallasFinales = [];
//         element.cajasDisponiblesMixtas = []
//         element.imagen = this.appService.urlImagen + element.imagenes[0]
//         element.stadingOrder = true
//         element.nombreProducto = element.variedades[0].nombreVariedad.toLowerCase() + " - " + element.variedades[0].producto.toLowerCase();
//         if (element.combo == 'S') {
//           element.totalPiezas = 0;
//           element.totalPrecio = 0.00;
//           element.totalPrecioJv = 0.00;
//         }
//         for (let x = 0; x < element.variedades.length; x++) {
//           const variedad = element.variedades[x];
//           variedad.cajasPorVariedad = [];
//           var buscarVariedadesPorTalla = element.variedades.filter(x => x.talla == variedad.talla);
//           if (buscarVariedadesPorTalla.length > 0) {
//             buscarVariedadesPorTalla.forEach(caja => {
//               variedad.cajasPorVariedad.push({
//                 caja: caja.caja,
//                 valor: caja.cantidadPorCajaMixta
//               })
//             });
//             var hash = {};
//             variedad.cajasPorVariedad = variedad.cajasPorVariedad.filter(function (productoCaja) {
//               var exists = !hash[productoCaja.caja];
//               hash[productoCaja.caja] = true;
//               return exists;
//             });
//           }
//           element.cajasDisponiblesMixtas.push(variedad.cantidadPorCajaMixta)
//           if (variedad.cantidadPorCaja > 0) {
//             element.tallasDeCaja.push(variedad.talla);
//             element.tallasCajaCm.push(variedad.tallaCm)
//             element.tallasFinales.push({ codigo: variedad.tallaCm, valor: variedad.talla });
//             if (element.combo == 'S') {
//               element.totalPiezas += variedad.cantidadPorCaja;
//             }
//             variedad.stadingOrder = true
//             variedad.cajaCombo = "N"
//             variedad.disabledBox = false
//             variedad.disabledBunches = false
//             if (variedad.seguridad == "si") {
//               variedad.disabled = true
//             }
//             element.botonBox = 'S'
//             element.botonBunches = 'S'
//             if (variedad.mostrarPrecioPorCaja == 'no') {
//               element.botonBunches = 'N'
//             }
//             for (var z = 0; z < variedad.precios.length; z++) {
//               var precio = variedad.precios[z];
//               var totalAux = 0;
//               var totalAuxJv = 0;
//               if (precio.tipoPrecio == "F") {
//                 if (c.codigoClientePadre != undefined) {
//                   var porcentajeSumar = c.porcentajeSubcliente / 100;
//                   var sumarPrecio = precio.precio * porcentajeSumar
//                   var sumarPrecioJv = precio.precioJv * porcentajeSumar
//                   precio.precio += sumarPrecio
//                   precio.precioJv += sumarPrecioJv
//                 }
//                 if (precio.codigoTipoCliente === c.codigoTipoCliente) {
//                   variedad.precio = precio.precio;
//                   variedad.precioCliente = precio.precio
//                   variedad.precioJv = precio.precioJv
//                   if (element.combo == 'S') {
//                     variedad.cajaCombo = "S"
//                     totalAux = variedad.precio * variedad.cantidadPorCaja
//                     totalAuxJv = variedad.precioJv * variedad.cantidadPorCaja
//                     element.totalPrecio += totalAux
//                     element.totalPrecioJv += totalAuxJv
//                   }
//                 }
//               }
//             }
//           }
//         }
//         var tallaOriginalMenor = element.tallasCajaCm[0];
//         var cajaOriginalMenor = [];
//         var tallasUnicas = Array.from(new Set(element.tallasCajaCm));
//         var tallaStr = element.tallasDeCaja[0];
//         var hash = {};
//         element.tallasFinales = element.tallasFinales.filter(function (current) {
//           var exists = !hash[current.valor];
//           hash[current.valor] = true;
//           return exists;
//         });
//         element.tallasCajaCm = tallasUnicas.sort(comparar)
//         element.tallasFinales.sort((a, b) => a.codigo + b.codigo)
//         element.tallaSeleccionada = tallaStr + '/';
//         if (element.variedades[0].producto == "ROSES" || element.variedades[0].producto == "GARDEN ROSES"
//           || element.variedades[0].producto == "MAYRAS GARDEN ROSES" || element.variedades[0].producto == "SPRAY ROSES") {
//           if (element.tallasFinales.filter(x => x.valor === "50 CM").length > 0) {
//             tallaOriginalMenor = 50;
//             tallaStr = "50 CM";
//             element.tallasDeCaja = [];
//             element.tallasDeCaja.push(tallaStr);
//             element.tallaSeleccionada = tallaStr + '/';
//           }
//         }
//         if (element.variedades[0].producto == "HYDRANGEA") {
//           if (element.tallasFinales.filter(x => x.valor === 'SUPER SELECT').length > 0) {
//             tallaOriginalMenor = 0;
//             tallaStr = 'SUPER SELECT';
//             element.tallasDeCaja = [];
//             element.tallasDeCaja.push(tallaStr);
//             element.tallaSeleccionada = tallaStr + '/';
//           }
//         }
//         var variedadBusqueda = [];
//         element.variedades.forEach(variedad => {
//           if (variedad.cantidadPorCaja > 0) {
//             if (variedad.tallaCm == tallaOriginalMenor && variedad.talla == tallaStr) {
//               variedadBusqueda.push(variedad)
//             }
//           }
//         });
//         variedadBusqueda.forEach(item => {
//           cajaOriginalMenor.push(item.cantidadPorCaja);
//         });
//         var minCaja = Math.min(...cajaOriginalMenor);
//         element.cajasDisponiblesMixtas = Array.from(new Set(element.cajasDisponiblesMixtas));
//         element.cajaSeleccionada = minCaja;
//         element.indexVariedadSeleccionada = this.tallaProducto(tallaStr, element, minCaja, "N");
//         element.indexPorTipoCaja = this.actualizarIndexPorTipoCaja(element, tallaStr);
//       }
//       function comparar(a, b) { return a - b; };
//       this.listaFiltros = [];
//       this.listaFiltrosFinales = [];
//       for (let item of cajas) {
//         this.listaFiltros.push({ tipo: item.variedades[0].nombreVariedad.toLowerCase(), valor: item.variedades[0].producto.toLowerCase(), seleccionado: 'N' })
//         this.listaFiltrosFinales.push({ tipo: item.variedades[0].nombreVariedad, valor: item.variedades[0].producto, seleccionado: null })
//       }
//       this._getProductosFiltro();
//       this._filterOptions();
//       this._getCategoriasAutocomplete()
//       this._obtenerColoresFiltro();
//       this._getColoresAutocomplete()
//       //this.getColoresWebShop(5)
//     });
//   }

//   public _getProductosFiltro() {
//     //eliminar productos repetidos 
//     var hash = {};
//     for (let index = 0; index < this.listaFiltros.length; index++) {
//       const element = this.listaFiltros[index];
//       element.seleccionado = 'N'
//     }
//     this.listaFiltros = this.listaFiltros.filter(function (variedades) {
//       var exists = !hash[variedades.tipo && variedades.valor] || false;
//       hash[variedades.tipo && variedades.valor] = true;
//       return exists;
//     });

//     //ordenar array alfabeticamente
//     this.listaFiltros = this.listaFiltros.sort(function (a, b) {
//       return a.valor.localeCompare(b.valor);
//     });

//   }

//   public _obtenerColoresFiltro() {
//     var colorRepeat: FiltroColores[] = []
//     this.colors = []
//     this.productos.forEach(item => {
//       if (this.buscarColoresPorProducto != "") {
//         if (item.variedades[0].producto === this.buscarColoresPorProducto ||
//           item.variedades[0].nombreVariedad === this.buscarColoresPorProducto && item.variedades[0].precioSO > 0) {
//           if (item.combo != "S") {
//             if (item.color != '-') {
//               colorRepeat.push({
//                 color: item.color,
//                 seleccionado: 'N'
//               });
//             }
//           }
//         }
//       } else {
//         if (item.combo != "S") {
//           if (item.color != '-') {
//             colorRepeat.push({
//               color: item.color,
//               seleccionado: 'N'
//             });
//           }
//         }
//       }
//     });
//     var hash = {};
//     colorRepeat = colorRepeat.filter(function (valor) {
//       var exists = !hash[valor.color];
//       hash[valor.color] = true;
//       return exists;
//     });
//     let uniquesCaja = Array.from(new Set(colorRepeat));
//     this.colors = uniquesCaja
//     this.colors.sort(function (a, b) {
//       return a.color.localeCompare(b.color)
//     });
//   }

//   public agregarFiltro(filtro: Filtro) {

//     this.nombreValorProducto = filtro.valor.toLowerCase()
//     for (let index = 0; index < this.listaFiltros.length; index++) {
//       const element = this.listaFiltros[index];
//       if (element === filtro) {
//         element.seleccionado = 'S';
//         break;
//       }
//     }

//     for (let index = 0; index < this.listaFiltrosSeleccionadosProducto.length; index++) {
//       const element = this.listaFiltrosSeleccionadosProducto[index];
//       if (element === filtro.valor) {
//         return;
//       }
//     }

//     //nueva logica de programacion de filtros
//     for (let index = 0; index < this.listaFiltros.length; index++) {
//       const element = this.listaFiltros[index];
//       if (element.valor === this.filtroAnterior) {
//         element.seleccionado = 'N';
//         break;
//       }
//     }

//     if (filtro.valor != this.filtroRepetido) {
//       this.listaFiltrosSeleccionados.push(new Filtro('PRO', filtro.valor.toLowerCase(), ''))
//       this.filtroRepetido = filtro.valor
//       this.filtroAnterior = filtro.valor
//     }
//     this.listaFiltrosSeleccionadosProducto.push(filtro.valor.toLowerCase());
//     this.GeneralEventFilter("PRO")
//   }

//   //nuevo
//   public changeColor(color: string) {

//     this.nombreValorProducto = color.toLowerCase()

//     for (let item of this.listaFiltrosSeleccionadosColor) {
//       if (color.toLowerCase() == item) {
//         return;
//       }
//     }

//     for (let index = 0; index < this.coloresWebShop.length; index++) {
//       const colores = this.coloresWebShop[index]
//       if (colores.color === color.toLowerCase()) {
//         colores.select = 'S'
//       }
//     }

//     if (color.toLowerCase() != this.filtroRepetido) {
//       this.listaFiltrosSeleccionados.push(new Filtro('COL', color.toLowerCase(), 'S'));
//       this.filtroRepetido = color.toLowerCase()
//     }
//     this.listaFiltrosSeleccionadosColor.push(color.toLowerCase());
//     this.GeneralEventFilter("COL")

//   }

//   public eliminarFiltroSeleccionado(filtro, value: string) {

//     if (this.listaFiltrosSeleccionados.filter(x => x.tipo == "PROMO").length > 0) {
//       const indexPromo = this.listaFiltrosSeleccionados.indexOf(filtro)
//       if (indexPromo != -1) {
//         this.listaFiltrosSeleccionados.splice(indexPromo, 1)
//       }
//     }

//     this.nombreValorProducto = value.toLowerCase()
//     this.appService.limpiarFiltroColor = []

//     const index: number = this.listaFiltrosSeleccionados.indexOf(filtro);

//     for (let index = 0; index < this.listaFiltros.length; index++) {
//       const element = this.listaFiltros[index];
//       if (element.valor === filtro.valor) {
//         element.seleccionado = 'N';
//       }
//     }

//     if (this.listaFiltrosSeleccionadosColor.filter(x => x == value.toLowerCase()).length > 0) {
//       //elimino filtro de color
//       var indexColor = this.listaFiltrosSeleccionadosColor.indexOf(value.toLowerCase())
//       this.listaFiltrosSeleccionadosColor.splice(indexColor, 1);
//     }

//     if (this.listaFiltrosSeleccionadosProducto.filter(x => x == value.toLowerCase()).length > 0) {
//       //elimino filtro de producto
//       var indexProducto = this.listaFiltrosSeleccionadosProducto.indexOf(value.toLowerCase())
//       this.listaFiltrosSeleccionadosProducto.splice(indexProducto, 1);
//     }

//     this.listaFiltrosSeleccionados.splice(index, 1);
//     this.filtroRepetido = ''

//     if (this.listaFiltrosSeleccionados.length == 0) {
//       this._limpiarWebShop();
//     }

//     this._validarFiltroProductos("DROP");

//   }

//   eliminarVariedad(variedad: Variedad) {
//     this.appService.eliminarVariedad(variedad);
//     this.appService._boxProgressReversa(this.appService.cajaSeleccionada);
//     if (this.appService.CajaArmada.totalProcentajeLleno <= 100 && this.appService.CajaArmada.totalProcentajeLleno >= 90) {
//       const dialogRef = this.dialog.open(NoteBoxesComponent, {
//         data: { variedad: null, condicion: 'LOW' },
//         panelClass: 'note-boxes'
//       });
//     }
//     this.appService.CajaArmada.totalProcentajeLleno = Math.round(this.appService.CajaArmada.totalProcentajeLleno);
//     this.cajaArmada.totalCantidadPorBunche = 0;
//     this.appService.CajaArmada.variedades.forEach(variedad => {
//       this.cajaArmada.totalCantidadPorBunche += variedad.cantidadPorBunche;
//     });
//     if (this.appService.CajaArmada.totalProcentajeLleno <= 0) {
//       this._limpiarWebShop();
//     }
//   }

//   public actualizarCajaSeleccionada() {
//     this.appService.cajaSeleccionada = this.appService.actualizarCajaSeleccionada(this.appService.cajaSeleccionada);
//     this.appService._calcularPorcentajeCajaArmada(this.appService.cajaSeleccionada);
//     this.appService.CajaArmada.totalProcentajeLleno = Math.round(this.appService.CajaArmada.totalProcentajeLleno);
//   }

//   public cajaSeleccionadaActualizada(event) {
//     var cajaCantidad = this.appService.cajasConValor.filter(x =>
//       x.caja == this.appService.cajaSeleccionada);
//     this.appService.cajaSeleccionadaNumber = cajaCantidad[0].valor
//     this.appService.cajaSeleccionada = cajaCantidad[0].caja
//   }

//   public mostraDetallesCaja(cajaModfiicar: Caja) {
//     const index: number = this.appService.Data.cartListCaja.indexOf(cajaModfiicar);
//     this.appService.mostraDetallesCaja(index);
//   }

//   public agregarACaja(argumento: string) {
//     if (this.appService.CajaArmada.totalProcentajeLleno >= 90) {
//       let c: ClienteDTO = JSON.parse(localStorage.getItem('Usuario'));
//       this.cajaArmada.codigoTipoCliente = c.codigoTipoCliente;
//       this.cajaArmada.codigoCliente = c.codigoPersona;
//       this.cajaArmada.cajaSeleccionada = this.appService.cajaSeleccionadaNumber
//       this.cajaArmada.stadingOrder = true
//       this.cajaArmada.combo = 'N'
//       let respuesta = this.appService.addToCartCaja(this.cajaArmada);
//       if (respuesta) {
//         const timeout = 1500;
//         const dialogRef = this.dialog.open(AddedComponent, {
//           data: { producto: this.cajaArmada.variedades, tipoAgrega: 'B', imagen: '', cantidad: 0 },
//           width: '410px',
//           panelClass: 'added-product'
//         });

//         dialogRef.afterClosed().subscribe(res => {
//           // setTimeout(() => {
//           dialogRef.close();
//           // }, timeout)
//         });
//       }
//       if (argumento != 'N') {
//         this.cajaArmada = this.appService.CajaArmada;
//         this.productosProveedor = [];
//         this._limpiarWebShop();
//       }
//       return;
//     }
//     const message = 'The box must be full.';
//     status = 'error';
//     this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });

//   }

//   public eliminarCaja(caja: Caja) {
//     const index: number = this.appService.Data.cartListCaja.indexOf(caja);
//     if (index !== -1) {
//       this.appService.Data.cartListCaja.splice(index, 1);
//       this.appService.Data.totalPrice = this.appService.Data.totalPrice - caja.totalPrecio;
//       this.appService.addCartLocalStorage();
//     }
//     if (this.appService.Data.cartListCaja.length == 0) {
//       this.getproductosWebShop();
//     }
//   }

//   public cambiarPaginaStading(event) {
//     this.paginaProductos = event;
//     window.scrollTo(0, 180);
//   }

//   public buscarProductosFiltro(evento, tipoBusqueda) {
//     this.appService.showNabvarCardActive = true;
//     if (this.filterValue.length <= 0) { this._limpiarWebShop(); }
//     if (this.filterValue != '') {
//       if (this.listaFiltrosSeleccionados.filter(x => x.valor == this.filterValue).length > 0) { return };
//       //busca cuando da enter
//       if (tipoBusqueda == 'N') {
//         if (evento.keyCode == 13) {
//           this.listaFiltrosSeleccionados.push(new Filtro('PRO', this.filterValue.toLowerCase(), ''))
//           this.nombreValorProducto = this.filterValue.toLowerCase()
//           this.listaFiltrosSeleccionadosProducto.push(this.filterValue.toLowerCase())
//           this.GeneralEventFilter("PRO")
//           this.appService.resultadoBusqueda = true
//           this.productoNoEncontrado = false
//           return;
//         }
//       }

//       //filtra productos cuando hace click en la lista o en el boton
//       if (tipoBusqueda == 'S') {
//         this.listaFiltrosSeleccionados.push(new Filtro('PRO', this.filterValue.toLowerCase(), ''))
//         this.nombreValorProducto = this.filterValue.toLowerCase()
//         this.listaFiltrosSeleccionadosProducto.push(this.filterValue.toLowerCase())
//         this.GeneralEventFilter("PRO")
//         this.appService.resultadoBusqueda = true
//         this.productoNoEncontrado = false
//       }
//     }
//   }

//   public GeneralEventFilter(filtro: string) {

//     if (this.cajaArmada.totalProcentajeLleno > 0) {
//       const dialogRef = this.dialog.open(DeleteComponent, {
//         data: { titulo: 'Caution', mensaje: 'You will lost the mix created if you do this action, continue with finding' },
//         panelClass: 'delete-boxes'
//       });
//       dialogRef.afterClosed().subscribe(res => {
//         if (res) {
//           this._limipiarVariablesCuandoBusca();
//           this._validarFiltroProductos(filtro)
//           return;
//         }
//         else {
//           var index = this.listaFiltrosSeleccionados.findIndex(x => x.valor === this.nombreValorProducto)
//           if (index !== -1) {
//             this.listaFiltrosSeleccionados.splice(index, 1)
//           }
//           for (let index = 0; index < this.listaFiltros.length; index++) {
//             const element = this.listaFiltros[index];
//             if (element.valor === this.nombreValorProducto) {
//               element.seleccionado = 'N';
//             }
//           }
//           this.appService.limpiarFiltroColor = []
//           return;
//         }
//       });
//     } else {
//       this._validarFiltroProductos(filtro)
//     }

//   }

//   public _limipiarVariablesCuandoBusca() {
//     this.appService.codigosProveedorFinales = [];
//     this.appService.codigosProveedorRespaldo = [];
//     this.productos = [];
//     this.productosProveedor = [];
//     this.appService.CajaArmada.totalProcentajeLleno = 0;
//     this.cajaArmada.variedades = [];
//     this.cajaArmada.totalCantidadPorBunche = 0;
//     this.appService.cajaSeleccionada = "EB";
//     this.appService.cajasConValor = [];
//     this.appService.CajaArmada.totalPiezas = 0;
//     let uniques = Array.from(new Set(this.listaFiltrosSeleccionados));
//     this.listaFiltrosSeleccionados = uniques;
//     this.mensajeValorProducto = true;
//     this.appService.activarQueryRoses = false;
//     this.appService.realizoBusquedaProducto = false;
//     this.buscarColoresPorProducto = "";
//     this.appService.resultadoBusqueda = false;
//     this.appService.mostrarPromociones = false;
//     this.productoNoEncontrado = false;
//     this.mensajeTropical = EnumMensajes.EMPTY;
//     this._obtenerColoresFiltro();
//   }

//   public _validarFiltroProductos(filtro: string) {
//     if (this.listaFiltrosSeleccionados.length == 0) {
//       this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//         const cajas: Caja[] = JSON.parse(data.json);
//         this.DatosProductos = cajas
//         this.productosXProveedorEvent(this.DatosProductos, 'F')
//         this._obtenerColoresFiltro();
//       });
//       this.DatosProductos = []
//       return;
//     }
//     if (this.productosProveedor.length > 0) {
//       this._limpiarWebShop();
//       return
//     }

//     this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//       const cajas: Caja[] = JSON.parse(data.json);
//       if (filtro == "PRO" || filtro == "COL") {
//         this.DatosProductos = []
//         if (this.listaFiltrosSeleccionadosProducto.length > 1) {
//           this.listaFiltrosSeleccionadosProducto.shift()
//           this.listaFiltrosSeleccionados.shift()
//         }
//         if (this.listaFiltrosSeleccionadosProducto.length > 0) {
//           for (let itemProducto of this.listaFiltrosSeleccionadosProducto) {
//             var stadingData = cajas.filter(x => x.combo != 'S' && x.variedades.find(y => y.precioSO > 0))
//             //busqueda desordenada
//             var filter = {
//               argumentoDeBusqueda: itemProducto.toLowerCase()
//             }
//             const filterKeys = Object.keys(filter);
//             var resultado = stadingData.filter(item => {
//               return filterKeys.some((columnaArray) => {
//                 if (filter[columnaArray]) {
//                   const fil = filter[columnaArray].split(' ');
//                   let check = false;
//                   if (itemProducto.toLowerCase() == 'tropical flowers foliage magic') {
//                     if (new RegExp('tropical flowers', 'gi').test(item[columnaArray]) || new RegExp('foliage magic', 'gi').test(item[columnaArray])) {
//                       check = true;
//                     } else {
//                       check = false;
//                     }
//                   } else {
//                     for (const f of fil) {
//                       if (new RegExp(f, 'gi').test(item[columnaArray]) || f === '') {
//                         check = true;
//                       } else {
//                         check = false;
//                         break;
//                       }
//                     }
//                   }
//                   return check;
//                 } else {
//                   return true;
//                 }
//               });
//             });
//             this.resultProductsFilter = this.DatosProductos = resultado.filter(x => x.combo == EnumSiNo.N && x.variedades.find(y => y.precioSO > 0));
//             this.buscarColoresPorProducto = this.listaFiltrosSeleccionadosProducto[0];
//           }
//         }
//         if (this.listaFiltrosSeleccionadosColor.length >= 0 && this.listaFiltrosSeleccionadosProducto.length == 0) {
//           for (let itemColor of this.listaFiltrosSeleccionadosColor) {
//             this.DatosProductos = this.DatosProductos.concat(cajas
//               .filter(x => x.color == itemColor.toUpperCase() && x.combo == 'N' && x.variedades.find(y => y.precioSO > 0)))
//             this.productos = this.DatosProductos
//             this.resultProductsFilter = this.DatosProductos
//           }
//         }
//         if (this.listaFiltrosSeleccionadosColor.length > 0 && this.listaFiltrosSeleccionadosProducto.length > 0) {
//           for (let itemColor of this.listaFiltrosSeleccionadosColor) {
//             this.productFilter = this.productFilter.concat(this.resultProductsFilter
//               .filter(x => x.color == itemColor.toUpperCase() && x.combo == 'N' && x.variedades.find(y => y.precioSO > 0)))
//             this.DatosProductos = this.productFilter
//             this.productos = this.DatosProductos
//           }
//           this.productFilter = [];
//         }
//         //eliminar productos repetidos
//         this.productos = [];
//         let uniques = Array.from(new Set(this.DatosProductos));
//         this.productos = uniques;
//         if (this.productos.length == 0) {
//           this.productoNoEncontrado = true;
//           this.appService.resultadoBusqueda = false;
//           return;
//         }
//         this.productoNoEncontrado = false;
//         this.productosXProveedorEvent(this.productos, 'F');
//         this._obtenerColoresFiltro();
//         this.DatosProductos = [];
//       }
//       //eliminar productos de la lista
//       else if (filtro == "DROP") {
//         if (this.listaFiltrosSeleccionadosProducto.length > 0) {
//           for (let itemProducto of this.listaFiltrosSeleccionadosProducto) {
//             this.DatosProductos = this.DatosProductos.concat(
//               cajas.filter(x => x.variedades
//                 .find(y => y.producto == itemProducto.toUpperCase() ||
//                   y.nombreVariedad == itemProducto.toUpperCase()) && x.combo == 'N' && x.variedades.find(y => y.precioSO > 0)))
//             this.resultProductsFilter = this.DatosProductos
//           }
//         }
//         if (this.listaFiltrosSeleccionadosColor.length >= 0 && this.listaFiltrosSeleccionadosProducto.length == 0) {
//           for (let itemColor of this.listaFiltrosSeleccionadosColor) {
//             this.DatosProductos = this.DatosProductos.concat(cajas
//               .filter(x => x.color == itemColor.toUpperCase() && x.combo == 'N' && x.variedades.find(y => y.precioSO > 0)))
//             this.productos = this.DatosProductos
//             this.resultProductsFilter = this.DatosProductos
//           }
//         }
//         if (this.listaFiltrosSeleccionadosColor.length > 0 && this.listaFiltrosSeleccionadosProducto.length > 0) {
//           for (let itemColor of this.listaFiltrosSeleccionadosColor) {
//             this.productFilter = this.productFilter.concat(this.resultProductsFilter
//               .filter(x => x.color == itemColor.toUpperCase() && x.combo == 'N' && x.variedades.find(y => y.precioSO > 0)))
//             this.DatosProductos = this.productFilter
//             this.productos = this.DatosProductos
//           }
//           this.productFilter = [];
//         }
//         this.productos = [];
//         let uniques = Array.from(new Set(this.DatosProductos));
//         this.productos = uniques;
//         this.productosXProveedorEvent(this.productos, 'F');
//         this.buscarColoresPorProducto = this.listaFiltrosSeleccionadosProducto[0];
//         this._obtenerColoresFiltro();
//         this.DatosProductos = [];
//       }
//     });

//   }

//   public productosXProveedorEvent(productosListaFiltrada: Array<Caja>, valorFiltro: string) {
//     this.cajaArmada = this.appService.CajaArmada;
//     if (this.cajaArmada.tipoCaja != '') {
//       this.cajaSeleccionada = this.cajaArmada.tipoCaja;
//       this.appService.cajaSeleccionada
//     }
//     productosListaFiltrada = productosListaFiltrada.filter(x => x.variedades.find(y => y.precioSO > 0) && x.combo != 'S');
//     if (valorFiltro != "F") {
//       this.productosProveedor.push(...this.productos)
//       this.productos = productosListaFiltrada.sort(function (a, b) {
//         return a.variedades[0].nombreVariedad.localeCompare(b.variedades[0].nombreVariedad);
//       });
//     } else {
//       this.productos = productosListaFiltrada.sort(function (a, b) {
//         return a.variedades[0].nombreVariedad.localeCompare(b.variedades[0].nombreVariedad);
//       });
//     }

//     if (this.productos.length === 0) {

//       const dialogRef = this.dialog.open(DeleteComponent, {
//         data: { titulo: 'Caution', mensaje: "Sorry, we can't find a mix with the requested search", mensajeDos: 'Would you like to clean the filters ?' },
//         panelClass: 'delete-boxes'
//       });
//       dialogRef.afterClosed().subscribe(res => {
//         if (res) {
//           this._limpiarWebShop()
//         }
//         else {
//           var index = this.listaFiltrosSeleccionados.findIndex(x => x.valor === this.nombreValorProducto)
//           var indexProduco = this.listaFiltrosSeleccionadosProducto.findIndex(x => x === this.nombreValorProducto)
//           var indexColor = this.listaFiltrosSeleccionadosColor.findIndex(x => x === this.nombreValorProducto)
//           if (index !== -1) {
//             this.listaFiltrosSeleccionados.splice(index, 1)
//           }
//           if (indexProduco !== -1) {
//             this.listaFiltrosSeleccionadosProducto.splice(indexProduco, 1)
//           }
//           if (indexColor !== -1) {
//             this.listaFiltrosSeleccionadosColor.splice(indexColor, 1)
//           }
//           for (let index = 0; index < this.listaFiltros.length; index++) {
//             const element = this.listaFiltros[index];
//             if (element.valor === this.nombreValorProducto) {
//               element.seleccionado = 'N';
//               break;
//             }
//           }
//           this._validarFiltroProductos("PRO");
//         }
//       });
//     }
//     var uniques = Array.from(new Set(this.productos));
//     this.productos = uniques
//     if (valorFiltro != "F") {
//       for (let item of this.nombreVariedadSeleccionada) {
//         const indexProductoBuscar = this.productos.findIndex(x => x.variedades[0].nombreVariedad == item.valorVariedad && x.variedades[0].producto == item.valorProducto)
//         if (indexProductoBuscar != -1) {
//           this.productos.splice(indexProductoBuscar, 1)
//         }
//       }
//     }
//     const c: any = JSON.parse(localStorage.getItem('Usuario'));
//     this.appService.cajasConValor = []
//     if (this.listaFiltrosSeleccionados.length > 0) {
//       this.coloresWebShop = [];
//       this.coloresEncontrados = 0;
//     }
//     for (let index = 0; index < this.productos.length; index++) {
//       const element = this.productos[index];
//       if (this.listaFiltrosSeleccionados.length > 0) {
//         this.coloresWebShop = [];
//         this.coloresEncontrados = 0;
//         this.appService.getColoresWebShop().subscribe(colores => {
//           this.productos.forEach(item => {
//             this.coloresWebShop = this.coloresWebShop.concat(colores.filter(x => x.color == item.color))
//           });
//           var hash = {};
//           this.coloresWebShop = this.coloresWebShop.filter(function (current) {
//             var exists = !hash[current.color];
//             hash[current.color] = true;
//             return exists;
//           });
//         });
//         this.getColoresFiltrados();
//       }
//       element.tallasDeCaja = [];
//       element.tallasCajaCm = [];
//       element.tallasFinales = []
//       element.cajasDisponiblesMixtas = []
//       element.imagen = this.appService.urlImagen + element.imagenes[0]
//       element.stadingOrder = true
//       element.nombreProducto = element.variedades[0].nombreVariedad.toLowerCase() + " - " + element.variedades[0].producto.toLowerCase()

//       if (element.combo == 'S') {
//         element.totalPiezas = 0;
//         element.totalPrecio = 0.00;
//         element.totalPrecioJv = 0.00;
//       }

//       for (let x = 0; x < element.variedades.length; x++) {
//         const variedad = element.variedades[x];
//         variedad.cajasPorVariedad = [];
//         var buscarVariedadesPorTalla = element.variedades.filter(x => x.talla == variedad.talla);
//         if (buscarVariedadesPorTalla.length > 0) {
//           buscarVariedadesPorTalla.forEach(caja => {
//             variedad.cajasPorVariedad.push({
//               caja: caja.caja,
//               valor: caja.cantidadPorCajaMixta
//             })
//           });
//           var hash = {};
//           variedad.cajasPorVariedad = variedad.cajasPorVariedad.filter(function (productoCaja) {
//             var exists = !hash[productoCaja.caja];
//             hash[productoCaja.caja] = true;
//             return exists;
//           });
//         }
//         element.cajasDisponiblesMixtas.push(variedad.cantidadPorCajaMixta);
//         if (variedad.cantidadPorCaja > 0) {
//           element.tallasDeCaja.push(variedad.talla);
//           element.tallasCajaCm.push(variedad.tallaCm)
//           element.tallasFinales.push({ codigo: variedad.tallaCm, valor: variedad.talla })
//           if (element.combo == 'S') {
//             element.totalPiezas += variedad.cantidadPorCaja;
//           }
//           variedad.stadingOrder = false
//           variedad.cajaCombo = "N"
//           variedad.disabledBox = false
//           variedad.disabledBunches = false
//           element.botonBox = 'S'
//           element.botonBunches = 'S'
//           if (variedad.mostrarPrecioPorCaja == 'no') {
//             element.botonBunches = 'N'
//           }
//           if (variedad.seguridad == "si") {
//             variedad.disabled = true
//           }
//           for (let z = 0; z < variedad.precios.length; z++) {
//             let precio = variedad.precios[z];
//             let totalAux = 0;
//             let totalAuxJv = 0;
//             if (precio.tipoPrecio == "F") {
//               if (c.codigoClientePadre != undefined) {
//                 let porcentajeSumar = c.porcentajeSubcliente / 100;
//                 let sumarPrecio = precio.precio * porcentajeSumar
//                 let sumarPrecioJv = precio.precioJv * porcentajeSumar
//                 precio.precio += sumarPrecio
//                 precio.precioJv += sumarPrecioJv
//               }
//               if (precio.codigoTipoCliente === c.codigoTipoCliente) {
//                 variedad.precio = precio.precio;
//                 variedad.precioCliente = precio.precio
//                 variedad.precioJv = precio.precioJv
//                 if (element.combo == 'S') {
//                   variedad.cajaCombo = "S"
//                   totalAux = variedad.precio * variedad.cantidadPorCaja
//                   totalAuxJv = variedad.precioJv * variedad.cantidadPorCaja
//                   element.totalPrecio += totalAux
//                   element.totalPrecioJv += totalAuxJv
//                 }
//               }
//             }
//           }
//           if (variedad.cantidadPorCajaMixta !== undefined) {
//             this.appService.cajasConValor.push({
//               caja: variedad.caja,
//               valor: variedad.cantidadPorCaja
//             });
//           }
//         }
//       }
//       if (element.combo == 'N') {
//         var tallaOriginalMenor = element.tallasCajaCm[0];
//         var cajaOriginalMenor = [];
//         var tallasUnicas = Array.from(new Set(element.tallasCajaCm));
//         var tallaStr = element.tallasDeCaja[0];
//         var hash = {};
//         element.tallasFinales = element.tallasFinales.filter(function (current) {
//           var exists = !hash[current.valor];
//           hash[current.valor] = true;
//           return exists;
//         });
//         element.tallasCajaCm = tallasUnicas.sort(comparar);
//         element.tallasFinales.sort((a, b) => a.codigo + b.codigo);
//         element.tallaSeleccionada = tallaStr + '/';
//         if (element.variedades[0].producto == "ROSES" || element.variedades[0].producto == "GARDEN ROSES"
//           || element.variedades[0].producto == "MAYRAS GARDEN ROSES" || element.variedades[0].producto == "SPRAY ROSES") {
//           if (element.tallasFinales.filter(x => x.valor === "50 CM").length > 0) {
//             tallaOriginalMenor = 50;
//             tallaStr = "50 CM";
//             element.tallasDeCaja = [];
//             element.tallasDeCaja.push(tallaStr);
//             element.tallaSeleccionada = tallaStr + '/';
//           }
//         }
//         if (element.variedades[0].producto == "HYDRANGEA") {
//           if (element.tallasFinales.filter(x => x.valor === 'SUPER SELECT').length > 0) {
//             tallaOriginalMenor = 0;
//             tallaStr = 'SUPER SELECT';
//             element.tallasDeCaja = [];
//             element.tallasDeCaja.push(tallaStr);
//             element.tallaSeleccionada = tallaStr + '/';
//           }
//         }
//         var variedadBusqueda = [];
//         element.variedades.forEach(variedad => {
//           if (variedad.cantidadPorCaja > 0) {
//             if (variedad.tallaCm == tallaOriginalMenor && variedad.talla == tallaStr) {
//               variedadBusqueda.push(variedad);
//             }
//           }
//         });
//         variedadBusqueda.forEach(item => {
//           cajaOriginalMenor.push(item.cantidadPorCaja);
//         });
//         var minCaja = Math.min(...cajaOriginalMenor);
//         element.cajasDisponiblesMixtas = Array.from(new Set(element.cajasDisponiblesMixtas));
//         element.cajaSeleccionada = minCaja;
//         element.indexVariedadSeleccionada = this.tallaProducto(tallaStr, element, minCaja, "N");
//         element.indexPorTipoCaja = this.actualizarIndexPorTipoCaja(element, tallaStr);
//         var hash = {};
//         this.appService.cajasConValor = this.appService.cajasConValor.filter(function (parametro) {
//           var exists = !hash[parametro.caja];
//           hash[parametro.caja] = true;
//           return exists;
//         });
//       }
//     }
//     this.appService.busquedaGeneralColorWS = [];
//     function comparar(a, b) { return a - b; }
//     this.appService.busquedaGeneralWs = "";
//     this.appService.listaProductosBusquedaMezcla = [];
//     this.appService.listaProductosBusquedaMezcla = this.productos;
//     this.appService.realizoBusquedaProducto = false;
//     this._opcionesDeBusquedaWS();
//     this._opcionesDeBusquedaColoWSr();
//   }

//   public _opcionesDeBusquedaWS() {
//     this.appService.opcionesDeBusquedaWs = null;
//     if (this.appService.validarSoloRoses == "ROSES" ||
//       this.appService.validarSoloRoses == "GARDEN ROSES" ||
//       this.appService.validarSoloRoses == "MAYRAS GARDEN ROSES" ||
//       this.appService.validarSoloRoses == "SPRAY ROSES") {
//       this.appService.opcionesDeBusquedaWs = this.appService.controlBusquedaWs.valueChanges
//         .pipe(
//           startWith(''),
//           map(value => this._habilitarBusquedaQueryRoses(value))
//         );
//     } else {
//       this.appService.opcionesDeBusquedaWs = this.appService.controlBusquedaWs.valueChanges
//         .pipe(
//           startWith(''),
//           map(value => this._datosDeBusqueda(value))
//         );
//     }
//   }

//   public _habilitarProductosQueryRoses() {
//     var resultado = this.appService._getFiltroGeneralProductos(
//       this.appService.busquedaGeneralWs,
//       this.appService.listaProductosBusquedaMezcla,
//       'I',
//       this.appService.filtrosDeBusquedaGeneral);
//     if (resultado.length == 0) {
//       const dialogRef = this.dialog.open(DeleteComponent, {
//         data: {
//           titulo: 'Caution',
//           mensaje: "For " + this.appService.busquedaGeneralWs + " , we can offer the following possible substitutes",
//           mostrarBoton: true
//         },
//         panelClass: 'delete-boxes'
//       });
//       var colorProducto: string = ''
//       this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//         const cajas: Caja[] = JSON.parse(data.json);
//         var productoBuscar: Caja[] = cajas.filter(x => x.variedades[0].nombreVariedad == this.appService.busquedaGeneralWs && x.variedades.find(y => y.precioSO > 0))
//         if (productoBuscar.length > 0) {
//           productoBuscar.filter(x => colorProducto = x.color);
//           this._recomendarProductosQueryRoses(colorProducto);
//         }
//       });
//     } else {
//       this.appService.realizoBusquedaProducto = true;
//       this.productos = resultado;
//     }
//   }

//   public _recomendarProductosQueryRoses(color: string) {
//     this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//       const cajas: Caja[] = JSON.parse(data.json);
//       var productoQueryRoses: Caja[] = []
//       for (let codigos of this.appService.codigosProveedorFinales) {
//         productoQueryRoses = productoQueryRoses.concat(cajas
//           .filter(x => x.variedades[0].codigosProveedor.find(y => y === codigos)))
//       }
//       this.productos = productoQueryRoses.filter(x => x.color === color && x.variedades.find(y => y.precioSO > 0));
//       this.productosXProveedorEvent(this.productos, 'F')
//     });
//   }

//   private _datosDeBusqueda(value: string): string[] {
//     this.appService.listaFinalBusquedaWS = []

//     for (let item of this.appService.listaProductosBusquedaMezcla) {
//       this.appService.listaFinalBusquedaWS.push(item.variedades[0].producto)
//       this.appService.listaFinalBusquedaWS.push(item.variedades[0].nombreVariedad)
//     }
//     var hash = {};
//     this.appService.listaFinalBusquedaWS = this.appService.listaFinalBusquedaWS.filter(function (current) {
//       var exists = !hash[current] || false;
//       hash[current] = true;
//       return exists;
//     });
//     const filterValue = value.toLowerCase();
//     return this.appService.listaFinalBusquedaWS.filter(option => option.toLowerCase().includes(filterValue));

//   }

//   //Habilita busqueda query roses
//   private _habilitarBusquedaQueryRoses(value: string): string[] {

//     this.appService.activarQueryRoses = true

//     this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//       const cajas: Caja[] = JSON.parse(data.json);
//       for (let item of cajas) {
//         if (item.variedades[0].producto == "ROSES" ||
//           item.variedades[0].producto == "GARDEN ROSES" ||
//           item.variedades[0].producto == "MAYRAS GARDEN ROSES" ||
//           item.variedades[0].producto == "SPRAY ROSES") {
//           //this.appService.listaFinalBusquedaWS.push(item.variedades[0].producto)
//           this.appService.listaFinalBusquedaWS.push(item.variedades[0].nombreVariedad)
//         }
//       }
//     });

//     var hash = {};
//     this.appService.listaFinalBusquedaWS = this.appService.listaFinalBusquedaWS.filter(function (current) {
//       var exists = !hash[current] || false;
//       hash[current] = true;
//       return exists;
//     });
//     const filterValue = value.toLowerCase();
//     return this.appService.listaFinalBusquedaWS.filter(option => option.toLowerCase().includes(filterValue)).sort();

//   }

//   public _opcionesDeBusquedaColoWSr() {
//     var colorRepeat = []
//     this.appService.busquedaGeneralColorWS = []
//     this.appService.listaProductosBusquedaMezcla.forEach(item => {
//       if (item.combo != "S") {
//         if (item.color != '-') {
//           colorRepeat.push(item.color)
//         }
//       }
//     });
//     let uniquesColor = Array.from(new Set(colorRepeat));
//     this.appService.busquedaGeneralColorWS = uniquesColor
//     this.appService.busquedaGeneralColorWS.sort();
//     this.appService.limpiarFiltroColor = []

//   }

//   public _buscarPorColorListaFiltrada(color: string) {

//     if (this.appService.filtrosDeBusquedaGeneral.filter(x => x === color).length > 0) {
//       return;
//     }

//     this.appService.realizoBusquedaProducto = true
//     this.appService.filtrosDeBusquedaGeneral.push(this.appService.busquedaGeneralWs)
//     var resultado = this.appService._getFiltroGeneralProductos(
//       color,
//       this.appService.listaProductosBusquedaMezcla,
//       'D',
//       this.appService.filtrosDeBusquedaGeneral);
//     this.productos = resultado

//   }

//   public _setCajaArmada(cajaArmada: Caja) {
//     this.cajaArmada = cajaArmada;
//   }

//   public bigPicture(imagen) {
//     const dialogRef = this.dialog.open(DetailProductImageComponent, {
//       data: { image: imagen, editar: false },
//       panelClass: 'img-producto'
//     });
//     dialogRef.afterClosed().subscribe(res => {
//     });
//   }


//   public rutaSeleccionada() {
//     const dialogRef = this.dialog.open(DifferentdestinationComponent, {
//       data: { null: null, editar: false },
//       panelClass: 'app-differentdestination'
//     });
//     dialogRef.afterClosed().subscribe(res => {
//       if (res) {
//         this._seleccionarMarcacion()
//         this._obtnerCamiones()
//       }
//     });
//   }

//   public dutchDirect() {
//     const dialogRef = this.dialog.open(DifferentdestinationComponent, {
//       panelClass: 'dutch-direct',
//     });
//   }

//   public actualizarProductoPorCaja(caja: number, producto: Caja) {
//     this.tipoCajaInput(caja);
//     producto.cajaSeleccionada = caja;
//     producto.tallaSeleccionada = producto.tallaSeleccionada.replace('/', '');
//     var index = this.tallaProducto(producto.tallaSeleccionada, producto, producto.cajaSeleccionada, "S");
//     producto.indexVariedadSeleccionada = index;
//   }

//   public actualizarProductoPorTalla(talla: Talla, producto: Caja) {
//     this.tipoCajaInput(producto.cajaSeleccionada);
//     producto.tallaSeleccionada = talla.valor;
//     producto.tallaSeleccionada = producto.tallaSeleccionada.replace('/', '');
//     var index = this.tallaProducto(producto.tallaSeleccionada, producto, producto.cajaSeleccionada, "S");
//     producto.indexPorTipoCaja = this.actualizarIndexPorTipoCaja(producto, talla.valor);
//     producto.indexVariedadSeleccionada = index;
//   }

//   tallaProducto(talla: string, producto: Caja, cajaSeleccionada: number, cambioFiltro: string) {
//     var indexVariedad = 0;
//     const index: number = this.productos.indexOf(producto);
//     const productoSeleccionado = this.productos[index];
//     for (var x = 0; x < productoSeleccionado.variedades.length; x++) {
//       const variedad = productoSeleccionado.variedades[x];
//       variedad.cajasCantidad = [];
//       if (variedad.cantidadPorCaja > 0) {
//         var variedadABuscar = productoSeleccionado.variedades.filter(x => x.talla == talla && x.cantidadPorCaja > 0);
//         variedadABuscar.forEach(item => {
//           if (item.cantidadPorCaja > 0) {
//             variedad.cajasCantidad.push(item.cantidadPorCaja);
//           }
//         });
//         if (cambioFiltro == "S") {
//           for (var caja of variedad.cajasCantidad) {
//             if (variedad.cantidadPorCaja == caja && variedad.talla == talla) {
//               cajaSeleccionada = caja;
//             } else if (producto.cajaSeleccionada == caja && producto.tallaSeleccionada == talla) {
//               cajaSeleccionada = caja;
//               break;
//             }
//           }
//           if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
//             var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
//             variedad.cajasCantidad.splice(indexCaja, 1)
//             variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
//             //variedad.cajasCantidad.sort((a, b) => a - b)
//             indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//             break;
//           }
//         } else if (variedad.producto == "ROSES" || variedad.producto == "GARDEN ROSES"
//           || variedad.producto == "MAYRAS GARDEN ROSES" || variedad.producto == "SPRAY ROSES") {
//           if (productoSeleccionado.tallasFinales.filter(x => x.valor == "50 CM").length > 0) {
//             if (variedad.cantidadPorCaja > 0) {
//               if (variedad.talla == "50 CM" && variedad.cantidadPorCaja == cajaSeleccionada) {
//                 var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
//                 variedad.cajasCantidad.splice(indexCaja, 1)
//                 variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
//                 //variedad.cajasCantidad.sort((a, b) => a - b)
//                 indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//                 break;
//               }
//             }
//           } else if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
//             var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
//             variedad.cajasCantidad.splice(indexCaja, 1)
//             variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
//             //variedad.cajasCantidad.sort((a, b) => a - b)
//             indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//             break;
//           }
//         } else if (variedad.producto == 'HYDRANGEA') {
//           if (productoSeleccionado.tallasFinales.filter(x => x.valor == 'SUPER SELECT').length > 0) {
//             if (variedad.talla == 'SUPER SELECT' && variedad.cantidadPorCaja == cajaSeleccionada) {
//               var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
//               variedad.cajasCantidad.splice(indexCaja, 1);
//               variedad.cajasCantidad.splice(0, 0, cajaSeleccionada);
//               //variedad.cajasCantidad.sort((a, b) => a - b)
//               indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//               break;
//             }
//           } else if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
//             var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
//             variedad.cajasCantidad.splice(indexCaja, 1)
//             variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
//             //variedad.cajasCantidad.sort((a, b) => a - b)
//             indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//             break;
//           }
//         } else if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
//           var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
//           variedad.cajasCantidad.splice(indexCaja, 1)
//           variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
//           //variedad.cajasCantidad.sort((a, b) => a - b)
//           indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//           break;
//         }
//       }
//     }
//     return indexVariedad;
//   }

//   public actualizarIndexPorTipoCaja(producto, talla: string): number {

//     let indexCaja: number;
//     const index: number = this.productos.indexOf(producto);
//     const productoSeleccionado = this.productos[index];

//     var resultadoCajaEB = productoSeleccionado.variedades.filter(x => x.caja === "EB" && x.talla === talla && x.cantidadPorCaja > 0)
//     var resultadoCajaQB = productoSeleccionado.variedades.filter(x => x.caja === "QB" && x.talla === talla && x.cantidadPorCaja > 0)
//     var resultadoCajaHB = productoSeleccionado.variedades.filter(x => x.caja === "HB" && x.talla === talla && x.cantidadPorCaja > 0)


//     // si tiene qb selecciona el precio del bunche qb
//     if (resultadoCajaQB.length > 0) {
//       resultadoCajaQB.forEach(variedad => {
//         indexCaja = productoSeleccionado.variedades.indexOf(variedad);
//       });
//       return indexCaja;
//     }
//     // si tiene hb selecciona el precio del bunche hb
//     if (resultadoCajaHB.length > 0) {
//       resultadoCajaHB.forEach(variedad => {
//         indexCaja = productoSeleccionado.variedades.indexOf(variedad);
//       });
//       return indexCaja;
//     }
//     // si tiene eb selecciona el precio del bunche eb
//     if (resultadoCajaEB.length > 0) {
//       resultadoCajaEB.forEach(variedad => {
//         indexCaja = productoSeleccionado.variedades.indexOf(variedad);
//       });
//       return indexCaja;
//     }
//   }


//   public limpiarInput(evento) {
//     this.productos.forEach(element => {
//       element.cantidadCajas = null;
//     });
//   }

//   public tipoCajaInput(parametro) {
//     this.cajaInput = parametro
//   }

//   public locked() {
//     const dialogRef = this.dialog.open(DeleteComponent, {
//       data: {
//         titulo: 'Information',
//         mensaje: EnumMensajes.PRODUCTBLOCKED,
//         imagen: 'S',
//         mostrarBoton: true
//       },
//       panelClass: 'delete-boxes'
//     });
//   }

//   public _updateDate(event) {
//     this.appService.readFiles().subscribe(dataFound => {
//       this.appService.datePipe = new DatePipe("en-US");
//       this.appService.dateFormat = this.appService.datePipe.transform(event.value, 'yyyy-MM-dd')
//       this.appService.priceFound = dataFound.filter(x => this.appService.dateFormat >= x.fechaInicio.toString() && this.appService.dateFormat <= x.fechaFin.toString())
//       if (this.appService.priceFound.length > 0) {
//         for (let item of this.appService.priceFound) {
//           this.appService.urlJsonGeneral = item.urlJson;
//         }
//       }
//       else {
//         this.appService.urlJsonGeneral = "texto.json";
//       }
//       this.getproductosWebShop();
//       localStorage.setItem("_ls_urlJson", this.appService.urlJsonGeneral);
//       localStorage.setItem("_ls_dateConecctionStading", event.value);
//     });
//   }

//   public _openCalendar(picker: MatDatepicker<Date>) {
//     picker.open();
//   }

//   public buscarProductosListaFiltrada(busquedaConEnter, busquedaConBoton) {
//     if (this.appService.busquedaGeneralWs == '') { return; }
//     for (let item of this.listaFiltrosSeleccionados) {
//       if (this.appService.busquedaGeneralWs == item.valor) {
//         break;
//       }
//     }
//     if (busquedaConBoton == 'S') {
//       if (this.listaFiltrosFinales.filter(x => x.valor === this.appService.busquedaGeneralWs
//         || x.tipo === this.appService.busquedaGeneralWs).length == 0 && busquedaConBoton != null) {
//         const dialogRef = this.dialog.open(DeleteComponent, {
//           data: {
//             titulo: 'Alert',
//             mensaje: "Unfortunately we can't do a mix with the variety selected " + this.appService.busquedaGeneralWs,
//             mostrarBoton: true
//           },
//           panelClass: 'delete-boxes'
//         });
//         return;
//       }
//       this.appService.filtrosDeBusquedaGeneral.push(this.appService.busquedaGeneralWs);
//       var resultado: any;
//       if (this.appService.activarQueryRoses == true) {
//         this.appService.realizoBusquedaProducto = false
//         this._habilitarProductosQueryRoses();
//         return;
//       } else {
//         this.appService.realizoBusquedaProducto = true
//         resultado = this.appService._getFiltroGeneralProductos(
//           this.appService.busquedaGeneralWs,
//           this.appService.listaProductosBusquedaMezcla,
//           'I',
//           this.appService.filtrosDeBusquedaGeneral);
//       }
//       this.productos = resultado
//       return;
//     }

//     if (busquedaConEnter.keyCode === 13) {
//       if (this.listaFiltrosFinales.filter(x => x.valor === this.appService.busquedaGeneralWs
//         || x.tipo === this.appService.busquedaGeneralWs).length == 0 && busquedaConBoton != null) {
//         const dialogRef = this.dialog.open(DeleteComponent, {
//           data: {
//             titulo: 'Alert',
//             mensaje: "Unfortunately we can't do a mix with the variety selected " + this.appService.busquedaGeneralWs,
//             mostrarBoton: true
//           },
//           panelClass: 'delete-boxes'
//         });
//         return;
//       }
//       this.appService.filtrosDeBusquedaGeneral.push(this.appService.busquedaGeneralWs);
//       if (this.appService.activarQueryRoses == true) {
//         this.appService.realizoBusquedaProducto = false
//         this._habilitarProductosQueryRoses();
//         return;
//       } else {
//         this.appService.realizoBusquedaProducto = true
//         resultado = this.appService._getFiltroGeneralProductos(
//           this.appService.busquedaGeneralWs,
//           this.appService.listaProductosBusquedaMezcla,
//           'I',
//           this.appService.filtrosDeBusquedaGeneral);
//       }
//       this.productos = resultado
//       return;
//     }

//   }

//   public _activarRowBox(producto: Caja) {
//     if (this.cajaArmada.variedades.length == 0) {
//       producto.variedades[0].disabledBox = false;
//       producto.variedades[0].disabledBunches = true;
//       producto.botonBox = 'S';
//       producto.botonBunches = 'N';
//     }
//   }

//   public _activarRowBunches(producto: Caja) {
//     producto.variedades[0].disabledBox = true;
//     producto.variedades[0].disabledBunches = false;
//     producto.botonBox = 'N';
//     producto.botonBunches = 'S';
//   }

//   public _eliminarFitros() {
//     this.appService.showNabvarCardActive = true;
//     this._limpiarWebShop();
//   }

//   public _getCategoriasAutocomplete() {
//     this.filtrosOpcionesCat = null;
//     this.filtrosOpcionesCat = this.categoriasControl.valueChanges
//       .pipe(
//         startWith(''),
//         map(value => this._filtrosCategoriasAuto(value))
//       );
//   }

//   private _filtrosCategoriasAuto(value: string): string[] {
//     this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//       const cajas: Caja[] = JSON.parse(data.json);
//       this.categorias = [];
//       cajas.forEach(x => {
//         if (x.variedades.find(y => y.precioSO > 0)) {
//           this.categorias.push(x.variedades[0].producto.trim());
//         }
//       });
//       var hash = {};
//       this.categorias = this.categorias.filter(function (current) {
//         var exists = !hash[current] || false;
//         hash[current] = true;
//         return exists;
//       });
//     });
//     const filterValue = value.toLowerCase();
//     return this.categorias.filter(option => option.toLowerCase().includes(filterValue));
//   }

//   public _getColoresAutocomplete() {
//     this.filtrosOpcionesColores = null
//     this.filtrosOpcionesColores = this.coloresControl.valueChanges
//       .pipe(
//         startWith(''),
//         map(value => this._filtrosColoresAutocomplete(value))
//       );
//   }

//   private _filtrosColoresAutocomplete(value: string): string[] {
//     this.colores = []
//     this.colors.forEach(x => {
//       this.colores.push(x.color)
//     })
//     var hash = {};
//     this.colores = this.colores.filter(function (current) {
//       var exists = !hash[current] || false;
//       hash[current] = true;
//       return exists;
//     });
//     const filterValue = value.toLowerCase();
//     return this.colores.filter(option => option.toLowerCase().includes(filterValue));
//   }


//   public _verFiltros(tipoFiltro) {
//     if (tipoFiltro == 'S') {
//       this.mostrarFiltrosAll = true
//       this.getColoresWebShop(100)
//     } else {
//       this.mostrarFiltrosAll = false
//       this.getColoresWebShop(5)
//     }
//   }

//   public _editarCajaBunches(variedad, tipoAgrega) {
//     const dialogRef = this.dialog.open(EditComponent, {
//       data: { caja: [variedad], tipoAgrega: tipoAgrega, verLista: 'N' },
//       width: '500px',
//       panelClass: 'edit-productos'
//     });
//     dialogRef.afterClosed().subscribe(res => {
//       if (res != null && res.tipoAccion == 'D') {
//         this.eliminarVariedad(res.nuevaVariedad)
//       }
//       if (res != null && res.tipoAccion == 'E') {
//         this._editarVarieadesSeleccionadas(res)
//       }
//     });
//   }

//   public _stadingInfo() {
//     const dialogRef = this.dialog.open(StadingInformationComponent, {
//       data: { data: null, editar: false },
//       panelClass: 'stading-info'
//     });
//     dialogRef.afterClosed().subscribe(respuesta => {
//       if (respuesta != null) {
//         this.actualizarDatos(respuesta);
//         this.appService.guardarShippingInformation(
//           this.marcacionSleccionada,
//           this.camionSeleccionado,
//           this.destinoSeleccionado,
//           EnumPagina.STA);
//       }
//     });
//   }

//   public _verListaItems() {
//     const dialogRef = this.dialog.open(EditComponent, {
//       data: { caja: this.cajaArmada.variedades, tipoAgrega: 'B', verLista: 'S' },
//       width: '1100px',
//       panelClass: 'edit-productos'
//     });
//     dialogRef.afterClosed().subscribe(res => {
//       if (res != null && res.tipoAccion == 'D') {
//         this.eliminarVariedad(res.nuevaVariedad)
//       }
//       if (res != null && res.tipoAccion == 'E') {
//         this._editarVarieadesSeleccionadas(res)
//       }
//     });
//   }

//   public _buscarCategoriasConFiltro(evento, tipoBusqueda: string) {
//     if (this.valorBusquedaCat != '') {
//       if (tipoBusqueda == 'N') {
//         if (evento.keyCode == 13) {
//           this.agregarFiltro({ tipo: '', valor: this.valorBusquedaCat, seleccionado: '' })
//         }
//         return;
//       }

//       if (tipoBusqueda == 'S') {
//         this.agregarFiltro({ tipo: '', valor: this.valorBusquedaCat, seleccionado: '' })
//       }
//     }

//   }

//   public _buscarColoresConFiltro(evento, tipoBusqueda: string) {
//     if (this.valorBusquedaCol != '') {
//       if (tipoBusqueda == 'N') {
//         if (evento.keyCode == 13) {
//           this.changeColor(this.valorBusquedaCol)
//         }
//         return;
//       }
//       if (tipoBusqueda == 'S') {
//         this.changeColor(this.valorBusquedaCol)
//       }
//     }
//   }

//   public _informationDialog(marcacion, tipo) {
//     let camionNombre = '';
//     if (this.camionSeleccionado == undefined) {
//       camionNombre = 'SN';
//     } else {
//       camionNombre = this.camionSeleccionado.nombre;
//     }
//     const dialogRef = this.dialog.open(InformationComponent, {
//       data: { data: 'S', marcacion: marcacion, camion: camionNombre, pagina: 'STD', tipo: tipo },
//       panelClass: 'information'
//     });
//     dialogRef.afterClosed().subscribe(respuesta => {
//       if (respuesta != null) {
//         this.actualizarDatos(respuesta);
//         this.appService.guardarShippingInformation(
//           this.marcacionSleccionada,
//           this.camionSeleccionado,
//           this.destinoSeleccionado,
//           EnumPagina.STA);
//       }
//     });
//   }

//   public _eliminarTodasVariedades() {
//     this._limpiarWebShop();
//   }

//   public _editarVarieadesSeleccionadas(datos) {
//     const indexVariedadARemplazar = this.cajaArmada.variedades.indexOf(datos.variedadRespaldo);
//     if (indexVariedadARemplazar != -1) {
//       this.cajaArmada.variedades.splice(indexVariedadARemplazar, 1);
//       this.cajaArmada.variedades.splice(indexVariedadARemplazar, 0, datos.nuevaVariedad);
//     }
//   }

//   public actualizarDatos(respuesta) {
//     this.camionSeleccionado = JSON.parse(sessionStorage.getItem('CamionStading'));
//     this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("DestinoStading"));
//     this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("MarcacionStading"));
//     this._getCalcularDiaEntrega();
//   }

//   _verFiltrosCategorias(listaFiltros) {
//     const dialogRef = this.dialog.open(FiltersComponent, {
//       data: { filtros: listaFiltros, tipoFiltro: 'P' },
//       panelClass: 'filters'
//     });
//     dialogRef.afterClosed().subscribe(res => {
//       if (res != null || res != undefined) {
//         for (let valor of res) {
//           this.agregarFiltro({ tipo: '', valor: valor.toLowerCase(), seleccionado: '' });
//         }
//       }
//     });
//   }

//   ngDoCheck() {
//     if (this.appService.activarEdicionVariedad) {
//       this.appService.activarEdicionVariedad = false;
//       this.appService._botonMenuSeleccionado(this.router.url);
//       this._iniciarEdicionBunches();
//     }
//     if (this.appService.activarAgregarBunches) {
//       this.appService.activarAgregarBunches = false;
//       this.appService._botonMenuSeleccionado(this.router.url);
//       this._agregarMasBunchesCajaCompleta();
//     }
//   }

//   public _iniciarEdicionBunches() {
//     if (this.cajaArmada.variedades.length > 0) {
//       this._limpiarWebShop();
//     }
//     setTimeout(() => {
//       const indexCajaAEditar = this.appService.Data.cartListCaja.indexOf(this.appService.datosEdicionVariedad.caja[0])
//       if (indexCajaAEditar != -1) {
//         this.appService.cajaSeleccionada = this.appService.Data.cartListCaja[indexCajaAEditar].tipoCaja
//         this.appService.Data.cartListCaja[indexCajaAEditar].variedades.splice(this.appService.datosEdicionVariedad.indexVariedad, 1)
//         this.appService.CajaArmada.variedades = this.appService.Data.cartListCaja[indexCajaAEditar].variedades;
//         this.appService._calcularPorcentajeCajaEditada(indexCajaAEditar);
//         this.appService.CajaArmada.totalProcentajeLleno = Math.round(this.appService.CajaArmada.totalProcentajeLleno);
//         const dialogRef = this.dialog.open(NoteBoxesComponent, {
//           data: { variedad: this.appService.datosEdicionVariedad.variedad, condicion: 'EDIT' },
//           panelClass: 'note-boxes'
//         });
//         dialogRef.afterClosed().subscribe(res => {
//           this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//             const cajas: Caja[] = JSON.parse(data.json);
//             this.cajaArmada.variedades = this.appService.Data.cartListCaja[indexCajaAEditar].variedades
//             this.cajaArmada.totalCantidadPorBunche = 0
//             this.appService.Data.cartListCaja[indexCajaAEditar].variedades.forEach(variedad => {
//               this.cajaArmada.totalCantidadPorBunche += variedad.cantidadPorBunche;
//             });
//             this.appService.Data.cartListCaja.splice(indexCajaAEditar, 1);
//             this.appService.Data.totalCartCount--;
//             this.appService.addCartLocalStorage();
//             this.appService.codigosProveedorFinales = this.appService.datosEdicionVariedad.codigosProveedor
//             var buscarProductos: Caja[] = [];
//             for (let codigos of this.appService.codigosProveedorFinales) {
//               buscarProductos = buscarProductos.concat(cajas
//                 .filter(x => x.variedades[0].codigosProveedor.find(y => y === codigos)));
//             }
//             var eliminarRepetidos = Array.from(new Set(buscarProductos));
//             buscarProductos = eliminarRepetidos;
//             var resultado = this._iniciarBusquedaProductosPorEstado(
//               buscarProductos,
//               this.appService.datosEdicionVariedad.variedad[0].sePuedeMezclar,
//               this.appService.datosEdicionVariedad.variedad[0].producto,
//             );
//             this.appService.activarBusquedaCuandoElimina = true;
//             this.appService.listaProductosBusquedaMezcla = resultado;
//             this._setListaFiltrosPorCambioEstado(resultado);
//             this._opcionesDeBusquedaColoWSr();
//             this._opcionesDeBusquedaCuandoEliminaVariedad();
//             this._getProductosFiltro();
//             this._filterOptions();
//             this._getCategoriasAutocomplete();
//             this._obtenerColoresFiltro();
//             this._getColoresAutocomplete();
//             return;
//           });
//         });
//       }
//     }, 20);

//   }

//   _recuperarProductosPorCambioDeMenu() {
//     this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//       const cajas: Caja[] = JSON.parse(data.json);
//       var codigoProveedor: number[] = [];
//       var variedad: Variedad[] = [];
//       for (let i = 0; i < this.appService.CajaArmada.variedades.length; i++) {
//         if (i == this.appService.CajaArmada.variedades.length - 1) {
//           codigoProveedor = this.appService.CajaArmada.variedades[i].codigosProveedor
//           variedad = [this.appService.CajaArmada.variedades[i]]
//         }
//       }
//       this.appService.codigosProveedorFinales = codigoProveedor;
//       var buscarProductos: Caja[] = [];
//       for (let codigos of this.appService.codigosProveedorFinales) {
//         buscarProductos = buscarProductos.concat(cajas.filter(x => x.variedades[0].codigosProveedor.find(y => y === codigos)))
//       }
//       buscarProductos = buscarProductos.filter(x => x.variedades.find(y => y.precioSO > 0));
//       let eliminarRepetidos = Array.from(new Set(buscarProductos));
//       buscarProductos = eliminarRepetidos;
//       var resultado = this._iniciarBusquedaProductosPorEstado(
//         buscarProductos,
//         variedad[0].sePuedeMezclar,
//         variedad[0].producto
//       );
//       this.appService.activarBusquedaCuandoElimina = true;
//       this.appService.listaProductosBusquedaMezcla = resultado;
//       this._setListaFiltrosPorCambioEstado(resultado);
//       this._opcionesDeBusquedaColoWSr();
//       this._opcionesDeBusquedaCuandoEliminaVariedad();
//       this._getProductosFiltro();
//       this._filterOptions();
//       this._getCategoriasAutocomplete()
//       this._obtenerColoresFiltro();
//       this._getColoresAutocomplete();
//     });
//   }

//   _iniciarBusquedaProductosPorEstado(buscarProductos: Caja[],
//     sePuedeMezclar: string, nombreProducto: string): Caja[] {
//     const cliente: ClienteDTO = JSON.parse(localStorage.getItem('Usuario'));
//     this.productos = [];
//     this.productos = this.appService._recalcularPreciosDeProductos(
//       buscarProductos,
//       cliente,
//       '/stading',
//       sePuedeMezclar,
//       nombreProducto,
//       buscarProductos,
//       true
//     );
//     var uniques = Array.from(new Set(this.productos));
//     this.productos = uniques;
//     this.productos = this.productos.sort(function (a, b) {
//       return a.variedades[0].nombreVariedad.localeCompare(b.variedades[0].nombreVariedad);
//     });
//     return this.productos;
//   }

//   _agregarMasBunchesCajaCompleta() {
//     const indexCajaAEditar = this.appService.Data.cartListCaja.indexOf(this.appService.datosEdicionVariedad.caja[0]);
//     if (indexCajaAEditar != -1) {
//       this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
//         const cajas: Caja[] = JSON.parse(data.json);
//         this.cajaArmada.variedades = this.appService.Data.cartListCaja[indexCajaAEditar].variedades;
//         this.appService.CajaArmada.variedades = this.appService.Data.cartListCaja[indexCajaAEditar].variedades;
//         this.cajaArmada.totalCantidadPorBunche = 0;
//         this.appService.Data.cartListCaja[indexCajaAEditar].variedades.forEach(variedad => {
//           this.cajaArmada.totalCantidadPorBunche += variedad.cantidadPorBunche;
//         });
//         this.appService.cajaSeleccionada = this.appService.actualizarCajaSeleccionada(this.appService.datosEdicionVariedad.caja[0].tipoCaja);
//         this.appService._calcularPorcentajeCajaEditada(indexCajaAEditar);
//         this.appService.CajaArmada.totalProcentajeLleno = Math.round(this.appService.CajaArmada.totalProcentajeLleno);
//         this.appService.Data.cartListCaja.splice(indexCajaAEditar, 1);
//         this.appService.Data.totalCartCount--;
//         this.appService.addCartLocalStorage();
//         this.appService.codigosProveedorFinales = this.appService.datosEdicionVariedad.codigosProveedor;
//         var buscarProductos: Caja[] = [];
//         for (var codigos of this.appService.codigosProveedorFinales) {
//           buscarProductos = buscarProductos.concat(cajas.filter(x => x.variedades[0].codigosProveedor.find(y => y === codigos)));
//         }
//         var eliminarRepetidos = Array.from(new Set(buscarProductos));
//         buscarProductos = eliminarRepetidos;
//         var resultado = this._iniciarBusquedaProductosPorEstado(
//           buscarProductos,
//           this.appService.datosEdicionVariedad.variedad[0].sePuedeMezclar,
//           this.appService.datosEdicionVariedad.variedad[0].producto,
//         );
//         this.appService.activarBusquedaCuandoElimina = true;
//         this.appService.listaProductosBusquedaMezcla = resultado;
//         this._setListaFiltrosPorCambioEstado(resultado);
//         this._opcionesDeBusquedaColoWSr();
//         this._opcionesDeBusquedaCuandoEliminaVariedad();
//         this._getProductosFiltro();
//         this._filterOptions();
//         this._getCategoriasAutocomplete();
//         this._obtenerColoresFiltro();
//         this._getColoresAutocomplete();
//       });
//     }
//   }

//   _setListaFiltrosPorCambioEstado(producto: Caja[]) {
//     this.listaFiltrosFinales = [];
//     this.listaFiltros = [];
//     for (let item of producto) {
//       this.listaFiltros.push({ tipo: item.variedades[0].nombreVariedad.toLowerCase(), valor: item.variedades[0].producto.toLowerCase(), seleccionado: 'N' })
//       this.listaFiltrosFinales.push({ tipo: item.variedades[0].nombreVariedad, valor: item.variedades[0].producto, seleccionado: null })
//     }
//     var uniques = Array.from(new Set(this.listaFiltrosFinales));
//     this.listaFiltrosFinales = uniques;
//   }

//   public _opcionesDeBusquedaCuandoEliminaVariedad() {
//     this.appService.opcionesDeBusquedaWs = null
//     this.appService.opcionesDeBusquedaWs = this.appService.controlBusquedaWs.valueChanges
//       .pipe(
//         startWith(''),
//         map(value => this._busquedaListaVariedadEliminada(value))
//       );
//   }

//   private _busquedaListaVariedadEliminada(value: string): string[] {
//     this.appService.listaFinalBusquedaWS = []
//     for (let item of this.appService.listaProductosBusquedaMezcla) {
//       this.appService.listaFinalBusquedaWS.push(item.variedades[0].producto)
//       this.appService.listaFinalBusquedaWS.push(item.variedades[0].nombreVariedad)
//     }
//     var hash = {};
//     this.appService.listaFinalBusquedaWS = this.appService.listaFinalBusquedaWS.filter(function (current) {
//       var exists = !hash[current] || false;
//       hash[current] = true;
//       return exists;
//     });
//     const filterValue = value.toLowerCase();
//     return this.appService.listaFinalBusquedaWS.filter(option => option.toLowerCase().includes(filterValue));

//   }

//   _limpiarWebShop() {
//     this.appService.codigosProveedorFinales = [];
//     this.appService.codigosProveedorRespaldo = [];
//     this.appService.listaProductosBusquedaMezcla = [];
//     this.appService.realizoBusquedaProducto = false;
//     this.appService.CajaArmada.totalProcentajeLleno = 0;
//     this.appService.cajaSeleccionada = "EB";
//     this.appService.cajasConValor = [];
//     this.appService.CajaArmada.totalPiezas = 0;
//     this.appService.busquedaGeneralWs = "";
//     this.appService.activarQueryRoses = false;
//     this.appService.resultadoBusqueda = false;
//     this.appService.mostrarPromociones = false;
//     this.appService.CajaArmada.variedades = [];
//     this.appService.activarBusquedaCuandoElimina = false;
//     this.productosProveedor = [];
//     this.nombreVariedadSeleccionada = [];
//     this.listaFiltrosSeleccionados = [];
//     this.listaFiltrosSeleccionadosColor = [];
//     this.listaFiltrosSeleccionadosProducto = [];
//     this.listaFiltrosFinales = [];
//     this.cajaArmada.variedades = [];
//     this.cajaArmada.totalCantidadPorBunche = 0;
//     this.mensajeValorProducto = false;
//     this.filterValue = "";
//     this.valorBusquedaCat = "";
//     this.valorBusquedaCol = "";
//     this.nombreVariedadSeleccionada = [];
//     this.productoNoEncontrado = false;
//     this.mostrarFiltrosAll = false;
//     this.filtroRepetido = "";
//     this.productos = [];
//     this.DatosProductos = [];
//     this.buscarColoresPorProducto = "";
//     this.page = 1;
//     this.paginaProductos = 1;
//     this.itemsPorPagina = 96;
//     this.pageNumbers = [24, 48, 96, 600];
//     this.mensajeTropical = EnumMensajes.EMPTY;
//     window.scrollTo(0, 0);
//     this.getproductosWebShop();
//   }

//   _cambiarPaginacion(pagina) {
//     this.itemsPorPagina = pagina;
//   }

//   _tropicalFlowers() {
//     this.appService.showNabvarCardActive = false;
//     this.mensajeTropical = EnumMensajes.TROPICAL;
//     this.agregarFiltro({ tipo: '', valor: "tropical flowers foliage magic", seleccionado: '' });
//   }

//   cambiarPagina(event) {
//     this.paginaProductos = event;
//     window.scrollTo(0, 180);
//   }

//   getInfoShipping() {
//     const cli = JSON.parse(localStorage.getItem('Usuario'));
//     this.appService.getInfoShipping(parseInt(cli.codigoPersona), EnumPagina.STA).subscribe(data => {
//       if (data[0].informacion != undefined) {
//         var info = JSON.parse(data[0].informacion);
//         this.marcacionSleccionada = info.marcacion;
//         this.camionSeleccionado = info.camion;
//         this.destinoSeleccionado = info.destino;
//         sessionStorage.setItem("MarcacionStading", JSON.stringify(this.marcacionSleccionada));
//         sessionStorage.setItem("CamionStading", JSON.stringify(this.camionSeleccionado));
//         sessionStorage.setItem("DestinoStading", JSON.stringify(this.destinoSeleccionado));
//       }
//     });
//   }

//   _orderCaja(cajas) {
//     cajas.sort(function (a, b) {
//       return a - b;
//     });
//     return cajas;
//   }

// }

