// import { NavigationStart} from '@angular/router';
// import { Filtro, Marcacion, Destino, Camion, SeasonPrices, Talla, FiltroColores, Colores, Etiquetas, Busqueda, PaginadorProducto, Productos } from './../../app.modelsWebShop';
// import { Component, OnInit, ViewChild, HostListener, Input, Pipe, ElementRef, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
// import { AppService } from '../../app.service';
// import { ClienteDTO } from '../../app.models';
// import { FormBuilder, FormControl } from '@angular/forms';
// import { Caja, Variedad } from 'src/app/app.modelsWebShop';
// import { ActivatedRoute, Router } from '@angular/router';
// import { MatDialog, MatSnackBar, MatDatepicker } from '@angular/material';
// import { ProductsMessageComponent } from 'src/app/shared/products-carousel/products-message/products-message.component';
// import { DetailProductImageComponent } from 'src/app/shared/products-carousel/detail-product-image/detail-product-image.component';
// import { DifferentdestinationComponent } from '../differentdestination/differentdestination.component';
// import { ProductDetallesDialogComponent } from 'src/app/shared/products-carousel/product-detalles-dialog/product-detalles-dialog.component';
// import { Observable } from 'rxjs';
// import { filter, map, startWith } from 'rxjs/operators';
// import { DatePipe } from '@angular/common';
// import { InformationComponent } from '../popus/information/information.component';
// import { FiltersComponent } from '../popus/filters/filters.component';
// import { AddedComponent } from '../popus/added/added.component';
// import { EditComponent } from '../popus/edit/edit.component';
// import { NoteBoxesComponent } from '../popus/note-boxes/note-boxes.component';
// import { DeleteComponent } from '../popus/delete/delete.component';
// import { EnumMensajes, EnumPagina, EnumSinDatos, EnumSiNo, EnumTipoCaja } from 'src/app/enumeration/enumeration';
// import { NgxSpinnerService } from "ngx-spinner";
// import { SharedService } from 'src/app/shared/service/shared.service';
// import { IncreaseboxComponent } from '../popus/increasebox/increasebox.component';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss']
// })
// @Pipe({
//   name: 'dateFormatPipe',
// })
// export class HomeComponent implements OnInit {
//   @ViewChild('sidenav') sidenav: any;
//   @Input() variedad: Variedad;
//   sidenavOpen = true;
//   sidenavClose = true;
//   sub: any;
//   viewCol = 25;
//   colors: FiltroColores[] = [];
//   page: any;
//   filtroProveedor: string;
//   date: any;
//   dateMostrar = 'SELECT YOUR SHIPPING DATE';
//   productos: Array<Caja> = [];
//   productosPaginados: Array<Caja> = [];
//   cajaArmada: Caja;
//   listaFiltrosSeleccionados: Filtro[] = [];
//   listaFiltrosSeleccionadosColor = [];
//   listaFiltrosSeleccionadosProducto = [];
//   listaFiltros: Filtro[] = [];
//   filtroRepetido: string = '';
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
//   cajaInput = null;
//   myControl = new FormControl();
//   filteredOptions: Observable<string[]>;
//   nameVariety: string[] = [];
//   filterValue = '';
//   // resultProductsFilter: Array<Caja> = [];
//   dateNowInit: string;
//   listaFiltrosFinales: Array<Filtro> = [];
//   priceFound: Array<SeasonPrices> = [];
//   webMessageDate: Array<any> = [];
//   datePipe;
//   dateFormat;
//   messagePublishTitle: string = '';
//   messagePublish: string = '';
//   etiquetaLimited: string = '';
//   productosProveedor: Array<Caja> = [];
//   nombreVariedadSeleccionada = [{ valorVariedad: '', valorProducto: '' }];
//   nombreValorProducto: string;
//   mensajeValorProducto: boolean;
//   buscarColoresPorProducto: string = '';
//   filtroAnterior: string = '';
//   categorias: string[] = [];
//   categoriasControl = new FormControl();
//   filtrosOpcionesCat: Observable<string[]>;
//   colores: string[] = [];
//   coloresControl = new FormControl();
//   filtrosOpcionesColores: Observable<string[]>;
//   valorBusquedaCol: string = '';
//   valorBusquedaCat: string = '';
//   mostrarFiltrosAll: boolean = false;
//   productoNoEncontrado: boolean = false;
//   pageNumbers = [];
//   itemsPorPagina: number;
//   paginaProductos = 1;
//   coloresWebShop: Colores[] = [];
//   etiquetasWebshop: Etiquetas[] = [];
//   coloresEncontrados: number = 0;
//   dias = [];
//   diaSemana = '';
//   zonaHorariaEcuador;
//   horarioDeEcuador = new Date();
//   dateNews = new Date();
//   mensajeTropical = EnumMensajes.EMPTY;
//   keyProducto = "arg";
//   listItemsSarch: Busqueda[] = [];
//   interval: any;
//   actions = [];
//   contadorTropicales = 0;
//   // Totales y respueta WebService
//   totalRegistros = 0;

//   paginado = new PaginadorProducto();

//   isLoading = false

//   isLoadingOne = false

//   logoCliente: string

//   previousUrl: string = null;
//   currentUrl: string = null;

//   productosWebShopFilter: Productos[] = [];

//   usuario: any;

//   productQuantity = 10;

//   isLoadingDate = false;

//   @Output() seleccionaCamionPo = new EventEmitter<void>();

//   constructor(public appService: AppService, private activatedRoute: ActivatedRoute,
//     public dialog: MatDialog, public router: Router, public formBuilder: FormBuilder,
//     public snackBar: MatSnackBar, private spinner: NgxSpinnerService, private sharedService: SharedService,
//     private el: ElementRef, private cdr: ChangeDetectorRef) {


//     this.sharedService.dataProductUpdate.subscribe((data: any) => {
//       this.productosPaginados = []
//       this.productos = []
//       this.obtenerProductosPorTemporada();
//     });

//     this.obtenerMensaje();
//     this.obtenerEtiquetas();

//     this.usuario = JSON.parse(localStorage.getItem('Usuario'));

//     this.spinner.show();
//     setTimeout(() => {
//       this.spinner.hide();
//     }, 15000);

//     this._getCalcularDiaEntrega();

//     this.itemsPorPagina = 20; //Para Pruebas original 100
//     this.pageNumbers = [20];

//     this._iniciarPaginador();
//     this._iniciarProductosParaFiltros();


//     this.clienteLogueado();
//     this.seleccionarMarcacion();
//     this.obtenerTodosCamiones();
//     //this.obtenerCamiones();
//     this.obtenerFiltroOrdenar();

//     this.appService.contadorCarrito();
//     this.appService._botonMenuSeleccionado(this.router.url);
//     //this.itemsToSearch();
//     router.events
//       .pipe(filter(event => event instanceof NavigationStart))
//       .subscribe((event: NavigationStart) => {
//         // console.log("event home:", event.url);
//         if (event.navigationTrigger == 'popstate' && event.url == '/home')
//           //console.log('prev:', event);
//           this._limpiarWebShop();

//       });
//   }

//   ngOnInit() {

//     this.activatedRoute.params.subscribe(params => {
//       const valor = params['edit'];
//       if ("edit-mix-box" == valor) {
//         this.productosXProveedorEvent("valor")
//       }
//     });

//     this.isLoadingOne = true;

//     this.filtroProveedor = '';
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
//     this.buscarColoresPorProducto = '';

//     this.appService.nameEmitter.subscribe(name => {
//       if (name == 'hub') { this._eliminarFitros(); }
//     });
//     this._verFiltros('S');

//     var selectContinueBuying = sessionStorage.getItem('selectContinueBuying') == undefined ? 'N' : sessionStorage.getItem('selectContinueBuying');
//     setTimeout(() => {
//       if (this.appService.Data.cartListCaja.length > 0 && selectContinueBuying == 'N') {

//         const dialogRef = this.dialog.open(DeleteComponent, {
//           data: {
//             titulo: 'Welcome! We are happy to have you back!',
//             mensaje: 'There are pending items in your cart.',
//             mensajeDos: 'Would you like to complete your existing order or start over?',
//             imagen: 'C',
//             starbuttons: 'S'
//           },
//           panelClass: 'delete-boxes'
//         });
//         dialogRef.afterClosed().subscribe(res => {
//           if (res || res == undefined) {
//             sessionStorage.setItem('selectContinueBuying', 'S');
//             return;
//           }
//           else {
//             sessionStorage.setItem('selectContinueBuying', 'S');
//             this.appService._removerOrdenPorTipoCaja(this.appService.Data.cartListCaja);
//             this.appService.Data.totalPrice = 0;
//             this.appService.totalWithTruckiBoxes = 0;
//             this.appService.totalTuckingBoxes = 0;
//             this.appService.Data.cartListCaja = [];
//             localStorage.removeItem("Data");
//             return;
//           }
//         });


//       }
//     }, 4000);

//     if (this.appService.cambioMenu == false) {
//       this.obtenerProductosPorTemporada();
//     }
//   }

//   @HostListener('window:scroll', ['$event'])
//   onScroll() {
//     const scrollPosition = window.scrollY + window.innerHeight;
//     const docHeight = this.el.nativeElement.offsetHeight;

//     if (!this.isLoading && scrollPosition >= (docHeight * 0.65)) {
//       if ((this.productosPaginados.length < this.totalRegistros)) {
//         this.loadMoreData();
//       }
//     }
//   }

//   loadMoreData() {
//     this.paginado.pagina++
//     this.getproductosWebShop()
//   }


//   _iniciarPaginador() {
//     this.datePipe = new DatePipe("en-US");
//     this.paginado.fecha = this.datePipe.transform(this.date.value, 'yyyy-MM-dd');
//     this.paginado.numRegistros = this.pageNumbers[0];
//     this.paginado.isTropical = false
//     this.paginado.colores = []
//     this.paginado.filtroProducto = []
//     this.paginado.isPromo = false
//     this.paginado.orden = 'PRO'
//   }


//   _iniciarProductosParaFiltros() {
//     this.appService.getProductosWebShopParaFiltros(this.paginado).subscribe(data => {
//       this.productosWebShopFilter = JSON.parse(data.json);
//       this.productosWebShopFilter.forEach(item => item.select == EnumSiNo.N)
//     })

//   }

//   _pageNotMove() {
//     window.scrollTo(0, 0);
//   }

//   ngOnDestroy() {
//     //this.sharedService.dataProductUpdate.unsubscribe();
//     //this.sub.unsubscribe();
//     if (this.interval) {
//       clearInterval(this.interval);
//     }
//   }

//   @HostListener('window:resize')
//   onWindowResize(): void {
//     (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
//     (window.innerWidth < 960) ? this.sidenavClose = false : this.sidenavClose = true;
//   }

//   seleccionarMarcacion() {
//     //C = CLIENTE,  S = SUBCLIENTE, 
//     var usuario = JSON.parse(localStorage.getItem("Usuario"))
//     if (usuario.codigoClientePadre != undefined || usuario.codigoClientePadre != null) {
//       if (sessionStorage.getItem('Marcacion') == 'undefined' || sessionStorage.getItem('Marcacion') == null) {
//         const cli = JSON.parse(localStorage.getItem('Usuario'));
//         this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'S').subscribe((data: any) => {
//           this.subclientes = data;
//           //this.getInfoShipping();
//           if (this.subclientes.length > 0) {
//             const principal = this.subclientes.find(subcliente => subcliente.esPrincipal === 'S')
//             if (principal) {
//               this.marcacionSleccionada = principal
//             } else {
//               this.marcacionSleccionada = this.subclientes[0];
//             }
//             sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacionSleccionada));
//             // sessionStorage.setItem('MarcacionStading', JSON.stringify(this.marcacionSleccionada));
//             this.seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
//             setTimeout(() => {
//               this.sharedService.imageUpdated.emit('actualizando'),
//                 2000
//             })
//           }
//         });
//       }
//       else {
//         this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
//         this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
//         this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"));
//       }
//     }
//     else {
//       if (sessionStorage.getItem('Marcacion') == 'undefined' || sessionStorage.getItem('Marcacion') == null) {
//         const cli = JSON.parse(localStorage.getItem('Usuario'));
//         this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
//           this.subclientes = data;
//           if (this.subclientes.length > 0) {
//             const principal = this.subclientes.find(subcliente => subcliente.esPrincipal === 'S')
//             if (principal) {
//               this.marcacionSleccionada = principal
//             } else {
//               this.marcacionSleccionada = this.subclientes[0];
//             }
//           }
//           sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacionSleccionada));
//           this.seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
//           setTimeout(() => {
//             this.sharedService.imageUpdated.emit('actualizando'),
//               2000
//           })
//         });
//       }
//       else {
//         this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
//         this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"))
//         this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"))
//       }
//     }
//   }

//   seleccionarDestino(codigoMarcacion) {
//     this.appService.getDestinos(codigoMarcacion).subscribe((data: any) => {
//       this.destinos = data;
//       this.destinoSeleccionado = this.destinos[0];
//       sessionStorage.setItem('Destino', JSON.stringify(this.destinoSeleccionado));
//     });
//   }

//   clienteLogueado() {
//     const cli = JSON.parse(localStorage.getItem('Usuario'));
//     this.clienteSeLeccionado = cli;
//   }

//   seleccionarCamion(codigoMarcacion) {
//     this.appService.getCamionSeleccionado(codigoMarcacion).subscribe((data: any) => {
//       this.camiones = data;
//       if (this.camiones.length > 0) {
//         this.camionSeleccionado = this.camiones[0];
//         sessionStorage.setItem('Camion', JSON.stringify(this.camionSeleccionado));
//       }
//     });
//   }

//   obtenerTodosCamiones() {
//     this.appService.getAllCamiones().subscribe((data: any) => {
//       this.camionesAll = data;
//     });
//   }

//   filtroOrdenar(index: number) {

//     this.paginado.orden = this.actions[index].codigo === '' ? 'PRO' : this.actions[index].codigo

//     this.getproductosWebShop();
//   }

//   obtenerFiltroOrdenar() {
//     this.actions = [
//       { id: 0, name: 'Varieties', codigo: 'VAR' },
//       { id: 1, name: 'Products', codigo: 'PRO' }]
//   }

//   obtenerProductosPorTemporada() {

//     this.getColoresWebShop(0);

//     let dateConnection = localStorage.getItem('_ls_dateConecction');

//     if (dateConnection != null || dateConnection != undefined) {
//       this.date = new Date(dateConnection);

//       this.datePipe = new DatePipe("en-US");
//       this.paginado.fecha = this.datePipe.transform(this.date, 'yyyy-MM-dd');
//     }

//     this.getproductosWebShop();
//   }

//   async obtenerMensaje() {
//     await this.appService.obtenerMensajePublicidad().subscribe(dataWeb => {
//       const now = new Date();
//       const datePipe = new DatePipe("en-US");
//       const dateFormat = datePipe.transform(now, 'yyyy-MM-dd')
//       if (dataWeb != null) {
//         const webMessageDate = dataWeb.filter(x => dateFormat >= x.fechaInicio.toString() && dateFormat <= x.fechaFin.toString());
//         if (webMessageDate.length > 0) {
//           this.messagePublish = webMessageDate[0].texto;
//           this.messagePublishTitle = webMessageDate[0].nombre;
//         } else {
//           this.messagePublish = EnumSinDatos.NOTDATA;
//         }
//       }
//     }, (err: any) => {
//       if (err) {
//         this.messagePublish = EnumSinDatos.NOTDATA;
//       }
//     });
//   }

//   obtenerEtiquetas() {
//     this.appService.obtenerEtiquetaWebShop().subscribe(etiquetas => {
//       this.etiquetasWebshop = JSON.parse(etiquetas.json);
//       this.etiquetasWebshop.forEach(a => {
//         if (a.codigoEtiqueta = 'ILIMITADO') {
//           this.etiquetaLimited = a.etiqueta;
//         }
//       })
//     });
//   }

//   getColoresWebShop(numero: number) {
//     this.appService.getColoresWebShop().subscribe(colores => {
//       this.coloresEncontrados = colores.numRegistros
//       this.coloresWebShop = JSON.parse(colores.json);
//       this.coloresWebShop.forEach(x => {
//         if (x.colorHex != null || x.colorHex != undefined) {
//           x.colorHex = '#' + x.colorHex;
//         }
//         if (x.color2Hex != null || x.color2Hex != undefined) {
//           x.color2Hex = '#' + x.color2Hex;
//         }
//         if (x.color2Hex === '#') {
//           x.color2Hex = x.colorHex;
//         }

//         x.nombre = x.nombre.toLowerCase();
//         if (x.nombre.toLowerCase().includes(' ')) {
//           x.estilo = 'c-' + x.nombre.toLocaleLowerCase().replace(' ', '-');
//         }
//         if (x.nombre.toLowerCase().includes('/')) {
//           x.estilo = 'c-' + x.nombre.toLocaleLowerCase().replace('/', '-');
//         }
//         else {
//           x.estilo = 'c-' + x.nombre.toLocaleLowerCase().replace(' ', '-');
//         }
//         x.select = EnumSiNo.N
//       })
//       this.coloresWebShop = this.coloresWebShop.sort(function (a, b) {
//         return a.nombre.localeCompare(b.nombre);
//       });
//     });
//   }

//   getBackgroundGradient(color1: string, color2: string): any {
//     return {
//       'background': `linear-gradient(90deg, ${color1}, ${color2})`,
//       'border-radius': '50%'
//     };
//   }

//   getColoresFiltrados() {
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

//   cambiarPagina(event) {
//     this.paginado.pagina = event;

//     this.obtenerProductosPorTemporada();
//     // this.paginaProductos = event;
//     window.scrollTo(0, 180);
//   }

//   getproductosWebShop() {
//     this.isLoadingOne = true
//     this.isLoading = true;
//     this.appService.getProductosWebShopPost(this.paginado).subscribe(data => {
//       this.totalRegistros = data.numRegistros;

//       this.destinoSeleccionado = JSON.parse(sessionStorage.getItem('Destino'));

//       const c: any = JSON.parse(localStorage.getItem('Usuario'));
//       const cajas: Caja[] = JSON.parse(data.json);
//       this.productos = cajas.filter(x => x.combo == EnumSiNo.N);

//       if (this.productos.length > 0) {

//         this.appService.orderWebShop = c.orderWebShop === EnumSiNo.N ? EnumSiNo.N : EnumSiNo.S;
//         for (let index = 0; index < this.productos.length; index++) {

//           const element = this.productos[index];
//           element.tallasDeCaja = [];
//           element.tallasCajaCm = [];
//           element.tallasFinales = [];
//           element.cajasDisponiblesMixtas = [];
//           element.imagen = this.appService.urlImagen + element.imagenes[0];
//           element.stadingOrder = false;
//           element.nombreProducto = element.variedades[0].nombreVariedad.toLowerCase() + " - " + element.variedades[0].producto.toLowerCase();
//           for (let x = 0; x < element.variedades.length; x++) {
//             const variedad = element.variedades[x];
//            // variedad.cajasPorVariedad = [];
//             var buscarVariedadesPorTalla = element.variedades.filter(x => x.talla == variedad.talla);
//             if (buscarVariedadesPorTalla.length > 0) {
//               buscarVariedadesPorTalla.forEach(caja => {
//                 // variedad.cajasPorVariedad.push({
//                 //   caja: caja.caja,
//                 //   valor: caja.cantidadPorCajaMixta
//                 // })
//               });
//               var hash = {};
//             //   variedad.cajasPorVariedad = variedad.cajasPorVariedad.filter(function (productoCaja) {
//             //     var exists = !hash[productoCaja.caja];
//             //     hash[productoCaja.caja] = true;
//             //     return exists;
//             //   });
//             // }
//           //  element.cajasDisponiblesMixtas.push(variedad.cantidadPorCajaMixta);
//             if (variedad.cantidadPorCaja > 0) {
//               element.tallasDeCaja.push(variedad.talla);
//               element.tallasCajaCm.push(variedad.tallaCm);
//               element.tallasFinales.push({ codigo: variedad.tallaCm, valor: variedad.talla });
//               if (element.combo == EnumSiNo.S) { element.totalPiezas += variedad.cantidadPorCaja; }
//               // variedad.stadingOrder = false;
//               // variedad.cajaCombo = EnumSiNo.N;
//               // variedad.disabledBox = false;
//               // variedad.disabledBunches = false;
//               // variedad.disabled = variedad.seguridad == "si" ? true : false;
//               element.botonBox = EnumSiNo.S;
//              // element.botonBunches = variedad.mostrarPrecioPorCaja == 'no' ? EnumSiNo.N : EnumSiNo.S;

//               // for (let z = 0; z < variedad.precios.length; z++) {
//               //   const precio = variedad.precios[z];
//               //   let totalAux = 0;
//               //   let totalAuxJv = 0;

//               //   if (precio.tipoPrecio === EnumSiNo.N) {

//               //     let porcentajeSumar = 0;

//               //     if (c.codigoClientePadre !== undefined) {
//               //       porcentajeSumar = c.porcentajeSubcliente / 100;
//               //     } else if (this.destinoSeleccionado !== null && this.destinoSeleccionado !== undefined
//               //       && this.destinoSeleccionado.subcliente !== null
//               //       && this.destinoSeleccionado.subcliente !== undefined
//               //       && this.destinoSeleccionado.subcliente.marginSubcliente !== null
//               //       && this.destinoSeleccionado.subcliente.marginSubcliente !== undefined) {
//               //       porcentajeSumar = this.destinoSeleccionado.subcliente.marginSubcliente / 100;
//               //     }

//               //     const sumarPrecio = precio.precio * porcentajeSumar;
//               //     const sumarPrecioJv = precio.precioJv * porcentajeSumar;

//               //     precio.precio += sumarPrecio;
//               //     precio.precioJv += sumarPrecioJv;

//               //     if (precio.codigoTipoCliente === c.codigoTipoCliente) {
//               //       variedad.precio = precio.precio;
//               //       variedad.precioCliente = precio.precioCliente;
//               //       variedad.precioJv = precio.precioJv;

//               //       if (element.combo === EnumSiNo.S) {
//               //         variedad.cajaCombo = EnumSiNo.S;
//               //         totalAux = variedad.precio * variedad.cantidadPorCaja;
//               //         totalAuxJv = variedad.precioJv * variedad.cantidadPorCaja;
//               //         element.totalPrecio += totalAux;
//               //         element.totalPrecioJv += totalAuxJv;
//               //       }
//               //     }
//               //   }
//               // }
//             }
//           }
//           var tallaOriginalMenor = element.tallasCajaCm[0];
//           var cajaOriginalMenor = [];
//           var tallasUnicas = Array.from(new Set(element.tallasCajaCm));
//           var tallaStr = element.tallasDeCaja[0];
//           var hash = {};
//           element.tallasFinales = element.tallasFinales.filter(function (current) {
//             var exists = !hash[current.valor];
//             hash[current.valor] = true;
//             return exists;
//           });
//           element.tallasCajaCm = tallasUnicas.sort((a, b) => a - b);
//           element.tallasFinales.sort((a, b) => a.codigo + b.codigo);
//           element.tallaSeleccionada = tallaStr;// + '/';
//           if (element.variedades[0].producto == "ROSES" || element.variedades[0].producto == "GARDEN ROSES"
//             || element.variedades[0].producto == "MAYRAS GARDEN ROSES" || element.variedades[0].producto == "SPRAY ROSES") {
//             if (element.tallasFinales.filter(x => x.valor === "50 CM").length > 0) {
//               tallaOriginalMenor = 50;
//               tallaStr = "50 CM";
//               element.tallasDeCaja = [];
//               element.tallasDeCaja.push(tallaStr);
//               element.tallaSeleccionada = tallaStr;// + '/';
//             }
//           }
//           if (element.variedades[0].producto == "HYDRANGEA") {
//             if (element.tallasFinales.filter(x => x.valor === 'SUPER SELECT').length > 0) {
//               tallaOriginalMenor = 0;
//               tallaStr = 'SUPER SELECT';
//               element.tallasDeCaja = [];
//               element.tallasDeCaja.push(tallaStr);
//               element.tallaSeleccionada = tallaStr;// + '/';
//             }
//           }
//           var variedadBusqueda = [];
//           element.variedades.forEach(variedad => {
//             if (variedad.cantidadPorCaja > 0) {
//               if (variedad.tallaCm == tallaOriginalMenor && variedad.talla == tallaStr) {
//                 variedadBusqueda.push(variedad)
//               }
//             }
//           });
//           variedadBusqueda.forEach(item => {
//             cajaOriginalMenor.push(item.cantidadPorCaja);
//           });
//           //debugger
//           var minCaja = Math.max(...cajaOriginalMenor);
//           element.cajasDisponiblesMixtas = Array.from(new Set(element.cajasDisponiblesMixtas));
//           element.cajaSeleccionada = minCaja;
//           element.indexVariedadSeleccionada = this.tallaProducto(tallaStr, element, minCaja, "N", false);
//           element.indexPorTipoCaja = this.actualizarIndexPorTipoCaja(element, tallaStr, false);
//           element.tallasFinales.sort((a, b) => a.codigo - b.codigo);

//         }
//         //function comparar(a, b) { return a - b; };
//         this.listaFiltros = [];
//         this.listaFiltrosFinales = [];
//         for (let item of cajas) {
//           this.listaFiltros.push({ tipo: item.variedades[0].nombreVariedad.toLowerCase(), valor: item.variedades[0].producto.toLowerCase(), seleccionado: 'N' })
//           this.listaFiltrosFinales.push({ tipo: item.variedades[0].nombreVariedad, valor: item.variedades[0].producto, seleccionado: null })
//         }
//         // this._getProductosFiltro();
//         // this._filterOptions();
//         // this._getCategoriasAutocomplete();
//         // this._obtenerColoresFiltro();
//         // this._getColoresAutocomplete();
//         //this.getColoresWebShop(5);`
//         this.productosPaginados = this.productosPaginados.concat(this.productos);
//       }
//       this.isLoading = false;
//       this.isLoadingOne = false;
//       this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
//     },
//       error => {
//         console.error('Error al obtener productos:', error);
//       });
//   }

//   _getProductosFiltro() {
//     var hash = {};
//     for (let index = 0; index < this.listaFiltros.length; index++) {
//       const element = this.listaFiltros[index];
//       element.seleccionado = EnumSiNo.N
//     }
//     this.listaFiltros = this.listaFiltros.filter(function (variedades) {
//       var exists = !hash[variedades.tipo && variedades.valor] || false;
//       hash[variedades.tipo && variedades.valor] = true;
//       return exists;
//     });
//     this.listaFiltros = this.listaFiltros.sort(function (a, b) {
//       return a.valor.localeCompare(b.valor);
//     });
//   }

//   _obtenerColoresFiltro() {
//     var colorRepeat: FiltroColores[] = [];
//     this.colors = [];
//     this.productos.forEach(item => {
//       if (this.buscarColoresPorProducto != "") {
//         if (item.variedades[0].producto === this.buscarColoresPorProducto || item.variedades[0].nombreVariedad === this.buscarColoresPorProducto) {
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

//   agregarFiltro(filtro: Filtro) {
//     this.nombreValorProducto = filtro.valor.toLowerCase()
//     // for (let index = 0; index < this.listaFiltros.length; index++) {
//     //   const element = this.listaFiltros[index];
//     //   if (element === filtro) {
//     //     element.seleccionado = 'S';
//     //     break;
//     //   }
//     // }
//     // for (let index = 0; index < this.listaFiltrosSeleccionadosProducto.length; index++) {
//     //   const element = this.listaFiltrosSeleccionadosProducto[index];
//     //   if (element === filtro.valor) {
//     //     return;
//     //   }
//     // }
//     // for (let index = 0; index < this.listaFiltros.length; index++) {
//     //   const element = this.listaFiltros[index];
//     //   if (element.valor === this.filtroAnterior) {
//     //     element.seleccionado = 'N';
//     //     break;
//     //   }
//     // }
//     if (filtro.valor != this.filtroRepetido) {
//       this.filtroRepetido = filtro.valor;
//       this.filtroAnterior = filtro.valor;
//     }

//     this.listaFiltrosSeleccionados.push(new Filtro('PRO', filtro.valor.toLowerCase(), ''));
//     //this.listaFiltrosSeleccionadosProducto.push(filtro.valor.toLowerCase());
//     //this.GeneralEventFilter();
//   }

//   changeColor(color: string) {
//     const colorLowerCase = color.toLowerCase();
//     const colorUpperCase = color.toUpperCase();

//     let seAgrega = true;

//     this.nombreValorProducto = colorLowerCase;

//     this.coloresWebShop.forEach(item => {
//       if (item.nombre === colorLowerCase) {
//         if (item.select === EnumSiNo.N) {
//           item.select = EnumSiNo.S;
//         } else {
//           item.select = EnumSiNo.N;
//           seAgrega = false;
//         }
//       }
//     });

//     const indiceElemento = this.paginado.colores.indexOf(colorUpperCase);

//     if (indiceElemento !== -1) {
//       this.paginado.colores.splice(indiceElemento, 1);
//     }

//     this.listaFiltrosSeleccionados = this.listaFiltrosSeleccionados.filter(
//       filtro => filtro.valor !== colorLowerCase
//     );

//     if (seAgrega) {
//       this.paginado.colores.push(colorUpperCase);
//       this.listaFiltrosSeleccionados.push(new Filtro('COL', colorLowerCase, 'S'));
//     }

//     this.paginado.pagina = 1
//     this.productosPaginados = [];
//     this.getproductosWebShop();

//     this.listaFiltrosSeleccionadosColor.push(colorLowerCase);
//     this.GeneralEventFilter();
//   }

//   eliminarFiltroSeleccionado(filtro: Filtro, value: string) {

//     const indexFiltro = this.listaFiltrosSeleccionados.findIndex(item => item.valor === filtro.valor)
//     if (indexFiltro != -1) {
//       this.listaFiltrosSeleccionados.splice(indexFiltro, 1);
//     }

//     switch (filtro.tipo) {
//       case 'PRO':
//         const indexFiltroProducto = this.productosWebShopFilter.findIndex(item => item.nombre === filtro.valor.toUpperCase());
//         if (indexFiltroProducto !== -1) {
//           this.productosWebShopFilter[indexFiltroProducto].select = EnumSiNo.N
//         }
//         this.paginado.filtroProducto = this.paginado.filtroProducto.filter(elemento => elemento !== filtro.valor.toUpperCase())
//         break;
//       case 'COL':
//         const indexFiltroColor = this.coloresWebShop.findIndex(item => item.nombre === filtro.valor);
//         if (indexFiltroColor !== -1) {
//           this.coloresWebShop[indexFiltroColor].select = EnumSiNo.N
//         }
//         this.paginado.colores = this.paginado.colores.filter(elemento => elemento !== filtro.valor.toUpperCase())
//         break;
//       case 'PROMO':
//         this.paginado.isPromo = !this.paginado.isPromo
//         this.appService.mostrarPromociones = !this.appService.mostrarPromociones
//         break;
//       case 'TRO':
//         this.mensajeTropical = EnumMensajes.EMPTY
//         this.paginado.isTropical = false
//         break;
//     }
//     this.isLoadingOne = true
//     this.paginado.pagina = 1
//     this.productosPaginados = [];
//     this.getproductosWebShop()



//     // if (this.listaFiltrosSeleccionados.filter(x => x.tipo == "PROMO").length > 0) {
//     //   const indexPromo = this.listaFiltrosSeleccionados.indexOf(filtro)
//     //   if (indexPromo != -1) {
//     //     this.listaFiltrosSeleccionados.splice(indexPromo, 1);
//     //   }
//     // }

//     // this.nombreValorProducto = value.toLowerCase();
//     // this.appService.limpiarFiltroColor = [];
//     // const index: number = this.listaFiltrosSeleccionados.indexOf(filtro);
//     // for (let index = 0; index < this.listaFiltros.length; index++) {
//     //   const element = this.listaFiltros[index];
//     //   if (element.valor === filtro.valor) {
//     //     element.seleccionado = 'N';
//     //   }
//     // }
//     // if (this.listaFiltrosSeleccionadosColor.filter(x => x == value.toLowerCase()).length > 0) {
//     //   var indexColor = this.listaFiltrosSeleccionadosColor.indexOf(value.toLowerCase());
//     //   this.listaFiltrosSeleccionadosColor.splice(indexColor, 1);
//     // }
//     // if (this.listaFiltrosSeleccionadosProducto.filter(x => x == value.toLowerCase()).length > 0) {
//     //   var indexProducto = this.listaFiltrosSeleccionadosProducto.indexOf(value.toLowerCase());
//     //   this.listaFiltrosSeleccionadosProducto.splice(indexProducto, 1);
//     // }
//     // this.listaFiltrosSeleccionados.splice(index, 1);
//     // this.filtroRepetido = ''
//     // if (this.listaFiltrosSeleccionados.length == 0) {
//     //   this._limpiarWebShop();
//     // }
//     //this._validarFiltroProductos("DROP");
//   }

//   actualizarCajaSeleccionada() {
//     this.appService.cajaSeleccionada = this.appService.actualizarCajaSeleccionada(this.appService.cajaSeleccionada);
//     this.appService._calcularPorcentajeCajaArmada(this.appService.cajaSeleccionada);
//     this.appService.CajaArmada.totalProcentajeLleno = Math.round(this.appService.CajaArmada.totalProcentajeLleno);
//   }

//   cajaSeleccionadaActualizada(event) {
//     var cajaCantidad = this.appService.cajasConValor.filter(x => x.caja == this.appService.cajaSeleccionada);
//     this.appService.cajaSeleccionadaNumber = cajaCantidad[0].valor;
//     this.appService.cajaSeleccionada = cajaCantidad[0].caja;
//   }

//   mostraDetallesCaja(cajaModfiicar: Caja) {
//     const index: number = this.appService.Data.cartListCaja.indexOf(cajaModfiicar);
//     this.appService.mostraDetallesCaja(index);
//   }

//   agregarACaja(argumento: string) {
//     if (this.appService.CajaArmada.totalProcentajeLleno >= 90) {
//       let c: ClienteDTO = JSON.parse(localStorage.getItem('Usuario'));

//       this.cajaArmada.codigoTipoCliente = c.codigoTipoCliente;
//       this.cajaArmada.codigoCliente = c.codigoPersona;
//       this.cajaArmada.tipoAgrega = 'B';
//       this.cajaArmada.stadingOrder = false;
//       this.cajaArmada.tipoCaja = this.appService.cajaSeleccionada;
//       this.cajaArmada.combo = 'N';
//       this.cajaArmada.cantidadIngresada = 1;
//       let respuesta = this.appService.addToCartCaja(this.cajaArmada);
//       if (respuesta) {
//         const timeout = 1500;
//         const dialogRef = this.dialog.open(AddedComponent, {
//           data: { producto: this.cajaArmada.variedades, tipoAgrega: 'B', imagen: '', cantidad: 0 },
//           width: '410px',
//           panelClass: 'added-product'
//         });
//         dialogRef.afterOpened().subscribe(() => {
//           // setTimeout(() => {
//           this.appService.contadorCarrito();
//           //dialogRef.close();
//           // }, timeout)
//         });
//         dialogRef.afterClosed().subscribe(() => {
//           // setTimeout(() => {
//           //this.appService.contadorCarrito();
//           dialogRef.close();
//           // }, timeout)
//         });
//       }
//       if (argumento != 'N') {
//         this.cajaArmada = this.appService.CajaArmada;
//         this._limpiarWebShop();
//       }
//       return;
//     }
//     // const message = 'The box must be full.';
//     // status = 'error';
//     // this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });

//   }

//   eliminarCaja(caja: Caja) {
//     const index: number = this.appService.Data.cartListCaja.indexOf(caja);
//     if (index !== -1) {
//       this.appService.Data.cartListCaja.splice(index, 1);
//       this.appService.Data.totalPrice = this.appService.Data.totalPrice - caja.totalPrecio;
//       this.appService.addCartLocalStorage();
//     }
//     if (this.appService.Data.cartListCaja.length == 0) {
//       this.isLoadingOne = true
//       this.paginado.pagina = 1
//       this.productosPaginados = [];
//       this.getproductosWebShop();
//     }

//   }

//   agregarFiltroPromo() {
//     if (this.cajaArmada.totalProcentajeLleno > 1 && this.cajaArmada.totalProcentajeLleno <= 100) {
//       const dialogRef = this.dialog.open(ProductsMessageComponent, {
//         width: '250',
//         panelClass: 'products-message'
//       });
//       dialogRef.afterClosed().subscribe(result => {
//         if (result) {
//           this.cajaArmada.totalProcentajeLleno = 0
//           for (let i = 0; i < this.cajaArmada.variedades.length; i++) {
//             this.cajaArmada.variedades.splice(i, 1000);
//             break;
//           }
//           this.router.navigate(['/promo']);
//         }
//       });
//     }
//     else {
//       this.router.navigate(['/promo']);
//     }
//   }

//   onPageChanged(event) {
//     this.page = event;
//     window.scrollTo(0, 0);
//   }

//   buscarProductosFiltro(evento, tipoBusqueda) {
//     this.paginado.pagina = 1
//     this.productosPaginados = [];
//     this.appService.showNabvarCardActive = true;
//     if (this.filterValue.length <= 0 && this.paginado.cajaMixta.length <= 0 &&
//       this.paginado.colores.length <= 0 &&
//       this.paginado.filtroProducto.length <= 0 &&
//       this.appService.CajaArmada.variedades.length <= 0) { this._limpiarWebShop(); }
//     if (this.filterValue != '' && this.filterValue.length > 3) {
//       if (this.listaFiltrosSeleccionados.filter(x => x.valor == this.filterValue).length > 0) { return };

//       this.paginado.filtroNombre = this.filterValue.toUpperCase();
//       this.paginado.pagina = 1;
//       //busca cuando da enter
//       if (tipoBusqueda == 'N') {
//         if (evento.keyCode == 13) {
//           this.obtenerProductosPorTemporada();
//           //this.listaFiltrosSeleccionados.push(new Filtro('PRO', this.filterValue.toLowerCase(), ''));
//           //this.nombreValorProducto = this.filterValue.toLowerCase();
//           //this.listaFiltrosSeleccionadosProducto.push(this.filterValue.toLowerCase());
//           // this.GeneralEventFilter("PRO");
//           this.appService.resultadoBusqueda = true;
//           this.productoNoEncontrado = false;
//           return;
//         }
//       }
//       //filtra productos cuando hace click en la lista o en el boton
//       if (tipoBusqueda == 'S') {
//         // TODO: Lista de Prodcutos y variadades completas para autocompletar

//         this.obtenerProductosPorTemporada();

//         // this.listaFiltrosSeleccionados.push(new Filtro('PRO', this.filterValue.toLowerCase(), ''));
//         // this.nombreValorProducto = this.filterValue.toLowerCase();
//         // this.listaFiltrosSeleccionadosProducto.push(this.filterValue.toLowerCase());
//         // this.GeneralEventFilter("PRO");
//         this.appService.resultadoBusqueda = true;
//         this.productoNoEncontrado = false;
//       }
//     } else {
//       this.paginado.filtroNombre = this.filterValue.toUpperCase();
//       this.paginado.pagina = 1;
//       this.obtenerProductosPorTemporada();
//     }
//   }

//   GeneralEventFilter() {
//     if (this.cajaArmada.totalProcentajeLleno > 0) {
//       const dialogRef = this.dialog.open(DeleteComponent, {
//         data: { titulo: 'Caution', mensaje: 'You will lost the mix created if you do this action, continue with finding' },
//         panelClass: 'delete-boxes'
//       });
//       dialogRef.afterClosed().subscribe(res => {
//         if (res) {
//           this._limipiarVariablesCuandoBusca();
//           this.isLoadingOne = true
//           this.paginado.pagina = 1
//           this.productosPaginados = [];
//           this.getproductosWebShop()
//           //this._validarFiltroProductos(filtro);
//           return;
//         }
//         else {

//           console.log(this.listaFiltrosSeleccionados.length);

//           var index = this.listaFiltrosSeleccionados.findIndex(x => x.valor === this.nombreValorProducto);
//           if (index !== -1) {
//             this.listaFiltrosSeleccionados.splice(index, 1);
//           }
//           for (let index = 0; index < this.listaFiltros.length; index++) {
//             const element = this.listaFiltros[index];
//             if (element.valor === this.nombreValorProducto) {
//               element.seleccionado = 'N';
//             }
//           }
//           this.appService.limpiarFiltroColor = [];
//           return;
//         }
//       });
//     } else {
//       //this._validarFiltroProductos(filtro);
//     }
//   }

//   _limipiarVariablesCuandoBusca() {
//     this.appService.codigosProveedorFinales = [];
//     this.appService.codigosProveedorRespaldo = [];
//     this.productos = [];
//     this.productosProveedor = [];
//     this.appService.CajaArmada.totalProcentajeLleno = 0;
//     this.cajaArmada.variedades = [];
//     this.cajaArmada.totalCantidadPorBunche = 0;
//     this.appService.cajaSeleccionada = EnumTipoCaja.EB;
//     this.appService.cajasConValor = [];
//     this.appService.CajaArmada.totalPiezas = 0;
//     let uniques = Array.from(new Set(this.listaFiltrosSeleccionados));
//     this.listaFiltrosSeleccionados = uniques;
//     this.mensajeValorProducto = true;
//     this.appService.activarQueryRoses = false;
//     this.appService.realizoBusquedaProducto = false;
//     this.buscarColoresPorProducto = '';
//     this.appService.resultadoBusqueda = false;
//     this.appService.mostrarPromociones = false;
//     this.productoNoEncontrado = false;
//     this.mensajeTropical = EnumMensajes.EMPTY;
//     this._obtenerColoresFiltro();
//   }

//   // _validarFiltroProductos(filtro: string) {
//   //   if (this.listaFiltrosSeleccionados.length == 0) {
//   //     this.appService.getProductosWebShop('120' , '20230601'  , 'ROSES' , 1 , 24).subscribe(data => {
//   //       const cajas: Caja[] = JSON.parse(data.json);
//   //       this.DatosProductos = cajas;
//   //       this.productosXProveedorEvent(this.DatosProductos, 'F');
//   //       this._obtenerColoresFiltro();
//   //     });
//   //     this.DatosProductos = [];
//   //     return;
//   //   }
//   //   if (this.productosProveedor.length > 0) {
//   //     this._limpiarWebShop();
//   //     return;
//   //   }
//   //   this.appService.getProductosWebShop('120' , '20230611'  , 'ROSES' , 1 , 24).subscribe(data => {
//   //     const cajas: Caja[] = JSON.parse(data.json);
//   //     if (filtro == "PRO" || filtro == "COL") {
//   //       this.DatosProductos = [];
//   //       if (this.listaFiltrosSeleccionadosProducto.length > 1) {

//   //         this.listaFiltrosSeleccionadosProducto.shift();
//   //         this.listaFiltrosSeleccionados.shift();

//   //       }
//   //       if (this.listaFiltrosSeleccionadosProducto.length > 0) {
//   //         for (var itemProducto of this.listaFiltrosSeleccionadosProducto) {
//   //           //busqueda desordenada
//   //           var filter = {
//   //             argumentoDeBusqueda: itemProducto.toLowerCase()
//   //           }
//   //           const filterKeys = Object.keys(filter);
//   //           var resultado = cajas.filter(item => {
//   //             return filterKeys.some((columnaArray) => {
//   //               if (filter[columnaArray]) {
//   //                 const fil = filter[columnaArray].split(' ');
//   //                 var check = false;
//   //                 if (itemProducto.toLowerCase() == 'tropical flowers foliage magic') {
//   //                   if (new RegExp('tropical flowers', 'gi').test(item[columnaArray]) || new RegExp('foliage magic', 'gi').test(item[columnaArray])) {
//   //                     check = true;
//   //                   } else {
//   //                     check = false;
//   //                   }
//   //                 } else {
//   //                   for (const f of fil) {
//   //                     if (new RegExp(f, 'gi').test(item[columnaArray]) || f === '') {
//   //                       check = true;
//   //                     } else {
//   //                       check = false;
//   //                       break;
//   //                     }
//   //                   }
//   //                 }
//   //                 return check;
//   //               } else {
//   //                 return true;
//   //               }
//   //             });
//   //           });
//   //           this.resultProductsFilter = this.DatosProductos = resultado.filter(x => x.combo == EnumSiNo.N);
//   //           console.log("muestra:", resultado[0]);
//   //           this.buscarColoresPorProducto = this.listaFiltrosSeleccionadosProducto[0];
//   //         }
//   //       }
//   //       if (this.listaFiltrosSeleccionadosColor.length >= 0 && this.listaFiltrosSeleccionadosProducto.length == 0) {
//   //         for (let itemColor of this.listaFiltrosSeleccionadosColor) {
//   //           this.DatosProductos = this.DatosProductos.concat(cajas.filter(x => x.color == itemColor.toUpperCase() && x.combo == 'N'));
//   //           this.productos = this.DatosProductos;
//   //           this.resultProductsFilter = this.DatosProductos;
//   //         }
//   //       }
//   //       if (this.listaFiltrosSeleccionadosColor.length > 0 && this.listaFiltrosSeleccionadosProducto.length > 0) {
//   //         for (let itemColor of this.listaFiltrosSeleccionadosColor) {
//   //           this.productFilter = this.productFilter.concat(this.resultProductsFilter.filter(x => x.color == itemColor.toUpperCase() && x.combo == 'N'));
//   //           this.DatosProductos = this.productFilter;
//   //           this.productos = this.DatosProductos;
//   //         }
//   //         this.productFilter = [];
//   //       }
//   //       //eliminar productos repetidos
//   //       this.productos = [];
//   //       let uniques = Array.from(new Set(this.DatosProductos));
//   //       this.productos = uniques;
//   //       if (this.productos.length == 0) {
//   //         this.productoNoEncontrado = true;
//   //         this.appService.resultadoBusqueda = false;
//   //         return;
//   //       }
//   //       this.productoNoEncontrado = false;
//   //       this.productosXProveedorEvent(this.productos, 'F');
//   //       this._obtenerColoresFiltro();
//   //       this.DatosProductos = [];
//   //     }
//   //     //eliminar productos de la lista
//   //     else if (filtro == "DROP") {
//   //       if (this.listaFiltrosSeleccionadosProducto.length > 0) {
//   //         for (let itemProducto of this.listaFiltrosSeleccionadosProducto) {
//   //           this.DatosProductos = this.DatosProductos.concat(
//   //             cajas.filter(x => x.variedades.find(y => y.producto == itemProducto.toUpperCase() || y.nombreVariedad == itemProducto.toUpperCase()) && x.combo == 'N'))
//   //           this.resultProductsFilter = this.DatosProductos;
//   //         }
//   //       }
//   //       if (this.listaFiltrosSeleccionadosColor.length >= 0 && this.listaFiltrosSeleccionadosProducto.length == 0) {
//   //         for (let itemColor of this.listaFiltrosSeleccionadosColor) {
//   //           this.DatosProductos = this.DatosProductos.concat(cajas.filter(x => x.color == itemColor.toUpperCase() && x.combo == 'N'))
//   //           this.productos = this.DatosProductos;
//   //           this.resultProductsFilter = this.DatosProductos;
//   //         }
//   //       }
//   //       if (this.listaFiltrosSeleccionadosColor.length > 0 && this.listaFiltrosSeleccionadosProducto.length > 0) {
//   //         for (let itemColor of this.listaFiltrosSeleccionadosColor) {
//   //           this.productFilter = this.productFilter.concat(this.resultProductsFilter.filter(x => x.color == itemColor.toUpperCase() && x.combo == 'N'))
//   //           this.DatosProductos = this.productFilter;
//   //           this.productos = this.DatosProductos;
//   //         }
//   //         this.productFilter = [];
//   //       }
//   //       this.productos = [];
//   //       var uniques = Array.from(new Set(this.DatosProductos));
//   //       this.productos = uniques;
//   //       this.productosXProveedorEvent(this.productos, 'F');
//   //       this.buscarColoresPorProducto = this.listaFiltrosSeleccionadosProducto[0];
//   //       this._obtenerColoresFiltro();
//   //       this.DatosProductos = [];
//   //     }
//   //   });
//   // }

//   productosXProveedorEvent(val: any) {

//     const codigosVistos = new Set();
//     this.paginado.cajaMixta = this.appService.CajaArmada.variedades.filter(variedad => {
//       if (!codigosVistos.has(variedad.codigoVariedad)) {
//         codigosVistos.add(variedad.codigoVariedad);
//         return true; // Mantener la variedad si es única
//       }
//       return false; // Descartar la variedad duplicada
//     });

//     this.isLoadingOne = true
//     this.paginado.pagina = 1
//     this.paginado.filtroNombre = ''
//     this.productosPaginados = [];
//     this.getproductosWebShop()
//   }

//   // productosXProveedorEvent(productosListaFiltrada: Array<Caja>, valorFiltro: string) {
//   //   debugger
//   //   window.scrollTo(0, 180);
//   //   this.cajaArmada = this.appService.CajaArmada;
//   //   if (this.cajaArmada.tipoCaja != '') {
//   //     this.appService.cajaSeleccionada;
//   //   }
//   //   //filtra productos cuando regresa del componente controls
//   //   if (valorFiltro != "F") {
//   //     this.productosProveedor.push(...this.productos)
//   //     this.productos = productosListaFiltrada.sort(function (a, b) {
//   //       return a.variedades[0].nombreVariedad.localeCompare(b.variedades[0].nombreVariedad);
//   //     });
//   //   } else {
//   //     this.productos = productosListaFiltrada.sort(function (a, b) {
//   //       return a.variedades[0].nombreVariedad.localeCompare(b.variedades[0].nombreVariedad);
//   //     });
//   //   }
//   //   if (this.productos.length === 0) {
//   //     const dialogRef = this.dialog.open(DeleteComponent, {
//   //       data: { titulo: 'Caution', mensaje: "Sorry, we can't find a mix with the requested search", mensajeDos: 'Would you like to clean the filters ?' },
//   //       panelClass: 'delete-boxes'
//   //     });
//   //     dialogRef.afterClosed().subscribe(res => {
//   //       if (res) {
//   //         this._limpiarWebShop();
//   //       }
//   //       else {
//   //         var index = this.listaFiltrosSeleccionados.findIndex(x => x.valor === this.nombreValorProducto)
//   //         var indexProduco = this.listaFiltrosSeleccionadosProducto.findIndex(x => x === this.nombreValorProducto)
//   //         var indexColor = this.listaFiltrosSeleccionadosColor.findIndex(x => x === this.nombreValorProducto)
//   //         if (index !== -1) {
//   //           this.listaFiltrosSeleccionados.splice(index, 1);
//   //         }
//   //         if (indexProduco !== -1) {
//   //           this.listaFiltrosSeleccionadosProducto.splice(indexProduco, 1);
//   //         }
//   //         if (indexColor !== -1) {
//   //           this.listaFiltrosSeleccionadosColor.splice(indexColor, 1);
//   //         }
//   //         for (let index = 0; index < this.listaFiltros.length; index++) {
//   //           const element = this.listaFiltros[index];
//   //           if (element.valor === this.nombreValorProducto) {
//   //             element.seleccionado = 'N';
//   //             break;
//   //           }
//   //         }
//   //         // this._validarFiltroProductos("PRO");
//   //       }
//   //     });
//   //   }
//   //   var uniques = Array.from(new Set(this.productos));
//   //   this.productos = uniques;
//   //   if (valorFiltro != "F") {
//   //     for (let item of this.nombreVariedadSeleccionada) {
//   //       const indexProductoBuscar = this.productos.findIndex(x => x.variedades[0].nombreVariedad == item.valorVariedad && x.variedades[0].producto == item.valorProducto)
//   //       if (indexProductoBuscar != -1) {
//   //         this.productos.splice(indexProductoBuscar, 1);
//   //       }
//   //     }
//   //   }
//   //   const c: any = JSON.parse(localStorage.getItem('Usuario'));
//   //   this.appService.cajasConValor = [];
//   //   if (this.listaFiltrosSeleccionados.length > 0) {
//   //     this.coloresWebShop = [];
//   //     this.coloresEncontrados = 0;

//   //     // this.appService.getColoresWebShop().subscribe(colores => {
//   //     //   this.productos.forEach(item => {
//   //     //     this.coloresWebShop = this.coloresWebShop.concat(colores.filter(x => x.color == item.color))
//   //     //   });
//   //     //   var hash = {};
//   //     //   this.coloresWebShop = this.coloresWebShop.filter(function (current) {
//   //     //     var exists = !hash[current.color];
//   //     //     hash[current.color] = true;
//   //     //     return exists;
//   //     //   });
//   //     // });

//   //     this.getColoresFiltrados();
//   //   }

//   //   for (let index = 0; index < this.productos.length; index++) {
//   //     const element = this.productos[index];
//   //     element.tallasDeCaja = [];
//   //     element.tallasCajaCm = [];
//   //     element.tallasFinales = [];
//   //     element.cajasDisponiblesMixtas = [];
//   //     element.imagen = this.appService.urlImagen + element.imagenes[0];
//   //     element.stadingOrder = false;
//   //     element.nombreProducto = element.variedades[0].nombreVariedad.toLowerCase() + " - " + element.variedades[0].producto.toLowerCase();
//   //     if (element.combo == 'S') {
//   //       element.totalPiezas = 0;
//   //       element.totalPrecio = 0.00;
//   //       element.totalPrecioJv = 0.00;
//   //     }
//   //     for (let x = 0; x < element.variedades.length; x++) {
//   //       const variedad = element.variedades[x];
//   //       variedad.cajasPorVariedad = [];
//   //       var buscarVariedadesPorTalla = element.variedades.filter(x => x.talla == variedad.talla);
//   //       if (buscarVariedadesPorTalla.length > 0) {
//   //         buscarVariedadesPorTalla.forEach(caja => {
//   //           variedad.cajasPorVariedad.push({
//   //             caja: caja.caja,
//   //             valor: caja.cantidadPorCajaMixta
//   //           })
//   //         });
//   //         var hash = {};
//   //         variedad.cajasPorVariedad = variedad.cajasPorVariedad.filter(function (productoCaja) {
//   //           var exists = !hash[productoCaja.caja];
//   //           hash[productoCaja.caja] = true;
//   //           return exists;
//   //         });
//   //       }
//   //       element.cajasDisponiblesMixtas.push(variedad.cantidadPorCajaMixta)
//   //       if (variedad.cantidadPorCaja > 0) {
//   //         element.tallasDeCaja.push(variedad.talla);
//   //         element.tallasCajaCm.push(variedad.tallaCm);
//   //         element.tallasFinales.push({ codigo: variedad.tallaCm, valor: variedad.talla });
//   //         if (element.combo == 'S') {
//   //           element.totalPiezas += variedad.cantidadPorCaja;
//   //         }
//   //         variedad.stadingOrder = false;
//   //         variedad.cajaCombo = "N";
//   //         variedad.disabledBox = false;
//   //         variedad.disabledBunches = false;
//   //         element.botonBox = 'S';
//   //         element.botonBunches = 'S';
//   //         if (variedad.mostrarPrecioPorCaja == 'no') {
//   //           element.botonBunches = 'N';
//   //         }
//   //         if (variedad.seguridad == "si") {
//   //           variedad.disabled = true;
//   //         }
//   //         for (var z = 0; z < variedad.precios.length; z++) {
//   //           var precio = variedad.precios[z];
//   //           var totalAux = 0;
//   //           var totalAuxJv = 0;
//   //           if (precio.tipoPrecio == "N") {
//   //             if (c.codigoClientePadre != undefined) {
//   //               var porcentajeSumar = c.porcentajeSubcliente / 100;
//   //               var sumarPrecio = precio.precio * porcentajeSumar
//   //               var sumarPrecioJv = precio.precioJv * porcentajeSumar
//   //               precio.precio += sumarPrecio
//   //               precio.precioJv += sumarPrecioJv
//   //             }
//   //             if (precio.codigoTipoCliente === c.codigoTipoCliente) {
//   //               variedad.precio = precio.precio;
//   //               variedad.precioCliente = precio.precio
//   //               variedad.precioJv = precio.precioJv
//   //               if (element.combo == 'S') {
//   //                 variedad.cajaCombo = "S"
//   //                 totalAux = variedad.precio * variedad.cantidadPorCaja
//   //                 totalAuxJv = variedad.precioJv * variedad.cantidadPorCaja
//   //                 element.totalPrecio += totalAux
//   //                 element.totalPrecioJv += totalAuxJv
//   //               }
//   //             }
//   //           }
//   //         }
//   //       }
//   //     }
//   //     if (element.combo == 'N') {
//   //       var tallaOriginalMenor = element.tallasCajaCm[0];
//   //       var cajaOriginalMenor = [];
//   //       var tallasUnicas = Array.from(new Set(element.tallasCajaCm));
//   //       var tallaStr = element.tallasDeCaja[0];
//   //       var hash = {};
//   //       element.tallasFinales = element.tallasFinales.filter(function (current) {
//   //         var exists = !hash[current.valor];
//   //         hash[current.valor] = true;
//   //         return exists;
//   //       });
//   //       element.tallasCajaCm = tallasUnicas.sort(comparar);
//   //       element.tallasFinales.sort((a, b) => a.codigo + b.codigo);
//   //       element.tallaSeleccionada = tallaStr;// + '/';
//   //       if (element.variedades[0].producto == "ROSES" || element.variedades[0].producto == "GARDEN ROSES"
//   //         || element.variedades[0].producto == "MAYRAS GARDEN ROSES" || element.variedades[0].producto == "SPRAY ROSES") {
//   //         if (element.tallasFinales.filter(x => x.valor === "50 CM").length > 0) {
//   //           tallaOriginalMenor = 50;
//   //           tallaStr = "50 CM";
//   //           element.tallasDeCaja = [];
//   //           element.tallasDeCaja.push(tallaStr);
//   //           element.tallaSeleccionada = tallaStr;// + '/';
//   //         }
//   //       }
//   //       if (element.variedades[0].producto == "HYDRANGEA") {
//   //         if (element.tallasFinales.filter(x => x.valor === 'SUPER SELECT').length > 0) {
//   //           tallaOriginalMenor = 0;
//   //           tallaStr = 'SUPER SELECT';
//   //           element.tallasDeCaja = [];
//   //           element.tallasDeCaja.push(tallaStr);
//   //           element.tallaSeleccionada = tallaStr;// + '/';
//   //         }
//   //       }
//   //       var variedadBusqueda = [];
//   //       element.variedades.forEach(variedad => {
//   //         if (variedad.cantidadPorCaja > 0) {
//   //           if (variedad.tallaCm == tallaOriginalMenor && variedad.talla == tallaStr) {
//   //             variedadBusqueda.push(variedad);
//   //           }
//   //         }
//   //       });
//   //       variedadBusqueda.forEach(item => {
//   //         cajaOriginalMenor.push(item.cantidadPorCaja);
//   //       });
//   //       var minCaja = Math.min(...cajaOriginalMenor);
//   //       element.cajasDisponiblesMixtas = Array.from(new Set(element.cajasDisponiblesMixtas));
//   //       element.cajaSeleccionada = minCaja;
//   //       element.indexVariedadSeleccionada = this.tallaProducto(tallaStr, element, minCaja, "N");
//   //       element.indexPorTipoCaja = this.actualizarIndexPorTipoCaja(element, tallaStr);
//   //       var hash = {};
//   //       this.appService.cajasConValor = this.appService.cajasConValor.filter(function (parametro) {
//   //         var exists = !hash[parametro.caja];
//   //         hash[parametro.caja] = true;
//   //         return exists;
//   //       });
//   //       element.tallasFinales.sort((a, b) => a.codigo - b.codigo);
//   //     }
//   //   }
//   //   this.appService.busquedaGeneralColorWS = [];
//   //   function comparar(a, b) { return a - b; };
//   //   this.appService.busquedaGeneralWs = "";
//   //   this.appService.listaProductosBusquedaMezcla = [];
//   //   this.appService.listaProductosBusquedaMezcla = this.productos;
//   //   this.appService.realizoBusquedaProducto = false;
//   //  // this._opcionesDeBusquedaWS();
//   //   this._opcionesDeBusquedaColoWSr();
//   // }

//   _getCalcularDiaEntrega() {
//     var dia = this._getDiaSemana();
//     var hora = this._getHoraDia();
//     var minutos = this._getMinutos();

//     switch (dia) {
//       case 'Monday': {
//         if (hora < 9 && minutos <= 59) {
//           this._getFechaFlorex();
//         }
//         if (hora >= 9 && minutos >= 0) {
//           this._calcularDiasEntregaPedido('Monday');
//         }
//         break;
//       }
//       case 'Tuesday': {
//         if (hora < 9 && minutos <= 59) {
//           this._getFechaFlorex();
//         }
//         if (hora >= 9 && minutos >= 0) {
//           this._calcularDiasEntregaPedido('Tuesday');
//         }
//         break;
//       }
//       case 'Wednesday': {
//         if (hora < 9 && minutos <= 59) {
//           this._getFechaFlorex();
//         }
//         if (hora >= 9 && minutos >= 0) {
//           this._calcularDiasEntregaPedido('Wednesday');
//         }
//         break;
//       }
//       case 'Thursday': {
//         if (hora < 9 && minutos <= 59) {
//           this._getFechaFlorex();
//         }
//         if (hora >= 9 && minutos >= 0) {
//           this._calcularDiasEntregaPedido('Thursday');
//         }
//         break;
//       }
//       case 'Friday': {
//         if (hora < 9 && minutos <= 59) {
//           this._getFechaFlorex();
//         }
//         if (hora >= 9 && minutos >= 0) {
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
//     if (localStorage.getItem("_ls_dateConecction") != null || localStorage.getItem("_ls_dateConecction") != undefined) {
//       this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecction')));
//       this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
//       localStorage.setItem("_ls_dateConecction", this.date.value);
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
//     }
//     else { //Si no es FLOWERFULL
//       if (this.diaSemana === 'Monday' ||
//         this.diaSemana === 'Tuesday' ||
//         this.diaSemana === 'Wednesday' ||
//         this.diaSemana === 'Thursday' ||
//         this.diaSemana === 'Friday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 3);
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
//     localStorage.setItem("_ls_dateConecction", this.date.value);
//   }

//   _calcularDiasEntregaPedido(dia: string) {
//     var fechaInicia = new Date();
//     var datePipe = new DatePipe("en-US");
//     if (localStorage.getItem("_ls_dateConecction") != null || localStorage.getItem("_ls_dateConecction") != undefined) {
//       this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecction')));
//       this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
//       localStorage.setItem("_ls_dateConecction", this.date.value);
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
//         fechaInicia.setDate(fechaInicia.getDate() + 4);
//       }
//       if (dia === 'Friday') {
//         fechaInicia.setDate(fechaInicia.getDate() + 6);
//       }
//     }

//     this.date = new FormControl(new Date(fechaInicia));
//     this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
//     localStorage.setItem("_ls_dateConecction", this.date.value);
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

//   _informationDialogControl(event) {
//     this.appService.actualizarAumentarCajaMixta(event)
//     this._informationDialog(this.marcacionSleccionada, this.paginado.isTropical ? 'T' : '')
//   }

//   public _informationDialog(marcacion, tipo) {
//     var camionNombre = '';
//     if (this.camionSeleccionado == undefined) {
//       camionNombre = 'SN';
//     } else {
//       camionNombre = this.camionSeleccionado.nombre
//     }
//     var destinoNombre = '';
//     if (this.destinoSeleccionado == undefined) {
//       destinoNombre = 'SN';
//     } else {
//       destinoNombre = this.destinoSeleccionado.nombre
//     }
//     const dialogRef = this.dialog.open(InformationComponent, {
//       data: { data: 'N', marcacion: marcacion, camion: camionNombre, pagina: 'HUB', tipo: tipo, destino: destinoNombre },
//       panelClass: 'information',
//       disableClose: true,
//       //maxHeight: '95vh'
//     });
//     dialogRef.afterClosed().subscribe(respuesta => {

//       this.isLoadingDate = true;

//       const dateString = localStorage.getItem('_ls_dateConecction');

//       const dateDateFormat  = this.datePipe.transform(dateString, 'MM-dd-yyyy');

//       this.dateMostrar = dateDateFormat.toString()
      
//       //this.cdr.detectChanges();
//       this.isLoadingDate = false;

//       if (respuesta != null) {
//         this.actualizarDatos();
//         this.appService.guardarShippingInformation(
//           this.marcacionSleccionada,
//           this.camionSeleccionado,
//           this.destinoSeleccionado,
//           EnumPagina.HUB);
//         if (this.appService.aumentarCajaMixta) {
//           this.appService.dispararEventoCamionYPoMixBox();
//           this.appService.actualizarAumentarCajaMixta('false');
//         } else {
//           debugger
//           this.appService.dispararEventoCamionYPo();
//         }
//         //this.seleccionaCamionPo.emit();
//       }
//     });
//   }

//   public actualizarDatos() {
//     this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
//     this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
//     this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"));
//     this._getCalcularDiaEntrega()
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
//       panelClass: ''
//     });
//     dialogRef.afterClosed().subscribe(res => {
//       this.seleccionarMarcacion();
//       // this.obtenerCamiones();
//       if (res) { }
//     });
//   }

//   public dutchDirect() {
//     const dialogRef = this.dialog.open(DifferentdestinationComponent, {
//       panelClass: 'dutch-direct',
//       data: { link: JSON.parse(localStorage.getItem('Usuario')).paginaWeb },
//       disableClose: true // Evita el cierre al hacer clic fuera del cuadro de diálogo
//     });
//   }

//   public actualizarProductoPorCaja(caja: number, producto: Caja) {
//     this.tipoCajaInput(caja);
//     producto.cajaSeleccionada = caja;
//     var index = this.tallaProducto(producto.tallaSeleccionada, producto, producto.cajaSeleccionada, "S", true);
//     producto.indexVariedadSeleccionada = index;
//   }

//   public actualizarProductoPorTalla(talla: Talla, producto: Caja) {
//     producto.tallaSeleccionada = talla.valor;
//     producto.indexPorTipoCaja = this.actualizarIndexPorTipoCaja(producto, talla.valor, true)
//     this.actualizarProductoPorCaja(producto.cajaSeleccionada, producto);
//   }

//   tallaProducto(talla: string, producto: Caja, cajaSeleccionada: number, cambioFiltro: string, actualizaTalla: boolean) {
//     var indexVariedad = 0;
//     var index: number = 0
//     var productoSeleccionado;

//     if (!actualizaTalla) {
//       index = this.productos.indexOf(producto);
//       productoSeleccionado = this.productos[index];
//     } else {
//       index = this.productosPaginados.indexOf(producto);
//       productoSeleccionado = this.productosPaginados[index];

//     }


//     for (var x = 0; x < productoSeleccionado.variedades.length; x++) {
//       const variedad = productoSeleccionado.variedades[x];

//       variedad.cajasCantidad = [];
//       if (variedad.cantidadPorCaja > 0) {
//         var variedadABuscar = productoSeleccionado.variedades.filter(x => x.talla == talla && x.cantidadPorCaja > 0);

//         variedadABuscar.forEach(item => {

//           item.cajasPorVariedad.sort((a, b) => a.valor - b.valor);

//           const indexMinima = item.cajasPorVariedad.findIndex(x => x.caja === item.cajaMinima)

//           const cajasDisponibles = item.cajasPorVariedad.slice(indexMinima)

//           const cajaSeAgrega = cajasDisponibles.find(x => x.caja == item.caja)

//           if (item.cantidadPorCaja > 0 && cajaSeAgrega != undefined) {
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
//             variedad.cajasCantidad.sort((a, b) => a - b)
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
//                 variedad.cajasCantidad.sort((a, b) => a - b)
//                 indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//                 break;
//               }
//             }
//           } else if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
//             var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
//             variedad.cajasCantidad.splice(indexCaja, 1)
//             variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
//             variedad.cajasCantidad.sort((a, b) => a - b)
//             indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//             break;
//           }
//         } else if (variedad.producto == 'HYDRANGEA') {
//           if (productoSeleccionado.tallasFinales.filter(x => x.valor == 'SUPER SELECT').length > 0) {
//             if (variedad.talla == 'SUPER SELECT' && variedad.cantidadPorCaja == cajaSeleccionada) {
//               var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
//               variedad.cajasCantidad.splice(indexCaja, 1);
//               variedad.cajasCantidad.splice(0, 0, cajaSeleccionada);
//               variedad.cajasCantidad.sort((a, b) => a - b)
//               indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//               break;
//             }
//           } else if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
//             var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
//             variedad.cajasCantidad.splice(indexCaja, 1)
//             variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
//             variedad.cajasCantidad.sort((a, b) => a - b)
//             indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//             break;
//           }
//         } else if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
//           var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
//           variedad.cajasCantidad.splice(indexCaja, 1)
//           variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
//           variedad.cajasCantidad.sort((a, b) => a - b)
//           indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
//           break;
//         }
//       }
//     }
//     return indexVariedad;
//   }

//   actualizarIndexPorTipoCaja(producto, talla: string, actualizaTalla: boolean): number {
//     var indexCaja: number;

//     var index;
//     var productoSeleccionado;

//     if (!actualizaTalla) {
//       index = this.productos.indexOf(producto);
//       productoSeleccionado = this.productos[index];
//     } else {
//       index = this.productosPaginados.indexOf(producto);
//       productoSeleccionado = this.productosPaginados[index];

//     }


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

//   limpiarInput(event) {
//     this.productos.forEach(element => {
//       element.cantidadCajas = null;
//     });
//   }

//   tipoCajaInput(parametro) {
//     this.cajaInput = parametro
//   }

//   openProductDetallesDialog(caja: Caja) {
//     const dialogRef = this.dialog.open(ProductDetallesDialogComponent, {
//       data: { caja: caja, editar: false },
//       panelClass: 'product-detalles-dialog'
//     });
//     dialogRef.afterClosed().subscribe(res => {
//       if (res) {
//         this.eliminarCaja(caja);
//         this.appService.CajaArmada = caja;
//         this.router.navigate(['/home']);
//       }
//     });
//   }

//   locked() {
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

//   _updateDate(event) {
//     this.date = event;
//     localStorage.removeItem("_ls_dateConecction");
//     localStorage.setItem("_ls_dateConecction", event.value);
//     this.obtenerProductosPorTemporada();
//   }

//   _openCalendar(picker: MatDatepicker<Date>) {
//     picker.open();
//   }

//   _limpiarWebShop() {
//     this.appService.codigosProveedorFinales = [];
//     this.appService.codigosProveedorRespaldo = [];
//     this.appService.listaProductosBusquedaMezcla = [];
//     this.appService.realizoBusquedaProducto = false;
//     this.appService.CajaArmada.totalProcentajeLleno = 0;
//     this.appService.CajaArmada.variedades = [];
//     this.appService.CajaArmada.totalPiezas = 0;
//     this.appService.cajaSeleccionada = "EB";
//     this.appService.cajasConValor = [];
//     this.appService.busquedaGeneralWs = "";
//     this.appService.activarQueryRoses = false;
//     this.appService.resultadoBusqueda = false;
//     this.appService.mostrarPromociones = false;
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
//     this.itemsPorPagina = 50;
//     this.pageNumbers = [50];
//     this.mensajeTropical = EnumMensajes.EMPTY;
//     window.scrollTo(0, 0);
//     this.paginado.filtroNombre = '';
//     this.paginado.cajaMixta = []
//     this.paginado.pagina = 1
//     this.paginado.colores = []
//     this.paginado.filtroProducto = [];

//     this.isLoadingOne = true
//     this.productosPaginados = [];
//     this.getproductosWebShop();
//     this.router.navigate(['/home']);
//   }

//   buscarProductosListaFiltrada(busquedaConEnter, busquedaConBoton) {
//     if (this.appService.busquedaGeneralWs == '') { return; }
//     if (busquedaConBoton == 'S') {
//       for (let item of this.listaFiltrosSeleccionados) {
//         if (this.appService.busquedaGeneralWs == item.valor) {
//           break;
//         }
//       }

//       if (this.listaFiltrosFinales.filter(x => x.valor === this.appService.busquedaGeneralWs
//         || x.tipo === this.appService.busquedaGeneralWs).length == 0 && busquedaConBoton != null) {
//         return;
//       }
//       this.appService.filtrosDeBusquedaGeneral.push(this.appService.busquedaGeneralWs);
//       var resultado: any;
//       if (this.appService.activarQueryRoses == true) {
//         this.appService.realizoBusquedaProducto = false;
//         // this._habilitarProductosQueryRoses();
//         return;
//       } else {
//         this.appService.realizoBusquedaProducto = true;
//         resultado = this.appService._getFiltroGeneralProductos(
//           this.appService.busquedaGeneralWs,
//           this.appService.listaProductosBusquedaMezcla,
//           'I',
//           this.appService.filtrosDeBusquedaGeneral);
//       }
//       this.productos = resultado;
//       return;
//     }

//     if (busquedaConEnter.keyCode === 13) {
//       for (let item of this.listaFiltrosSeleccionados) {
//         if (this.appService.busquedaGeneralWs == item.valor) {
//           break;
//         }
//       }
//       if (this.listaFiltrosFinales.filter(x => x.valor === this.appService.busquedaGeneralWs
//         || x.tipo === this.appService.busquedaGeneralWs).length == 0 && busquedaConBoton != null) {
//         return;
//       }
//       this.appService.filtrosDeBusquedaGeneral.push(this.appService.busquedaGeneralWs);
//       if (this.appService.activarQueryRoses == true) {
//         this.appService.realizoBusquedaProducto = false
//         // this._habilitarProductosQueryRoses();
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

//   _datosDeBusqueda(value: string): string[] {
//     this.appService.activarQueryRoses = false;
//     this.appService.listaFinalBusquedaWS = [];
//     for (let item of this.appService.listaProductosBusquedaMezcla) {
//       if (!(item.variedades[0].producto == "ROSES" ||
//         item.variedades[0].producto == "GARDEN ROSES" ||
//         item.variedades[0].producto == "MAYRAS GARDEN ROSES" ||
//         item.variedades[0].producto == "SPRAY ROSES")) {
//         this.appService.listaFinalBusquedaWS.push(item.variedades[0].producto);
//         this.appService.listaFinalBusquedaWS.push(item.variedades[0].nombreVariedad);
//       }
//     }
//     var hash = {};
//     this.appService.listaFinalBusquedaWS = this.appService.listaFinalBusquedaWS.filter(function (current) {
//       var exists = !hash[current] || false;
//       hash[current] = true;
//       return exists;
//     });
//     const filterValue = value.toLowerCase();
//     var list = this.appService.listaFinalBusquedaWS.filter(option => option.toLowerCase().includes(filterValue));
//     return list.length ? list : ['No matches in restult, maybe other name?']
//   }

//   _allowSelection(option: string): { [className: string]: boolean } {
//     return {
//       'no-data': option.includes('No matches'),
//     }
//   }

//   //Habilita busqueda query roses
//   // _habilitarBusquedaQueryRoses(value: string): string[] {
//   //   this.appService.activarQueryRoses = true
//   //   this.appService.getProductosWebShop('120', '20230610', 'ROSES', 1, 24).subscribe(data => {
//   //     const cajas: Caja[] = JSON.parse(data.json);
//   //     for (let item of cajas) {
//   //       if (item.variedades[0].producto == "ROSES" ||
//   //         item.variedades[0].producto == "GARDEN ROSES" ||
//   //         item.variedades[0].producto == "MAYRAS GARDEN ROSES" ||
//   //         item.variedades[0].producto == "SPRAY ROSES") {
//   //         //this.appService.listaFinalBusquedaWS.push(item.variedades[0].producto)
//   //         this.appService.listaFinalBusquedaWS.push(item.variedades[0].nombreVariedad)
//   //       }
//   //     }
//   //   });
//   //   var hash = {};
//   //   this.appService.listaFinalBusquedaWS = this.appService.listaFinalBusquedaWS.filter(function (current) {
//   //     var exists = !hash[current] || false;
//   //     hash[current] = true;
//   //     return exists;
//   //   });
//   //   const filterValue = value.toLowerCase();
//   //   return this.appService.listaFinalBusquedaWS.filter(option => option.toLowerCase().includes(filterValue)).sort();
//   // }

//   _opcionesDeBusquedaColoWSr() {
//     var colorRepeat = [];
//     this.appService.busquedaGeneralColorWS = [];
//     this.appService.listaProductosBusquedaMezcla.forEach(item => {
//       if (item.combo != "S") {
//         if (item.color != '-') {
//           colorRepeat.push(item.color);
//         }
//       }
//     });
//     var uniquesColor = Array.from(new Set(colorRepeat));
//     this.appService.busquedaGeneralColorWS = uniquesColor;
//     this.appService.busquedaGeneralColorWS.sort();
//     this.appService.limpiarFiltroColor = [];
//   }

//   _buscarPorColorListaFiltrada(color: string) {
//     if (this.appService.filtrosDeBusquedaGeneral.filter(x => x === color).length > 0) {
//       return;
//     }
//     this.appService.realizoBusquedaProducto = true;
//     this.appService.filtrosDeBusquedaGeneral.push(this.appService.busquedaGeneralWs);
//     var resultado = this.appService._getFiltroGeneralProductos(
//       color,
//       this.appService.listaProductosBusquedaMezcla,
//       'D',
//       this.appService.filtrosDeBusquedaGeneral);
//     this.productos = resultado;
//   }

//   _setCajaArmada(cajaArmada: Caja) {
//     this.cajaArmada = cajaArmada
//   }

//   _activarRowBox(producto: Caja) {
//     if (this.cajaArmada.variedades.length == 0) {
//     //  producto.variedades[0].disabledBox = false;
//    //   producto.variedades[0].disabledBunches = true;
//       producto.botonBox = EnumSiNo.S;
//       producto.botonBunches = EnumSiNo.N;
//     }
//   }

//   _activarRowBunches(producto: Caja) {
//     producto.variedades[0].disabledBox = true;
//     producto.variedades[0].disabledBunches = false;
//     producto.botonBox = EnumSiNo.N;
//     producto.botonBunches = EnumSiNo.S;
//   }

//   _eliminarFitros() {
//     this.appService.showNabvarCardActive = true;
//     this.paginado.numRegistros = this.pageNumbers[0];
//     this.paginado.pagina = 1
//     this.paginado.isTropical = false
//     this.paginado.colores = []
//     this.paginado.filtroProducto = []
//     this.paginado.isPromo = false
//     this.paginado.orden = 'PRO'
//     this.coloresWebShop.forEach(color => color.select = EnumSiNo.N)
//     this.productosWebShopFilter.forEach(producto => producto.select = EnumSiNo.N)
//     this.appService.mostrarPromociones = false;
//     this.listaFiltrosSeleccionados = [];
//     this.obtenerProductosPorTemporada()
//     //  this._limpiarWebShop();
//   }

//   // _getCategoriasAutocomplete() {
//   //   this.filtrosOpcionesCat = null;
//   //   this.filtrosOpcionesCat = this.categoriasControl.valueChanges
//   //     .pipe(
//   //       startWith(''),
//   //       map(value => this._filtrosCategoriasAuto(value))
//   //     );
//   // }

//   // private _filtrosCategoriasAuto(value: string): string[] {
//   //   this.appService.getProductosWebShop('120', '20230610', 'ROSES', 1, 24).subscribe(data => {
//   //     this.categorias = [];
//   //     const cajas: Caja[] = JSON.parse(data.json);
//   //     cajas.forEach(x => {
//   //       this.categorias.push(x.variedades[0].producto.trim())
//   //     });
//   //     var hash = {};
//   //     this.categorias = this.categorias.filter(function (current) {
//   //       var exists = !hash[current] || false;
//   //       hash[current] = true;
//   //       return exists;
//   //     });
//   //   });
//   //   const filterValue = value.toLowerCase();
//   //   return this.categorias.filter(option => option.toLowerCase().includes(filterValue));
//   // }

//   _getColoresAutocomplete() {
//     this.filtrosOpcionesColores = null;
//     this.filtrosOpcionesColores = this.coloresControl.valueChanges
//       .pipe(
//         startWith(''),
//         map(value => this._filtrosColoresAuto(value))
//       );
//   }

//   _filtrosColoresAuto(value: string): string[] {
//     const filterValue = value.toLowerCase();
//     return this.coloresWebShop.filter(option => option.nombre.toLowerCase().includes(filterValue))
//       .map(color => color.nombre);
//   }

//   _verFiltrosCategorias() {
//     const dialogRef = this.dialog.open(FiltersComponent, {
//       data: { filtros: this.productosWebShopFilter, tipoFiltro: 'P' },
//       panelClass: 'filters'
//     });
//     dialogRef.afterClosed().subscribe(res => {
//       if (res != null || res != undefined) {
//         for (let valor of res) {
//           this.paginado.filtroProducto.push(valor.toUpperCase())
//           this.agregarFiltro({ tipo: '', valor: valor.toLowerCase(), seleccionado: '' });
//         }

//         this.isLoadingOne = true
//         this.paginado.pagina = 1
//         this.productosPaginados = [];
//         this.getproductosWebShop();
//         // this._getProductosFiltro();
//       }
//     });
//   }

//   _verFiltros(tipoFiltro) {
//     if (tipoFiltro == 'S') {
//       this.mostrarFiltrosAll = true;
//       this.getColoresWebShop(100);
//     } else {
//       this.mostrarFiltrosAll = false;
//       //  this.getColoresWebShop(5);
//     }
//   }

//   // _editarCajaBunches(variedad, tipoAgrega) {
//   //   const dialogRef = this.dialog.open(EditComponent, {
//   //     data: { caja: [variedad], tipoAgrega: tipoAgrega, verLista: 'N' },
//   //     width: '500px',
//   //     panelClass: 'edit-productos'
//   //   });
//   //   dialogRef.afterClosed().subscribe(res => {
//   //     if (res != null && res.tipoAccion == 'D') {
//   //       this.eliminarVariedad(res.nuevaVariedad);
//   //     }
//   //     if (res != null && res.tipoAccion == 'E') {
//   //       this._editarVarieadesSeleccionadas(res);
//   //     }
//   //   });
//   // }

//   _verListaItems() {
//     const dialogRef = this.dialog.open(EditComponent, {
//       data: { caja: this.cajaArmada.variedades, tipoAgrega: 'B', verLista: 'S' },
//       width: '1100px',
//       panelClass: 'edit-productos'
//     });
//     dialogRef.afterClosed().subscribe(res => {
//       if (res != null && res.tipoAccion == 'D') {
//         this.eliminarVariedad(res.nuevaVariedad);
//       }
//       if (res != null && res.tipoAccion == 'E') {
//         this._editarVarieadesSeleccionadas(res);
//       }
//     });
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
//     this.productosXProveedorEvent(null)
//     if (this.appService.CajaArmada.totalProcentajeLleno <= 0) {
//       this._limpiarWebShop();
//     }
//   }


//   _buscarCategoriasConFiltro(evento, tipoBusqueda: string) {
//     if (this.valorBusquedaCat != '') {
//       if (tipoBusqueda == 'N') {
//         if (evento.keyCode == 13) {
//           this.paginado.filtroProducto.push(this.valorBusquedaCat.toUpperCase());
//           this.agregarFiltro({ tipo: '', valor: this.valorBusquedaCat, seleccionado: '' });

//           this.isLoadingOne = true
//           this.paginado.pagina = 1
//           this.productosPaginados = [];
//           this.getproductosWebShop()
//         }
//         return;
//       }
//       if (tipoBusqueda == 'S') {
//         this.agregarFiltro({ tipo: '', valor: this.valorBusquedaCat, seleccionado: '' });
//       }
//     }
//   }

//   _buscarCategoriasConFiltroCheck(filtro) {

//     const indexFiltroProducto = this.productosWebShopFilter.findIndex(item => item.nombre === filtro.nombre);

//     if (indexFiltroProducto !== -1) {
//       console.log(this.productosWebShopFilter[indexFiltroProducto].select);

//       if (this.productosWebShopFilter[indexFiltroProducto].select === EnumSiNo.N || this.productosWebShopFilter[indexFiltroProducto].select === undefined) {
//         this.productosWebShopFilter[indexFiltroProducto].select = EnumSiNo.S
//         this.agregarFiltro({ tipo: '', valor: filtro.nombre.toUpperCase(), seleccionado: '' });
//         this.paginado.filtroProducto.push(filtro.nombre.toUpperCase())
//       } else {
//         this.productosWebShopFilter[indexFiltroProducto].select = EnumSiNo.N
//         this.eliminarFiltroSeleccionado(new Filtro('PRO', this.productosWebShopFilter[indexFiltroProducto].nombre.toLocaleLowerCase(), ''), this.productosWebShopFilter[indexFiltroProducto].nombre.toLowerCase())
//         return
//       }
//     }
//     this.isLoadingOne = true
//     this.paginado.pagina = 1
//     this.productosPaginados = [];
//     this.getproductosWebShop()
//   }

//   _buscarColoresConFiltro(evento, tipoBusqueda: string) {
//     if (this.valorBusquedaCol != '') {
//       if (tipoBusqueda == 'N') {
//         if (evento.keyCode == 13) {
//           this.changeColor(this.valorBusquedaCol);
//         }
//         return;
//       }
//       if (tipoBusqueda == 'S') {
//         this.changeColor(this.valorBusquedaCol);
//       }
//     }
//   }

//   _mostrarPromociones() {
//     // if (this.appService.mostrarPromociones == false) {
//     //   this.appService.mostrarPromociones = true;
//     // } else if (this.appService.mostrarPromociones == true) {
//     //   this.appService.mostrarPromociones = false;
//     // }
//     this.appService.mostrarPromociones = !this.appService.mostrarPromociones;
//     this.paginado.isPromo = !this.paginado.isPromo
//     var indexPromo = this.listaFiltrosSeleccionados.findIndex(item => item.tipo === 'PROMO')

//     if (this.appService.mostrarPromociones && indexPromo == -1) {
//       this.listaFiltrosSeleccionados.push({ valor: 'Promo', tipo: 'PROMO', seleccionado: 'S' });
//     }

//     if (!this.appService.mostrarPromociones && indexPromo != -1) {
//       this.listaFiltrosSeleccionados.splice(indexPromo, 1);
//     }

//     this.isLoadingOne = true
//     this.paginado.pagina = 1
//     this.productosPaginados = [];
//     this.getproductosWebShop();
//   }

//   _eliminarTodasVariedades() {
//     this._limpiarWebShop();
//   }

//   _editarVarieadesSeleccionadas(datos) {
//     const indexVariedadARemplazar = this.cajaArmada.variedades.indexOf(datos.variedadRespaldo)
//     if (indexVariedadARemplazar != -1) {
//       this.cajaArmada.variedades.splice(indexVariedadARemplazar, 1);
//       this.cajaArmada.variedades.splice(indexVariedadARemplazar, 0, datos.nuevaVariedad);
//     }
//   }

//   //se inicia cuando se edita el bunche, se ejecuta cada instante , este metodo se puede controlar
//   ngDoCheck() {
//     if (this.appService.activarEdicionVariedad) {
//       this.appService.activarEdicionVariedad = false;
//       this.appService._botonMenuSeleccionado(this.router.url);
//       //this._iniciarEdicionBunches();
//     }
//     if (this.appService.activarAgregarBunches) {
//       this.appService.activarAgregarBunches = false;
//       this.appService._botonMenuSeleccionado(this.router.url);
//       //this._agregarMasBunchesCajaCompleta();
//     }
//   }

//   actualizarCantidadBunchesMixtas(cantidad, variedad) {
//     var seAgrega = true;
//     var caja = variedad.cajasPorVariedad.filter(x => x.caja === this.appService.cajaSeleccionada)[0].valor;
//     var cajaFull = this.appService.calularPorcentajeAntesDeAgregar(this.appService.cajaSeleccionada, variedad, caja);

//     if (cajaFull >= 100 && this.appService.cajaSeleccionada === EnumTipoCaja.HB) {
//       this._mensajeCajaCompleta();
//       return;
//     }

//     if (cajaFull >= 100 && this.appService.cajaSeleccionada != EnumTipoCaja.HB) {
//       seAgrega = this._mensajeAgrandarCaja(variedad);
//     }
//     if (!seAgrega) {
//       this._mensajeCajaCompleta();
//       return
//     }
//     this.appService.recalcularCaja(variedad, cantidad);
//     if (this.appService.CajaArmada.totalProcentajeLleno >= 95 && this.appService.CajaArmada.totalProcentajeLleno <= 105) {
//       const dialogRef = this.dialog.open(IncreaseboxComponent, {
//         data: {},
//         panelClass: 'increase-box',
//         disableClose: true,
//       });
//       dialogRef.afterClosed().subscribe((value) => {
//         if (value === 'Agregar') {
//           this.agregarACaja('S');
//         }

//       });
//     }
//   }

//   public _mensajeCajaCompleta() {
//     const dialogRef = this.dialog.open(NoteBoxesComponent, {
//       data: { variedad: null, condicion: 'FULL' },
//       panelClass: 'note-boxes'
//     });
//     dialogRef.afterClosed().subscribe((value) => {
//       if (value === 'Agregar') {
//         this.agregarACaja('S');
//       }

//     });
//   }

//   public _mensajeAgrandarCaja(variedad) {
//     if (variedad.cajasPorVariedad.filter(x => x.caja === EnumTipoCaja.HB).length == 0 && this.appService.cajaSeleccionada === EnumTipoCaja.QB) {
//       return false;
//     }

//     window.scrollTo(0, 100);
//     if (this.appService.cajaSeleccionada != EnumTipoCaja.HB) {
//       this.appService.cajaSeleccionada = this.appService.actualizarCajaSeleccionada(this.appService.cajaSeleccionada);
//     }
//     this.appService.cajaSeleccionadaNumber = variedad.cajasPorVariedad.filter(x => x.caja === this.appService.cajaSeleccionada)[0].valor;
//     // this.appService._calcularPorcentajeCajaArmada(this.appService.cajaSeleccionada);
//     // this.appService.CajaArmada.totalProcentajeLleno = Math.round(this.appService.CajaArmada.totalProcentajeLleno);
//     return true;
//   }

//   _opcionesDeBusquedaCuandoEliminaVariedad() {
//     this.appService.opcionesDeBusquedaWs = null;
//     this.appService.opcionesDeBusquedaWs = this.appService.controlBusquedaWs.valueChanges
//       .pipe(
//         startWith(''),
//         map(value => this._busquedaListaVariedadEliminada(value))
//       );
//   }

//   _busquedaListaVariedadEliminada(value: string): string[] {
//     this.appService.listaFinalBusquedaWS = [];
//     for (let item of this.appService.listaProductosBusquedaMezcla) {
//       this.appService.listaFinalBusquedaWS.push(item.variedades[0].producto);
//       this.appService.listaFinalBusquedaWS.push(item.variedades[0].nombreVariedad);
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

//   _iniciarBusquedaProductosPorEstado(buscarProductos: Caja[],
//     sePuedeMezclar: string, nombreProducto: string): Caja[] {
//     const cliente: ClienteDTO = JSON.parse(localStorage.getItem('Usuario'));
//     this.productos = [];
//     this.productos = this.appService._recalcularPreciosDeProductos(
//       buscarProductos,
//       cliente,
//       '/home',
//       sePuedeMezclar,
//       nombreProducto,
//       buscarProductos,
//       false
//     );
//     var uniques = Array.from(new Set(this.productos));
//     this.productos = uniques;
//     this.productos = this.productos.sort(function (a, b) {
//       return a.variedades[0].nombreVariedad.localeCompare(b.variedades[0].nombreVariedad);
//     });
//     return this.productos;
//   }

//   _setListaFiltrosPorCambioEstado(producto: Caja[]) {
//     this.listaFiltrosFinales = [];
//     this.listaFiltros = [];
//     for (let item of producto) {
//       this.listaFiltros.push({ tipo: item.variedades[0].nombreVariedad.toLowerCase(), valor: item.variedades[0].producto.toLowerCase(), seleccionado: 'N' });
//       this.listaFiltrosFinales.push({ tipo: item.variedades[0].nombreVariedad, valor: item.variedades[0].producto, seleccionado: null });
//     }
//     var uniques = Array.from(new Set(this.listaFiltrosFinales));
//     this.listaFiltrosFinales = uniques;
//   }

//   mostrarMensajePopup() {
//     const dialogRef = this.dialog.open(DeleteComponent, {
//       data: { titulo: 'Alert', mensaje: EnumMensajes.NOTITEMSPROMO, mostrarBoton: true, imagen: 'S' },
//       panelClass: 'delete-boxes'
//     });
//     dialogRef.afterClosed().subscribe(() => {
//       //this._limpiarWebShop();
//     });
//   }

//   _cambiarPaginacion(pagina) {
//     console.log("¨Paginacion cambio")
//     this.paginado.numRegistros = pagina;
//     this.paginado.pagina = 1;
//     //this.itemsPorPagina = pagina;
//     this.obtenerProductosPorTemporada();
//   }

//   _tropicalFlowers() {
//     //this.appService.showNabvarCardActive = false;
//     this.mensajeTropical = EnumMensajes.TROPICAL;
//     this.paginado.isTropical = true
//     this.listaFiltrosSeleccionados.push(new Filtro('TRO', 'Tropical Flowers', ''));
//     this.isLoadingOne = true
//     this.paginado.pagina = 1
//     this.productosPaginados = [];
//     this.getproductosWebShop()
//     // this.agregarFiltro({ tipo: '', valor: "tropical flowers foliage magic", seleccionado: '' });

//   }

//   // getInfoShipping() {
//   //   const cli = JSON.parse(localStorage.getItem('Usuario'));
//   //   this.appService.getInfoShipping(parseInt(cli.codigoPersona), EnumPagina.HUB).subscribe(data => {
//   //     debugger
//   //     if (data[0].informacion != undefined) {
//   //       var info = JSON.parse(data[0].informacion);
//   //       this.marcacionSleccionada = info.marcacion;
//   //       this.camionSeleccionado = info.camion;
//   //       this.destinoSeleccionado = info.destino;
//   //       sessionStorage.setItem("Marcacion", JSON.stringify(this.marcacionSleccionada));
//   //       sessionStorage.setItem("Camion", JSON.stringify(this.camionSeleccionado));
//   //       sessionStorage.setItem("Destino", JSON.stringify(this.destinoSeleccionado));
//   //     }
//   //   });
//   // }


//   ejemplo() {
//     console.log("nuevo servidor ");
//   }

//   _orderCaja(cajas) {
//     cajas.sort(function (a, b) {
//       return b - a;
//     });
//     return cajas;
//   }

//   // toRigth(target: any) {
//   //   const parent = target.parentElement.children[1];
//   //   parent.scrollLeft += 30;
//   // }
//   // toLeft(target: any) {
//   //   const parent = target.parentElement.children[1];
//   //   parent.scrollLeft -= 30;
//   // }

//   toRigth(target: any) {
//     const parent = target.parentElement;
//     if (parent && parent.children.length > 1) {
//       parent.children[1].scrollLeft += 60;
//     }
//   }

//   toLeft(target: any) {
//     const parent = target.parentElement;
//     if (parent && parent.children.length > 1) {
//       parent.children[1].scrollLeft -= 60;
//     }
//   }

//   setDesplazar(target: any, index: number) {
//     const parent = target.parentElement.parentElement;
//     parent.scrollLeft = index * target.scrollWidth;
//   }

//   _varietiesNoRepeated(list) {
//     var lisFinal = list.filter((v, i, a) => a.findIndex(t => (t.codigoVariedad === v.codigoVariedad && t.talla === v.talla)) === i);
//     return lisFinal.sort((a, b) => a.nombreVariedad.localeCompare(b.nombreVariedad));
//   }

//   _countVarietiesNoRepeat(v, list) {
//     return list.filter(t => (t.codigoVariedad === v.codigoVariedad && t.talla === v.talla)).length;
//   }

//   _piceVarietiesNoRepeat(v, list) {
//     var a = list.filter(t => (t.codigoVariedad === v.codigoVariedad && t.talla === v.talla));
//     var b = a.map(a => a.precioCliente);
//     return b[0];
//     var c = b.reduce(function (a, b) {
//       return a + b;
//     });
//     // anteriormente estaba así:
//     return list.filter(t => (t.codigoVariedad === v.codigoVariedad && t.talla === v.talla)).map(a => a.precioCliente).reduce(function (a, b) {
//       return a + b;
//     });
//   }

// }

