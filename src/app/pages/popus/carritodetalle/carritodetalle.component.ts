import { ProductDetallesDialogComponent } from './../../../shared/products-carousel/product-detalles-dialog/product-detalles-dialog.component';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { Caja, Talla, Variedad, ambiente } from 'src/app/app.modelsWebShop';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { EditComponent } from '../edit/edit.component';
import { DeleteComponent } from '../delete/delete.component';
import { CargosAdicionalesComponent } from '../cargos-adicionales/cargos-adicionales.component';
import { EnumMensajes, EnumPagina, EnumSiNo } from 'src/app/enumeration/enumeration';
import { AppWebshopService } from 'src/app/app-webshop.service';
import { CajaCarritoDetalleWebShop, CajaCarritoWebShop, TallaWebShop } from 'src/app/app.modelsWebShopV2';
import { ResponsiveService } from 'src/app/responsive.service';


@Component({
  selector: 'app-carritodetalle',
  templateUrl: './carritodetalle.component.html',
  styleUrls: ['./carritodetalle.component.scss']
})
export class CarritodetalleComponent implements OnInit {
  total = 0;
  grandTotal = 0;
  cartItemCount = 0;
  cartItemCountTotal = 0;
  boxesEB: number = 0;
  boxesQB: number = 0;
  boxesHB: number = 0;
  boxesEBT: number = 0;
  boxesQBT: number = 0;
  boxesHBT: number = 0;
  cartItemTropicalCount: number = 0;
  cartItemNoTropicalCount: number = 0;
  countBoxesTruckingHB: number = 0;
  countBoxesTruckingQB: number = 0;
  countBoxesTruckingEB: number = 0;
  tallaGeneral: Talla = null;
  activarTab: boolean = true;
  cantidadPorLote: number = 0;
  precioPorLote: number = 0;
  precioPorCaja: number = 0;
  contadorPorLote = 0;
  mixBoxesBelow: boolean = false;
  tropicalBelowH: boolean = false;
  tropicalBelowS: boolean = false;
  urlImagen = ''

  isMobile: boolean;

  constructor(public appService: AppService, public dialog: MatDialog, public appWebshopService: AppWebshopService,
    public router: Router, public dialogRef: MatDialogRef<CarritodetalleComponent>, public appWebShopService: AppWebshopService, public responsive: ResponsiveService) {
    this.isMobile = this.responsive.isMobile();
  }

  ngOnInit() {
    this.urlImagen = ambiente.urlFotos
  }

  public obtenerTallaSeleccionada(cajaDetalle: CajaCarritoDetalleWebShop) {
    return this.appWebShopService.obtenerTallaProducto(cajaDetalle.producto)
  }

  public actualizarCajaPorTalla(caja: CajaCarritoWebShop, talla: TallaWebShop, indexCaja: number) {
    this.appWebShopService.editarCajaSolida(caja, indexCaja, talla, caja.cantidadCajas)
  }

  public actualizarCajaPorCantidad(event, caja: CajaCarritoWebShop, talla: TallaWebShop, indexCaja: number) {
    if (event.target.value === '' || event.target.value === '0') {
      return;
    }
    this.appWebShopService.editarCajaSolida(caja, indexCaja, talla, event.target.value)
  }

  _eliminarCaja(caja: CajaCarritoWebShop) {
    const index: number = this.appWebShopService.data.cartListCaja.indexOf(caja);
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { titulo: 'Caution', mensaje: EnumMensajes.DELETECLIENTE },
      panelClass: 'delete-boxes'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (index !== -1) {
          this.appWebShopService.eliminarCajaCart(index)
        }
      }
    });
  }

  editarCajaMixta(caja: CajaCarritoWebShop) {
    const index: number = this.appWebShopService.data.cartListCaja.indexOf(caja);
    this.appWebShopService.editarCajaCart(index, caja);
    this.appWebShopService.paginador.cajaMixta = [];
    caja.detalle.forEach(detalle => {
      if(!detalle.variedadInactiva){        
        this.appWebShopService.paginador.cajaMixta.push(new Variedad(detalle.producto.codigoVariedad,
          detalle.producto.nombreVariedad, detalle.producto.producto, 0, caja.tamanioCaja, 0, caja.talla, 0, '', 0, 0, '', 0))
      }
    })
    this.appWebShopService.paginador.pagina = 1
    this.appWebShopService.addPaginadorLocalStorage();
    this.appService.dispararEditaCajaMixta();
    this.close()
  }


  mostrarCheckout() {
    var bandera = false
    this.appWebShopService.data.cartListCaja.forEach(caja => {
      caja.detalle.forEach(detalle => {
        if(detalle.variedadInactiva){
          bandera = true
        }
      })
    })
    return bandera
  }

  close() {
    this.dialogRef.close();
  }

  _checkout() {
    //if (this.appService.totalWithTruckiBoxes <= 0) { return }
    this.dialogRef.close();
    this.router.navigate(['/checkout']);
  }

  _checkoutStading() {
    if (this.appService.totalWithTruckiBoxes <= 0) { return }
    this.dialogRef.close();
    this.router.navigate(['/checkout/standing']);
  }

  cargosAdicionales() {
    var dataValue = "CART";
    const dialogRef = this.dialog.open(CargosAdicionalesComponent, {
      data: { value: dataValue, condicion: this.appService.setCondicionTab },
      panelClass: 'costo-envio'
    });
  }

  _verDetalleCajaCombo(caja) {
    const dialogRef = this.dialog.open(ProductDetallesDialogComponent, {
      data: { caja: caja, editar: false },
      panelClass: 'detalle-combo'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) { }
    });
  }

  _verMasProductos(caja: Caja) {
    const index = this.appService.Data.cartListCaja.indexOf(caja);
    if (index !== -1) {
      var pagina = this.activarTab == true ? EnumPagina.HUB : EnumPagina.STA;
      const dialogRef = this.dialog.open(EditComponent, {
        data:
        {
          caja: caja,
          tipoAgrega: "B",
          verLista: 'CART',
          paginaRuta: pagina,
          mensajeTitulo: EnumMensajes.MESSAGETITLE
        },
        width: '1100px',
        height: '520px',
        panelClass: 'edit-productos'
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.appService.activarEdicionVariedad = true;
          this.appService.cambioMenu = null;
          if (this.activarTab == true) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/stading']);
          }
          this.dialogRef.close();
        }
      });
    }
  }


}



