import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { isObject } from 'rxjs/internal/util/isObject';
import { Caja, DatosActualizados, EditarVariedad, EnviarDatos, Talla, Variedad } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';
import { AddedComponent } from '../added/added.component';
import { NoteBoxesComponent } from '../note-boxes/note-boxes.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public modificoCaja: boolean = false

  public enviarDatos
  public datosActualizados: any

  constructor(public appService: AppService, public dialog: MatDialog, public router: Router,
    public dialogRef: MatDialogRef<EditComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  _close() {
    this.dialogRef.close()
  }

  _eliminar(variedad: Variedad) {
    this.enviarDatos = new EnviarDatos('D', variedad, null);
    this.dialogRef.close(this.enviarDatos)
  }

  _actulizarTallaPorProducto(talla: Talla, productOriginal: Caja[], variedad: Variedad) {
    this.modificoCaja = true
    var data = productOriginal[0].variedades.filter(x => x.tallaCm == talla.codigo && x.talla == talla.valor)
    var resultado = data.filter(x => x.caja === variedad.caja)
    if (resultado.length > 0) {
      const indexVariedad = productOriginal[0].variedades.indexOf(resultado[0])
      if (indexVariedad != -1) {
      //  variedad.indexPorVariedad = indexVariedad
      }
      else {
       // variedad.indexPorVariedad = indexVariedad
      }
    }

    this.datosActualizados = new DatosActualizados(
      talla,
      productOriginal,
      variedad
    );

  }

  _guardar() {

    if (this.modificoCaja) {

      let asignarVariedad = this.datosActualizados.productOriginal[0].variedades
        .find(x => x.caja === this.datosActualizados.variedad.caja &&
          x.talla == this.datosActualizados.talla.valor && x.tallaCm == this.datosActualizados.talla.codigo)

      if (asignarVariedad != null || asignarVariedad != undefined) {
        let variedadEditarSeleccionada = this._asignarVariedad(asignarVariedad)
        this.enviarDatos = new EnviarDatos('E', variedadEditarSeleccionada, this.datosActualizados.variedad);
        this.dialogRef.close(this.enviarDatos)
      }
    } else {
      this.dialogRef.close()
    }

  }

  _asignarVariedad(asignarVariedad) {

    let variedadEditarSeleccionada = new Variedad(
      this.datosActualizados.variedad.codigoVariedad,
      this.datosActualizados.variedad.nombreVariedad,
      this.datosActualizados.variedad.producto,
      this.datosActualizados.variedad.cantidadPorBunche,
      this.datosActualizados.variedad.caja,
      this.datosActualizados.variedad.cantidadPorCaja,
      this.datosActualizados.talla.valor,
      this.datosActualizados.talla.codigo,
      this.datosActualizados.variedad.imagenes,
      asignarVariedad.precio,
      asignarVariedad.precioSO,
      asignarVariedad.precioFinca,
      asignarVariedad.precioJv,
     // asignarVariedad.precioCliente,
      // this.datosActualizados.variedad.stadingOrder,
      // this.datosActualizados.variedad.cajaCombo,
      // this.datosActualizados.variedad.cartCount,
      // this.datosActualizados.variedad.precios,
      // this.datosActualizados.variedad.codigosProveedor,
      // this.datosActualizados.variedad.seguridad,
      // this.datosActualizados.variedad.cajasCantidad,
      // this.datosActualizados.variedad.disabled,
      // this.datosActualizados.variedad.mostrarPrecioPorCaja,
      // this.datosActualizados.variedad.cantidadPorCajaMixta,
      // this.datosActualizados.variedad.sePuedeMezclar,
      // this.datosActualizados.variedad.nombresProveedor,
      // this.datosActualizados.variedad.disabledBox,
      // this.datosActualizados.variedad.disabledBunches,
      // this.datosActualizados.variedad.productOriginal,
      // this.datosActualizados.variedad.tallasVariedadSeleccionada,
      // this.datosActualizados.variedad.indexPorVariedad,
      // this.datosActualizados.variedad.cajasPorVariedad,
      // this.datosActualizados.variedad.cajaMinima,
      // this.datosActualizados.variedad.fincaPreferida
    );

    return variedadEditarSeleccionada;

  }

  _actualizarBunchesCajaCompleta(talla: Talla, productOriginal: Caja[], variedad: Variedad, indexVariedad: number, cart: Caja) {

    const indexCaja = this.appService.Data.cartListCaja.indexOf(cart)
    const indexVariedadAnterior = this.appService.Data.cartListCaja[indexCaja].variedades.indexOf(variedad)

    if (indexVariedadAnterior != -1) {
      this.appService.Data.cartListCaja[indexCaja].variedades.splice(indexVariedad, 1)
      this.modificoCaja = true
      var data = productOriginal[0].variedades.filter(x => x.tallaCm == talla.codigo && x.talla == talla.valor)
      var resultado = data.filter(x => x.caja === variedad.caja)
      if (resultado.length > 0) {
        const indexVariedad = productOriginal[0].variedades.indexOf(resultado[0])
        if (indexVariedad != -1) {
          //variedad.indexPorVariedad = indexVariedad
        }
        else {
          //variedad.indexPorVariedad = indexVariedad
        }
      }
      let nuevaVariedad = this._asignarVariedadCajaCompleta(resultado, variedad, talla)
    //  this.appService.Data.cartListCaja[indexCaja].variedades.splice(indexVariedad, 0, nuevaVariedad)
      //this.appService.addCartLocalStorage();
    }

  }

  _asignarVariedadCajaCompleta(variedadAnterior: Variedad[], nuevaVariedad: Variedad, talla: Talla) {

    // let variedadEditarSeleccionada = new Variedad(
    //   nuevaVariedad.codigoVariedad,
    //   nuevaVariedad.nombreVariedad,
    //   nuevaVariedad.producto,
    //   nuevaVariedad.cantidadPorBunche,
    //   nuevaVariedad.caja,
    //   nuevaVariedad.cantidadPorCaja,
    //   //talla.valor,
    //   //talla.codigo,
    // //  nuevaVariedad.imagenes,
    //   // variedadAnterior[0].precio,
    //   // variedadAnterior[0].precioSO,
    //   // variedadAnterior[0].precioFinca,
    //   // variedadAnterior[0].precioJv,
    //   // variedadAnterior[0].precioCliente,
    //   // nuevaVariedad.stadingOrder,
    //   // nuevaVariedad.cajaCombo,
    //   // nuevaVariedad.cartCount,
    //   // nuevaVariedad.precios,
    //   // nuevaVariedad.codigosProveedor,
    //   // nuevaVariedad.seguridad,
    //   // nuevaVariedad.cajasCantidad,
    //   // nuevaVariedad.disabled,
    //   // nuevaVariedad.mostrarPrecioPorCaja,
    //   // nuevaVariedad.cantidadPorCajaMixta,
    //   // nuevaVariedad.sePuedeMezclar,
    //   // nuevaVariedad.nombresProveedor,
    //   // nuevaVariedad.disabledBox,
    //   // nuevaVariedad.disabledBunches,
    //   // nuevaVariedad.productOriginal,
    //   // nuevaVariedad.tallasVariedadSeleccionada,
    //   // nuevaVariedad.indexPorVariedad,
    //   // nuevaVariedad.cajasPorVariedad,
    //   // nuevaVariedad.cajaMinima,
    //   // nuevaVariedad.fincaPreferida
    // );
    // return variedadEditarSeleccionada;
  }

  _salirCajaCompleta() {
    this.dialogRef.close()
  }


  _eliminarVariedadCajaCompleta(caja: Caja, variedad: Variedad, indexVariedad: number) {
   // this.appService.datosEdicionVariedad = new EditarVariedad([caja], [variedad], indexVariedad, variedad.codigosProveedor)
    this.dialogRef.close(true)
  }

  _agregarMasBunches(data) {
    this.appService.cajaSeleccionada = this.appService.actualizarCajaSeleccionada(data.caja.tipoCaja)
    const dialogRef = this.dialog.open(NoteBoxesComponent, {
      data: { variedad: null, condicion: 'ADD' },
      panelClass: 'note-boxes'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.appService.activarAgregarBunches = true
        this.appService.datosEdicionVariedad = new EditarVariedad(
          [data.caja], 
          [data.caja.variedades[0]], 
          0, 
          data.caja.variedades[0].codigosProveedor)
        if (data.paginaRuta == 'STADING') {
          this.router.navigate(['/stading']);
          this.dialogRef.close()
        } else {
          this.router.navigate(['/home']);
          this.dialogRef.close()
        }
      } else {
        this.appService.cajaSeleccionada = data.caja.tipoCaja
      }
    });
  }

}
