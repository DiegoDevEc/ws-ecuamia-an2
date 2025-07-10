import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { AppWebshopService } from 'src/app/app-webshop.service';
import { PaginadorProducto, Variedad } from 'src/app/app.modelsWebShop';
import { ProductoWebShop, CajaCarritoWebShop, CajaCarritoDetalleWebShop } from 'src/app/app.modelsWebShopV2';
import { AppService } from 'src/app/app.service';
import { EnumTipoCaja, EnumSiNo } from 'src/app/enumeration/enumeration';
import { NoteBoxesComponent } from 'src/app/pages/popus/note-boxes/note-boxes.component';
import { SharedService } from '../service/shared.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-controls-fedex',
  templateUrl: './controls-fedex.component.html',
  styleUrls: ['./controls-fedex.component.scss']
})
export class ControlsFedexComponent implements OnInit {
  @Input() type: string;
  @Input() productoReferencia: ProductoWebShop;
  @Input() cantidadBunches: number;
  @Output() cajaSeleccionadaActualizada: EventEmitter<string> = new EventEmitter<string>();
  @Output() emitirPopupCamion: EventEmitter<any> = new EventEmitter<any>();
  @Output() filtrarPorVariedadAgregada: EventEmitter<any> = new EventEmitter<any>();
  @Output() limpiarCarrito: EventEmitter<void> = new EventEmitter();
  contadorClics = 0

  private producto;
  private subscription: Subscription;
  paginado = new PaginadorProducto();
  date: any;
  datePipe;

  constructor(public appService: AppService, public snackBar: MatSnackBar,
    public dialog: MatDialog, private sharedService: SharedService, public appWebShopService: AppWebshopService) {
    this.subscription = this.appService.eventoSeleccionaCamionYPoMixBox.subscribe(() => {
      this.incrementPrimerIntento()
      this.contadorClics = this.appWebShopService.obtenerContador();
    })
  }

  ngOnInit() {
    this.producto = _.cloneDeep(this.productoReferencia);
  }

  public agregarVariosBunches() {
    
    this.producto = _.cloneDeep(this.productoReferencia)
    this.appWebShopService.incrementarContador();
    this.contadorClics = this.appWebShopService.obtenerContador();
    let usuario = JSON.parse(localStorage.getItem("Usuario"));

    if (usuario.estadoPadre === 'BLO') {
      this.snackBar.open('New orders cannot be placed, please contact your account manager for help.', '×'
        , { panelClass: 'error', verticalPosition: 'top', duration: 7000 });
      return
    }

    if (sessionStorage.getItem('Camion') == null
      || sessionStorage.getItem('Camion') == 'undefined'
      || sessionStorage.getItem('Destino') == null
      || sessionStorage.getItem('Destino') == 'undefined'
      || sessionStorage.getItem('Marcacion') == null
      || sessionStorage.getItem('Marcacion') == 'undefined'
    ) {
      const variablesPorAgregar = []
      variablesPorAgregar.push(this.producto)
      variablesPorAgregar.push(this.cantidadBunches)
      this.sharedService.respaldarDatosProductoAgregar(variablesPorAgregar)
      this.emitirPopupCamion.emit('mixBox');
      return;
    }
    
    if (this.cantidadBunches == null || this.cantidadBunches == undefined) { return }
    this._agregarBunchesPorCaja();
  }

  public incrementPrimerIntento() {
    this.producto = _.cloneDeep(this.productoReferencia)
    if (this.sharedService.productoRespaldo != null) {
      const cantidadBunchesRespaldo = this.sharedService.productoRespaldo[1];
      const productoRespaldo = this.sharedService.productoRespaldo[0];
      this.cantidadBunches = cantidadBunchesRespaldo
      this.sharedService.respaldarDatosProductoAgregar(null)

      this.getproductosWebShop(productoRespaldo);
      //this.producto = productoRespaldo
      // this._agregarBunchesPorCaja();
    }
  }

  getproductosWebShop(productoRespaldo) {
    let dateConnection = localStorage.getItem('_ls_dateConecction');

    if (dateConnection != null || dateConnection != undefined) {
      this.date = new Date(dateConnection);

      this.datePipe = new DatePipe("en-US");
      this.paginado.fecha = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    }

    const destinoSeleccionado = JSON.parse(sessionStorage.getItem('Destino'));
    const cliente: any = JSON.parse(localStorage.getItem('Usuario'));
    this.paginado.codigoTipoCliente = cliente.codigoTipoCliente
    this.paginado.margen = destinoSeleccionado.subcliente.marginSubcliente
    this.paginado.pagina = 1
    this.paginado.filtroNombre = productoRespaldo.nombreVariedad

    const tallaSeleccionada = productoRespaldo.tallas.find(talla => talla.tallaSeleccionada);

    this.appWebShopService.getProductosWebShopPostV2(this.paginado).subscribe(data => {
      console.log("pasando nuevo precio");
      const productosActualizados = JSON.parse(data.json);
      this.producto = productosActualizados[0];
      this.producto.tallas.forEach(talla => {
        if (talla.talla === tallaSeleccionada.talla) {
          talla.tallaSeleccionada = true
        } else {
          talla.tallaSeleccionada = false
        }
      })
      this._agregarBunchesPorCaja();
      this.sharedService.respaldarDatosProductoAgregar(null)
      this.limpiarFiltros()
    },
      error => {
        console.error('Error al obtener productos:', error);
      });
  }

  public cajaAgrandarCaja(cajaCarrito: CajaCarritoWebShop): string {
    let cajaAgrandar = '';
    const tallaProducto = this.appWebShopService.obtenerTallaProducto(this.producto);
    if (cajaCarrito.tamanioCaja === EnumTipoCaja.EB) {
      const indexCaja = tallaProducto.cajas.findIndex(caja => caja.caja === EnumTipoCaja.QB);
      if (indexCaja != -1) {
        cajaAgrandar = EnumTipoCaja.QB
      }
    }

    if (cajaCarrito.tamanioCaja === EnumTipoCaja.QB) {
      const indexCaja = tallaProducto.cajas.findIndex(caja => caja.caja === EnumTipoCaja.HB);
      if (indexCaja != -1) {
        cajaAgrandar = EnumTipoCaja.HB
      }
    }
    return cajaAgrandar
  }

  public _agregarBunchesPorCaja(esRecursivo: boolean = false) {

    this.appService.existenProveedoresEb(this.producto.codigoVariedad).subscribe((dataProveedor) => {

      console.log(dataProveedor);

      let cajaCarrito = this.appWebShopService.getCajaMixtaArmada();

      if (dataProveedor) {
        this.appWebShopService.getCajaMixtaArmada().tamanioCaja = "QB"
        cajaCarrito.tamanioCaja = "QB"
      }

      const tallaProducto = this.appWebShopService.obtenerTallaProducto(this.producto);

      const indexVaridad = cajaCarrito.detalle.findIndex(item =>
        item.producto.codigoVariedad === this.producto.codigoVariedad && tallaProducto.talla === item.talla
      )

      if (cajaCarrito.detalle.length === 0 || indexVaridad === -1) {

        const detallesCajaOriginal = cajaCarrito.detalle.length

        const detalle = new CajaCarritoDetalleWebShop(this.producto, 0, 0, 0, 0, tallaProducto.precioMixta, 0, 0, tallaProducto.talla)

        cajaCarrito.detalle.push(detalle)
        const index = cajaCarrito.detalle.indexOf(detalle);
        this.appWebShopService.cajaMixtaArmada = cajaCarrito
        let seAgrego
        if (this.contadorClics > 0 && dataProveedor) {
          seAgrego = this.appWebShopService.emularRecalcularCajaEb(this.cantidadBunches, index)
        } else {
          seAgrego = this.appWebShopService.emularRecalcularCaja(this.cantidadBunches, index)
        }

        if (!seAgrego) {

          let seAgregaConReduccion = false;
          let contadorReduccion = -1;
          let cantidadDisponible = this.cantidadBunches + contadorReduccion; // Asignar antes del bucle

          while (!seAgregaConReduccion && cantidadDisponible > 0) {
            if (this.contadorClics > 0 && dataProveedor) {
              seAgrego = this.appWebShopService.emularRecalcularCajaEb(this.cantidadBunches, index)
            } else {
              seAgrego = this.appWebShopService.emularRecalcularCaja(this.cantidadBunches, index)
            }
            contadorReduccion -= 1; // Reducir el contador después de la evaluación
            cantidadDisponible = this.cantidadBunches + contadorReduccion; // Actualizar cantidadDisponible
          }

          if (cantidadDisponible === 0) {
            this._mensajeCajadesbordada("Mensaje 01")
          } else {
            this._mensajeCajadesbordadaAceptarCambio(this.producto.nombreVariedad, cantidadDisponible)
              .afterClosed().subscribe((cantidad: number) => {
                if (cantidad > 0) {
                  this.cantidadBunches = cantidad
                  this._agregarBunchesPorCaja(true)
                }
              });
          }
          this.appWebShopService.cajaMixtaArmada.detalle.splice(index, 1);
        } else {
          const cajaEmulada = this.appWebShopService.emularRecalcularCajaDetalle(this.cantidadBunches, index);
          if (detallesCajaOriginal > 0 && cajaEmulada.tamanioCaja !== cajaCarrito.tamanioCaja) {
            if (!esRecursivo) {
              this._mensajeCajadesbordadaProponerCambio(this.producto.nombreVariedad, this.cantidadBunches)
                .afterClosed().subscribe((acepto: boolean) => {
                  if (acepto === true) {
                    if (this.contadorClics > 0 && dataProveedor) {
                      this.appWebShopService.recalcularCajaEb(this.cantidadBunches, index)
                      console.log("Primer If " + this.contadorClics)
                    } else {
                      this.appWebShopService.recalcularCaja(this.cantidadBunches, index)
                    }
                  } {
                    cajaCarrito.detalle.splice(index, 1)
                  }
                });
            }

          } else {
            if (this.contadorClics > 0 && dataProveedor) {
              this.appWebShopService.recalcularCajaEb(this.cantidadBunches, index)
              console.log("Segundo If " + this.contadorClics)
            } else {
              this.appWebShopService.recalcularCaja(this.cantidadBunches, index)
            }
          }
        }
      }
      else {
        const seAgrego = this.appWebShopService.emularRecalcularCaja(this.cantidadBunches, indexVaridad)
        if (!seAgrego) {

          let seAgregaConReduccion = false;
          let contadorReduccion = -1;
          let cantidadDisponible = this.cantidadBunches + contadorReduccion; // Asignar antes del bucle

          while (!seAgregaConReduccion && cantidadDisponible > 0) {
            seAgregaConReduccion = this.appWebShopService.emularRecalcularCaja(cantidadDisponible, indexVaridad);
            if (!seAgregaConReduccion) {
              contadorReduccion -= 1; // Reducir el contador después de la evaluación
            }
            cantidadDisponible = this.cantidadBunches + contadorReduccion; // Actualizar cantidadDisponible
          }

          if (cantidadDisponible === 0) {
            this._mensajeCajadesbordada("Mensaje 01")
          } else {
            this._mensajeCajadesbordadaAceptarCambio(this.producto.nombreVariedad, cantidadDisponible)
              .afterClosed().subscribe((cantidad: number) => {
                if (cantidad > 0) {
                  this.cantidadBunches = cantidad
                  this._agregarBunchesPorCaja(true)
                }
              });
          }
        } else {
          const cajaEmulada = this.appWebShopService.emularRecalcularCajaDetalle(this.cantidadBunches, indexVaridad);

          if (!esRecursivo && cajaEmulada.tamanioCaja !== cajaCarrito.tamanioCaja) {
            this._mensajeCajadesbordadaProponerCambio(this.producto.nombreVariedad, this.cantidadBunches)
              .afterClosed().subscribe((acepto: boolean) => {
                if (acepto === true) {
                  if (this.contadorClics > 0 && dataProveedor) {
                    this.appWebShopService.recalcularCajaEb(this.cantidadBunches, indexVaridad)
                    console.log("Tercer If " + this.contadorClics)
                  } else {
                    this.appWebShopService.recalcularCaja(this.cantidadBunches, indexVaridad)
                  }
                }
              });
          } else {
            if (this.contadorClics > 0 && dataProveedor) {
              this.appWebShopService.recalcularCajaEb(this.cantidadBunches, indexVaridad)
              console.log("Cuarto If " + this.contadorClics)
            } else {
              this.appWebShopService.recalcularCaja(this.cantidadBunches, indexVaridad)
            }
          }
        }
      }
      console.log("Emitiendo segundo Evento");
      this.filtrarPorVariedadAgregada.emit("1");
      console.log("Despues de Emitir segundo Evento");
    })
  }


  public _mensajeCajaCompleta() {
    const dialogRef = this.dialog.open(NoteBoxesComponent, {
      data: { variedad: null, condicion: 'FULL' },
      panelClass: 'note-boxes'
    });
  }

  public _mensajeCajadesbordada(mensaje: string) {
    const dialogRef = this.dialog.open(NoteBoxesComponent, {
      data: { variedad: null, condicion: 'OVERFLOWINGBOX' },
      panelClass: 'note-boxes'
    });
  }

  public _mensajeCajadesbordadaAceptarCambio(variedad: string, cantidadCalculada: number) {
    return this.dialog.open(NoteBoxesComponent, {
      data: { variedad: variedad, condicion: 'OVERFLOWINGBOXCHANGE', cantidad: cantidadCalculada },
      panelClass: 'note-boxes'
    });
  }

  public _mensajeCajadesbordadaProponerCambio(variedad: string, cantidad: number) {
    return this.dialog.open(NoteBoxesComponent, {
      data: { variedad: variedad, condicion: 'OVERFLOWINGBOXCHANGES', cantidad: cantidad },
      panelClass: 'note-boxes'
    });
  }

  public _mensajeCajaIncrease() {
    const dialogRef = this.dialog.open(NoteBoxesComponent, {
      data: { variedad: null, condicion: 'ADD' },
      panelClass: 'note-boxes'
    });
  }

  public emitirCajaSelecionada(cajaSeleccionada: string) {
    this.cajaSeleccionadaActualizada.emit(cajaSeleccionada);
  }

  public _mensajeIncreaseBox() {
    return this.dialog.open(NoteBoxesComponent, {
      data: { variedad: null, condicion: 'ENLARGE' },
      panelClass: 'note-boxes'
    });
  }

  limpiarFiltros() {
    this.appWebShopService.paginador.filtroNombre = '';
    this.appWebShopService.paginador.cajaMixta = []
    this.appWebShopService.paginador.colores = []
    this.appWebShopService.paginador.filtroProducto = []
    this.appWebShopService.paginador.isPromo = false
    this.appWebShopService.paginador.isLimited = false
    this.appWebShopService.paginador.orden = 'PRO'
    this.appWebShopService.addPaginadorLocalStorage();
    this.appWebShopService.coloresWebShop.forEach(color => color.select = EnumSiNo.N)
    this.appWebShopService.productosWebShopFilter.forEach(producto => producto.select = EnumSiNo.N)
    this.appService.mostrarPromociones = false;
    this.appService.mostrarLimited = false;
    this.appService.mostrarTinted = false;
    this.appWebShopService.listaFiltrosSeleccionados = [];

    const cajaMixtaTamanio = this.appWebShopService.cajaMixtaArmada.tamanioCaja
    this.appWebShopService.cajaMixtaArmada.detalle.forEach(caj => {
      const talla = this.appWebShopService.obtenerTallaProducto(caj.producto)
      new Variedad(caj.producto.codigoVariedad, caj.producto.nombreVariedad, caj.producto.producto, 0, '', 0, talla.talla, 0, '', 0, 0, '', 0)
      this.appWebShopService.paginador.cajaMixta.push(new Variedad(caj.producto.codigoVariedad, caj.producto.nombreVariedad, caj.producto.producto, 0, cajaMixtaTamanio, 0, talla.talla, 0, '', 0, 0, '', 0))
    })
    this.appWebShopService.paginador.pagina = 1
    this.appWebShopService.addPaginadorLocalStorage();
  }

}
