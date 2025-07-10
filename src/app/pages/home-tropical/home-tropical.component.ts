import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Caja, Camion, Colores, Destino, Etiquetas, Filtro, Marcacion, PaginadorProducto, Productos, Variedad, ambiente } from 'src/app/app.modelsWebShop';
import { EnumMensajes, EnumPagina, EnumSiNo, EnumSinDatos, EnumTipoCaja } from 'src/app/enumeration/enumeration';
import { DifferentdestinationComponent } from '../differentdestination/differentdestination.component';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { InformationComponent } from '../popus/information/information.component';
import { DeleteComponent } from '../popus/delete/delete.component';
import { AppService } from 'src/app/app.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { AppWebshopService } from 'src/app/app-webshop.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ProductoWebShop } from 'src/app/app.modelsWebShopV2';
import { FiltersComponent } from '../popus/filters/filters.component';
import { ResponsiveService } from 'src/app/responsive.service';
import { MessageClientComponent } from '../home-v2/message-client/message-client.component';

@Component({
  selector: 'app-home-tropical',
  templateUrl: './home-tropical.component.html',
  styleUrls: ['./home-tropical.component.scss']
})
export class HomeTropicalComponent implements OnInit {


  @ViewChild('sidenav') sidenav: any;
  sidenavOpen = true;
  sidenavClose = true;
  paginado = new PaginadorProducto();
  productosPaginados: Array<ProductoWebShop> = [];
  coloresEncontrados: number = 0;
  //coloresWebShop: Colores[] = [];
  date: any;
  datePipe;
  totalRegistros = 0;
  isLoading = false
  isLoadingOne = false
  destinoSeleccionado: Destino;
  camionSeleccionado: Camion;
  //listaFiltrosSeleccionados: Filtro[] = [];
  //productosWebShopFilter: Productos[] = [];
  myControl = new FormControl();

  isLoadingDate = false;
  dateMostrar = 'SELECT YOUR SHIPPING DATE';
  marcacionSleccionada: Marcacion;
  dias = [];
  diaSemana = '';
  zonaHorariaEcuador;
  horarioDeEcuador = new Date();
  dateNews = new Date();
  dateNowInit: string;
  etiquetasWebshop: Etiquetas[] = [];
  etiquetaLimited: string = '';

  usuario: any;

  messagePublish: string = '';
  messagePublishTitle: string = '';

  subclientes: Array<Marcacion> = [];
  destinos: Destino[] = [];
  listaFiltrosSeleccionadosColor = [];

  camiones: Array<Camion> = [];
  camionesAll: Array<Camion> = [];

  cajaArmada: Caja;

  nombreValorProducto: string;
  mensajeTropical = EnumMensajes.EMPTY;

  filtroRepetido: string = '';
  filtroAnterior: string = '';

  listaFiltros: Filtro[] = [];

  filterValue = '';
  urlImagen = '';

  isMobile: boolean;

  sePuedeAgrandarCaja = false;

  constructor(public appService: AppService, private sharedService: SharedService, public appWebshopService: AppWebshopService, public dialog: MatDialog,
    private el: ElementRef, public router: Router, public responsive: ResponsiveService, public snackBar: MatSnackBar) {

      this.isMobile = this.responsive.isMobile();

    this.sharedService.dataProductUpdate.subscribe((data: any) => {
      this.productosPaginados = []
      this.obtenerProductosPorTemporada();
    });

    this.cajaArmada = appService.CajaArmada
  }

  ngOnDestroy(): void {
    console.log("home-tropical component destroyed");
    this.appWebshopService.paginador.filtroNombre = '';
    this.appWebshopService.paginador.cajaMixta = []
    this.appWebshopService.paginador.colores = []
    this.appWebshopService.paginador.filtroProducto = []
    this.appWebshopService.paginador.isPromo = false
    this.appWebshopService.paginador.isLimited = false
    this.appWebshopService.paginador.orden = 'PRO'
    this.appWebshopService.addPaginadorLocalStorage();
    this.appWebshopService.coloresWebShop.forEach(color => color.select = EnumSiNo.N)
    this.appWebshopService.productosWebShopFilter.forEach(producto => producto.select = EnumSiNo.N)
    this.appService.mostrarPromociones = false;
    this.appService.mostrarLimited = false;
    this.appService.mostrarTinted = false;
    this.appWebshopService.listaFiltrosSeleccionados = [];
  }

  async ngOnInit() {
    this.urlImagen = ambiente.urlFotos
    await this.obtenerUsuario();

    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
      this.sidenavClose = false;
    }

    //this.listaFiltrosSeleccionados.push(new Filtro('TRO', 'Tropical Flowers', ''));
    this._getCalcularDiaEntrega();

    this._iniciarPaginador();
    this._iniciarProductosParaFiltros();

    this.seleccionarMarcacion();
    this.obtenerTodosCamiones();

    this.appService.contadorCarrito();

    this.obtenerMensaje();


    this.obtenerProductosPorTemporada();

    const dateString = localStorage.getItem('_ls_dateConecction');

    const dateDateFormat = this.datePipe.transform(dateString, 'MM-dd-yyyy');

    this.dateMostrar = dateDateFormat.toString()

    sessionStorage.removeItem('Camion');
  }

  async obtenerUsuario() {
    while (!this.usuario) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.usuario = JSON.parse(localStorage.getItem('Usuario'));
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollPosition = window.scrollY + window.innerHeight;
    const docHeight = this.el.nativeElement.offsetHeight;

    if (!this.isLoading && scrollPosition >= (docHeight * 0.65)) {
      if ((this.productosPaginados.length < this.totalRegistros)) {
        this.loadMoreData();
      }
    }
  }

  loadMoreData() {
    this.appWebshopService.paginador.pagina++
    this.appWebshopService.addPaginadorLocalStorage();
    this.getproductosWebShop()
  }

  agregarACaja() {
    this.appWebshopService.agregarCajaMixtaAcarrito();
    this._limpiarWebShop();
  }

  openDialogMensajeCliente() {
    const dialogRef = this.dialog.open(MessageClientComponent, {
      data: { messagePublishTitle : this.messagePublishTitle , messagePublish: this.messagePublish},
    });
  }

    _allProducts() {

      if (this.appWebshopService.data.cartListCaja.length === 0) {
        this._aplicaFedexAllProducts(false);
        this.router.navigate(['home']);
        return;
      }
  
      const dialogRef = this.dialog.open(DeleteComponent, {
        data: {
          titulo: '',
          mensaje: '',
          mensajeDos: 'Are there products in your shopping cart, would you like to complete your existing order or start over?',
          imagen: 'C',
          starbuttons: 'S'
        },
        panelClass: 'delete-boxes'
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res || res == undefined) {
          //sessionStorage.setItem('selectContinueBuying', 'S');
          return;
        }
        else {
         // sessionStorage.setItem('selectContinueBuying', 'S');
          localStorage.removeItem("DataCar");
          localStorage.removeItem("idCarrito");
          this.appWebshopService.getCajaMixtaArmada();
          this.appWebshopService.data.totalCartCount = 0;
          this.appWebshopService.data.cartListCaja = [];
          this.router.navigate(['home']);
        }
      });


    //this.appService.showNabvarCardActive = false;
    // this.mensajeTropical = EnumMensajes.TROPICAL;
    // this.paginado.isTropical = true
    // this.listaFiltrosSeleccionados.push(new Filtro('TRO', 'Tropical Flowers', ''));
    // this.isLoadingOne = true
    // this.paginado.pagina = 1
    // this.productosPaginados = [];
    // this.getproductosWebShop()
    // this.agregarFiltro({ tipo: '', valor: "tropical flowers foliage magic", seleccionado: '' });

  }

  _buscarCategoriasConFiltroCheck(filtro) {

    const indexFiltroProducto = this.appWebshopService.productosWebShopFilter.findIndex(item => item.nombre === filtro.nombre);

    if (indexFiltroProducto !== -1) {
      if (this.appWebshopService.productosWebShopFilter[indexFiltroProducto].select === EnumSiNo.N || this.appWebshopService.productosWebShopFilter[indexFiltroProducto].select === undefined) {
        this.appWebshopService.productosWebShopFilter[indexFiltroProducto].select = EnumSiNo.S
        this.agregarFiltro({ tipo: '', valor: filtro.nombre.toUpperCase(), seleccionado: '' });
        this.appWebshopService.paginador.filtroProducto.push(filtro.nombre.toUpperCase())
        this.appWebshopService.addPaginadorLocalStorage();
      } else {
        this.appWebshopService.productosWebShopFilter[indexFiltroProducto].select = EnumSiNo.N
        this.eliminarFiltroSeleccionado(new Filtro('PRO', this.appWebshopService.productosWebShopFilter[indexFiltroProducto].nombre.toLocaleLowerCase(), ''), this.appWebshopService.productosWebShopFilter[indexFiltroProducto].nombre.toLowerCase())
        return
      }
    }
    this.isLoadingOne = true
    this.appWebshopService.paginador.pagina = 1
    this.appWebshopService.addPaginadorLocalStorage();
    this.productosPaginados = [];
    this.getproductosWebShop()
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }

  async obtenerProdcutosParaFiltros() {    
    while (!this.appWebshopService.productosWebShopFilter) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  agregarFiltro(filtro: Filtro) {
    this.nombreValorProducto = filtro.valor.toLowerCase()
    if (filtro.valor != this.filtroRepetido) {
      this.filtroRepetido = filtro.valor;
      this.filtroAnterior = filtro.valor;
    }
    this.appWebshopService.listaFiltrosSeleccionados.push(new Filtro('PRO', filtro.valor.toLowerCase(), ''));
  }

  eliminarFiltroSeleccionado(filtro: Filtro, value: string) {

    const indexFiltro = this.appWebshopService.listaFiltrosSeleccionados.findIndex(item => item.valor === filtro.valor)
    if (indexFiltro != -1) {
      this.appWebshopService.listaFiltrosSeleccionados.splice(indexFiltro, 1);
    }

    // if(this.appWebshopService.listaFiltrosSeleccionados.length == 0){
    //   this.router.navigate(['/home']);
    // }

    switch (filtro.tipo) {
      case 'PRO':
        const indexFiltroProducto = this.appWebshopService.productosWebShopFilter.findIndex(item => item.nombre === filtro.valor.toUpperCase());
        if (indexFiltroProducto !== -1) {
          this.appWebshopService.productosWebShopFilter[indexFiltroProducto].select = EnumSiNo.N
        }
        this.appWebshopService.paginador.filtroProducto = this.appWebshopService.paginador.filtroProducto.filter(elemento => elemento !== filtro.valor.toUpperCase())
        break;
      case 'COL':
        const indexFiltroColor = this.appWebshopService.coloresWebShop.findIndex(item => item.nombre === filtro.valor);
        if (indexFiltroColor !== -1) {
          this.appWebshopService.coloresWebShop[indexFiltroColor].select = EnumSiNo.N
        }
        this.appWebshopService.paginador.colores = this.appWebshopService.paginador.colores.filter(elemento => elemento !== filtro.valor.toUpperCase())
        break;
      case 'PROMO':
        this.appWebshopService.paginador.isPromo = !this.appWebshopService.paginador.isPromo
        this.appService.mostrarPromociones = !this.appService.mostrarPromociones
        break;
      case 'TRO':
        this.mensajeTropical = EnumMensajes.EMPTY
        this.appWebshopService.paginador.isTropical = true
        break;
    }
    this.isLoadingOne = true
    this.appWebshopService.paginador.pagina = 1
    this.appWebshopService.addPaginadorLocalStorage();
    this.productosPaginados = [];
    this.getproductosWebShop()
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  obtenerTodosCamiones() {
    this.appService.getAllCamiones().subscribe((data: any) => {
      this.camionesAll = data;
    });
  }

  seleccionarDestino(codigoMarcacion) {
    this.appService.getDestinos(codigoMarcacion).subscribe((data: any) => {
      this.destinos = data as Destino[];
      this.destinoSeleccionado = this.destinos[0];
      this.destinoSeleccionado.subcliente.infoShippingHub = ''
      this.destinoSeleccionado.subcliente.carrito = ''
      sessionStorage.setItem('Destino', JSON.stringify(this.destinoSeleccionado));
    });
  }

  seleccionarMarcacion() {
    var usuario = JSON.parse(localStorage.getItem("Usuario"))
    if (usuario.codigoClientePadre != undefined || usuario.codigoClientePadre != null) {
      if (sessionStorage.getItem('Marcacion') == 'undefined' || sessionStorage.getItem('Marcacion') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'S').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            const principal = this.subclientes.find(subcliente => subcliente.esPrincipal === 'S')
            if (principal) {
              this.marcacionSleccionada = principal
            } else {
              this.marcacionSleccionada = this.subclientes[0];
            }
            sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacionSleccionada));
            this.appService._getCargasTransportePorMarcacion(this.marcacionSleccionada.codigoSeleccion).subscribe(data => {
              localStorage.setItem("ls_cargos", JSON.stringify(data));
            });
            this.seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
            setTimeout(() => {
              this.sharedService.imageUpdated.emit('actualizando'),
                2000
            })
          }
        });
      }
      else {
        this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
        this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"));
      }
    }
    else {
      if (sessionStorage.getItem('Marcacion') == 'undefined' || sessionStorage.getItem('Marcacion') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            const principal = this.subclientes.find(subcliente => subcliente.esPrincipal === 'S')
            if (principal) {
              this.marcacionSleccionada = principal
            } else {
              this.marcacionSleccionada = this.subclientes[0];
            }
          }
          sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacionSleccionada));
          this.appService._getCargasTransportePorMarcacion(this.marcacionSleccionada.codigoSeleccion).subscribe(data => {
            localStorage.setItem("ls_cargos", JSON.stringify(data));
          });
          this.seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
          setTimeout(() => {
            this.sharedService.imageUpdated.emit('actualizando'),
              2000
          })
        });
      }
      else {
        this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
        this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"))
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"))
      }
    }
  }

  seleccionarCamion(codigoMarcacion) {
    this.appService.getCamionSeleccionado(codigoMarcacion).subscribe((data: any) => {
      this.camiones = data;
      if (this.camiones.length > 0) {
        this.camionSeleccionado = this.camiones[0];
        sessionStorage.setItem('Camion', JSON.stringify(this.camionSeleccionado));
      }
    });
  }

  async obtenerMensaje() {
    await this.appService.obtenerMensajePublicidad().subscribe(dataWeb => {
      const now = new Date();
      const datePipe = new DatePipe("en-US");
      const dateFormat = datePipe.transform(now, 'yyyy-MM-dd')
      if (dataWeb != null) {
        const webMessageDate = dataWeb.filter(x => dateFormat >= x.fechaInicio.toString() && dateFormat <= x.fechaFin.toString());
        if (webMessageDate.length > 0) {
          this.messagePublish = webMessageDate[0].texto;
          this.messagePublishTitle = webMessageDate[0].nombre;
        } else {
          this.messagePublish = EnumSinDatos.NOTDATA;
        }
      }
    }, (err: any) => {
      if (err) {
        this.messagePublish = EnumSinDatos.NOTDATA;
      }
    });
  }

  _iniciarPaginador() {
    this.datePipe = new DatePipe("en-US");
    this.appWebshopService.paginador.fecha = this.datePipe.transform(this.date.value, 'yyyy-MM-dd'); //'2023-12-25'//this.datePipe.transform(this.date.value, 'yyyy-MM-dd');
    this.appWebshopService.paginador.isTropical = true;
    if (this.appWebshopService.paginador.filtroNombre.length > 0) {
      this.filterValue = this.appWebshopService.paginador.filtroNombre;
    }
    this.appWebshopService.addPaginadorLocalStorage();
  }

    _aplicaFedexAllProducts(aplicaFedex: boolean) {

    if (this.appWebshopService.data.cartListCaja.length === 0) {
      this.router.navigate(['home']);
      sessionStorage.removeItem('Paginador');
      this.appWebshopService.paginador = this.appWebshopService.getPaginadorLocalStorage();

      this.appWebshopService.paginador.filtroNombre = '';
      this.appWebshopService.paginador.cajaMixta = []
      this.appWebshopService.paginador.colores = []
      this.appWebshopService.paginador.filtroProducto = []
      this.appWebshopService.paginador.isPromo = false
      this.appWebshopService.paginador.isLimited = false
      this.appWebshopService.paginador.orden = 'PRO'
      this.appWebshopService.addPaginadorLocalStorage();
      this.appWebshopService.coloresWebShop.forEach(color => color.select = EnumSiNo.N)
      this.appWebshopService.productosWebShopFilter.forEach(producto => producto.select = EnumSiNo.N)
      this.appService.mostrarPromociones = false;
      this.appService.mostrarLimited = false;
      this.appService.mostrarTinted = false;
      this.appWebshopService.listaFiltrosSeleccionados = [];

      if (aplicaFedex || this.appWebshopService.paginador.aplicaFedexCarrito) {

        this.appWebshopService.paginador.aplicaFedex = true
        this.getCarrierFedex()
        this._calcularDiasEntregaPedidoFedex();
      } else {
        this.appWebshopService.paginador.aplicaFedex = false
        sessionStorage.removeItem('Camion');
        localStorage.removeItem('_ls_dateConecction');
        this._getCalcularDiaEntrega()
      }
      this.productosPaginados = [];

      this.obtenerProductosPorTemporada();
      return;
    }
  }

  getCarrierFedex() {
    this.appService.getAllCamiones().subscribe((data: any) => {
      var carrier = data;
      (carrier);
      carrier = carrier.filter(item => item.codigoCamion === 'IPD');
      sessionStorage.setItem('Camion', JSON.stringify(carrier[0]));
    });
  }

  _calcularDiasEntregaPedidoFedex(): void {

    // const diasSemana = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const datePipe = new DatePipe('en-US');

    // Obtener la hora actual de Ecuador
    const zonaHorariaEcuador = new Date().toLocaleString('en-US', { timeZone: 'America/Guayaquil' });
    let fechaEcuador = new Date(zonaHorariaEcuador);

    const hora = fechaEcuador.getHours();
    const minutos = fechaEcuador.getMinutes();

    // Si es después de las 9:00 AM en Ecuador, considerar como pedido del día siguiente
    if (hora > 9 || (hora === 9 && minutos > 0)) {
      fechaEcuador.setDate(fechaEcuador.getDate() + 1);
    }

    const dia = fechaEcuador.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const fechaEntrega = new Date(fechaEcuador);
    // Aplicar lógica de entrega según día efectivo del pedido
    switch (dia) {
      case 2: // Martes
        // Entrega el lunes siguiente
        fechaEntrega.setDate(fechaEntrega.getDate() + ((8 - dia) % 7));
        break;
      case 3: // Miércoles
        // Entrega el martes siguiente
        fechaEntrega.setDate(fechaEntrega.getDate() + 6);
        break;
      case 4: // Jueves
        // Entrega el jueves siguiente
        fechaEntrega.setDate(fechaEntrega.getDate() + 7);
        break;
      case 5: // Viernes
        // Entrega el viernes siguiente
        fechaEntrega.setDate(fechaEntrega.getDate() + 10);
        break;
      default:
        // Sábado, domingo o lunes → entrega el lunes siguiente
        const diasParaLunes = (8 - dia) % 7;
        fechaEntrega.setDate(fechaEntrega.getDate() + diasParaLunes);
        break;
    }

    this.date = new FormControl(fechaEntrega);
    this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
    localStorage.setItem('_ls_dateConecction', this.date.value.toString());
  }

  obtenerProductosPorTemporada() {

    this.getColoresWebShop();

    let dateConnection = localStorage.getItem('_ls_dateConecction');

    if (dateConnection != null || dateConnection != undefined) {
      this.date = new Date(dateConnection);

      this.datePipe = new DatePipe("en-US");
      this.appWebshopService.paginador.fecha = this.datePipe.transform(this.date, 'yyyy-MM-dd');
      this.appWebshopService.addPaginadorLocalStorage();
    }

    this.getproductosWebShop();
  }

  async getproductosWebShop() {
    this.isLoadingOne = true
    this.isLoading = true;
    this.destinoSeleccionado = JSON.parse(sessionStorage.getItem('Destino'));

    while (!this.destinoSeleccionado) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.destinoSeleccionado = JSON.parse(sessionStorage.getItem('Destino'));
    }

    const cliente: any = JSON.parse(localStorage.getItem('Usuario'));
    this.appWebshopService.paginador.codigoTipoCliente = cliente.codigoTipoCliente
    this.appWebshopService.paginador.margen = this.destinoSeleccionado.subcliente.marginSubcliente
    this.appWebshopService.addPaginadorLocalStorage();

    this.appWebshopService.getProductosWebShopPostV2(this.appWebshopService.paginador).subscribe(data => {
      this.totalRegistros = data.numRegistros;
      this.productosPaginados = this.productosPaginados.concat(JSON.parse(data.json))
      this.isLoading = false;
      this.isLoadingOne = false;
      this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
    },
      error => {
        console.error('Error al obtener productos:', error);
        this.isLoading = false;
        this.isLoadingOne = false;
      });
  }

  _eliminarTodasVariedades() {
    this._limpiarWebShop();
  }

  eliminarVariedad(index: number) {
    this.appWebshopService.eliminarCajaMixta(index)
    this.filtrarPorVariedadAgregada()
  }

  aumentarTamanioCaja() {
    this.appWebshopService.aumentarTamanioCaja()
    this.getproductosWebShop()
  }

  getColoresWebShop() {
    this.appService.getColoresWebShop().subscribe(colores => {
      this.coloresEncontrados = colores.numRegistros
      this.appWebshopService.coloresWebShop = JSON.parse(colores.json);
      this.appWebshopService.coloresWebShop.forEach(x => {
        if (x.colorHex != null || x.colorHex != undefined) {
          x.colorHex = '#' + x.colorHex;
        }
        if (x.color2Hex != null || x.color2Hex != undefined) {
          x.color2Hex = '#' + x.color2Hex;
        }
        if (x.color2Hex === '#') {
          x.color2Hex = x.colorHex;
        }

        x.nombre = x.nombre.toLowerCase();
        if (x.nombre.toLowerCase().includes(' ')) {
          x.estilo = 'c-' + x.nombre.toLocaleLowerCase().replace(' ', '-');
        }
        if (x.nombre.toLowerCase().includes('/')) {
          x.estilo = 'c-' + x.nombre.toLocaleLowerCase().replace('/', '-');
        }
        else {
          x.estilo = 'c-' + x.nombre.toLocaleLowerCase().replace(' ', '-');
        }
        if (this.appWebshopService.paginador.colores.length > 0) {
          this.appWebshopService.paginador.colores.forEach(color => {
            let colorSeleccionado = x.nombre.toLocaleUpperCase();
            if (color === colorSeleccionado) {

              this.appWebshopService.listaFiltrosSeleccionados.push(new Filtro('COL', x.nombre.toLocaleLowerCase(), 'S'));
              x.select = EnumSiNo.S
            } else {
              x.select = EnumSiNo.N
            }
          })
        }
      })
      this.appWebshopService.coloresWebShop = this.appWebshopService.coloresWebShop.sort(function (a, b) {
        return a.nombre.localeCompare(b.nombre);
      });
    });
  }

  _informationDialogControl(event) {
    this.appService.actualizarAumentarCajaMixta(event)
    this._informationDialog(this.marcacionSleccionada, this.appWebshopService.paginador.isTropical ? 'T' : '')
  }

  public _informationDialog(marcacion, tipo) {
    let usuario = JSON.parse(localStorage.getItem("Usuario"));

    if (usuario.estadoPadre === 'BLO') {
      this.snackBar.open('New orders cannot be placed, please contact your account manager for help.', '×'
        , { panelClass: 'error', verticalPosition: 'top', duration: 7000 });
      return
    }

    tipo =  this.appWebshopService.paginador.isTropical ? 'T' : ''
    if (this.appWebshopService.data.cartListCaja.length !== 0) {
      return
    }
    if (this.appWebshopService.cajaMixtaArmada.detalle.length !== 0) {
      return
    }
    var camionNombre = '';
    if (this.camionSeleccionado == undefined) {
      camionNombre = 'SN';
    } else {
      camionNombre = this.camionSeleccionado.nombre
    }
    var destinoNombre = '';
    if (this.destinoSeleccionado == undefined) {
      destinoNombre = 'SN';
    } else {
      destinoNombre = this.destinoSeleccionado.nombre
    }
    const dialogRef = this.dialog.open(InformationComponent, {
      data: { data: 'N', marcacion: marcacion, camion: camionNombre, pagina: 'HUB', tipo: tipo, destino: destinoNombre },
      panelClass: 'information',
      disableClose: true,
      //maxHeight: '95vh'informat
    });
    dialogRef.afterClosed().subscribe(respuesta => {

      this.isLoadingDate = true;

      const dateString = localStorage.getItem('_ls_dateConecction');

      const dateDateFormat = this.datePipe.transform(dateString, 'MM-dd-yyyy');

      //this.dateMostrar = dateDateFormat.toString()

      this.isLoadingDate = false;

      if (respuesta != null) {
        this.actualizarDatos();
        this.appService.guardarShippingInformation(
          this.marcacionSleccionada,
          this.camionSeleccionado,
          this.destinoSeleccionado,
          EnumPagina.HUB);
        if (this.appService.aumentarCajaMixta) {
          this.appService.dispararEventoCamionYPoMixBox();
          this.appService.actualizarAumentarCajaMixta('false');
        } else {
          this.appService.dispararEventoCamionYPo();
        }
        //this.seleccionaCamionPo.emit();
      }
    });
  }

  public actualizarDatos() {
    this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
    this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
    this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"));
    this._getCalcularDiaEntrega()
  }

  _getCalcularDiaEntrega() {
    var dia = this._getDiaSemana();
    var hora = this._getHoraDia();
    var minutos = this._getMinutos();
    switch (dia) {
      case 'Monday': {
        if (hora < 9 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 9 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Monday');
        }
        break;
      }
      case 'Tuesday': {
        if (hora < 9 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 9 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Tuesday');
        }
        break;
      }
      case 'Wednesday': {
        if (hora < 9 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 9 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Wednesday');
        }
        break;
      }
      case 'Thursday': {
        if (hora < 9 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 9 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Thursday');
        }
        break;
      }
      case 'Friday': {
        if (hora < 9 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 9 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Friday');
        }
        break;
      }
      case 'Saturday': {
        this._getFechaFlorex();
        break;
      }
      case 'Sunday': {
        this._getFechaFlorex();
        break;
      }
    }
  }

  _mostrarPromociones() {
    this.appService.mostrarPromociones = !this.appService.mostrarPromociones;
    this.appWebshopService.paginador.isPromo = !this.appWebshopService.paginador.isPromo
    var indexPromo = this.appWebshopService.listaFiltrosSeleccionados.findIndex(item => item.tipo === 'PROMO')

    if (this.appService.mostrarPromociones && indexPromo == -1) {
      this.appWebshopService.listaFiltrosSeleccionados.push({ valor: 'Promo', tipo: 'PROMO', seleccionado: 'S' });
    }

    if (!this.appService.mostrarPromociones && indexPromo != -1) {
      this.appWebshopService.listaFiltrosSeleccionados.splice(indexPromo, 1);
    }

    this.isLoadingOne = true
    this.appWebshopService.paginador.pagina = 1
    this.appWebshopService.addPaginadorLocalStorage();
    this.productosPaginados = [];
    this.getproductosWebShop();
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }

  _mostrarTinted() {
    this.appService.mostrarTinted = !this.appService.mostrarTinted;
    this.appWebshopService.paginador.isTinted = !this.appWebshopService.paginador.isTinted
    var indexTinted = this.appWebshopService.listaFiltrosSeleccionados.findIndex(item => item.tipo === 'TINTED')

    if (this.appService.mostrarTinted && indexTinted == -1) {
      this.appWebshopService.listaFiltrosSeleccionados.push({ valor: 'Tinted', tipo: 'TINTED', seleccionado: 'S' });
    }

    if (!this.appService.mostrarTinted && indexTinted != -1) {
      this.appWebshopService.listaFiltrosSeleccionados.splice(indexTinted, 1);
    }

    this.isLoadingOne = true
    this.appWebshopService.paginador.pagina = 1
    this.appWebshopService.addPaginadorLocalStorage();
    this.productosPaginados = [];
    this.getproductosWebShop();
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }

  _mostrarLimited() {
    this.appService.mostrarLimited = !this.appService.mostrarLimited;
    this.appWebshopService.paginador.isLimited = !this.appWebshopService.paginador.isLimited
    var indexLimited = this.appWebshopService.listaFiltrosSeleccionados.findIndex(item => item.tipo === 'LIMITED')

    if (this.appService.mostrarLimited && indexLimited == -1) {
      this.appWebshopService.listaFiltrosSeleccionados.push({ valor: 'Limited', tipo: 'LIMITED', seleccionado: 'S' });
    }

    if (!this.appService.mostrarLimited && indexLimited != -1) {
      this.appWebshopService.listaFiltrosSeleccionados.splice(indexLimited, 1);
    }

    this.isLoadingOne = true
    this.appWebshopService.paginador.pagina = 1
    this.appWebshopService.addPaginadorLocalStorage();
    this.productosPaginados = [];
    this.getproductosWebShop();
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
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

  _getFechaFlorex() {
    var fechaInicia = new Date();
    var datePipe = new DatePipe("en-US");
    if (localStorage.getItem("_ls_dateConecction") != null || localStorage.getItem("_ls_dateConecction") != undefined) {
      this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecction')));
      this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
      localStorage.setItem("_ls_dateConecction", this.date.value);
      return;
    }
    if (this.usuario.codigoClientePadre == 1940) { //Si es FLOWERFULL
      if (this.diaSemana === 'Sunday' ||
        this.diaSemana === 'Monday' ||
        this.diaSemana === 'Tuesday') {
        fechaInicia.setDate(fechaInicia.getDate() + 4);
      }
      if (this.diaSemana === 'Wednesday' ||
        this.diaSemana === 'Thursday' ||
        this.diaSemana === 'Friday' ||
        this.diaSemana === 'Saturday') {
        fechaInicia.setDate(fechaInicia.getDate() + 5);
      }
    }
    else { //Si no es FLOWERFULL
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

    this.date = new FormControl(new Date(fechaInicia));
    this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
    localStorage.setItem("_ls_dateConecction", this.date.value);

    this.dateMostrar = datePipe.transform(this.date.value, 'yyyy-MM-dd');
  }

  _calcularDiasEntregaPedido(dia: string) {
    var fechaInicia = new Date();
    var datePipe = new DatePipe("en-US");
    if (localStorage.getItem("_ls_dateConecction") != null || localStorage.getItem("_ls_dateConecction") != undefined) {
      this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecction')));
      this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
      localStorage.setItem("_ls_dateConecction", this.date.value);
      return;
    }
    if (this.usuario.codigoClientePadre == 1940) { //Si es FLOWERFULL
      if (dia === 'Saturday' || dia === 'Sunday' || dia === 'Monday') {
        fechaInicia.setDate(fechaInicia.getDate() + 5);
      }
      if (dia === 'Tuesday' || dia === 'Wednesday' || dia === 'Thursday' || dia === 'Friday') {
        fechaInicia.setDate(fechaInicia.getDate() + 6);
      }
    }
    else { //Si no es FLOWERFULL
      if (dia === 'Monday' || dia === 'Tuesday' || dia === 'Wednesday' || dia === 'Thursday') {
        fechaInicia.setDate(fechaInicia.getDate() + 4);
      }
      if (dia === 'Friday') {
        fechaInicia.setDate(fechaInicia.getDate() + 6);
      }
    }

    this.date = new FormControl(new Date(fechaInicia));
    this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
    localStorage.setItem("_ls_dateConecction", this.date.value);
  }

  _verFiltrosCategorias() {
    const dialogRef = this.dialog.open(FiltersComponent, {
      data: { filtros: this.appWebshopService.productosWebShopFilter, tipoFiltro: 'P' },
      panelClass: 'filters'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != null || res != undefined) {
        for (let valor of res) {
          this.appWebshopService.paginador.filtroProducto.push(valor.toUpperCase())
          this.agregarFiltro({ tipo: '', valor: valor.toLowerCase(), seleccionado: '' });
        }

        this.isLoadingOne = true
        this.appWebshopService.paginador.pagina = 1
        this.appWebshopService.addPaginadorLocalStorage();
        this.productosPaginados = [];
        this.getproductosWebShop();
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
      }
    });
  }

  _eliminarFitros() {
    this.appService.showNabvarCardActive = true;
    this.appWebshopService.paginador.numRegistros = 50;
    this.appWebshopService.paginador.pagina = 1
    this.appWebshopService.paginador.isTropical = true
    this.appWebshopService.paginador.colores = []
    this.appWebshopService.paginador.filtroProducto = []
    this.appWebshopService.paginador.isPromo = false
    this.appWebshopService.paginador.isLimited = false
    this.appWebshopService.paginador.isTinted = false
    this.appWebshopService.paginador.orden = 'PRO'
    this.appWebshopService.addPaginadorLocalStorage();
    this.appWebshopService.coloresWebShop.forEach(color => color.select = EnumSiNo.N)
    this.appWebshopService.productosWebShopFilter.forEach(producto => producto.select = EnumSiNo.N)
    this.appService.mostrarPromociones = false;
    this.appService.mostrarLimited = false;
    this.appService.mostrarTinted = false;
    this.appWebshopService.listaFiltrosSeleccionados = [];
    this.productosPaginados = [];
    //this.router.navigate(['/home']);
    this.obtenerProductosPorTemporada()
   window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public dutchDirect() {
     const dialogRef = this.dialog.open(DifferentdestinationComponent, {
       panelClass: 'dutch-direct',
       data: { link: JSON.parse(localStorage.getItem('Usuario')).paginaWeb },
       disableClose: true // Evita el cierre al hacer clic fuera del cuadro de diálogo
     });
  }

  changeColor(color: string) {
    const colorLowerCase = color.toLowerCase();
    const colorUpperCase = color.toUpperCase();

    let seAgrega = true;

    this.nombreValorProducto = colorLowerCase;

    this.appWebshopService.coloresWebShop.forEach(item => {
      if (item.nombre === colorLowerCase) {
        if (item.select === EnumSiNo.N || item.select === undefined) {
          item.select = EnumSiNo.S;
        } else {
          item.select = EnumSiNo.N;
          seAgrega = false;
        }
      }
    });

    const indiceElemento = this.appWebshopService.paginador.colores.indexOf(colorUpperCase);

    if (indiceElemento !== -1) {
      this.appWebshopService.paginador.colores.splice(indiceElemento, 1);
      //     this.appWebshopService.paginador.pagina = 1
      this.appWebshopService.addPaginadorLocalStorage();
    }

    this.appWebshopService.listaFiltrosSeleccionados = this.appWebshopService.listaFiltrosSeleccionados.filter(
      filtro => filtro.valor !== colorLowerCase
    );

    if (seAgrega) {
      this.appWebshopService.paginador.colores.push(colorUpperCase);
      //  this.appWebshopService.paginador.pagina = 1
      this.appWebshopService.addPaginadorLocalStorage();
      this.appWebshopService.listaFiltrosSeleccionados.push(new Filtro('COL', colorLowerCase, 'S'));
    }

    this.appWebshopService.paginador.pagina = 1
    this.appWebshopService.addPaginadorLocalStorage();
    this.productosPaginados = [];
    this.getproductosWebShop();

    this.listaFiltrosSeleccionadosColor.push(colorLowerCase);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.GeneralEventFilter();
  }

  GeneralEventFilter() {
    if (this.cajaArmada.totalProcentajeLleno > 0) {
      const dialogRef = this.dialog.open(DeleteComponent, {
        data: { titulo: 'Caution', mensaje: 'You will lost the mix created if you do this action, continue with finding' },
        panelClass: 'delete-boxes'
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this._limipiarVariablesCuandoBusca();
          this.isLoadingOne = true
          this.appWebshopService.paginador.pagina = 1
          this.appWebshopService.addPaginadorLocalStorage();
          this.productosPaginados = [];
          this.getproductosWebShop()
          //this._validarFiltroProductos(filtro);
          return;
        }
        else {
          var index = this.appWebshopService.listaFiltrosSeleccionados.findIndex(x => x.valor === this.nombreValorProducto);
          if (index !== -1) {
            this.appWebshopService.listaFiltrosSeleccionados.splice(index, 1);
          }
          for (let index = 0; index < this.listaFiltros.length; index++) {
            const element = this.listaFiltros[index];
            if (element.valor === this.nombreValorProducto) {
              element.seleccionado = 'N';
            }
          }
          this.appService.limpiarFiltroColor = [];
          return;
        }
      });
    } else {
      //this._validarFiltroProductos(filtro);
    }
  }

  _limipiarVariablesCuandoBusca() {
    this.appService.codigosProveedorFinales = [];
    this.appService.codigosProveedorRespaldo = [];
    this.productosPaginados = [];
    // this.productosProveedor = [];
    this.appService.CajaArmada.totalProcentajeLleno = 0;
    this.cajaArmada.variedades = [];
    this.cajaArmada.totalCantidadPorBunche = 0;
    this.appService.cajaSeleccionada = EnumTipoCaja.EB;
    this.appService.cajasConValor = [];
    this.appService.CajaArmada.totalPiezas = 0;
    let uniques = Array.from(new Set(this.appWebshopService.listaFiltrosSeleccionados));
    this.appWebshopService.listaFiltrosSeleccionados = uniques;
    // this.mensajeValorProducto = true;
    this.appService.activarQueryRoses = false;
    this.appService.realizoBusquedaProducto = false;
    // this.buscarColoresPorProducto = '';
    this.appService.resultadoBusqueda = false;
    this.appService.mostrarPromociones = false;
    this.appService.mostrarLimited = false;
    this.appService.mostrarTinted = false;
    //   this.productoNoEncontrado = false;
    this.mensajeTropical = EnumMensajes.EMPTY;
    //this._obtenerColoresFiltro();
  }

  buscarProductosFiltro(evento, tipoBusqueda) {
    this.appWebshopService.paginador.pagina = 1
    this.appWebshopService.addPaginadorLocalStorage();
    this.productosPaginados = [];
    this.appService.showNabvarCardActive = true;
    
    const cajaMixtaTamanio = this.appWebshopService.cajaMixtaArmada.tamanioCaja
    this.appWebshopService.cajaMixtaArmada.detalle.forEach(caj => {
      const talla = this.appWebshopService.obtenerTallaProducto(caj.producto)
      new Variedad(caj.producto.codigoVariedad, caj.producto.nombreVariedad, caj.producto.producto, 0, '', 0, talla.talla, 0, '', 0, 0, '', 0)
      this.appWebshopService.paginador.cajaMixta.push(new Variedad(caj.producto.codigoVariedad, caj.producto.nombreVariedad, caj.producto.producto, 0, cajaMixtaTamanio, 0, talla.talla, 0, '', 0, 0, '', 0))
    })
    this.appWebshopService.addPaginadorLocalStorage();

    if (this.filterValue.length <= 0 && this.appWebshopService.paginador.cajaMixta.length <= 0 &&
      this.appWebshopService.paginador.colores.length <= 0 &&
      this.appWebshopService.paginador.filtroProducto.length <= 0 &&
      this.appWebshopService.getCajaMixtaArmada().detalle.length <= 0) {
      console.log("Mensaje vacio");
        
        this._limpiarWebShop(); }
    if (this.filterValue != '' && this.filterValue.length > 3) {
      if (this.appWebshopService.listaFiltrosSeleccionados.filter(x => x.valor == this.filterValue).length > 0) { return };

      this.appWebshopService.paginador.filtroNombre = this.filterValue.toUpperCase();
      this.appWebshopService.paginador.pagina = 1;
      this.appWebshopService.addPaginadorLocalStorage();
      //busca cuando da enter
      if (tipoBusqueda == 'N') {
        if (evento.keyCode == 13) {
          this.obtenerProductosPorTemporada();
          // this.GeneralEventFilter("PRO");
          this.appService.resultadoBusqueda = true;
          //this.productoNoEncontrado = false;
          return;
        }
      }
      //filtra productos cuando hace click en la lista o en el boton
      if (tipoBusqueda == 'S') {
        // TODO: Lista de Prodcutos y variadades completas para autocompletar

        this.obtenerProductosPorTemporada();
        this.appService.resultadoBusqueda = true;
        // this.productoNoEncontrado = false;
      }
    } else {
      this.appWebshopService.paginador.filtroNombre = this.filterValue.toUpperCase();
      this.appWebshopService.paginador.pagina = 1;
      this.appWebshopService.addPaginadorLocalStorage();
      this.obtenerProductosPorTemporada();
    }
  }

  _limpiarWebShop() {
    this.appService.codigosProveedorFinales = [];
    this.appService.codigosProveedorRespaldo = [];
    this.appService.listaProductosBusquedaMezcla = [];
    this.appService.realizoBusquedaProducto = false;
    //this.appService.CajaArmada.totalProcentajeLleno = 0;
    //this.appService.CajaArmada.variedades = [];
    //this.appService.CajaArmada.totalPiezas = 0;
    this.appService.cajaSeleccionada = "EB";
    this.appService.cajasConValor = [];
    this.appService.busquedaGeneralWs = "";
    this.appService.activarQueryRoses = false;
    this.appService.resultadoBusqueda = false;
    this.appService.mostrarPromociones = false;
    this.appService.activarBusquedaCuandoElimina = false;
    this.appWebshopService.cajaMixtaArmada = this.appWebshopService.armarCajaMixta()
    // this.productosProveedor = [];
    // this.nombreVariedadSeleccionada = [];
    this.appWebshopService.listaFiltrosSeleccionados = [];
    this.listaFiltrosSeleccionadosColor = [];
    //  this.listaFiltrosSeleccionadosProducto = [];
    //  this.listaFiltrosFinales = [];
    this.cajaArmada.variedades = [];
    this.cajaArmada.totalCantidadPorBunche = 0;
    // this.mensajeValorProducto = false;
    this.filterValue = "";
    // this.valorBusquedaCat = "";
    // this.valorBusquedaCol = "";
    // this.nombreVariedadSeleccionada = [];
    //this.productoNoEncontrado = false;
    // this.mostrarFiltrosAll = false;
    this.filtroRepetido = "";
    // this.productos = [];
    // this.DatosProductos = [];
    // this.buscarColoresPorProducto = "";
    // this.page = 1;
    //  this.paginaProductos = 1;
    //  this.itemsPorPagina = 50;
    //  this.pageNumbers = [50];
    this.mensajeTropical = EnumMensajes.EMPTY;
    window.scrollTo(0, 0);
    this.appWebshopService.paginador.filtroNombre = '';
    this.appWebshopService.paginador.cajaMixta = []
    this.appWebshopService.paginador.pagina = 1
    this.appWebshopService.paginador.colores = []
    this.appWebshopService.paginador.filtroProducto = [];
    this.appWebshopService.addPaginadorLocalStorage();

    this.isLoadingOne = true
    this.productosPaginados = [];
    this.getproductosWebShop();
    // this.router.navigate(['/home']);
  }

  _limpiarWebShopFiltros(){

 //   const paginadoRespaldo = _.cloneDeep(this.paginado)

    this._limpiarWebShop();
  //  this.paginado.cajaMixta = paginadoRespaldo.cajaMixta

  }

  _iniciarProductosParaFiltros() {
    this.appService.getProductosWebShopParaFiltros(this.appWebshopService.paginador).subscribe(data => {
      this.appWebshopService.productosWebShopFilter = JSON.parse(data.json);
      this.appWebshopService.productosWebShopFilter.forEach(item => item.select == EnumSiNo.N)

      this.appWebshopService.paginador.filtroProducto.forEach(filtro => {

        const indexFiltroProducto = this.appWebshopService.productosWebShopFilter.findIndex(item => item.nombre === filtro);

        if (indexFiltroProducto !== -1) {
          if (this.appWebshopService.productosWebShopFilter[indexFiltroProducto].select === EnumSiNo.N || this.appWebshopService.productosWebShopFilter[indexFiltroProducto].select === undefined) {
            this.appWebshopService.productosWebShopFilter[indexFiltroProducto].select = EnumSiNo.S
            this.agregarFiltro({ tipo: '', valor: filtro.toUpperCase(), seleccionado: '' });
          } else {
            this.appWebshopService.productosWebShopFilter[indexFiltroProducto].select = EnumSiNo.N
            this.eliminarFiltroSeleccionado(new Filtro('PRO', this.appWebshopService.productosWebShopFilter[indexFiltroProducto].nombre.toLocaleLowerCase(), ''), this.appWebshopService.productosWebShopFilter[indexFiltroProducto].nombre.toLowerCase())
            return
          }
        }
      })

    })
  }

  filtrarPorVariedadAgregada() {
    window.scrollTo(0, 0);
    this.filterValue = '';
    this.appWebshopService.paginador.filtroNombre = '';
    this.appWebshopService.paginador.cajaMixta = []
    this.appWebshopService.paginador.colores = []
    this.appWebshopService.paginador.filtroProducto = []
    this.appWebshopService.paginador.isPromo = false
    this.appWebshopService.paginador.isLimited = false
    this.appWebshopService.paginador.orden = 'PRO'
    this.appWebshopService.addPaginadorLocalStorage();
    this.appWebshopService.coloresWebShop.forEach(color => color.select = EnumSiNo.N)
    this.appWebshopService.productosWebShopFilter.forEach(producto => producto.select = EnumSiNo.N)
    this.appService.mostrarPromociones = false;
    this.appService.mostrarLimited = false;
    this.appService.mostrarTinted = false;
    this.appWebshopService.listaFiltrosSeleccionados = [];
    
    const cajaMixtaTamanio = this.appWebshopService.cajaMixtaArmada.tamanioCaja
    this.appWebshopService.cajaMixtaArmada.detalle.forEach(caj => {
      const talla = this.appWebshopService.obtenerTallaProducto(caj.producto)
      new Variedad(caj.producto.codigoVariedad, caj.producto.nombreVariedad, caj.producto.producto, 0, '', 0, talla.talla, 0, '', 0, 0, '', 0)
      this.appWebshopService.paginador.cajaMixta.push(new Variedad(caj.producto.codigoVariedad, caj.producto.nombreVariedad, caj.producto.producto, 0, cajaMixtaTamanio, 0, talla.talla, 0, '', 0, 0, '', 0))
    })
    this.appWebshopService.paginador.pagina = 1
    this.appWebshopService.addPaginadorLocalStorage();
    this.productosPaginados = []
    this.obtenerProductosPorTemporada()
  }


}
