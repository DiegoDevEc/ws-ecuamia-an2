import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ambiente } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-added',
  templateUrl: './added.component.html',
  styleUrls: ['./added.component.scss']
})
export class AddedComponent implements OnInit {

  public urlImagen: string
  public nombreVariedad: string
  public nombreProducto: string
  public nombreCaja: string

  constructor(public appService: AppService, public dialog: MatDialog, public router: Router,
    public dialogRef: MatDialogRef<AddedComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.urlImagen = ambiente.urlFotos
    
    if(this.data.tipoAgrega == 'C'){
      if(this.data.producto.combo == 'S'){
        this.nombreCaja = this.data.producto.nombreCaja.toLowerCase()
        return;
      }
      this.nombreVariedad = this.data.producto.nombreVariedad.toLowerCase()
      this.nombreProducto = this.data.producto.producto.toLowerCase()
    }
  }

  closeAdded(){
    this.dialogRef.close();
  }

  _varietiesNoRepeated(list: any) {
    let tr=0;

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
