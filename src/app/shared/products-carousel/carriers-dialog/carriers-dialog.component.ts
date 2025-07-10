import { Component, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Data, AppService } from '../../../app.service';
import { Orden, Camion } from '../../../app.modelsWebShop';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-carriers-dialog',
  templateUrl: './carriers-dialog.component.html',
  styleUrls: ['./carriers-dialog.component.scss']
})
export class CarriersDialogComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  public camionesAll: Array<Camion> = [];
  public dataSource: any;
  public displayedColumns: string[] = ['Name', 'Boton'];


  constructor(public appService: AppService,
    public dialogRef: MatDialogRef<CarriersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    setTimeout(() => {
      this.getAllCamiones();
    }, 20)
  }

  ngOnInit() {
  }


  public getAllCamiones() {
    this.appService.getAllCamiones().subscribe((data: any) => {
      this.camionesAll = data;
      this.dataSource = new MatTableDataSource(this.camionesAll);
    });
  }

  public carrierSeleccionado(camion: Camion) {
    this.dialogRef.close()   
    sessionStorage.setItem('Camion', JSON.stringify(camion));
  }


  public close(): void {
    this.dialogRef.close();
  }

  public searchCarries(filterValue: string) {
    //metodo para buscar
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
