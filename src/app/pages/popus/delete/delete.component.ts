import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AppWebshopService } from 'src/app/app-webshop.service';
import { AppService } from 'src/app/app.service';
import { CarritodetalleComponent } from '../carritodetalle/carritodetalle.component';
import { InformationComponent } from '../information/information.component';
import { EnumPagina } from 'src/app/enumeration/enumeration';
import { Camion, Destino, Marcacion } from 'src/app/app.modelsWebShop';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  destinoSeleccionado: Destino;
  camionSeleccionado: Camion;
  isLoadingDate = false;
  marcacionSleccionada: Marcacion;
  datePipe;
  isLoading = false
  isLoadingOne = false
  dateMostrar = 'SELECT YOUR SHIPPING DATE';
  dias = [];
  diaSemana = '';
  zonaHorariaEcuador;
  horarioDeEcuador = new Date();
  myControl = new FormControl();
  carritos = [];
  date: any;
  dateNowInit: string;
  usuario: any;

  constructor(public appService: AppService, public dialog: MatDialog, public router: Router,
    public dialogRef: MatDialogRef<DeleteComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public appWebshopService: AppWebshopService, public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.data.carritos.forEach(carrito => {
      var carritoAgregar = JSON.parse(carrito.carrito)
      carritoAgregar.idCarrito = carrito.idCarrito
      carritoAgregar.tipoCarritoTropical = carrito.tipoCarritoTropical
      this.carritos.push(carritoAgregar)
    })
  }

  _continue() {
    this.dialogRef.close(true)
  }


  totalCajasPedido(carData: any) {
    var total = 0;
    carData.dataCar.forEach(caja => {
      total += caja.cantidadCajas
    })
    return total;
  }
  /*
    public _informationDialog(marcacion, tipo) {
  
      let usuario = JSON.parse(localStorage.getItem("Usuario"));
  
      if (usuario.estadoPadre === 'BLO') {
        this.snackBar.open('New orders cannot be placed, please contact your account manager for help.', '×'
          , { panelClass: 'error', verticalPosition: 'top', duration: 7000 });
        return
      }
  
      tipo = this.appWebshopService.paginador.isTropical ? 'T' : ''
      // if (this.appWebshopService.data.cartListCaja.length !== 0) {
      //   return
      // }
      // if (this.appWebshopService.cajaMixtaArmada.detalle.length !== 0) {
      //   return
      // }
      var camionNombre = '';
      if (this.camionSeleccionado == undefined) {
        camionNombre = 'SN';
      } else {
        camionNombre = this.camionSeleccionado.nombre
      }
      var destinoNombre = '';
      if (this.destinoSeleccionado == undefined) {
        destinoNombre = 'SN';
      } else {
        destinoNombre = this.destinoSeleccionado.nombre
      }
  
      setTimeout(() => {
  
  
        const dialogRef = this.dialog.open(InformationComponent, {
          data: { data: 'N', marcacion: marcacion, camion: camionNombre, pagina: 'HUB', tipo: tipo, destino: destinoNombre },
          panelClass: 'information',
          disableClose: true,
          //maxHeight: '95vh'informat
        });
        dialogRef.afterClosed().subscribe(respuesta => {
  
          this.isLoadingDate = true;
  
          const dateString = localStorage.getItem('_ls_dateConecction');
  
          const dateDateFormat = this.datePipe.transform(dateString, 'MM-dd-yyyy');
  
          this.dateMostrar = dateDateFormat.toString()
  
          this.isLoadingDate = false;
  
          if (respuesta != null) {
            this.actualizarDatos();
            this.appService.guardarShippingInformation(
              this.marcacionSleccionada,
              this.camionSeleccionado,
              this.destinoSeleccionado,
              EnumPagina.HUB);
            if (this.appService.aumentarCajaMixta) {
              this.appService.dispararEventoCamionYPoMixBox();
              this.appService.actualizarAumentarCajaMixta('false');
            } else {
              this.appService.dispararEventoCamionYPo();
            }
            //this.seleccionaCamionPo.emit();
          }
        });
      }, 1000)
  
    }*/



  public _informationDialogActualizarPrecios(marcacion, tipo, idcarrito) {

    let usuario = JSON.parse(localStorage.getItem("Usuario"));

    if (usuario.estadoPadre === 'BLO') {
      this.snackBar.open('New orders cannot be placed, please contact your account manager for help.', '×'
        , { panelClass: 'error', verticalPosition: 'top', duration: 7000 });
      return
    }

    tipo = tipo

    var camionNombre = '';
    if (this.camionSeleccionado == undefined) {
      camionNombre = 'SN';
    } else {
      camionNombre = this.camionSeleccionado.nombre
    }
    var destinoNombre = '';
    if (this.destinoSeleccionado == undefined) {
      destinoNombre = 'SN';
    } else {
      destinoNombre = this.destinoSeleccionado.nombre
    }

    setTimeout(() => {

      const dialogRef = this.dialog.open(InformationComponent, {
        data: { data: 'N', marcacion: marcacion, camion: camionNombre, pagina: 'HUB', tipo: tipo, destino: destinoNombre },
        panelClass: 'information',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(respuesta => {
        var datePipeActualizar = new DatePipe("en-US");
        this.isLoadingDate = true;
        const dateString = localStorage.getItem('_ls_dateConecction');
        const dateDateFormat = datePipeActualizar.transform(dateString, 'dd-MM-yyyy');
        this.dateMostrar = dateDateFormat.toString()
        this.isLoadingDate = false;
        this.appService.dispararEventoCamionYPo();


        var usuario = JSON.parse(localStorage.getItem('Usuario'));
        var codigoCliente = parseInt(usuario.codigoPersona);

        this.appService.
          _obtenerCarritoPorClienteActualizarFecha(codigoCliente, this.appWebshopService.getPaginadorLocalStorage(),
            this.dateMostrar, idcarrito).subscribe(data => {
              var carrito = JSON.parse(data[0].carrito);
              carrito.idCarrito = data[0].idCarrito
              carrito.tipoCarritoTropical = data[0].tipoCarritoTropical
              this._continueCarSelect(carrito)
            })
      });
    }, 1000)

  }

  public actualizarDatos() {
    this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
    this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
    this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"));
    this._getCalcularDiaEntrega()
  }

  _getCalcularDiaEntrega() {
    var dia = this._getDiaSemana();
    var hora = this._getHoraDia();
    var minutos = this._getMinutos();

    switch (dia) {
      case 'Monday': {
        if (hora < 9 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 9 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Monday');
        }
        break;
      }
      case 'Tuesday': {
        if (hora < 9 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 9 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Tuesday');
        }
        break;
      }
      case 'Wednesday': {
        if (hora < 9 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 9 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Wednesday');
        }
        break;
      }
      case 'Thursday': {
        if (hora < 9 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 9 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Thursday');
        }
        break;
      }
      case 'Friday': {
        if (hora < 9 && minutos <= 59) {
          this._getFechaFlorex();
        }
        if (hora >= 9 && minutos >= 0) {
          this._calcularDiasEntregaPedido('Friday');
        }
        break;
      }
      case 'Saturday': {
        this._getFechaFlorex();
        break;
      }
      case 'Sunday': {
        this._getFechaFlorex();
        break;
      }
    }
  }

  _getDiaSemana(): string {
    this.dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.zonaHorariaEcuador = new Date().toLocaleString('en-US', { timeZone: 'America/Guayaquil' });
    this.horarioDeEcuador = new Date(this.zonaHorariaEcuador);
    this.horarioDeEcuador.setHours(this.horarioDeEcuador.getHours());
    this.horarioDeEcuador.setMinutes(this.horarioDeEcuador.getMinutes());
    this.diaSemana = this.dias[this.horarioDeEcuador.getDay()];
    return this.diaSemana;
  }

  _getHoraDia(): number {
    return this.horarioDeEcuador.getHours();
  }

  _getMinutos(): number {
    return this.horarioDeEcuador.getMinutes();
  }

  _getFechaFlorex() {
    let usuario = JSON.parse(localStorage.getItem("Usuario"));
    var fechaInicia = new Date();
    var datePipe = new DatePipe("en-US");
    if (localStorage.getItem("_ls_dateConecction") != null || localStorage.getItem("_ls_dateConecction") != undefined) {
      this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecction')));
      this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
      localStorage.setItem("_ls_dateConecction", this.date.value);
      return;
    }
    if (this.usuario.codigoClientePadre == 1940) { //Si es FLOWERFULL
      if (this.diaSemana === 'Sunday' ||
        this.diaSemana === 'Monday' ||
        this.diaSemana === 'Tuesday') {
        fechaInicia.setDate(fechaInicia.getDate() + 4);
      }
      if (this.diaSemana === 'Wednesday' ||
        this.diaSemana === 'Thursday' ||
        this.diaSemana === 'Friday' ||
        this.diaSemana === 'Saturday') {
        fechaInicia.setDate(fechaInicia.getDate() + 5);
      }
    }
    else { //Si no es FLOWERFULL
      if (this.diaSemana === 'Monday' ||
        this.diaSemana === 'Tuesday' ||
        this.diaSemana === 'Wednesday' ||
        this.diaSemana === 'Thursday' ||
        this.diaSemana === 'Friday') {
        fechaInicia.setDate(fechaInicia.getDate() + 3);
      }
      if (this.diaSemana === 'Saturday') {
        fechaInicia.setDate(fechaInicia.getDate() + 5);
      }
      if (this.diaSemana === 'Sunday') {
        fechaInicia.setDate(fechaInicia.getDate() + 4);
      }
    }

    this.date = new FormControl(new Date(fechaInicia));
    this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
    localStorage.setItem("_ls_dateConecction", this.date.value);

    this.dateMostrar = datePipe.transform(this.date.value, 'yyyy-MM-dd');
  }

  _calcularDiasEntregaPedido(dia: string) {
    var fechaInicia = new Date();
    var datePipe = new DatePipe("en-US");
    if (localStorage.getItem("_ls_dateConecction")) {
      this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecction')));
      this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
      localStorage.setItem("_ls_dateConecction", this.date.value);
      return;
    }
    if (this.usuario.codigoClientePadre == 1940) { //Si es FLOWERFULL
      if (dia === 'Saturday' || dia === 'Sunday' || dia === 'Monday') {
        fechaInicia.setDate(fechaInicia.getDate() + 5);
      }
      if (dia === 'Tuesday' || dia === 'Wednesday' || dia === 'Thursday' || dia === 'Friday') {
        fechaInicia.setDate(fechaInicia.getDate() + 6);
      }
    }
    else { //Si no es FLOWERFULL
      if (dia === 'Monday' || dia === 'Tuesday' || dia === 'Wednesday' || dia === 'Thursday') {
        fechaInicia.setDate(fechaInicia.getDate() + 4);
      }
      if (dia === 'Friday') {
        fechaInicia.setDate(fechaInicia.getDate() + 6);
      }
    }

    this.date = new FormControl(new Date(fechaInicia));
    this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
    localStorage.setItem("_ls_dateConecction", this.date.value);
  }

  actualizarPreciosPorFecha(codMarcacion: any, isTropical: any, idCarrito: any) {
    this._informationDialogActualizarPrecios(codMarcacion, isTropical === 'N' ? '' : 'T', idCarrito)
  }

  _continueCarSelect(carData: any) {

    this.appWebshopService.getCartLocalStorage();
    this.appWebshopService.data.cartListCaja = [];
    this.appWebshopService.data.totalCartCount = 0;
    this.appWebshopService.data.totalPrice = 0

    var carrito = carData

    if (carData.pedidoCaducado == true) {
      this.actualizarPreciosPorFecha(carrito.codMarcacion, carrito.tipoCarritoTropical, carrito.idCarrito);
      this.dialogRef.close(true)
      return;
    }

    const dateString = carrito.fechaPedido;
    const parts = dateString.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const dateObject = new Date(year, month, day);

    const camion = {
      nombre: carrito.nombreCamion,
      codigoCamion: carrito.codCamion
    }

    if (carrito.tipoCarritoTropical == 'S') {
      this.appWebshopService.paginador.isTropical = true;
      this.appWebshopService.paginador.aplicaFedexCarrito = false
    }    

    camion.codigoCamion === 'IPD' ? this.appWebshopService.paginador.aplicaFedexCarrito = true : this.appWebshopService.paginador.aplicaFedexCarrito = false

    this.appWebshopService.addPaginadorLocalStorage();


    this.appService.getDestinos(carrito.codMarcacion).subscribe((data: any) => {
      const po = data;
      let destino;

      po.forEach(element => {
        if (element.codigoDestino == carrito.codDestino) {
          destino = element;
        }
      });

      sessionStorage.setItem("Destino", JSON.stringify(destino));
      sessionStorage.setItem("Camion", JSON.stringify(camion));
      localStorage.setItem("_ls_dateConecction", dateObject.toString());
      localStorage.setItem("idCarrito", carrito.idCarrito)


      this.appWebshopService.data.cartListCaja = carrito.dataCar;
      this.appWebshopService.data.totalCartCount = 0;
      this.appWebshopService.data.cartListCaja.forEach(caja => {

        if (caja.tipoCaja === 'M') {
          caja.detalle.forEach(cajaMixta => {
            cajaMixta.precio = cajaMixta.precioCajaMixta * cajaMixta.totalTallos
            this.appWebshopService.data.totalPrice += cajaMixta.precio
          })
        } else {
          this.appWebshopService.data.totalPrice += caja.precioTotalCaja
        }

        this.appWebshopService.data.totalCartCount += caja.cantidadCajas;
      });
      this.appWebshopService.addCartLocalStorage();

      this.dialogRef.close(true)

      if (carrito.tipoCarritoTropical == 'N') {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/homeTropical']);
      }

      setTimeout(() => {
        this.shippingCartDetail()
      }, 500);

    });

  }

  shippingCartDetail() {
    var height = '';
    if (this.appService.Data.cartListCaja.length > 0) {
      var height = '100vh';
    }
    const dialogRef = this.dialog.open(CarritodetalleComponent, {
      data: {
        null: null,
        editar: false
      },
      panelClass: 'carrito-detalle',
      height: height
    });
  }

  _cancel() {
    this.dialogRef.close(false)
  }

  _EliminarCarrito(carData: any) {
    const idCarrito = carData.idCarrito;
    this.appService.eliminarCarritoHistorial(idCarrito).subscribe(() => {
      console.log("Carrito Eliminado");
      this.usuario = JSON.parse(localStorage.getItem('Usuario'));
      this.appWebshopService.paginador.codigoTipoCliente = this.usuario.codigoTipoCliente;
      this.appWebshopService.addPaginadorLocalStorage();
      this.appService._obtenerCarritoPorCliente(this.usuario.codigoPersona, this.appWebshopService.getPaginadorLocalStorage()).subscribe(data => {
        this.appWebshopService.data.totalCartCliente = data.length;
        this.dialogRef.close(false);
        window.location.reload();
      });
    });

  }

}
