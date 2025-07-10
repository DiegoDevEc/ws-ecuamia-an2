import { Observable, of } from 'rxjs';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteTrigger, MatDatepicker, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { VERSION } from '@angular/material';
import { DatePipe, WeekDay, Location } from '@angular/common';
import { EnumMensajes, EnumSiNo } from 'src/app/enumeration/enumeration';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, startWith } from 'rxjs/operators';
import { Caja, Camion, Destino, Filtro, PaginadorProducto, Variedad } from 'src/app/app.modelsWebShop';
import { ClienteDTO } from 'src/app/app.models';
import { AddedComponent } from '../added/added.component';

interface Data {
}

@Component({
  selector: 'app-increasebox',
  templateUrl: './increasebox.component.html',
  styleUrls: ['./increasebox.component.scss']
})
export class IncreaseboxComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  @Input() variedad: Variedad;
  currentpage: any;
  cajaArmada: Caja;
  productosProveedor: Array<Caja> = [];
  nombreVariedadSeleccionada = [{ valorVariedad: '', valorProducto: '' }];
  listaFiltrosSeleccionados: Filtro[] = [];
  listaFiltrosSeleccionadosColor = [];
  listaFiltrosSeleccionadosProducto = [];
  listaFiltrosFinales: Array<Filtro> = [];
  mensajeValorProducto: boolean;
  filterValue = '';
  valorBusquedaCol: string = '';
  valorBusquedaCat: string = '';
  mostrarFiltrosAll: boolean = false;
  productoNoEncontrado: boolean = false;
  pageNumbers = [];
  itemsPorPagina: number;
  paginaProductos = 1;
  productos: Array<Caja> = [];
  filtroRepetido: string = '';
  DatosProductos = [];
  buscarColoresPorProducto: string = '';
  page: any;
  mensajeTropical = EnumMensajes.EMPTY;
  paginado = new PaginadorProducto();
  isLoadingOne = false
  isLoading = false
  productosPaginados: Array<Caja> = [];
  totalRegistros = 0;
  destinoSeleccionado: Destino;
  listaFiltros: Filtro[] = [];
  camionSeleccionado: Camion;
  usuario: any;
  agregoCarrito: Boolean = false;


  constructor(private builder: FormBuilder, public appService: AppService, public dialog: MatDialog, public router: Router,
    public dialogRef: MatDialogRef<IncreaseboxComponent>, @Inject(MAT_DIALOG_DATA)
    public data: any, private spinner: NgxSpinnerService, private location: Location,
    private activatedRoute: ActivatedRoute, public snackBar: MatSnackBar) { 
      this.usuario = JSON.parse(localStorage.getItem('Usuario'));
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const valor = params['edit'];
      if ("edit-mix-box" == valor) {
        this.productosXProveedorEvent("valor")
      }
    });
    this.currentpage = this.router.url.replace('/', '');
    this.currentpage == 'home' || this.currentpage == 'checkout' ? this.currentpage = 'HUB' : this.currentpage = 'STD';
    this.cajaArmada = this.appService.CajaArmada;
    this.appService.CajaArmada.totalPiezas = 0;
    this.agregoCarrito = false;
  }

  agregarACaja(argumento: string) {
    // if (this.appService.CajaArmada.totalProcentajeLleno >= 90) {
    //   let c: ClienteDTO = JSON.parse(localStorage.getItem('Usuario'));

    //   this.cajaArmada.codigoTipoCliente = c.codigoTipoCliente;
    //   this.cajaArmada.codigoCliente = c.codigoPersona;
    //   this.cajaArmada.tipoAgrega = 'B';
    //   this.cajaArmada.stadingOrder = false;
    //   this.cajaArmada.tipoCaja = this.appService.cajaSeleccionada;
    //   this.cajaArmada.combo = 'N';
    //   this.cajaArmada.cantidadIngresada = 1;
    //   let respuesta = this.appService.addToCartCaja(this.cajaArmada);
    //   if (respuesta) {
    //     const timeout = 1500;
    //     const dialogRef = this.dialog.open(AddedComponent, {
    //       data: { producto: this.cajaArmada.variedades, tipoAgrega: 'B', imagen: '', cantidad: 0 },
    //       width: '410px',
    //       panelClass: 'added-product'
    //     });
    //     dialogRef.afterOpened().subscribe(() => {
    //       // setTimeout(() => {
    //       this.appService.contadorCarrito();
    //       //dialogRef.close();
    //       // }, timeout)
    //     });
    //     dialogRef.afterClosed().subscribe(() => {
    //       // setTimeout(() => {
    //       //this.appService.contadorCarrito();
    //       dialogRef.close();
    //       // }, timeout)
    //     });
    //   }
    //   if (argumento != 'N') {
    //     this.cajaArmada = this.appService.CajaArmada;
    //     this._limpiarWebShop();
    //   }
    // }
    // const message = 'The box must be full.';
    // status = 'error';
    // this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    //this.obtenerProductosPorTemporada();
    //this.cajaArmada = this.appService.CajaArmada;
    //this.appService.CajaArmada.totalPiezas = 0;
   // this._limpiarWebShop();
        this.dialogRef.close("Agregar");
  }

  productosXProveedorEvent(val: any) {

    const codigosVistos = new Set();
    this.paginado.cajaMixta = this.appService.CajaArmada.variedades.filter(variedad => {
      if (!codigosVistos.has(variedad.codigoVariedad)) {
        codigosVistos.add(variedad.codigoVariedad);
        return true; // Mantener la variedad si es única
      }
      return false; // Descartar la variedad duplicada
    });

    this.isLoadingOne = true
    this.paginado.pagina = 1
    this.paginado.filtroNombre = ''
    this.productosPaginados = [];
   // this.getproductosWebShop()
  }

  _limpiarWebShop() {
    this.appService.codigosProveedorFinales = [];
    this.appService.codigosProveedorRespaldo = [];
    this.appService.listaProductosBusquedaMezcla = [];
    this.appService.realizoBusquedaProducto = false;
    this.appService.CajaArmada.totalProcentajeLleno = 0;
    this.appService.CajaArmada.variedades = [];
    this.appService.CajaArmada.totalPiezas = 0;
    this.appService.cajaSeleccionada = "EB";
    this.appService.cajasConValor = [];
    this.appService.busquedaGeneralWs = "";
    this.appService.activarQueryRoses = false;
    this.appService.resultadoBusqueda = false;
    this.appService.mostrarPromociones = false;
    this.appService.activarBusquedaCuandoElimina = false;
    this.productosProveedor = [];
    this.nombreVariedadSeleccionada = [];
    this.listaFiltrosSeleccionados = [];
    this.listaFiltrosSeleccionadosColor = [];
    this.listaFiltrosSeleccionadosProducto = [];
    this.listaFiltrosFinales = [];
    this.cajaArmada.variedades = [];
    this.cajaArmada.totalCantidadPorBunche = 0;
    this.mensajeValorProducto = false;
    this.filterValue = "";
    this.valorBusquedaCat = "";
    this.valorBusquedaCol = "";
    this.nombreVariedadSeleccionada = [];
    this.productoNoEncontrado = false;
    this.mostrarFiltrosAll = false;
    this.filtroRepetido = "";
    this.productos = [];
    this.DatosProductos = [];
    this.buscarColoresPorProducto = "";
    this.page = 1;
    this.paginaProductos = 1;
    this.itemsPorPagina = 50;
    this.pageNumbers = [50];
    this.mensajeTropical = EnumMensajes.EMPTY;
    window.scrollTo(0, 0);
    this.paginado.filtroNombre = '';
    this.paginado.cajaMixta = []
    this.paginado.pagina = 1
    this.paginado.colores = []
    this.paginado.filtroProducto = [];

    this.isLoadingOne = true
    this.productosPaginados = [];
   // this.getproductosWebShop();
    this.router.navigate(['/home']);
  }

  // getproductosWebShop() {
  //   this.isLoadingOne = true
  //   this.isLoading = true;
  //   this.appService.getProductosWebShopPost(this.paginado).subscribe(data => {

  //     this.totalRegistros = data.numRegistros;

  //     const c: any = JSON.parse(localStorage.getItem('Usuario'));
  //     const cajas: Caja[] = JSON.parse(data.json);
  //     this.productos = cajas.filter(x => x.combo == EnumSiNo.N);

  //     if (this.productos.length > 0) {

  //       this.appService.orderWebShop = c.orderWebShop === EnumSiNo.N ? EnumSiNo.N : EnumSiNo.S;
  //       for (let index = 0; index < this.productos.length; index++) {

  //         const element = this.productos[index];
  //         element.tallasDeCaja = [];
  //         element.tallasCajaCm = [];
  //         element.tallasFinales = [];
  //         element.cajasDisponiblesMixtas = [];
  //         element.imagen = this.appService.urlImagen + element.imagenes[0];
  //         element.stadingOrder = false;
  //         element.nombreProducto = element.variedades[0].nombreVariedad.toLowerCase() + " - " + element.variedades[0].producto.toLowerCase();
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
  //           element.cajasDisponiblesMixtas.push(variedad.cantidadPorCajaMixta);
  //           if (variedad.cantidadPorCaja > 0) {
  //             element.tallasDeCaja.push(variedad.talla);
  //             element.tallasCajaCm.push(variedad.tallaCm);
  //             element.tallasFinales.push({ codigo: variedad.tallaCm, valor: variedad.talla });
  //             if (element.combo == EnumSiNo.S) { element.totalPiezas += variedad.cantidadPorCaja; }
  //             variedad.stadingOrder = false;
  //             variedad.cajaCombo = EnumSiNo.N;
  //             variedad.disabledBox = false;
  //             variedad.disabledBunches = false;
  //             variedad.disabled = variedad.seguridad == "si" ? true : false;
  //             element.botonBox = EnumSiNo.S;
  //             element.botonBunches = variedad.mostrarPrecioPorCaja == 'no' ? EnumSiNo.N : EnumSiNo.S;
  //             for (let z = 0; z < variedad.precios.length; z++) {
  //               var precio = variedad.precios[z];
  //               var totalAux = 0;
  //               var totalAuxJv = 0;
  //               if (precio.tipoPrecio == EnumSiNo.N) {
  //                 if (c.codigoClientePadre != undefined) {
  //                   var porcentajeSumar = c.porcentajeSubcliente / 100;
  //                   var sumarPrecio = precio.precio * porcentajeSumar
  //                   var sumarPrecioJv = precio.precioJv * porcentajeSumar
  //                   precio.precio += sumarPrecio
  //                   precio.precioJv += sumarPrecioJv
  //                 }
  //                 if (c.codigoClientePadre === undefined && this.destinoSeleccionado != null) {
  //                   if (this.destinoSeleccionado.subcliente != null) {
  //                     if (this.destinoSeleccionado.subcliente.marginSubcliente != null && this.destinoSeleccionado.subcliente.marginSubcliente > 0) {
  //                       var porcentajeSumar = this.destinoSeleccionado.subcliente.marginSubcliente / 100;
  //                       var sumarPrecio = precio.precio * porcentajeSumar
  //                       var sumarPrecioJv = precio.precioJv * porcentajeSumar
  //                       precio.precio += sumarPrecio
  //                       precio.precioJv += sumarPrecioJv
  //                     }
  //                   }
  //                 }
  //                 if (precio.codigoTipoCliente === c.codigoTipoCliente) {
  //                   variedad.precio = precio.precio;
  //                   variedad.precioCliente = precio.precioCliente
  //                   variedad.precioJv = precio.precioJv
  //                   if (element.combo == EnumSiNo.S) {
  //                     variedad.cajaCombo = EnumSiNo.S
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
  //         element.tallasCajaCm = tallasUnicas.sort((a, b) => a - b);
  //         element.tallasFinales.sort((a, b) => a.codigo + b.codigo);
  //         element.tallaSeleccionada = tallaStr;// + '/';
  //         if (element.variedades[0].producto == "ROSES" || element.variedades[0].producto == "GARDEN ROSES"
  //           || element.variedades[0].producto == "MAYRAS GARDEN ROSES" || element.variedades[0].producto == "SPRAY ROSES") {
  //           if (element.tallasFinales.filter(x => x.valor === "50 CM").length > 0) {
  //             tallaOriginalMenor = 50;
  //             tallaStr = "50 CM";
  //             element.tallasDeCaja = [];
  //             element.tallasDeCaja.push(tallaStr);
  //             element.tallaSeleccionada = tallaStr;// + '/';
  //           }
  //         }
  //         if (element.variedades[0].producto == "HYDRANGEA") {
  //           if (element.tallasFinales.filter(x => x.valor === 'SUPER SELECT').length > 0) {
  //             tallaOriginalMenor = 0;
  //             tallaStr = 'SUPER SELECT';
  //             element.tallasDeCaja = [];
  //             element.tallasDeCaja.push(tallaStr);
  //             element.tallaSeleccionada = tallaStr;// + '/';
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
  //         //debugger
  //         var minCaja = Math.max(...cajaOriginalMenor);
  //         element.cajasDisponiblesMixtas = Array.from(new Set(element.cajasDisponiblesMixtas));
  //         element.cajaSeleccionada = minCaja;
  //         element.indexVariedadSeleccionada = this.tallaProducto(tallaStr, element, minCaja, "N", false);
  //         element.indexPorTipoCaja = this.actualizarIndexPorTipoCaja(element, tallaStr, false);
  //         element.tallasFinales.sort((a, b) => a.codigo - b.codigo);

  //       }
  //       //function comparar(a, b) { return a - b; };
  //       this.listaFiltros = [];
  //       this.listaFiltrosFinales = [];
  //       for (let item of cajas) {
  //         this.listaFiltros.push({ tipo: item.variedades[0].nombreVariedad.toLowerCase(), valor: item.variedades[0].producto.toLowerCase(), seleccionado: 'N' })
  //         this.listaFiltrosFinales.push({ tipo: item.variedades[0].nombreVariedad, valor: item.variedades[0].producto, seleccionado: null })
  //       }
  //       // this._getProductosFiltro();
  //       // this._filterOptions();
  //       // this._getCategoriasAutocomplete();
  //       // this._obtenerColoresFiltro();
  //       // this._getColoresAutocomplete();
  //       //this.getColoresWebShop(5);`
  //       this.productosPaginados = this.productosPaginados.concat(this.productos);
  //     }
  //     this.isLoading = false;
  //     this.isLoadingOne = false;
  //     console.log(JSON.parse(sessionStorage.getItem('Camion')));


  //     this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
  //     // window.scrollTo(0,0)
  //   });
  // }

  tallaProducto(talla: string, producto: Caja, cajaSeleccionada: number, cambioFiltro: string, actualizaTalla: boolean) {

    var indexVariedad = 0;
    var index: number = 0
    var productoSeleccionado;

    if (!actualizaTalla) {
      index = this.productos.indexOf(producto);
      productoSeleccionado = this.productos[index];
    } else {
      index = this.productosPaginados.indexOf(producto);
      productoSeleccionado = this.productosPaginados[index];

    }


    for (var x = 0; x < productoSeleccionado.variedades.length; x++) {
      const variedad = productoSeleccionado.variedades[x];

      variedad.cajasCantidad = [];
      if (variedad.cantidadPorCaja > 0) {
        var variedadABuscar = productoSeleccionado.variedades.filter(x => x.talla == talla && x.cantidadPorCaja > 0);

        variedadABuscar.forEach(item => {

          item.cajasPorVariedad.sort((a, b) => a.valor - b.valor);

          const indexMinima = item.cajasPorVariedad.findIndex(x => x.caja === item.cajaMinima)

          const cajasDisponibles = item.cajasPorVariedad.slice(indexMinima)

          const cajaSeAgrega = cajasDisponibles.find(x => x.caja == item.caja)

          if (item.cantidadPorCaja > 0 && cajaSeAgrega != undefined) {
            variedad.cajasCantidad.push(item.cantidadPorCaja);
          }

        });

        if (cambioFiltro == "S") {
          for (var caja of variedad.cajasCantidad) {
            if (variedad.cantidadPorCaja == caja && variedad.talla == talla) {
              cajaSeleccionada = caja;
            } else if (producto.cajaSeleccionada == caja && producto.tallaSeleccionada == talla) {
              cajaSeleccionada = caja;
              break;
            }
          }
          if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
            var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
            variedad.cajasCantidad.splice(indexCaja, 1)
            variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
            variedad.cajasCantidad.sort((a, b) => a - b)
            indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
            break;
          }
        } else if (variedad.producto == "ROSES" || variedad.producto == "GARDEN ROSES"
          || variedad.producto == "MAYRAS GARDEN ROSES" || variedad.producto == "SPRAY ROSES") {
          if (productoSeleccionado.tallasFinales.filter(x => x.valor == "50 CM").length > 0) {
            if (variedad.cantidadPorCaja > 0) {
              if (variedad.talla == "50 CM" && variedad.cantidadPorCaja == cajaSeleccionada) {
                var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
                variedad.cajasCantidad.splice(indexCaja, 1)
                variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
                variedad.cajasCantidad.sort((a, b) => a - b)
                indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
                break;
              }
            }
          } else if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
            var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
            variedad.cajasCantidad.splice(indexCaja, 1)
            variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
            variedad.cajasCantidad.sort((a, b) => a - b)
            indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
            break;
          }
        } else if (variedad.producto == 'HYDRANGEA') {
          if (productoSeleccionado.tallasFinales.filter(x => x.valor == 'SUPER SELECT').length > 0) {
            if (variedad.talla == 'SUPER SELECT' && variedad.cantidadPorCaja == cajaSeleccionada) {
              var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
              variedad.cajasCantidad.splice(indexCaja, 1);
              variedad.cajasCantidad.splice(0, 0, cajaSeleccionada);
              variedad.cajasCantidad.sort((a, b) => a - b)
              indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
              break;
            }
          } else if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
            var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
            variedad.cajasCantidad.splice(indexCaja, 1)
            variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
            variedad.cajasCantidad.sort((a, b) => a - b)
            indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
            break;
          }
        } else if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
          var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
          variedad.cajasCantidad.splice(indexCaja, 1)
          variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
          variedad.cajasCantidad.sort((a, b) => a - b)
          indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
          break;
        }
      }
    }
    return indexVariedad;
  }

  actualizarIndexPorTipoCaja(producto, talla: string, actualizaTalla: boolean): number {
    var indexCaja: number;

    var index;
    var productoSeleccionado;

    if (!actualizaTalla) {
      index = this.productos.indexOf(producto);
      productoSeleccionado = this.productos[index];
    } else {
      index = this.productosPaginados.indexOf(producto);
      productoSeleccionado = this.productosPaginados[index];

    }


    var resultadoCajaEB = productoSeleccionado.variedades.filter(x => x.caja === "EB" && x.talla === talla && x.cantidadPorCaja > 0)
    var resultadoCajaQB = productoSeleccionado.variedades.filter(x => x.caja === "QB" && x.talla === talla && x.cantidadPorCaja > 0)
    var resultadoCajaHB = productoSeleccionado.variedades.filter(x => x.caja === "HB" && x.talla === talla && x.cantidadPorCaja > 0)
    // si tiene qb selecciona el precio del bunche qb
    if (resultadoCajaQB.length > 0) {
      resultadoCajaQB.forEach(variedad => {
        indexCaja = productoSeleccionado.variedades.indexOf(variedad);
      });
      return indexCaja;
    }
    // si tiene hb selecciona el precio del bunche hb
    if (resultadoCajaHB.length > 0) {
      resultadoCajaHB.forEach(variedad => {
        indexCaja = productoSeleccionado.variedades.indexOf(variedad);
      });
      return indexCaja;
    }
    // si tiene eb selecciona el precio del bunche eb
    if (resultadoCajaEB.length > 0) {
      resultadoCajaEB.forEach(variedad => {
        indexCaja = productoSeleccionado.variedades.indexOf(variedad);
      });
      return indexCaja;
    }
  }

  actualizarCajaSeleccionada() {
    this.appService.cajaSeleccionada = this.appService.actualizarCajaSeleccionada(this.appService.cajaSeleccionada);
    this.appService._calcularPorcentajeCajaArmada(this.appService.cajaSeleccionada);
    this.appService.CajaArmada.totalProcentajeLleno = Math.round(this.appService.CajaArmada.totalProcentajeLleno);
    this.dialogRef.close();
  }

}
