import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatDatepicker, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ClienteDTO } from 'src/app/app.models';
import { DatePipe } from '@angular/common';
import { DownloadComponent } from '../../popus/download/download.component';
import { OrdenS } from 'src/app/app.modelsWebShop';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public orders: OrdenS[] = [];
  public page: number = 1;
  public count: number = 0;
  public clienteLogueado: ClienteDTO;
  public filterValue: string = '';
  public filterFechaSince: string = '';
  public filterFechaUntil: string = '';
  public mostrarMensaje = '';
  public contFiltros: number = 0;

  constructor(public appService: AppService, public dialog: MatDialog,
    public datepipe: DatePipe, translate: TranslateService, private router: Router) {
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    translate.use('en');;
  }

  ngOnInit() {
    this.getObtenerClientePedido();
    this.appService.detalleOrdenSeleccionado = null;
    this.appService._botonMenuSeleccionado(this.router.url)
  }

  // public onPageChanged(event) {
  //   this.page = event;
  //   window.scrollTo(0, 0);
  // }


  public getObtenerClientePedido() {
    var dataMarcacion = JSON.parse(sessionStorage.getItem("Marcacion"));
    const cli = JSON.parse(localStorage.getItem('Usuario'));
    var esSubcliente = 'N';
    var codigoCliente;

    if (cli.codigoClientePadre != undefined) {
      codigoCliente = cli.codigoPersona;
      esSubcliente = 'S';
    } else {
      codigoCliente = cli.codigoPersona;
      esSubcliente = 'N';
    }

    this.appService.getObtenerPedidoCliente(codigoCliente, dataMarcacion.codigoSeleccion, esSubcliente, this.page)
    .subscribe(data => {
      console.log(data)
      this.orders = data.map(order => ({
        ...order,
        fechaConexion: this.fomatDate(order.fechaConexion),
      }));
      //ordenar por array por id
      this.orders.sort((a, b) => a.id - b.id).reverse();
      for (let index = 0; index < this.orders.length; index++) {
        let cajas = 0;
        const orden = this.orders[index];
        orden.cajas.forEach(data => {
          if (data.variedades[0].cantidadPorCaja != undefined) {
            cajas += data.variedades[0].cantidadPorCaja
          }
        });
        orden.boxes = cajas
      }
      this.orders.forEach(element => {
        element.usuario = cli.codigoUsuario;
      });

      if (this.orders.length === 0) {
        this.mostrarMensaje = 'Sorry, no records were found'
      }
      if (this.orders.length > 0) {
        this.count = this.orders[0].totalConsulta;
      }
    });


  }

  public _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  public _limpiarFiltros() {
    this.filterFechaSince = ""
    this.filterFechaUntil = ""
    this.filterValue = ""
    this.orders = []
    this.page = 1
    this.contFiltros = 0
    this.ngOnInit();
  }

  public _updateDate(event) {
    if (this.filterFechaSince != "" && this.filterFechaUntil != "") {
      this.page = 1
      this.applyFilter(null, "S");
    }
  }

  public applyFilter(busquedaConEnter: any, busquedaConBoton: string) {
    var dataMarcacion = JSON.parse(sessionStorage.getItem("Marcacion"));
    const cli = JSON.parse(localStorage.getItem('Usuario'));
    var esSubcliente = 'N';
    var codigoCliente;

    if (cli.codigoClientePadre != undefined) {
      codigoCliente = cli.codigoPersona;
      esSubcliente = 'S';
    } else {
      codigoCliente = cli.codigoPersona;
      esSubcliente = 'N';
    }


    if (busquedaConBoton === "S") {
      if (this.filterFechaSince == null) {
        this.filterFechaSince = '';
      } 
      if (this.filterFechaUntil == null) {
        this.filterFechaUntil = '';
      }
      if ((this.filterValue.length == 0 && this.filterFechaSince == null && this.filterFechaUntil == null)
        || (this.filterValue.length == 0 && (this.filterFechaSince.length == 0 && this.filterFechaUntil.length == 0))) {
        this.getObtenerClientePedido();
        return;
      }else {
        this.contFiltros += 1;
      }

      if (this.filterValue.length == 0) {
        this.filterValue = 'xnullx'
      }

      if (this.contFiltros == 1) {
        this.page = 1
      }

      this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
      this.appService.getObtenerPedidoClienteFiltro(codigoCliente, dataMarcacion.codigoSeleccion, esSubcliente, this.page,
        this.datepipe.transform(this.filterFechaSince, 'yyyy-MM-dd'),
        this.datepipe.transform(this.filterFechaUntil, 'yyyy-MM-dd'),
        this.filterValue.trim()).subscribe((data: any) => {
          if (this.filterValue == 'xnullx') {
            this.filterValue = '';
          }
          this.orders = data.map(order => ({
            ...order,
            fechaConexion: this.fomatDate(order.fechaConexion)
          }));
          if (this.orders.length > 0) {
            this.count = this.orders[0].totalConsulta;
            return;
          } else {
             this.mostrarMensaje = 'Sorry, no records were found'
          }
          this.count = 0;
        });

      return;
    }

    if (busquedaConEnter.keyCode === 13) {
      if (this.filterFechaSince == null) {
        this.filterFechaSince = '';
      }
      if (this.filterFechaUntil == null) {
        this.filterFechaUntil = '';
      }
      if ((this.filterValue.length == 0 && this.filterFechaSince == null && this.filterFechaUntil == null)
        || (this.filterValue.length == 0 && (this.filterFechaSince.length == 0 && this.filterFechaUntil.length == 0))) {
        this.getObtenerClientePedido();
        return;
      }else {
        this.contFiltros += 1;
      }

      if (this.filterValue.length == 0) {
        this.filterValue = 'xnullx'
      }

      if (this.contFiltros == 1) {
        this.page = 1
      }

      this.clienteLogueado = JSON.parse(localStorage.getItem('Usuario'));
      this.appService.getObtenerPedidoClienteFiltro(codigoCliente, dataMarcacion.codigoSeleccion, esSubcliente, this.page,
        this.datepipe.transform(this.filterFechaSince, 'yyyy-MM-dd'),
        this.datepipe.transform(this.filterFechaUntil, 'yyyy-MM-dd'),
        this.filterValue.trim()).subscribe((data: any) => {
          if (this.filterValue == 'xnullx') {
            this.filterValue = '';
          }

          this.orders = data.map(order => ({
            ...order,
            fechaConexion: this.fomatDate(order.fechaConexion)
          }));
          if (this.orders.length > 0) {
            this.count = this.orders[0].totalConsulta;
            return;
          } else {
             this.mostrarMensaje = 'Sorry, no records were found'
          }
          this.count = 0;
        });
    }

  }

  onPageChanged2(event: number) {
    this.page = event; // Actualiza el número de página actual
    window.scrollTo(0, 0);
    this.applyFilter(null, "S");
    console.log('Página actual:', this.page);
  }

  goToFirstPage() {
    this.page = 1; 
    this.onPageChanged2(this.page);
  }

  goToLastPage() {
    this.page = this.orders[0].totalConsulta; 
    this.onPageChanged2(this.page);
  }

  private fomatDate(fecha){
    const parts = fecha.split('-');
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));

  }

  _detalleOrden(orden) {
    this.appService.detalleOrdenSeleccionado = orden
    this.router.navigate(['/account/orders-details'])
  }

}

