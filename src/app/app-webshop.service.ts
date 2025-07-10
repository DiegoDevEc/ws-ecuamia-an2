import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarritoDetalle, Colores, Filtro, PaginadorProducto, Productos, ambiente } from './app.modelsWebShop';
import { CajaCarritoDetalleWebShop, CajaCarritoWebShop, CajaWebShop, CargosTransporte, DataCar, OrdenCompraWebShop, ProductoWebShop, ResponseWebShop, TallaWebShop } from './app.modelsWebShopV2';
import { EnumTipoCaja } from './enumeration/enumeration';
import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { InformationService } from './core/services/information-service';

@Injectable({
  providedIn: 'root'
})
export class AppWebshopService {

  public data = this.getCartLocalStorage();
  public totalTuckingBoxes: number = 0;
  public cajaMixtaArmada = this.getCajaMixtaArmada();
  public sePuedeAgrandar = false;
  public barraProgresoImagen: string[] = [];
  public paginador = this.getPaginadorLocalStorage();
  public contadorClicsAddBox = 0;

  //Para Filtros de pantalla
  public listaFiltrosSeleccionados: Filtro[] = [];
  public productosWebShopFilter: Productos[] = [];
  public coloresWebShop: Colores[] = [];

  public estadoPadre = '';

  constructor(public http: HttpClient, private informationService: InformationService) { }

  public getFincas(): Observable<any> {
    return this.http.get<any>(ambiente.urlServicioRest + 'consultarProveedores');
  }

  public getCartLocalStorage(): DataCar {
    var dataLocalStorage = JSON.parse(localStorage.getItem('DataCar'));
    if (dataLocalStorage != null) {
      return JSON.parse(localStorage.getItem('DataCar'));
    }
    return new DataCar(
      [], // Carro de Compras Cajas
      0, // totalPrice,
      0,
      0,
      new CargosTransporte(0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      0
    );
  }

  public getPaginadorLocalStorage(): PaginadorProducto {
    var dataLocalStorage = JSON.parse(sessionStorage.getItem('Paginador'));
    if (dataLocalStorage != null) {
      return JSON.parse(sessionStorage.getItem('Paginador'));
    }
    let paginado = new PaginadorProducto();
    paginado.pagina = 1;
    paginado.numRegistros = 50;
    paginado.colores = []
    paginado.filtroProducto = []
    paginado.isPromo = false
    paginado.isLimited = false
    paginado.isTinted = false
    paginado.orden = 'PRO'
    return paginado
  }

  public getCajaMixtaArmada(): CajaCarritoWebShop {
    var dataSessionStorage = JSON.parse(sessionStorage.getItem('CajaMixtaArmada'));
    if (dataSessionStorage != null) {
      let caja = JSON.parse(sessionStorage.getItem('CajaMixtaArmada'))
      this.obtnerImagenProgreso(caja)
      return caja;
    }
    return this.armarCajaMixta()
  }

  public getProductosWebShopPostV2(filtros: PaginadorProducto) {
    return this.http.post<ResponseWebShop>(ambiente.urlServicioRest + 'consultarPrecios', filtros);
  }

  public getImagenBarraProgreso() {
    return this.http.get<any[]>('assets/data/' + 'box-progress/box-imagen.json')
  }

  public agregarCajaCart(caja: CajaCarritoWebShop) {

    if (caja.tipoCaja == 'S') {

      const indexCaja = this.data.cartListCaja.findIndex(
        cajaList =>
          cajaList.tipoCaja === "S" &&
          cajaList.tamanioCaja === caja.tamanioCaja &&
          cajaList.talla === caja.talla &&
          cajaList.detalle[0].producto.codigoVariedad === caja.detalle[0].producto.codigoVariedad
      );

      if (indexCaja != -1) {
        const catidadTotal = this.data.cartListCaja[indexCaja].cantidadCajas + caja.cantidadCajas
        const cajaSolidaArmada = this.armarCajaSolida(caja.detalle[0].producto, catidadTotal)
        this.data.cartListCaja[indexCaja] = cajaSolidaArmada
      } else {
        this.data.cartListCaja.push(caja);
      }
    } else {
      this.data.cartListCaja.push(caja);
    }
    this.totalCarritoCajas();
    this.addCartLocalStorage();
    return true;
  }

  public totalCarritoCajas() {
    this.data.totalPrice = 0;
    this.data.totalCartCount = 0;
    this.data.cartListCaja.forEach(caja => {
      if (caja.tipoCaja === 'S') {
        this.data.totalPrice = this.data.totalPrice + caja.precioTotalCaja;
        this.data.totalCartCount = this.data.totalCartCount + parseInt(caja.cantidadCajas.toString());
      } else {
        let valorSumaTotalCaja = 0;
        caja.detalle.forEach(cajaMixta => {
          console.log(valorSumaTotalCaja);

          valorSumaTotalCaja += cajaMixta.precio
        });
        this.data.totalPrice = this.data.totalPrice + valorSumaTotalCaja;
        this.data.totalCartCount = this.data.totalCartCount + 1;
      }
    });
    this.totalCargosTransporte();
  }

  public totalCargosTransporte() {
    this.data.cargosTransporte.totalEb = 0;
    this.data.cargosTransporte.totalQb = 0;
    this.data.cargosTransporte.totalHb = 0;

    this.data.cargosTransporte.precioEb = 0;
    this.data.cargosTransporte.precioQb = 0;
    this.data.cargosTransporte.precioHb = 0;

    this.data.cargosTransporte.cantidadEb = 0;
    this.data.cargosTransporte.cantidadQb = 0;
    this.data.cargosTransporte.cantidadHb = 0;

    const cargosTransporte = JSON.parse(localStorage.getItem('ls_cargos'));

    if (cargosTransporte) {
      cargosTransporte.forEach(cargo => {
        if (cargo.tipoCaja === EnumTipoCaja.EB) {
          this.data.cargosTransporte.precioEb += cargo.valorEnvio;
        }
        if (cargo.tipoCaja === EnumTipoCaja.QB) {
          this.data.cargosTransporte.precioQb += cargo.valorEnvio;
        }
        if (cargo.tipoCaja === EnumTipoCaja.HB) {
          this.data.cargosTransporte.precioHb += cargo.valorEnvio;
        }
      })
    }

    this.data.cartListCaja.forEach(caja => {

      if (caja.tamanioCaja === EnumTipoCaja.EB) {
        this.data.cargosTransporte.cantidadEb = this.data.cargosTransporte.cantidadEb + caja.cantidadCajas;
      }
      if (caja.tamanioCaja === EnumTipoCaja.QB) {
        this.data.cargosTransporte.cantidadQb = this.data.cargosTransporte.cantidadQb + caja.cantidadCajas;
      }
      if (caja.tamanioCaja === EnumTipoCaja.HB) {
        this.data.cargosTransporte.cantidadHb = this.data.cargosTransporte.cantidadHb + caja.cantidadCajas;
      }
    });

    this.data.cargosTransporte.totalEb = this.data.cargosTransporte.precioEb * this.data.cargosTransporte.cantidadEb;
    this.data.cargosTransporte.totalQb = this.data.cargosTransporte.precioQb * this.data.cargosTransporte.cantidadQb;
    this.data.cargosTransporte.totalHb = this.data.cargosTransporte.precioHb * this.data.cargosTransporte.cantidadHb;
    this.data.cargosTransporte.totalCargosPorTransporte = this.data.cargosTransporte.totalEb + this.data.cargosTransporte.totalQb + this.data.cargosTransporte.totalHb;
    this.data.totalPrice = this.data.totalPrice + this.data.cargosTransporte.totalCargosPorTransporte;
  }

  public armarCajaSolida(producto: ProductoWebShop, cantidadIngresado: number): CajaCarritoWebShop {
    const destinoSeleccionado = JSON.parse(sessionStorage.getItem('Destino'));
    const cajaProducto = this.obtenerCajaProducto(producto)
    const tallaProducto = this.obtenerTallaProducto(producto)
    const nombreCaja = producto.nombreVariedad.toUpperCase() + ' - ' + producto.producto.toUpperCase()
    const totalBunches = cantidadIngresado * cajaProducto.cantidadPorCaja / cajaProducto.cantidadPorBunche
    var cajaCarrito = new CajaCarritoWebShop([], nombreCaja, cajaProducto.caja, 'S', tallaProducto.talla, 100, cantidadIngresado, 0, destinoSeleccionado)
    var carritoDetalle = new CajaCarritoDetalleWebShop(producto, totalBunches, cantidadIngresado * cajaProducto.cantidadPorCaja, cajaProducto.precio, 0, 0, 0, 0, tallaProducto.talla)
    cajaCarrito.destinoDetalle = destinoSeleccionado.codigoDestino
    cajaCarrito.nameCliente = this.informationService.nameInfo
    cajaCarrito.phoneCliente = this.informationService.phoneInfo
    cajaCarrito.addressCliente = this.informationService.addressInfo
    cajaCarrito.address2Cliente = this.informationService.addressInfo2
    cajaCarrito.cityCliente = this.informationService.cityInfo
    cajaCarrito.stateCliente = this.informationService.stateInfo
    cajaCarrito.zipCliente = this.informationService.zipInfo

    carritoDetalle.precio = cajaProducto.precio
    cajaCarrito.precioTotalCaja = producto.tipoPrecioVariedad === 'T' ? (cantidadIngresado * cajaProducto.cantidadPorCaja) * cajaProducto.precio : ((cantidadIngresado * cajaProducto.cantidadPorCaja) / cajaProducto.cantidadPorBunche) * cajaProducto.precio
    cajaCarrito.detalle.push(carritoDetalle)
    return cajaCarrito
  }

  public agregarCajaMixtaAcarrito() {
    this.cajaMixtaArmada.nameCliente = this.informationService.nameInfo
    this.cajaMixtaArmada.phoneCliente = this.informationService.phoneInfo
    this.cajaMixtaArmada.addressCliente = this.informationService.addressInfo
    this.cajaMixtaArmada.address2Cliente = this.informationService.addressInfo2
    this.cajaMixtaArmada.cityCliente = this.informationService.cityInfo
    this.cajaMixtaArmada.stateCliente = this.informationService.stateInfo
    this.cajaMixtaArmada.zipCliente = this.informationService.zipInfo

    this.agregarCajaCart(this.cajaMixtaArmada)
    this.eliminarCajaMixtaStorage();
  }

  public editarCajaSolida(cajaCarritoWebShop: CajaCarritoWebShop, indexCaja: number, talla: TallaWebShop, cantidadIngresado: number) {

    const cajaProductoOriginal = this.obtenerCajaProducto(cajaCarritoWebShop.detalle[0].producto)

    //Resetea los valores Originales
    cajaCarritoWebShop.detalle[0].producto.tallas.forEach(tallaItem => {
      tallaItem.tallaSeleccionada = false
      talla.cajas.forEach(caja => caja.cajaSeleccionada = false)
    })

    // Setea los valores modificados
    cajaCarritoWebShop.detalle[0].producto.tallas.forEach(tallaItem => {
      if (tallaItem.talla === talla.talla) {
        tallaItem.tallaSeleccionada = true
        tallaItem.cajas.forEach(cajaItem => {
          if (cajaItem.caja === cajaProductoOriginal.caja) {
            cajaItem.cajaSeleccionada = true
          }
        })
      }
    })

    const cajaProducto = this.obtenerCajaProducto(cajaCarritoWebShop.detalle[0].producto)
    const tallaProducto = this.obtenerTallaProducto(cajaCarritoWebShop.detalle[0].producto)
    const totalPrecioCaja = (cantidadIngresado * cajaProducto.cantidadPorCaja) * cajaProducto.precio
    const nombreCaja = cajaCarritoWebShop.nombreCaja
    var cajaCarrito = new CajaCarritoWebShop([], nombreCaja, cajaProducto.caja, 'S', tallaProducto.talla, 100, cantidadIngresado, totalPrecioCaja)
    var carritoDetalle = new CajaCarritoDetalleWebShop(cajaCarritoWebShop.detalle[0].producto, cajaProducto.cantidadPorBunche, cantidadIngresado * cajaProducto.cantidadPorCaja, cajaProducto.precio, 0, 0, 0, 0, tallaProducto.talla)
    cajaCarrito.detalle = []
    carritoDetalle.precio = cajaProducto.precio
    cajaCarrito.detalle.push(carritoDetalle)
    this.data.cartListCaja[indexCaja] = cajaCarrito

    this.totalCarritoCajas();
    this.addCartLocalStorage();
  }

  public armarCajaMixta(): CajaCarritoWebShop {
    const destinoSeleccionado = JSON.parse(sessionStorage.getItem('Destino'));
    this.eliminarCajaMixtaStorage()
    return new CajaCarritoWebShop([], '', 'EB', 'M', '', 0, 1, 0, destinoSeleccionado)
  }

  public agregarDetalleCajaMixta5(cajaCarrito: CajaCarritoWebShop, producto: ProductoWebShop, cantidadIngresada: number, emular: boolean) {

  }

  public agregarDetalleCajaMixta20(cajaCarrito: CajaCarritoWebShop, producto: ProductoWebShop, cantidadIngresada: number, emular: boolean) {

    cajaCarrito.detalle.forEach(detalleItem => {
      const tallaItem = this.obtenerTallaProducto(detalleItem.producto)
      const cajaProductoItem = tallaItem.cajas.find(caja => caja.caja === cajaCarrito.tamanioCaja);
      detalleItem.cantidadTallosPorCaja = cajaProductoItem.cantidadPorCaja
      detalleItem.totalTallos = detalleItem.cantidadBunches * cajaProductoItem.cantidadPorBunche
      detalleItem.precio = detalleItem.producto.tipoPrecioVariedad === 'T' ? detalleItem.precioCajaMixta * detalleItem.totalTallos : detalleItem.precioCajaMixta * detalleItem.cantidadBunches
      //detalleItem.precio = detalleItem.precioCajaMixta * detalleItem.totalTallos
      detalleItem.porcentaje = (detalleItem.totalTallos / detalleItem.cantidadTallosPorCaja) * 100
      detalleItem.porcentaje = (detalleItem.totalTallos / detalleItem.cantidadTallosPorCaja) * 100
    })

    const tallaProducto = this.obtenerTallaProducto(producto);
    const cajaProducto = tallaProducto.cajas.find(caja => caja.caja === cajaCarrito.tamanioCaja);
    // cajaCarrito.tamanioCaja = cajaProducto.caja;
    const detalle = new CajaCarritoDetalleWebShop(producto, cantidadIngresada,
      cajaProducto.cantidadPorBunche, 0, (cantidadIngresada * cajaProducto.cantidadPorBunche),
      tallaProducto.precioMixta, cajaProducto.cantidadPorCaja, 0, tallaProducto.talla)

    const indexProductoExistente = cajaCarrito.detalle.findIndex(item => item.producto.codigoVariedad == detalle.producto.codigoVariedad && item.talla === tallaProducto.talla)

    if (cajaCarrito.detalle.length == 0 || indexProductoExistente === -1) {
      cajaCarrito.detalle.push(detalle)
    }

    if (indexProductoExistente != -1) {
      cajaCarrito.detalle[indexProductoExistente].cantidadTallosPorCaja = cajaProducto.cantidadPorCaja
      cajaCarrito.detalle[indexProductoExistente].cantidadBunches = cajaCarrito.detalle[indexProductoExistente].cantidadBunches + cantidadIngresada
      cajaCarrito.detalle[indexProductoExistente].totalTallos = cajaCarrito.detalle[indexProductoExistente].cantidadBunches * cajaProducto.cantidadPorBunche
      cajaCarrito.detalle[indexProductoExistente].precio = cajaCarrito.detalle[indexProductoExistente].producto.tipoPrecioVariedad === 'T' ? cajaCarrito.detalle[indexProductoExistente].precioCajaMixta * cajaCarrito.detalle[indexProductoExistente].totalTallos : cajaCarrito.detalle[indexProductoExistente].precioCajaMixta * cajaCarrito.detalle[indexProductoExistente].cantidadBunches
      //cajaCarrito.detalle[indexProductoExistente].precio = cajaCarrito.detalle[indexProductoExistente].precioCajaMixta * cajaCarrito.detalle[indexProductoExistente].totalTallos
      cajaCarrito.detalle[indexProductoExistente].porcentaje = (cajaCarrito.detalle[indexProductoExistente].totalTallos / cajaCarrito.detalle[indexProductoExistente].cantidadTallosPorCaja) * 100
    }

    cajaCarrito.porcentajeLleno = this.obtenerPorcentajeLlenoCajaMixta(cajaCarrito)

    if (!emular) {
      this.cajaMixtaArmada = cajaCarrito
      this.addCajaMixtaArmadaLocalStorage()
      this.obtnerImagenProgreso(this.cajaMixtaArmada)
    } else {
      return cajaCarrito
    }

  }

  // public agregarDetalleCajaMixta(cajaCarrito: CajaCarritoWebShop, producto: ProductoWebShop, cantidadIngresada: number, emular: boolean) {

  //   const tallaProducto = this.obtenerTallaProducto(producto);
  //   const cajaProducto = this.obtenerCajaProductoMixta(producto);
  //   cajaCarrito.tamanioCaja = cajaProducto.caja;
  //   const detalle = new CajaCarritoDetalleWebShop(producto, cantidadIngresada,
  //     cajaProducto.cantidadPorBunche, 0, (cantidadIngresada * cajaProducto.cantidadPorBunche),
  //     tallaProducto.precioMixta, cajaProducto.cantidadPorCaja, 0, tallaProducto.talla)

  //   const indexProductoExistente = cajaCarrito.detalle.findIndex(item => item.producto.codigoVariedad == detalle.producto.codigoVariedad && item.talla === tallaProducto.talla)

  //   if (cajaCarrito.detalle.length == 0 || indexProductoExistente === -1) {
  //     cajaCarrito.detalle.push(detalle)
  //   }

  //   if (indexProductoExistente != -1) {
  //     cajaCarrito.detalle[indexProductoExistente].cantidadTallosPorCaja = cajaProducto.cantidadPorCaja
  //     cajaCarrito.detalle[indexProductoExistente].cantidadBunches = cajaCarrito.detalle[indexProductoExistente].cantidadBunches + cantidadIngresada
  //     cajaCarrito.detalle[indexProductoExistente].totalTallos = cajaCarrito.detalle[indexProductoExistente].cantidadBunches * cajaProducto.cantidadPorBunche
  //     cajaCarrito.detalle[indexProductoExistente].precio = cajaCarrito.detalle[indexProductoExistente].precioCajaMixta * cajaCarrito.detalle[indexProductoExistente].totalTallos
  //     cajaCarrito.detalle[indexProductoExistente].porcentaje = (cajaCarrito.detalle[indexProductoExistente].totalTallos / cajaCarrito.detalle[indexProductoExistente].cantidadTallosPorCaja) * 100
  //   }

  //   cajaCarrito.porcentajeLleno = this.obtenerPorcentajeLlenoCajaMixta(cajaCarrito)

  //   if (!emular) {
  //     this.cajaMixtaArmada = cajaCarrito
  //     this.addCajaMixtaArmadaLocalStorage()
  //     this.obtnerImagenProgreso(this.cajaMixtaArmada)
  //   } else {
  //     return cajaCarrito
  //   }

  // }

  obtnerImagenProgreso(cajaCarrito: CajaCarritoWebShop) {
    this.getImagenBarraProgreso().subscribe(data => {
      this._validarCajaSeleccionada(cajaCarrito.tamanioCaja, data);
    });
  }

  obtenerCantidadTallosCajaMixta() {
    var totalTalloCaja = 0
    this.cajaMixtaArmada.detalle.forEach(item => totalTalloCaja += item.totalTallos)
    return totalTalloCaja
  }

  _validarCajaSeleccionada(tipoCaja: string, data) {

    this.barraProgresoImagen = []
    this.barraProgresoImagen.push("")
    this.barraProgresoImagen.shift()

    switch (tipoCaja) {
      case "EB": {
        var filtroCaja = data.filter(x => x.caja === "EB")
        this._getTipoCajaProgresoConImagen(filtroCaja);
        break;
      }
      case "QB": {
        var filtroCaja = data.filter(x => x.caja === "QB")
        this._getTipoCajaProgresoConImagen(filtroCaja);
        break;
      }
      case "HB": {
        var filtroCaja = data.filter(x => x.caja === "HB")
        this._getTipoCajaProgresoConImagen(filtroCaja);
        break;
      }

    }
  }

  obtenerPorcentajeLlenoCajaMixta(cajaCarrito: CajaCarritoWebShop): number {
    var porcentajeCajaLleno = 0
    cajaCarrito.detalle.forEach(caja => {
      porcentajeCajaLleno += caja.porcentaje
    })
    return Math.round(porcentajeCajaLleno)
  }

  obtenerTotalCajaMixta(productos: ProductoWebShop[]): number {
    var totalCajaMixta = 0;
    productos.forEach(product => {
      var cajaProducto = this.obtenerCajaProducto(product)
      totalCajaMixta = (cajaProducto.precio * cajaProducto.cantidadPorBunche) * cajaProducto.cantidadPorCaja
    })
    return totalCajaMixta;
  }

  obtenerCajaProducto(producto: ProductoWebShop): CajaWebShop {
    const indexTallaSeleccionada = producto.tallas.findIndex(item => item.tallaSeleccionada)
    const indexCajaSeleccionada = producto.tallas[indexTallaSeleccionada].cajas.findIndex(caja => caja.cajaSeleccionada)
    return producto.tallas[indexTallaSeleccionada].cajas[indexCajaSeleccionada]
  }

  obtenerCajaProductoMixta(producto: ProductoWebShop): CajaWebShop {
    const indexTallaSeleccionada = producto.tallas.findIndex(item => item.tallaSeleccionada)
    let indexCajaSeleccionada = producto.tallas[indexTallaSeleccionada].cajas.findIndex(caja => caja.cajaSeleccionada)
    if (indexCajaSeleccionada === -1) {
      indexCajaSeleccionada = producto.tallas[indexTallaSeleccionada].cajas.findIndex(caja => caja.caja === producto.tallas[indexTallaSeleccionada].cajaMinima)
      producto.tallas[indexTallaSeleccionada].cajas[indexCajaSeleccionada].cajaSeleccionada = true
    }
    return producto.tallas[indexTallaSeleccionada].cajas[indexCajaSeleccionada]
  }

  obtenerTallaProducto(producto: ProductoWebShop): TallaWebShop {
    const indexTallaSeleccionada = producto.tallas.findIndex(item => item.tallaSeleccionada)
    return producto.tallas[indexTallaSeleccionada]
  }

  public addCartLocalStorage() {
    try {
      if (this.data) {
        var dataLocalStorage = JSON.stringify(this.data);

        localStorage.removeItem('DataCar');
        localStorage.setItem('DataCar', dataLocalStorage);
        console.log("Datos almacenados en localStorage con éxito.");

        if (this.data.cartListCaja.length == 0) {
          this.limpiarCarrito();
        } else {
          this.setRegistrarCarritoDetallePorCliente();
        }
      } else {
        console.error("this.data está vacío o nulo.");
      }
    } catch (error) {
      console.error("Ocurrió un error:", error);
    }
  }


  //actualizar carrito por cliente WS
  public _registrarCarritoDetallePorCliente(codigoCliente: number, accion: string, dataAn: string, idCarrito: string, tipoCarrtitoTropical: string) {
    var datePipe = new DatePipe("en-US");
    var fechaFormataeda = datePipe.transform(localStorage.getItem('_ls_dateConecction'), 'dd-MM-yyyy');

    const c = JSON.parse(localStorage.getItem('Usuario'));
    const camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
    const destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
    const marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"));

    var codigoMarcacion = marcacionSleccionada.codigoSeleccion;
    var codigoCamion = camionSeleccionado.codigoCamion;
    var codigoDestino = destinoSeleccionado.codigoDestino;

    let ordenPedido = new OrdenCompraWebShop(fechaFormataeda, codigoMarcacion, codigoCamion, codigoDestino,
      c.codigoClientePadre != undefined ? c.codigoClientePadre : c.codigoPersona, this.data.cartListCaja, "", this.data.cargosTransporte.totalCargosPorTransporte)
      
      ordenPedido.destinoSeleccionado = codigoDestino
      ordenPedido.nombreCamion = camionSeleccionado.nombre
      ordenPedido.nombreEtiqueta = destinoSeleccionado.marcacion.nombreEtiqueta
      ordenPedido.destinoNombre = destinoSeleccionado.nombre

      ordenPedido.dataCar.forEach(caja => {
          caja.detalle.forEach(detalle => {
            
            detalle.producto.tallas = detalle.producto.tallas.filter(talla => {
              if (talla.tallaSeleccionada) {
              
                const cajaTamanio = caja.tamanioCaja
                talla.cajas.forEach(caja => {
                  caja.cajaSeleccionada = false
                  if (caja.caja === cajaTamanio) {
                    caja.cajaSeleccionada = true
                  }
                })

                if (caja.tipoCaja === "S") {
                  talla.cajas = talla.cajas.filter(caja => caja.cajaSeleccionada);
                }
                
                return true; 
              }
              return false; 
            });
          });
      });

      ordenPedido.dataCar.forEach(caja =>{
        caja.fincaPreferida = undefined
        caja.detalle.forEach(detalle =>{
          const tallaDetalle = this.obtenerTallaProducto(detalle.producto)
          detalle.precioFinca = tallaDetalle.precioFinca
          detalle.producto.productoBuncheActivado= undefined
          detalle.producto.productoSeleccionado= undefined
        })
      })

      return ordenPedido.dataCar.length > 0 ? this.http.post(ambiente.urlServicioRest + "registrarCarritoDetalle/" + codigoCliente + "/" + accion + "/" + idCarrito + "/" + tipoCarrtitoTropical, ordenPedido): null
  }

  public _limpiarCarrito(idCarrito: string) {
    return this.http.post(ambiente.urlServicioRest + "limpiarCarrito/" + idCarrito, "lipiarCarrito")
  }

  limpiarCarrito() {
    var idcarrito = JSON.parse(localStorage.getItem('idCarrito'));
    this._limpiarCarrito(idcarrito).subscribe(data => {
      localStorage.removeItem('idCarrito');
    }, (err: any) => {
      console.log("error")
    })

  }

  public setRegistrarCarritoDetallePorCliente() {
    
    var data = JSON.parse(localStorage.getItem("DataCar"))
    if (data != null || data != undefined) {
      data.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"))
      data.camionSeleccionado = JSON.parse(sessionStorage.getItem("Camion"))
      data.fecha = localStorage.getItem("_ls_dateConecction")
    }
    var usuario = JSON.parse(localStorage.getItem('Usuario'));
    var codigoCliente = parseInt(usuario.codigoPersona)
    var idcarrito = JSON.parse(localStorage.getItem('idCarrito'));
    var paginador = JSON.parse(sessionStorage.getItem('Paginador'));    
    
    this._registrarCarritoDetallePorCliente(codigoCliente, 'A', JSON.stringify(data), idcarrito == null ? 'noId' : idcarrito, paginador.isTropical ? 'S' : 'N').subscribe(data => {
      localStorage.setItem('idCarrito', JSON.stringify(data));
    }, (err: any) => {
      console.log("error")
    })
  }

  public addCajaMixtaArmadaLocalStorage() {
    try {
      if (this.cajaMixtaArmada) {
        var dataSessionStorage = JSON.stringify(this.cajaMixtaArmada);

        sessionStorage.removeItem('CajaMixtaArmada');
        sessionStorage.setItem('CajaMixtaArmada', dataSessionStorage);
        console.log("Datos almacenados en localStorage con éxito.");
        // this.setRegistrarCarritoDetallePorCliente();
      } else {
        console.error("this.data está vacío o nulo.");
      }
    } catch (error) {
      console.error("Ocurrió un error:", error);
    }
  }

  public addPaginadorLocalStorage() {
    try {
      if (this.paginador) {
        var dataSessionStorage = JSON.stringify(this.paginador);
        sessionStorage.removeItem('Paginador');
        sessionStorage.setItem('Paginador', dataSessionStorage);
      } else {
        console.error("this.paginador está vacío o nulo.");
      }
    } catch (error) {
      console.error("Ocurrió un error:", error);
    }
  }

  public eliminarCajaMixtaStorage() {
    sessionStorage.removeItem('CajaMixtaArmada');
  }

  public eliminarCajaCart(indexCaja: number) {
    this.data.cartListCaja.splice(indexCaja, 1);
    this.totalCarritoCajas();
    this.addCartLocalStorage();
  }

  public editarCajaCart(indexCaja: number, cajaArmadaMixta: CajaCarritoWebShop) {
    this.data.cartListCaja.splice(indexCaja, 1);

    this.cajaMixtaArmada = cajaArmadaMixta;

    cajaArmadaMixta.detalle.forEach((detalle, index) => {
      if(detalle.variedadInactiva){        
        this.eliminarCajaMixta(index)
      }
    });
    
    this.obtnerImagenProgreso(this.cajaMixtaArmada)
    this.addCajaMixtaArmadaLocalStorage()
    this.totalCarritoCajas();
    this.addCartLocalStorage();
  }

  public emularRecalcularCaja(cantidad, index) {
    let cajaCopia = _.cloneDeep(this.cajaMixtaArmada)

    try {
      cajaCopia.detalle[index].cantidadBunches = cajaCopia.detalle[index].cantidadBunches + (cantidad)

      const cajaEB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.EB)

      const cajaQB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.QB)

      const cajaHB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.HB)

      const cajaRecalculada = this.obtnerAjusteCaja(cajaEB, cajaQB, cajaHB)

      if (cajaRecalculada === undefined) {
        return false
      } else { return true }

    } catch {
      console.log("Error caja sin medida");
      return false;
    }
  }

  public recalcularCajaEb(cantidad, index) {
    let cajaCopia = _.cloneDeep(this.cajaMixtaArmada)
    try {
      cajaCopia.detalle[index].cantidadBunches = cajaCopia.detalle[index].cantidadBunches + (cantidad)

      const cajaQB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.QB)

      const cajaHB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.HB)

      const cajaRecalculada = this.obtnerAjusteCaja(undefined, cajaQB, cajaHB)

      if (cajaRecalculada === undefined) {
        return false
      }
      this.cajaMixtaArmada = cajaRecalculada
      this.cajaMixtaArmada.porcentajeLleno = this.obtenerPorcentajeLlenoCajaMixta(this.cajaMixtaArmada)
      this.addCajaMixtaArmadaLocalStorage()
      this.obtnerImagenProgreso(this.cajaMixtaArmada)
      this.sePuedeAgrandarCajaMixta()
      return true
    }
    catch {
      console.log("Error caja sin medida");
      return false;
    }
  }

  public emularRecalcularCajaEb(cantidad, index) {
    let cajaCopia = _.cloneDeep(this.cajaMixtaArmada)

    try {
      cajaCopia.detalle[index].cantidadBunches = cajaCopia.detalle[index].cantidadBunches + (cantidad)

      const cajaQB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.QB)

      const cajaHB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.HB)

      const cajaRecalculada = this.obtnerAjusteCaja(undefined, cajaQB, cajaHB)

      if (cajaRecalculada === undefined) {
        return false
      } else { return true }

    } catch {
      console.log("Error caja sin medida");
      return false;
    }
  }

  public emularRecalcularCajaDetalle(cantidad, index) {
    let cajaCopia = _.cloneDeep(this.cajaMixtaArmada)

    try {
      cajaCopia.detalle[index].cantidadBunches = cajaCopia.detalle[index].cantidadBunches + (cantidad)

      const cajaEB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.EB)

      const cajaQB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.QB)

      const cajaHB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.HB)

      if (cajaCopia.tamanioCaja === EnumTipoCaja.EB) {
        const cajaRecalculada = this.obtnerAjusteCaja(cajaEB, cajaQB, cajaHB)
        return cajaRecalculada
      }

      if (cajaCopia.tamanioCaja === EnumTipoCaja.QB) {
        const cajaRecalculada = this.obtnerAjusteCaja(undefined, cajaQB, cajaHB)
        return cajaRecalculada
      }

      if (cajaCopia.tamanioCaja === EnumTipoCaja.HB) {
        const cajaRecalculada = this.obtnerAjusteCaja(undefined, undefined, cajaHB)
        return cajaRecalculada
      }


    } catch {
      console.log("Error caja sin medida");
      return false;
    }
  }

  public recalcularCaja(cantidad, index) {
    let cajaCopia = _.cloneDeep(this.cajaMixtaArmada)

    try {
      cajaCopia.detalle[index].cantidadBunches = cajaCopia.detalle[index].cantidadBunches + (cantidad)

      const cajaEB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.EB)

      const cajaQB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.QB)

      const cajaHB = this.emularTamanioCaja(cajaCopia, EnumTipoCaja.HB)

      const cajaRecalculada = this.obtnerAjusteCaja(cajaEB, cajaQB, cajaHB)

      if (cajaRecalculada === undefined) {
        return false
      }

      this.cajaMixtaArmada = cajaRecalculada

      this.cajaMixtaArmada.porcentajeLleno = this.obtenerPorcentajeLlenoCajaMixta(this.cajaMixtaArmada)
      this.addCajaMixtaArmadaLocalStorage()
      this.obtnerImagenProgreso(this.cajaMixtaArmada)
      this.sePuedeAgrandarCajaMixta()
      return true

    } catch {
      console.log("Error caja sin medida");
      return false;
    }
  }

  public emularTamanioCaja(cajaEmular, tamanioCajaEmular) {
    const cajaCarritoCopia = _.cloneDeep(cajaEmular);
    cajaCarritoCopia.tamanioCaja = tamanioCajaEmular;

    for (const detalleItem of cajaCarritoCopia.detalle) {
      const tallaItem = this.obtenerTallaProducto(detalleItem.producto);
      let cajaProductoItem = tallaItem.cajas.find(caja => caja.caja === cajaCarritoCopia.tamanioCaja);
      if (cajaProductoItem === undefined) {
        return undefined; // Retorna tempranamente si cajaProductoItem es undefined
      }
      detalleItem.cantidadBunchePorCaja = detalleItem.cantidadBunches * cajaProductoItem.cantidadPorBunche;
      detalleItem.cantidadTallosPorCaja = cajaProductoItem.cantidadPorCaja;
      detalleItem.totalTallos = detalleItem.cantidadBunches * cajaProductoItem.cantidadPorBunche;
      detalleItem.precio = detalleItem.producto.tipoPrecioVariedad === 'T' ? detalleItem.totalTallos * detalleItem.precioCajaMixta : detalleItem.cantidadBunches * detalleItem.precioCajaMixta;
      //detalleItem.precio = detalleItem.precioCajaMixta * detalleItem.totalTallos;
      detalleItem.porcentaje = (detalleItem.totalTallos / detalleItem.cantidadTallosPorCaja) * 100;
    }

    cajaCarritoCopia.porcentajeLleno = this.obtenerPorcentajeLlenoCajaMixta(cajaCarritoCopia);
    return cajaCarritoCopia;
  }

  public eliminarCajaMixta(indexCaja: number) {
    this.cajaMixtaArmada.detalle.splice(indexCaja, 1);

    const cajaEB = this.emularTamanioCaja(this.cajaMixtaArmada, EnumTipoCaja.EB)

    const cajaQB = this.emularTamanioCaja(this.cajaMixtaArmada, EnumTipoCaja.QB)

    const cajaHB = this.emularTamanioCaja(this.cajaMixtaArmada, EnumTipoCaja.HB)

    const cajaRecalculada = this.obtnerAjusteCaja(cajaEB, cajaQB, cajaHB)

    this.cajaMixtaArmada = cajaRecalculada

    this.cajaMixtaArmada.porcentajeLleno = this.obtenerPorcentajeLlenoCajaMixta(this.cajaMixtaArmada)
    this.addCajaMixtaArmadaLocalStorage()
    this.obtnerImagenProgreso(this.cajaMixtaArmada)
  }

  public obtnerAjusteCaja(cajaEB, cajaQB, cajaHB) {
    const cajasOrden = [];
    if (cajaEB !== undefined && cajaEB.porcentajeLleno <= 105) {
      cajasOrden.push(cajaEB)
    }
    if (cajaQB !== undefined && cajaQB.porcentajeLleno <= 105) {
      cajasOrden.push(cajaQB)
    }
    if (cajaHB !== undefined && cajaHB.porcentajeLleno <= 105) {
      cajasOrden.push(cajaHB)
    }
    cajasOrden.sort((a, b) => b.porcentajeLleno - a.porcentajeLleno)

    return cajasOrden[0];

  }

  public _getTipoCajaProgresoConImagen(data) {

    if (this.cajaMixtaArmada.porcentajeLleno < 50) {
      this.barraProgresoImagen.push(data[0].imagen)
    }
    if (this.cajaMixtaArmada.porcentajeLleno >= 50 && this.cajaMixtaArmada.porcentajeLleno < 75) {
      this.barraProgresoImagen.push(data[1].imagen)
    }
    if (this.cajaMixtaArmada.porcentajeLleno >= 75 && this.cajaMixtaArmada.porcentajeLleno < 90) {
      this.barraProgresoImagen.push(data[2].imagen)
    }
    if (this.cajaMixtaArmada.porcentajeLleno >= 90) {
      this.barraProgresoImagen.push(data[3].imagen)
    }

  }

  public aumentarTamanioCaja() {
    const tamaniosDisponibles = [
      EnumTipoCaja.EB,
      EnumTipoCaja.QB,
      EnumTipoCaja.HB
    ];

    const indiceActual = tamaniosDisponibles.indexOf(this.cajaMixtaArmada.tamanioCaja as EnumTipoCaja);

    if (indiceActual < tamaniosDisponibles.length - 1) {
      // Si hay un tamaño siguiente, aumenta el tamaño
      this.cajaMixtaArmada.tamanioCaja = tamaniosDisponibles[indiceActual + 1];
      this.recalcularCajaMixta()
      this.addCajaMixtaArmadaLocalStorage()
    } else {
      // Si ya estás en el tamaño más grande, muestra un mensaje de advertencia
      swal.fire({
        icon: 'warning',
        title: 'Alert',
        text: "You can't enlarge the box anymore",
      });
    }
  }

  public reducirTamanioCaja() {
    const tamaniosDisponibles = [
      EnumTipoCaja.EB,
      EnumTipoCaja.QB,
      EnumTipoCaja.HB
    ];

    const indiceActual = tamaniosDisponibles.indexOf(this.cajaMixtaArmada.tamanioCaja as EnumTipoCaja);

    if (indiceActual > 0) {
      // Si hay un tamaño anterior, reduce el tamaño
      this.cajaMixtaArmada.tamanioCaja = tamaniosDisponibles[indiceActual - 1];
      this.recalcularCajaMixta()
      this.addCajaMixtaArmadaLocalStorage()
    } else {
      // Si ya estás en el tamaño más pequeño, muestra un mensaje de advertencia
      swal.fire({
        icon: 'warning',
        title: 'Alert',
        text: "You can't reduce the box anymore",
      });
    }
  }

  public recalcularCajaMixta() {

    this.cajaMixtaArmada.detalle.forEach(detalle => {

      detalle.producto.tallas.forEach(talla => {
        if (talla.tallaSeleccionada) {
          talla.cajas.forEach(caja => {
            caja.cajaSeleccionada = false
          })
        }
      })

      detalle.producto.tallas.forEach(talla => {
        if (talla.tallaSeleccionada) {
          talla.cajas.forEach(caja => {
            if (caja.caja === this.cajaMixtaArmada.tamanioCaja) {
              caja.cajaSeleccionada = true
            }
          })
        }
      })

      const tallaProducto = this.obtenerTallaProducto(detalle.producto);

      const cajaProducto = this.obtenerCajaProductoMixta(detalle.producto);
      detalle.precioCajaMixta = tallaProducto.precioMixta
      detalle.cantidadTallosPorCaja = cajaProducto.cantidadPorCaja
      detalle.talla = tallaProducto.talla
      detalle.cantidadBunchePorCaja = cajaProducto.cantidadPorBunche
      detalle.precio = detalle.producto.tipoPrecioVariedad === 'T' ? detalle.totalTallos * detalle.precioCajaMixta : detalle.cantidadBunches * detalle.precioCajaMixta
      //detalle.precio = detalle.precioCajaMixta * detalle.totalTallos
      detalle.porcentaje = (detalle.totalTallos / detalle.cantidadTallosPorCaja) * 100
    })
    this.cajaMixtaArmada.porcentajeLleno = this.obtenerPorcentajeLlenoCajaMixta(this.cajaMixtaArmada)
    this.obtnerImagenProgreso(this.cajaMixtaArmada)
    this.sePuedeAgrandar = false;
  }

  sePuedeAgrandarCajaMixta() {
    this.sePuedeAgrandar = true;

    const tamanioCaja = this.cajaMixtaArmada.tamanioCaja;

    this.cajaMixtaArmada.detalle.forEach(element => {
      const tallaProducto = this.obtenerTallaProducto(element.producto);

      if (tamanioCaja === EnumTipoCaja.EB) {
        const tieneCajaQB = tallaProducto.cajas.some(caja => caja.caja === EnumTipoCaja.QB);

        if (!tieneCajaQB) {
          this.sePuedeAgrandar = false;
          // Salir del bucle al encontrar un elemento que no cumple la condición
          return;
        }
      } else if (tamanioCaja === EnumTipoCaja.QB) {
        const tieneCajaHB = tallaProducto.cajas.some(caja => caja.caja === EnumTipoCaja.HB);

        if (!tieneCajaHB) {
          this.sePuedeAgrandar = false;
          // Salir del bucle al encontrar un elemento que no cumple la condición
          return;
        }
      }
    });
  }


  sePuedeDisminuirCajaMixta(tamanioCaja): boolean {
    let sePuedeDisminuir = true;

    this.cajaMixtaArmada.detalle.forEach(element => {
      const tallaProducto = this.obtenerTallaProducto(element.producto);

      if (tamanioCaja === EnumTipoCaja.HB) {
        const tieneCajaQB = tallaProducto.cajas.some(caja => caja.caja === EnumTipoCaja.QB);

        if (!tieneCajaQB) {
          return false;
        }
      } else if (tamanioCaja === EnumTipoCaja.QB) {
        const tieneCajaEB = tallaProducto.cajas.some(caja => caja.caja === EnumTipoCaja.EB);

        if (!tieneCajaEB) {
          return false;
        }
      }
    });

    return sePuedeDisminuir && tamanioCaja !== EnumTipoCaja.EB
  }

  incrementarContador() {
    this.contadorClicsAddBox++;
  }

  obtenerContador() {
    return this.contadorClicsAddBox;
  }

}
