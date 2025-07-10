import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Caja, Etiquetas, ambiente } from 'src/app/app.modelsWebShop';
import { MatDialog } from '@angular/material';
import { CajaCarritoWebShop, CajaWebShop, ProductoWebShop, TallaWebShop } from 'src/app/app.modelsWebShopV2';
import { DetailProductImageComponent } from 'src/app/shared/products-carousel/detail-product-image/detail-product-image.component';
import { AppService } from 'src/app/app.service';
import { AppWebshopService } from 'src/app/app-webshop.service';
import { DeleteComponent } from '../../popus/delete/delete.component';
import { EnumMensajes } from 'src/app/enumeration/enumeration';

@Component({
  selector: 'app-card-product',
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss']
})
export class CardProductComponent implements OnInit {

  @Input() producto: ProductoWebShop;
  urlImagen: string;
  cajaArmada: CajaCarritoWebShop;
  precioSeleccionado: number;
  indexTallaSeleccionada: number;
  indexCajaSeleccionada: number;
  cantidadCajas: '';
  etiquetasWebshop: Etiquetas[] = [];
  etiquetaLimited: string = '';

  @Output() showDialogInformacion: EventEmitter<void> = new EventEmitter();
  @Output() filtrarPorVariedadAgregada: EventEmitter<void> = new EventEmitter();
  @Output() limpiarCarritoEmit: EventEmitter<void> = new EventEmitter();

  constructor(public appService: AppService, public dialog: MatDialog, public appWebService: AppWebshopService) {

    this.cajaArmada = appWebService.cajaMixtaArmada
  }

  ngOnInit() {

    this.urlImagen = ambiente.urlFotos
    this.producto.productoBuncheActivado = this.cajaArmada.detalle.length === 0  //true
    this.ordenarTallasYCajas()
    this.iniciarTallaYcajaSeleccionada()
    this.obtenerEtiquetas()
  }

  setDesplazar(target: any, index: number) {
    const parent = target.parentElement.parentElement;
    parent.scrollLeft = index * target.scrollWidth;
  }

  toLeft(target: any) {
    const parent = target.parentElement;
    if (parent && parent.children.length > 1) {
      parent.children[1].scrollLeft -= 60;
    }
  }

  toRigth(target: any) {
    const parent = target.parentElement;
    if (parent && parent.children.length > 1) {
      parent.children[1].scrollLeft += 60;
    }
  }

  public bigPicture(imagen) {
    const dialogRef = this.dialog.open(DetailProductImageComponent, {
      data: { image: imagen, editar: false },
      panelClass: 'img-producto'
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  _activarRowBunches() {
    this.producto.productoSeleccionado = true
    this.producto.productoBuncheActivado = false
  }

  _activarRowBox() {
    this.producto.productoSeleccionado = true
    this.producto.productoBuncheActivado = true
    if (this.cajaArmada.detalle.length == 0) {
    }
  }

  public seleccionarCaja(cajaSelect: CajaWebShop) {
    this.indexTallaSeleccionada = this.producto.tallas.findIndex(item => item.tallaSeleccionada)
    this.indexCajaSeleccionada = this.producto.tallas[this.indexTallaSeleccionada].cajas.findIndex(caja => caja.caja === cajaSelect.caja)
    this.limpiarSeleccionProducto()
    this.producto.tallas[this.indexTallaSeleccionada].tallaSeleccionada = true
    this.producto.tallas[this.indexTallaSeleccionada].cajas[this.indexCajaSeleccionada].cajaSeleccionada = true
    this.precioProducto()
  }

  public actualizarProductoPorTalla(talla: TallaWebShop) {
    if (talla.tallaSeleccionada) {
      return;
    }
    this.indexCajaSeleccionada = 0;
    this.indexTallaSeleccionada = undefined;
    this.limpiarSeleccionProducto()
    this.indexTallaSeleccionada = this.producto.tallas.findIndex(item => item.talla === talla.talla)
    this.producto.tallas.forEach(item => item.tallaSeleccionada = false)
    this.producto.tallas[this.indexTallaSeleccionada].tallaSeleccionada = true
    this.producto.tallas[this.indexTallaSeleccionada].cajas[this.indexCajaSeleccionada].cajaSeleccionada = true
    this.precioProducto()
  }

  public precioProducto() {
    this.precioSeleccionado = this.producto.tallas
      .filter(talla => talla.tallaSeleccionada)
      .map(talla => talla.cajas.find(caja => caja.cajaSeleccionada))
      .find(caja => !!caja).precio;
  }

  public limpiarSeleccionProducto() {
    this.producto.tallas.forEach(talla => {
      talla.tallaSeleccionada = false
      talla.cajas.forEach(caja => caja.cajaSeleccionada = false)
    })
  }

  public iniciarTallaYcajaSeleccionada() {
    this.indexTallaSeleccionada = 0;
    this.indexCajaSeleccionada = 0;
    this.producto.tallas[this.indexTallaSeleccionada].tallaSeleccionada = true
    if (this.producto.tallas[this.indexTallaSeleccionada].cajas.length > 0) {
      this.producto.tallas[this.indexTallaSeleccionada].cajas[this.indexCajaSeleccionada].cajaSeleccionada = true
    }
    this.precioProducto()
  }

  public ordenarTallasYCajas() {
    this.producto.tallas.sort((a, b) => {
      const tallaCmA = parseFloat(a.tallaCm);
      const tallaCmB = parseFloat(b.tallaCm);
      return tallaCmA - tallaCmB;
    });

    this.producto.tallas.forEach(talla => {
      talla.cajas.sort((a, b) => {
        return b.cantidadPorCaja - a.cantidadPorCaja;
      });
    })
  }

  limpiarInput(event) {
    this.cantidadCajas = ''
  }

  filtrarPorVariedad(event) {
    this.filtrarPorVariedadAgregada.emit();
  }

  limpiarCarrito() {
    this.limpiarCarritoEmit.emit();
  }

  _informationDialogControl(event) {
    this.showDialogInformacion.emit(event);
  }

  locked() {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        titulo: 'Information',
        mensaje: EnumMensajes.PRODUCTBLOCKED,
        imagen: 'S',
        mostrarBoton: true
      },
      panelClass: 'delete-boxes'
    });
  }

  obtenerEtiquetas() {
    this.appService.obtenerEtiquetaWebShop().subscribe(etiquetas => {
      this.etiquetasWebshop = JSON.parse(etiquetas.json);
      this.etiquetasWebshop.forEach(a => {
        if (a.codigoEtiqueta = 'LIMITED') {
          this.etiquetaLimited = a.etiqueta;
        }
      })
    });
  }

}
