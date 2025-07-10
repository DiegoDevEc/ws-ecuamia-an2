import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { CarritodetalleComponent } from '../carritodetalle/carritodetalle.component';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.component.html',
  styleUrls: ['./order-placed.component.scss']
})
export class OrderPlacedComponent implements OnInit {

  constructor(public appService: AppService, public dialog: MatDialog, public router: Router,
    public dialogRef: MatDialogRef<OrderPlacedComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  _orderPlace() {
    this.dialogRef.close(false)
  }

  close() {
    this.dialogRef.close(true)
  }

  _goToCart() {
    this.dialogRef.close()
    const dialogRef = this.dialog.open(CarritodetalleComponent, {
      data: { null: null, editar: false },
      panelClass: 'carrito-detalle'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) { }
    });
  }

}
