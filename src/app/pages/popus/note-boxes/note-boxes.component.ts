import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AppWebshopService } from 'src/app/app-webshop.service';
import { AppService } from 'src/app/app.service';
import { EnumTipoCaja } from 'src/app/enumeration/enumeration';

@Component({
  selector: 'app-note-boxes',
  templateUrl: './note-boxes.component.html',
  styleUrls: ['./note-boxes.component.scss']
})
export class NoteBoxesComponent implements OnInit {

  porcentajeEB: number = 0;
  porcentajeQB: number = 0;
  porcentajeHB: number = 0;

  constructor(public appService: AppService, public dialog: MatDialog, public router: Router,
    public dialogRef: MatDialogRef<NoteBoxesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public appWebshopService: AppWebshopService) { }

  ngOnInit() {
    if (this.data.condicion == 'EDIT') {
      this.appWebshopService.getImagenBarraProgreso().subscribe(data => {
        this.appWebshopService._validarCajaSeleccionada(this.appWebshopService.cajaMixtaArmada.tamanioCaja, data);
      });
    }
    if (this.data.condicion == 'ADD') {
      this.appWebshopService.getImagenBarraProgreso().subscribe(data => {
        this.appWebshopService._validarCajaSeleccionada(this.appWebshopService.cajaMixtaArmada.tamanioCaja, data);
      });
    }
  }

  _accept() {
    this.dialogRef.close(true)
  }

  _acceptRecal() {
    this.dialogRef.close(this.data.cantidad)
  }

  _enlarge() {
    this.appWebshopService.aumentarTamanioCaja()
    this.dialogRef.close(true)
  }

  _cancel(){
    //this.dialogRef.close(false)
    this.appWebshopService.contadorClicsAddBox = 0
    this.dialogRef.close("Agregar");
  } 
   _addToCart() {
    this.appWebshopService.agregarCajaMixtaAcarrito();
    this.dialogRef.close("addToCart");
  }

}
