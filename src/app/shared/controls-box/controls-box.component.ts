import { Colores, Destino, Filtro, Marcacion, PaginadorProducto } from './../../app.modelsWebShop';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Variedad, Caja } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { AddedComponent } from 'src/app/pages/popus/added/added.component';
import { InformationComponent } from 'src/app/pages/popus/information/information.component';
import { Router } from '@angular/router';
import { SharedService } from '../service/shared.service';
import { Subscription } from 'rxjs';
import { ProductoWebShop } from 'src/app/app.modelsWebShopV2';
import { AppWebshopService } from 'src/app/app-webshop.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-controls-box',
  templateUrl: './controls-box.component.html',
  styleUrls: ['./controls-box.component.scss']
})
export class ControlsBoxComponent implements OnInit {
  @Input() productoReferencia: ProductoWebShop;
  @Input() indexVariedad: number;
  //@Input() variedad: Variedad;
  @Input() type: string;
  @Input() TipoCaja: string
  @Input() imagen: any
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() limpiarOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitirPopupCamion: EventEmitter<any> = new EventEmitter<any>();
  @Input() DatosProductosIu: any
  @Input() cajaSeleccionada: string;
  @Input() paginaRuta: string
  @Input() marcacionSleccionada: Marcacion;
  @Input() camionSeleccionado;
  @Input() isTropical: boolean;
  destinoSeleccionado: Destino;
  public align = 'center center';
  currentpage: any;
  datePipe;
  totalRegistros = 0;
  dias = [];
  nameInfo: string = '';
  addressInfo: string = '';
  cityInfo: string = '';
  stateInfo: string = '';
  zipInfo: string = '';
  phoneInfo: string = '';
  errorInfoTropical = false;

  private subscription: Subscription;

  constructor(public appService: AppService, public snackBar: MatSnackBar,
    public dialog: MatDialog, public router: Router, private sharedService: SharedService,
    public dialogRef: MatDialogRef<InformationComponent>, public appWebShopService: AppWebshopService) {

  }


  public DatosProductos = []
  public productos: Array<Caja> = [];
  private producto;
  @Input() cantidadCajas: number;

  ngOnDestroy() {
    // if (this.subscription) {
    //    this.subscription.unsubscribe();
    //  }
  }

  ngOnInit() {
    this.producto = _.cloneDeep(this.productoReferencia) 
    

    this.subscription = this.appService.eventoSeleccionaCamionYPo.subscribe(() => {
      this.subscription.unsubscribe();
      this.incrementPrimerIntento()
    })

    this.currentpage = this.router.url.replace('/', '');
    this.currentpage == 'home' ? this.currentpage = 'HUB' : this.currentpage = 'STD';
    this.layoutAlign();
  }

  public layoutAlign() {
    if (this.type === 'all') {
      this.align = 'space-between center';
    } else if (this.type === 'wish') {
      this.align = 'start center';
    } else {
      this.align = 'center center';
    }
  }

  _setTropicalInfo() {
    if (this.nameInfo == '' ||
      this.addressInfo == '' ||
      this.cityInfo == '' ||
      this.stateInfo == '' ||
      this.zipInfo == '' ||
      this.phoneInfo == '') { this.errorInfoTropical = true; return; } else { this.errorInfoTropical = false; }
    let str: any;
    str = {
      nombreEtiqueta: this.nameInfo,
      direccionEtiqueta: this.addressInfo,
      ciudad: this.cityInfo,
      destino: this.stateInfo,
      codigoPostal: this.zipInfo,
      telefonoEtiqueta: this.phoneInfo,
    }

    if (this.currentpage == 'HUB') { sessionStorage.setItem('AditionalInfoT', JSON.stringify(str)); }
    if (this.currentpage == 'STD') { sessionStorage.setItem('AditionalInfoStadingT', JSON.stringify(str)); }

    //Guardar PO
    let marcacionTropical;
    let destinoTropical;
    if (this.currentpage == 'HUB') {
      marcacionTropical = JSON.parse(sessionStorage.getItem("MarcacionT"));
      destinoTropical = JSON.parse(sessionStorage.getItem("DestinoT"));
    }
    if (this.currentpage == 'STD') {
      marcacionTropical = JSON.parse(sessionStorage.getItem("MarcacionStadingT"));
      destinoTropical = JSON.parse(sessionStorage.getItem("DestinoStadingT"));
    }
    destinoTropical.nombreCliente = str.nombreEtiqueta;
    destinoTropical.direccion = str.direccionEtiqueta;
    destinoTropical.ciudad = str.ciudad;
    destinoTropical.codigoDestino = str.destino;
    destinoTropical.codigoPostal = str.codigoPostal;
    destinoTropical.telefono = str.telefonoEtiqueta;

    this.appService.persistirDestino(destinoTropical, marcacionTropical.pk.codigoMarcacion).subscribe(
      (data: any) => {
        console.log("PO save:", data);
      });
  }

  public increment() {
    this.producto = _.cloneDeep(this.productoReferencia) 
    
    let usuario = JSON.parse(localStorage.getItem("Usuario"));

    if(usuario.estadoPadre === 'BLO'){
      this.snackBar.open('New orders cannot be placed, please contact your account manager for help.', '×'
      , { panelClass: 'error', verticalPosition: 'top', duration: 7000 });
      return
    }
    
    if (this.isTropical == true) {
      this._setTropicalInfo();
      if (!this.errorInfoTropical) {
        this.dialogRef.close('save')
      }
    }
    else {

      if (sessionStorage.getItem('Camion') == null
        || sessionStorage.getItem('Camion') == 'undefined'
        || sessionStorage.getItem('Destino') == null
        || sessionStorage.getItem('Destino') == 'undefined'
        || sessionStorage.getItem('Marcacion') == null
        || sessionStorage.getItem('Marcacion') == 'undefined'
      ) {
        const variablesPorAgregar = []
        variablesPorAgregar.push(this.producto)
        variablesPorAgregar.push(this.cantidadCajas)
        this.sharedService.respaldarDatosProductoAgregar(variablesPorAgregar)
        this.emitirPopupCamion.emit(variablesPorAgregar);
        return;
      }
    }

    // if (this.sharedService.productoRespaldo != null) {
    //   this.esprimerAgregado = false
    //   console.log("Agregandoooo");
    //   const cantidadCajasRespaldo = this.sharedService.productoRespaldo[1];
    //   const variedadRespaldo = this.sharedService.productoRespaldo[3];
    //   const productoRespaldo = this.sharedService.productoRespaldo[4];
    //   this.cantidadCajas = cantidadCajasRespaldo
    //   this.producto = productoRespaldo
    //   this.imagen = this.producto.imagen
    //   this.variedad = this.actualizarPrecioVariedad(variedadRespaldo);
    //   this.sharedService.respaldarDatosProductoAgregar(null)
    // } else {
    if (
      this.cantidadCajas == null || this.cantidadCajas == undefined) { return }
    //   let variedadBuscar = this.producto.variedades[this.indexVariedad];
    // this.variedad = variedadBuscar;

    this.incrementVarios();

  }

  public incrementPrimerIntento() {
    if (this.sharedService.productoRespaldo != null) {
      this.producto = this.sharedService.productoRespaldo[0]
      this.cantidadCajas = this.sharedService.productoRespaldo[1]
      this.sharedService.respaldarDatosProductoAgregar(null)
      this.incrementVarios();
    }
  }

  public incrementVarios() {
    const cajaSolida = this.appWebShopService.armarCajaSolida(this.producto, this.cantidadCajas)
    var respuesta = this.appWebShopService.agregarCajaCart(cajaSolida)

    if (respuesta) {
      const timeout = 1500;
      const dialogRef = this.dialog.open(AddedComponent, {
        data: { producto: this.producto, tipoAgrega: 'C', imagen: this.producto.imagenes[0], cantidad: this.cantidadCajas },
        width: '400px',
        panelClass: 'added-product'
      });
      dialogRef.afterClosed().subscribe(res => { });
      /*dialogRef.afterOpened().subscribe(res => {
        setTimeout(() => {
          dialogRef.close();
        }, timeout)
      });*/
    }
    //this.appWebShopService.setRegistrarCarritoDetallePorCliente()

    this.limpiarOut.emit("1");

  }

  public changeQuantity(value) {
    this.onQuantityChange.emit(value);
  }

}
