import { Component, Inject, OnInit } from '@angular/core';
import { Destino } from 'src/app/app.modelsWebShop';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppService } from '../../../app.service';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-new-po',
  templateUrl: './new-po.component.html',
  styleUrls: ['./new-po.component.scss']
})
export class NewPoComponent implements OnInit {
  myGroup;
  destino: Destino
  destinoSeleccionado: Destino;
  destinoFinal: Destino[] = [];
  selectDestino: Destino[] = this.destinoFinal;
  areaDestino = new FormControl('');
  destinoForm = this.builder.group({ area: this.areaDestino });
  mostrarDestino = [];
  po: Destino[] = [];
  poRecibidos: Destino[] = [];

  constructor(public _appService: AppService, public router: Router, public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NewPoComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder, private builder: FormBuilder, public appService: AppService,
    public dialog: MatDialog) {
    this.poRecibidos = this.data.destinos;
    this.myGroup = new FormGroup({
      nombre: new FormControl(),
      codigoDestino: new FormControl()
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.myGroup = this.formBuilder.group({
        'nombre': ['', Validators.compose([Validators.required])]
      });
      this._obtenerDestinosPorMarcacion(this.data.marcacion);
    }, 20);
  }

  public savePO(): void {
    var marcacion = null;
    if (this.data.tipoDestino == "H") {
      marcacion = JSON.parse(sessionStorage.getItem("Marcacion"));
    }
    if (this.data.tipoDestino == "S") {
      marcacion = JSON.parse(sessionStorage.getItem("MarcacionStading"));
    }
    if (this.myGroup.valid) {

      var poExist = this.poRecibidos.find(item => item.nombre === this.myGroup.value.nombre);
      if (poExist) {
        this.snackBar.open('Error: PO Record already exists ', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
        this.dialogRef.close(null);
        return;
      }
      const des: Destino = new Destino(
        this.myGroup.value.nombre,
        '', '', '', '', '', '','', '', null, null
      );
      this._appService.persistirDestino(des.nombre, marcacion.pk.codigoMarcacion).subscribe(
        (data: any) => {
          this.destino = data;
          this.snackBar.open('Confirmation: Record created ', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });

          this.appService.getDestinos(marcacion.pk.codigoMarcacion).subscribe((destinos: any) => {

            let destinoBdd = destinos.find(item => item.nombre === this.myGroup.value.nombre)

            if (destinoBdd) {
              this.destino = destinoBdd
            }

            if (this.data.tipoDestino == "H") {
              sessionStorage.setItem("Destino", JSON.stringify(this.destino));
              JSON.parse(sessionStorage.getItem("Destino"));
              this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
            }
            if (this.data.tipoDestino == "S") {
              sessionStorage.setItem("DestinoStading", JSON.stringify(this.destino));
              JSON.parse(sessionStorage.getItem("DestinoStading"));
              this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("DestinoStading"));
            }
            this.dialogRef.close(this.destino);
           // this.close()
          })
        },
        (err: any) => {
          if (err.status === 404) {
            this.snackBar.open('Error: Failed to conecct to server', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          }
          else if (err.status === 401) {
            this.snackBar.open('Error: ', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          }
        });
    }
    else {
      this.snackBar.open('Name is required. ', '×', { panelClass: 'error', verticalPosition: 'top', duration: 1000 });
    }
  }

  _persistirDestinoPorMarcacion(data) {
    if (this.myGroup.valid) {
      const des: Destino = new Destino(
        this.myGroup.value.nombre,
        '', '', '', '', '','', '', '', null, null
      );
      this._appService.persistirDestino(des.nombre, data.marcacion).subscribe(
        (data: any) => {
          this.destino = data
          this.snackBar.open('Confirmation: Record created ', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
          this.dialogRef.close(this.destino);
        },
        (err: any) => {
          if (err.status === 404) {
            this.snackBar.open('Error: Failed to conecct to server', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          }
          else if (err.status === 401) {
            this.snackBar.open('Error: ', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          }
        });
    }
    else {
      this.snackBar.open('Name is required. ', '×', { panelClass: 'error', verticalPosition: 'top', duration: 1000 });
    }
  }

  close() {
    this.dialogRef.close()
  }

  _obtenerDestinosPorMarcacion(codigoMarcacion) {
    this.appService.getDestinos(codigoMarcacion).subscribe((data: any) => {
      this.mostrarDestino = [];
      this.destinoFinal = [];
      this.selectDestino = [];
      this.po = data;
      this.mostrarDestino.push(this.po[0].nombre);
      this.destinoFinal.push(...this.po);
      this.selectDestino = this.destinoFinal;
    });
  }

  searchDestino(query: string) {
    let result = this._selectDestino(query);
    if (result.length > 0) {
      this.selectDestino = result;
    }
  }

  _selectDestino(query: string): Destino[] {
    let result: Destino[] = [];
    for (let destino of this.destinoFinal) {
      if (destino.nombre.toLowerCase().indexOf(query) > -1) {
        result.push(destino);
      }
    }
    return result;
  }

  _seleccionarDestino(destino: Destino) {
    this.dialogRef.close(destino)
  }

  public _nuevoDestino() {
    const dialogRef = this.dialog.open(NewPoComponent, {
      panelClass: 'nuevo-destino',
      data: { tipo: 'NEW', tipoBoton: 'B1', tipoDestino: this.router.url === "/checkout" ? "H" : "S" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        debugger
        this._seleccionarDestino(result);
      }
    });
  }

}


