import { Marcacion } from './../../../app.modelsWebShop';
import { Component, OnInit, Inject, ViewEncapsulation, ɵConsole } from '@angular/core';
import { Data, AppService } from '../../../app.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Destino } from 'src/app/app.modelsWebShop';
import { MatDialog } from '@angular/material';
import { NewPoComponent } from '../../products-carousel/new-po/new-po.component';
import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-product-po',
  templateUrl: './product-po.component.html',
  styleUrls: ['./product-po.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductPoComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  public dataSource: any;
  public displayedColumns: string[] = ['Name', 'Boton'];
  public destinos: Array<Destino> = [];
  public marcacionSleccionada: Marcacion;
  public subclientes: Array<Marcacion> = [];
  public destinoSeleccionado: Destino;


  constructor(public appService: AppService, public dialogRef: MatDialogRef<ProductPoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) {
    setTimeout(() => {
      this.seleccionarMarcacion();
    }, 20)
  }

  ngOnInit() {
  }

  public close(): void {
    this.dialogRef.close();
  }

  public seleccionarMarcacion() {

    //se valida si es cliente o subcliente : C = CLIENTE,  S = SUBCLIENTE, 
    var data: any
    data = JSON.parse(localStorage.getItem("Usuario"))
    if (data.codigoClientePadre != null || data.codigoClientePadre != undefined) {
      if (sessionStorage.getItem('Marcacion') == 'undefined' || sessionStorage.getItem('Marcacion') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.marcacionSleccionada = this.subclientes[0];
            sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacionSleccionada));
            this.appService._getCargasTransportePorMarcacion(this.marcacionSleccionada.codigoSeleccion).subscribe(data => {
              localStorage.setItem("ls_cargos", JSON.stringify(data));
            });
            this.seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
            return;
          }
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem('Marcacion'));
        this.seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
      }
    }
    else {
      if (sessionStorage.getItem('Marcacion') == 'undefined' || sessionStorage.getItem('Marcacion') == null) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        this.appService.getMarcacionesPrincipal(cli.codigoPersona, 'C').subscribe((data: any) => {
          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.marcacionSleccionada = this.subclientes[0];
            sessionStorage.setItem('Marcacion', JSON.stringify(this.marcacionSleccionada));
            this.appService._getCargasTransportePorMarcacion(this.marcacionSleccionada.codigoSeleccion).subscribe(data => {
              localStorage.setItem("ls_cargos", JSON.stringify(data));
            });
            this.seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
            return;
          }
        });
      }
      else {
        this.marcacionSleccionada = JSON.parse(sessionStorage.getItem('Marcacion'));
        this.seleccionarDestino(this.marcacionSleccionada.codigoSeleccion);
      }
    }
  }

  public seleccionarDestino(codigoMarcacion) {
    // sessionStorage.setItem("Destino",JSON.stringify(destino));
    this.appService.getDestinos(codigoMarcacion).subscribe((data: any) => {
      this.destinos = data;
      this.dataSource = new MatTableDataSource(this.destinos);
    });
  }

  public destinoseleccionado(destino: Destino) {
    this.dialogRef.close()
    sessionStorage.setItem("Destino", JSON.stringify(destino));
  }

  public addNewPO() {
    const dialogRef = this.dialog.open(NewPoComponent, {
      panelClass: 'products-message'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"))
      this.close()
      if (result) {

      }
    });
  }

  public searchFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
