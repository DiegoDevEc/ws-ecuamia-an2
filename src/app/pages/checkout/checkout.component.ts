import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatStepper, MatDatepicker } from '@angular/material';
import { AppService } from '../../app.service';
import { Caja, Orden, Destino, Camion, ambiente } from 'src/app/app.modelsWebShop';
import { FincaPreferida } from "src/app/FincaPreferida";
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common'
import { OrderPlacedComponent } from '../popus/order-placed/order-placed.component';
import { InformationComponent } from '../popus/information/information.component';
import { CargosAdicionalesComponent } from '../popus/cargos-adicionales/cargos-adicionales.component';
import { NewPoComponent } from 'src/app/shared/products-carousel/new-po/new-po.component';
import { EnumMensajes, EnumSiNo } from 'src/app/enumeration/enumeration';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppWebshopService } from 'src/app/app-webshop.service';
import { CajaCarritoDetalleWebShop, OrdenCompraWebShop } from 'src/app/app.modelsWebShopV2';
import { ResponsiveService } from 'src/app/responsive.service';
import swal from 'sweetalert2';
import { InformationService } from 'src/app/core/services/information-service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  @ViewChild('verticalStepper') verticalStepper: MatStepper;

  total = 0;
  grandTotal = 0;
  cartItemCount = 0;
  cartItemCountTotal = 0;
  date: any;
  dateT: any;
  c: any;
  carrier: Camion[] = [];
  destinoSeleccionado: Destino;
  camionSeleccionado: Camion;
  marcacionSleccionada: any;
  destinoSeleccionadoT: Destino;
  marcacionSleccionadaT: any;
  boxesEB: number = 0;
  boxesQB: number = 0;
  boxesHB: number = 0;
  boxesEBT: number = 0;
  boxesQBT: number = 0;
  boxesHBT: number = 0;
  countBoxesTruckingHB: number = 0;
  countBoxesTruckingQB: number = 0;
  countBoxesTruckingEB: number = 0;
  dateNowInit: string;
  dateNowInitT: string;
  updateDate: any;
  updateDateT: any;
  tipoCliente: number;
  truckingCharges: number;
  resultadoProveedor: FincaPreferida[] = [];
  cajaHub: Caja[] = [];
  cajaHubT: Caja[] = [];
  totalCajas: number = 0;
  totalCajasSolidas: number = 0;
  totalCajasTropicales: number = 0;
  cantidadPorLote: number = 0;
  precioPorLote: number = 0;
  precioPorCaja: number = 0;
  contadorPorLote = 0;
  observacion: string = '';
  destinoFinal: Destino[] = [];
  selectDestino: Destino[] = this.destinoFinal;
  mostrarDestino = [];
  po: Destino[] = [];
  urlImagen: string;
  contieneTropical: string = EnumSiNo.N;
  mensajetropical = EnumMensajes.TROPICAL;
  isMobile: boolean;
  constructor(public appService: AppService, public formBuilder: FormBuilder, private router: Router, public dialog: MatDialog,
    public datePipe: DatePipe,
    public snackBar: MatSnackBar,
    public appWebShopService: AppWebshopService,
    private informarmationService: InformationService,
    private spinner: NgxSpinnerService, public responsive: ResponsiveService) {
      this.isMobile = this.responsive.isMobile();
  }

  //false hub
  //true standing
  ngOnInit() {
    this._getFincasPreferidasComunes()
    //console.log(JSON.stringify(this.appWebshopService.data.cartListCaja))

    this.urlImagen = ambiente.urlFotos
    localStorage.removeItem("_lsIndividualC");
    this.verificarContenido(false);
    this.calcularFechaEnvio();
    this._seleccionarMarcacion();
   // this._calculosCajas(false);
    this.appService.contadorCarrito();
    this.totalCajas = this.appService._contadorCarritoPorTipoCaja(false);
    this.appService._botonMenuSeleccionado(this.router.url);
  }

  verificarContenido(condicion: boolean) {

    for (let caja of this.appService.Data.cartListCaja) {
      if (caja.stadingOrder === condicion) {
        if (this.appService.tropfilter.includes(caja.verificarVariedadCaja.toUpperCase())) {
          this.contieneTropical = EnumSiNo.S
          break;
        }
      }
    }
    for (let caja of this.appService.Data.cartListCaja) {
      if (caja.stadingOrder === condicion) {
        if (this.appService.tropfilter.includes(caja.verificarVariedadCaja.toUpperCase())) {
          this.totalCajasTropicales++;
        } else {
          this.totalCajasSolidas++;
        }
      }
    }
  }

  /*_calculosCajas(condicion: boolean) {
    this.appService._calcularTotalCajaPorTipoCarrito(condicion);
    this.total = 0;
    this.grandTotal = 0;
    this.cartItemCount = 0;
    this.cartItemCountTotal = 0;
    this.appService.totalTuckingBoxes = 0;
    this.appService.Data.cartListCaja.forEach(caja => {
      if (caja.stadingOrder === condicion) {
        this.total += caja.totalPrecio;
        this.grandTotal += caja.totalPrecio;
        this.cartItemCount += 1;
        this.cartItemCountTotal += 1;
        caja.mostrarDetalle = false;
      }
    });

    var resultado = this.appService._consultarSiEsFloristeria();

    if (resultado === EnumSiNo.N) {
      this._getTotalCajaConCargosAdicionales(condicion);
    }

    if (resultado === EnumSiNo.S) {
      this._getCargosAdicionalesPorFloristeria(condicion);
    }

    this.appService.addCartLocalStorage();
  }*/

  calcularFechaEnvio() {
    var datePipe = new DatePipe("en-US");
    this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecction')));
    this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');

    if (this.contieneTropical == EnumSiNo.S) {
      this.dateT = new FormControl(new Date(localStorage.getItem('_ls_dateConecctionT')));
      this.dateNowInitT = datePipe.transform(this.dateT.value, 'yyyy-MM-dd')
    }

  }

  _seleccionarMarcacion() {
    if(this.appWebShopService.paginador.isTropical == true){
      this.tropicalCamionFedex();
    }
    this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
    this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
    this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"));

    this.destinoSeleccionadoT = JSON.parse(sessionStorage.getItem("DestinoT"));
    this.marcacionSleccionadaT = JSON.parse(sessionStorage.getItem("MarcacionT"));

    this._obtenerDestinosPorMarcacion(this.marcacionSleccionada.pk.codigoMarcacion);
  }

  tropicalCamionFedex() {
    // Obtén el valor del Camion almacenado en sessionStorage (antes de eliminarlo)
    const camionStorage = JSON.parse(sessionStorage.getItem('Camion') || 'null');
    
    // Elimina el valor de 'Camion' del sessionStorage
    sessionStorage.removeItem('Camion');
    
    this.appService.getAllCamiones().subscribe((data: any) => {
      this.carrier = data;
  
      // Si hay un Camion previamente almacenado, ajústalo al principio de la lista
      if (camionStorage != null) {
        const indexCamion = this.carrier.findIndex(item => item.nombre === camionStorage.nombre);
        if (indexCamion !== -1) {
          const camion = this.carrier.splice(indexCamion, 1); // Remueve el camión del array
          this.carrier.unshift(camion[0]); // Agrega el camión al inicio del array
        }
      }
  
      // Filtra los camiones con codigoCamion === 'FDX'
      const camionesFiltrados = this.carrier.filter(item => item.codigoCamion === 'FDX');
      
      // Si existe al menos un camión, guárdalo en el sessionStorage
      if (camionesFiltrados.length > 0) {
        sessionStorage.setItem('Camion', JSON.stringify(camionesFiltrados[0]));
      }
    });
  }

  _getTotalCajaConCargosAdicionales(condicion: boolean) {
    var usuario = JSON.parse(localStorage.getItem("Usuario"));
    if (JSON.parse(localStorage.getItem("Usuario")) != undefined) {
      this.appService._getCargosAdicionalesMarcacion(usuario.codigoPersona).subscribe(data => {
        this._iniciarVariables();
        data.forEach(item => {
          if (item.tipoCaja == "EB") { this.boxesEB = item.valorEnvio }
          if (item.tipoCaja == "HB") { this.boxesHB = item.valorEnvio }
          if (item.tipoCaja == "QB") { this.boxesQB = item.valorEnvio }
        });
        this._calculosCartListCajas(condicion);
      });
    }

    if (usuario.codigoClientePadre === undefined || usuario.codigoClientePadre === null) {
      var marcacion;
      if (condicion === false) { marcacion = JSON.parse(sessionStorage.getItem("Marcacion")) }
      if (condicion === true) { marcacion = JSON.parse(sessionStorage.getItem("MarcacionStading")); }
      this.appService._getCargasTransportePorMarcacion(marcacion.pk.codigoMarcacion).subscribe(data => {
        this._iniciarVariables();
        localStorage.setItem("ls_cargos", JSON.stringify(data));
        var resultado = JSON.parse(localStorage.getItem("ls_cargos"));
        if (resultado.length > 1) {
          resultado.forEach(item => {
            if (item.tipoCaja == "EB") { this.boxesEB = item.valorEnvio }
            if (item.tipoCaja == "HB") { this.boxesHB = item.valorEnvio }
            if (item.tipoCaja == "QB") { this.boxesQB = item.valorEnvio }
          });
        }
        this._calculosCartListCajas(condicion);
      });
    }

  }

  _iniciarVariables() {
    this.boxesEB = 0;
    this.boxesQB = 0;
    this.boxesHB = 0;
    this.boxesEBT = 0;
    this.boxesQBT = 0;
    this.boxesHBT = 0;
    this.countBoxesTruckingEB = 0;
    this.countBoxesTruckingQB = 0;
    this.countBoxesTruckingHB = 0;
    this.appService.totalTuckingBoxes = 0;
    this.appService.totalWithTruckiBoxes = 0;
  }

  _calculosCartListCajas(condicion) {
    this.appService.Data.cartListCaja.forEach(data => {
      if (data.stadingOrder == condicion) {
        if (data.tipoCaja == 'EB') {
          this.countBoxesTruckingEB += data.cantidadIngresada;
        }
        if (data.tipoCaja == 'HB') {
          this.countBoxesTruckingHB += data.cantidadIngresada;
        }
        if (data.tipoCaja == 'QB') {
          this.countBoxesTruckingQB += data.cantidadIngresada;
        }
      }
    });
    this.boxesEBT = this.boxesEB * this.countBoxesTruckingEB;
    this.boxesQBT = this.boxesQB * this.countBoxesTruckingQB;
    this.boxesHBT = this.boxesHB * this.countBoxesTruckingHB;

    setTimeout(() => {
      this.appService.totalTuckingBoxes = this.boxesEBT + this.boxesQBT + this.boxesHBT;
      this.appService.totalWithTruckiBoxes = this.grandTotal + this.appService.totalTuckingBoxes;
    }, 20);
  }

  _getCargosAdicionalesPorFloristeria(condicion: boolean) {
    this.appService.esFloristeria = EnumSiNo.S;
    var camion = JSON.parse(sessionStorage.getItem("Camion"));
    var marcacion = JSON.parse(sessionStorage.getItem("Marcacion"));
    // this.appService._getCargosPorFloristeria(camion.codigoCamion, marcacion.pk.codigoMarcacion).subscribe(data => {
    //   this.cantidadPorLote = data[0].cantidadLote;
    //   this.precioPorLote = data[0].precioLote;
    //   this.precioPorCaja = data[0].precioCaja;
    //   //this._calcularTotalCargosPorFloristeria(condicion);
    // });
  }

  _getFincasPreferidasComunes() {
    this.appWebShopService.getFincas().subscribe(data => {
      const fincasResponse: any[] = JSON.parse(data.json)
      const fincas: FincaPreferida[] = fincasResponse.map(item => new FincaPreferida(item.codigoPersona, item.nombre, item.aplicaEb));
      this.appWebShopService.data.cartListCaja.forEach(caja => {
      //  if (caja.tipoCaja === 'M') {
          const codigosProveedorPrimerObjeto = caja.detalle[0].producto.codigosProveedor
          const codigosProveedorComunes = codigosProveedorPrimerObjeto.filter(codigo =>
            caja.detalle.slice(1).every(objeto => objeto.producto.codigosProveedor.includes(codigo))
          );

            // const listaFiltrada = fincas.filter(objeto => codigosProveedorComunes.includes(objeto.codigoProveedor));

         const listaFiltrada = caja.tamanioCaja === 'EB'
           ? fincas
             .filter(objeto => codigosProveedorComunes.includes(objeto.codigoProveedor))
             .filter(objeto => objeto.aplicaEb === 'S')
           : fincas.filter(objeto => codigosProveedorComunes.includes(objeto.codigoProveedor));
 
          caja.fincaPreferida = listaFiltrada[0]
          caja.fincasComunes = listaFiltrada

       // }
      })
    });
  }

  // _getFincasPreferidasComunes() {
  //   this.appWebshopService.data.cartListCaja.forEach(caja => {
  //     if (caja.tipoCaja === 'M') {
  //       const codigosProveedorPrimerObjeto = caja.detalle[0].producto.codigosProveedor
  //       const codigosProveedorComunes = codigosProveedorPrimerObjeto.filter(codigo =>
  //         caja.detalle.slice(1).every(objeto => objeto.producto.codigosProveedor.includes(codigo))
  //       );

  //       console.log("************************");
  //       console.log(codigosProveedorComunes);
  //       this.appWebshopService.getFincas().subscribe(data => {
  //         const fincas: FincaPreferida[] = JSON.parse(data.json)
  //         const listaFiltrada = fincas.filter(objeto => codigosProveedorComunes.includes(objeto.codigoPersona));
  //         caja.fincaPreferida = listaFiltrada[0]
  //         caja.fincasComunes = listaFiltrada
  //       });
  //     }
  //   })
  // }


  _fincaPreferida(fincaPreferida, index: number) {
   this.appWebShopService.data.cartListCaja[index].fincaPreferida = fincaPreferida
   console.log("¨fincapreferisda", fincaPreferida, index);
   
    // caja.variedades[0].fincaPreferida = fincaPreferida
  }

  public obtenerTallaSeleccionada(cajaDetalle: CajaCarritoDetalleWebShop){
    return this.appWebShopService.obtenerTallaProducto(cajaDetalle.producto)
  }

  _placeOrder() {

    
    this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
    this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
    this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"));

    setTimeout(() => {
      this.spinner.show();
    }, 20)

    this.c = JSON.parse(localStorage.getItem('Usuario'));

    var datePipe = new DatePipe("en-US");
    var fechaFormataeda = datePipe.transform(localStorage.getItem('_ls_dateConecction'), 'dd-MM-yyyy');

    let ordenPedido = new OrdenCompraWebShop(fechaFormataeda, this.marcacionSleccionada.codigoSeleccion,
      this.camionSeleccionado.codigoCamion,
      this.destinoSeleccionado.codigoDestino,
      this.c.codigoClientePadre != undefined ? this.c.codigoClientePadre : this.c.codigoPersona, this.appWebShopService.data.cartListCaja, this.observacion, this.appWebShopService.data.cargosTransporte.totalCargosPorTransporte)
      ordenPedido.dataCar.forEach(caja =>{
        caja.detalle.forEach(detalle =>{
          const tallaDetalle = this.appWebShopService.obtenerTallaProducto(detalle.producto)
          detalle.precioFinca = tallaDetalle.precioFinca
          detalle.producto.productoBuncheActivado= undefined
          detalle.producto.productoSeleccionado= undefined
          // if (caja.fincasComunes.length == 0) {
          //   swal.fire({
          //     icon: 'warning',
          //     title: 'Alert',
          //     text: "La Caja " + (caja.tipoCaja == 'S' ? "Solida " : "Mixta ") + "con variedad " + detalle.producto.nombreVariedad + " no tiene finca para el tamaño seleccionado, por favor seleccione otro tamaño de Caja.",
          //   });
          // }
        })
      })

    this.appService.registrarCompra(ordenPedido).subscribe(
      (data: any) => {
        console.log(data);
        const idCarrito = localStorage.getItem('idCarrito');
        this.appService.eliminarCarritoHistorial(idCarrito).subscribe(() => {
          console.log("Carrito Eliminado");          
         });
        localStorage.removeItem("idCarrito");
        localStorage.removeItem("DataCar");
        localStorage.removeItem("_ls_dateConecction");
        sessionStorage.removeItem("Camion");
        this.informarmationService.aplicaDestinatarioPedidoCompleto = false;
        this.informarmationService.addressInfo = '';
        this.informarmationService.addressInfo2 = '';
        this.informarmationService.nameInfo = '';
        this.informarmationService.cityInfo = '';
        this.informarmationService.stateInfo = '';
        this.informarmationService.zipInfo = '';
        this.informarmationService.phoneInfo = '';
        
        this.appWebShopService.getCajaMixtaArmada();
        this.appWebShopService.data.totalCartCount = 0;
        this.appWebShopService.data.cartListCaja = [];
        this.spinner.hide();
        const dialogRef = this.dialog.open(OrderPlacedComponent, {
          data: {
            mensaje: EnumMensajes.ORDERECEIVED,
            mensaje2: EnumMensajes.ORDERECEIVED2,
            estado: EnumMensajes.PENDINGORDERHUB
          },
          panelClass: 'order-placed'
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/account/orders']);
          }
        });
      },
      (err: any) => {
        if (err.status != null || err.status != undefined) {
          this.spinner.hide();
          this.snackBar.open(EnumMensajes.ERRORSERVER, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }
      });
  }

  _continuarCompra() {
    this.router.navigate(['home']);
  }

  _updateDate(event, tipo) {
    var datePipe = new DatePipe("en-US");
    if (tipo != 'T') {
      localStorage.removeItem("_ls_dateConecction");
      localStorage.setItem("_ls_dateConecction", event.value);
      this.updateDate = datePipe.transform(event.value, 'dd-MM-yyyy');
    } else {
      localStorage.removeItem("_ls_dateConecctionT");
      localStorage.setItem("_ls_dateConecctionT", event.value);
      this.updateDateT = datePipe.transform(event.value, 'dd-MM-yyyy');
    }


  }

  _cargosAdicionales() {
    var dataValue = "CART"
    const dialogRef = this.dialog.open(CargosAdicionalesComponent, {
      data: { value: dataValue, condicion: false },
      panelClass: 'costo-envio'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) { }
    });
  }

  _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  _informationDialog(marcacion, tipo) {
    var camionNombre = '';
    if (this.camionSeleccionado == undefined) {
      camionNombre = 'SN';
    } else {
      camionNombre = this.camionSeleccionado.nombre;
    }
    const dialogRef = this.dialog.open(InformationComponent, {
      data: { data: 'N', marcacion: marcacion, camion: camionNombre, pagina: 'HUB', tipo: tipo },
      panelClass: 'information'
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      // if (respuesta != null) {
      this._actualizarDatos();
      // }
    });
  }

  _actualizarDatos() {
    this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
    this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
    this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"));
    this.destinoSeleccionadoT = JSON.parse(sessionStorage.getItem("DestinoT"));
    this.marcacionSleccionadaT = JSON.parse(sessionStorage.getItem("MarcacionT"));
    //this._calculosCajas(false);
    this.calcularFechaEnvio();
  }

  _obtenerDestinosPorMarcacion(codigoMarcacion) {
    this.appService.getDestinos(codigoMarcacion).subscribe((data: any) => {
      this.mostrarDestino = [];
      this.destinoFinal = [];
      this.selectDestino = [];
      this.po = data;

      var sessionDes = JSON.parse(sessionStorage.getItem("Destino"));
      var itemDestino: Destino;
      itemDestino = this.po.find(x => x.nombre == sessionDes.nombre);
      this.mostrarDestino.push(this.po[0].nombre);
      this.destinoFinal.push(...this.po);
      this.selectDestino = this.destinoFinal;
      this.asignarDestinoPorDefaultOrden(itemDestino);
    });
  }

  asignarDestinoPorDefaultOrden(destino: Destino) {
    for (var index = 0; index < this.appService.Data.cartListCaja.length; index++) {
      const caja = this.appService.Data.cartListCaja[index];
      if (!caja.stadingOrder) {
        if (caja.destinoSeleccionado === null) {
          caja.destinoSeleccionado = destino;
          caja.destinoNombre = destino.nombre;
        }
      }
    }
    //this.appService.addCartLocalStorage();
  }

  /*asignarDestinoPorCaja(caja: Caja) {
    const dialogRef = this.dialog.open(NewPoComponent, {
      panelClass: 'nuevo-destino',
      data: { marcacion: this.marcacionSleccionada.pk.codigoMarcacion, tipo: 'SELECT PO' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        caja.destinoSeleccionado = result;
        caja.destinoNombre = result.nombre;
        this.appService.addCartLocalStorage();
      }
    });
  }*/
  setAditionalInfoString(info, po) {
    var str;
    // str = `
    //   `+ 'Client name: ' + info.nombreEtiqueta + `
    //   `+ 'Address: ' + info.direccionEtiqueta + `
    //   `+ 'City / State / Zip: ' + info.ciudad + '/' +
    //   info.destino + '/' +
    //   info.codigoPostal + `
    //   `+ 'Tel: ' + info.telefonoEtiqueta + `
    //   `+ 'PO: ' + po + `
    //   `;
    str = '\\'
      + 'Client name: ' + info.nombreEtiqueta + '\\ '
      + 'Address: ' + info.direccionEtiqueta + '\\ '
      + 'City / State / Zip: ' + info.ciudad + '/' +
      info.destino + '/' +
      info.codigoPostal + '\\ '
      + 'Tel: ' + info.telefonoEtiqueta + '\\ '
      + 'PO: ' + po;
    return str;
  }

  _varietiesNoRepeated(list: any) {
    let tr = 0;

    return list.filter((v, i, a) => a.findIndex(t => (t.codigoVariedad === v.codigoVariedad && t.talla === v.talla)) === i);
  }
  _countVarietiesNoRepeat(v, list) {
    return list.filter(t => (t.codigoVariedad === v.codigoVariedad && t.talla === v.talla)).length;
  }

  _piceVarietiesNoRepeat(v, list) {
    return list.filter(t => (t.codigoVariedad === v.codigoVariedad && t.talla === v.talla)).map(a => a.precioCliente).reduce(function (a, b) {
      return a + b;
    });;
  }
}
