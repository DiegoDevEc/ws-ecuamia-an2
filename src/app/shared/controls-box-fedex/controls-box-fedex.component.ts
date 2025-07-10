import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppWebshopService } from 'src/app/app-webshop.service';
import { Marcacion, Destino, Caja } from 'src/app/app.modelsWebShop';
import { ProductoWebShop } from 'src/app/app.modelsWebShopV2';
import { AppService } from 'src/app/app.service';
import { AddedComponent } from 'src/app/pages/popus/added/added.component';
import { InformationComponent } from 'src/app/pages/popus/information/information.component';
import { SharedService } from '../service/shared.service';
import * as _ from 'lodash';
import { InformationService } from 'src/app/core/services/information-service';

@Component({
  selector: 'app-controls-box-fedex',
  templateUrl: './controls-box-fedex.component.html',
  styleUrls: ['./controls-box-fedex.component.scss']
})
export class ControlsBoxFedexComponent implements OnInit {
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

  constructor(public appService: AppService, public snackBar: MatSnackBar, private informarmationService: InformationService,
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

  public increment() {
    
    this.producto = _.cloneDeep(this.productoReferencia)

    let usuario = JSON.parse(localStorage.getItem("Usuario"));

    if (usuario.estadoPadre === 'BLO') {
      this.snackBar.open('New orders cannot be placed, please contact your account manager for help.', '×'
        , { panelClass: 'error', verticalPosition: 'top', duration: 7000 });
      return
    }

    if(this.informarmationService.aplicaDestinatarioPedidoCompleto){
      this.incrementVarios(); 
      return;
    }

      const variablesPorAgregar = []
      variablesPorAgregar.push(this.producto)
      variablesPorAgregar.push(this.cantidadCajas)
      this.sharedService.respaldarDatosProductoAgregar(variablesPorAgregar)
      this.emitirPopupCamion.emit(variablesPorAgregar);
      return;
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
    }
    this.limpiarOut.emit("1");

  }

  public changeQuantity(value) {
    this.onQuantityChange.emit(value);
  }

}
