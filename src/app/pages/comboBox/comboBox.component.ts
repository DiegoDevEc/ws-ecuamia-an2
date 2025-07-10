import { Marcacion, ClienteUsuario, Destino, Camion, Information } from './../../app.modelsWebShop';
import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { AppService } from '../../app.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { Caja, Variedad } from 'src/app/app.modelsWebShop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatDatepicker } from '@angular/material';
import { DetailProductImageComponent } from 'src/app/shared/products-carousel/detail-product-image/detail-product-image.component'
import { DifferentdestinationComponent } from '../differentdestination/differentdestination.component';
import { ProductDetallesDialogComponent } from 'src/app/shared/products-carousel/product-detalles-dialog/product-detalles-dialog.component';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { InformationComponent } from '../popus/information/information.component';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { EnumPagina, EnumSiNo } from 'src/app/enumeration/enumeration';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-comboBox',
  templateUrl: './comboBox.component.html',
  styleUrls: ['./comboBox.component.scss']
})
export class ComboBoxComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  @Input() variedad: Variedad;
  public sidenavOpen = true;
  public sidenavClose = true;
  private sub: any;
  public page: any;
  public date: any
  public productos: Array<Caja> = [];
  public cajaArmada: Caja;
  public number = 0;
  public marcacionSleccionada: Marcacion;
  public subclientes: Array<Marcacion> = [];
  public clienteSeLeccionado: ClienteUsuario;
  public destinoSeleccionado: Destino;
  public destinos: Array<Destino> = [];
  public camionSeleccionado: Camion;
  public camiones: Array<Camion> = [];
  public camionesAll: Array<Camion> = [];
  public cajaInput = null;
  public numberPage: number;
  public dateNow: Date;
  public dateNowInit: string;
  public dateChange: any;
  public datePipe;
  public myControl = new FormControl();
  public filterValue = "";
  public filteredOptions: Observable<string[]>;
  public nameVariety: string[] = [];

  constructor(private activatedRoute: ActivatedRoute, public appService: AppService,
    public dialog: MatDialog, public formBuilder: FormBuilder,
    public snackBar: MatSnackBar) {

  //  this.getproductosWebShop();
    this.ValidacionDias()
    this.clienteLogueado();
    this.seleccionarMarcacion();
    this.obtenerTodosCamiones();

  }

  ngOnInit() {
    this.appService.contadorCarrito();
    this.number = 0
    this.numberPage = 30
    this.sub = this.activatedRoute.params.subscribe(() => {
    });
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
      this.sidenavClose = false;
    }
    if (this.appService.Data.cartListCaja.length == 0) {
      this.appService.Data.totalPrice = 0.00;
    }
  }

  public _filterOptions() {
    this.filteredOptions = null;
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );
  }

  // private _filter(value: string): string[] {
  //   this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
  //     this.nameVariety = []
  //     const cajas: Caja[] = JSON.parse(data.json);
  //     for (let item of cajas.filter(x => x.combo == "S")) {
  //       this.nameVariety.push(item.variedades[0].producto);
  //       this.nameVariety.push(item.variedades[0].nombreVariedad);
  //     }
  //   });
  //   var hash = {};
  //   this.nameVariety = this.nameVariety.filter(function (current) {
  //     var exists = !hash[current] || false;
  //     hash[current] = true;
  //     return exists;
  //   });
  //   const filterValue = value.toLowerCase();
  //   return this.nameVariety.filter(option => option.toLowerCase().includes(filterValue));
  // }



  public seleccionarCamion(codigoMarcacion) {
    this.appService.getCamionSeleccionado(codigoMarcacion).subscribe((data: any) => {
      this.camiones = data;
      if (this.camiones.length > 0) {
        this.camionSeleccionado = this.camiones[0];
        sessionStorage.setItem('Camion', JSON.stringify(this.camionSeleccionado));
      }
    });
  }

  public obtenerTodosCamiones() {
    this.appService.getAllCamiones().subscribe((data: any) => {
      this.camionesAll = data;
    });
  }

  // public getproductosWebShop() {
  //   this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
  //     const cajas: Caja[] = JSON.parse(data.json);
  //     this.productos = cajas.filter(x => x.combo == "S");
  //     this.productos.sort(function (a, b) {
  //       return a.variedades[0].nombreVariedad.localeCompare(b.variedades[0].nombreVariedad);
  //     });
  //     const c: any = JSON.parse(localStorage.getItem('Usuario'));
  //     if (c.orderWebShop === 'N') {
  //       this.appService.orderWebShop = 'N'
  //     } else {
  //       this.appService.orderWebShop = 'S'
  //     }
  //     for (let index = 0; index < this.productos.length; index++) {
  //       const element = this.productos[index];
  //       element.tallasDeCaja = [];
  //       element.tallasCajaCm = []
  //       element.tallasFinales = []
  //       element.imagen = this.appService.urlImagen + element.imagenes[0]
  //       if (element.combo == 'S') {
  //         element.totalPiezas = 0;
  //         element.totalPrecio = 0.00;
  //         element.totalPrecioJv = 0.00;
  //       }
  //       for (let x = 0; x < element.variedades.length; x++) {
  //         const variedad = element.variedades[x];
  //         variedad.imagenes = this.appService.urlImagen + element.imagenes[0]
  //         element.tallasDeCaja.push(variedad.talla);
  //         element.tallasCajaCm.push(variedad.tallaCm)
  //         element.tallasFinales.push({ codigo: variedad.tallaCm, valor: variedad.talla })
  //         if (element.combo == 'S') {
  //           element.totalPiezas += variedad.cantidadPorCaja;
  //         }
  //         variedad.stadingOrder = false
  //         variedad.cajaCombo = "S"
  //         if (variedad.seguridad == "si") {
  //           variedad.disabled = true
  //         }
  //         for (let z = 0; z < variedad.precios.length; z++) {
  //           let precio = variedad.precios[z];
  //           let totalAux = 0;
  //           let totalAuxJv = 0;
  //           if (precio.tipoPrecio == "N") {
  //             if (c.codigoClientePadre != undefined) {
  //               let porcentajeSumar = c.porcentajeSubcliente / 100;
  //               let sumarPrecio = precio.precio * porcentajeSumar
  //               let sumarPrecioJv = precio.precioJv * porcentajeSumar
  //               precio.precio += sumarPrecio
  //               precio.precioJv += sumarPrecioJv
  //             }
  //             if (precio.codigoTipoCliente === c.codigoTipoCliente) {
  //               variedad.precio = precio.precio;
  //               variedad.precioCliente = precio.precio
  //               variedad.precioJv = precio.precioJv
  //               if (element.combo == 'S') {
  //                 totalAux = variedad.precio * variedad.cantidadPorCaja
  //                 totalAuxJv = variedad.precioJv * variedad.cantidadPorCaja
  //                 element.totalPrecio += totalAux
  //                 element.totalPrecioJv += totalAuxJv
  //               }
  //             }
  //           }
  //         }
  //       }
  //       var tallaOriginalMenor = element.tallasCajaCm[0];
  //       var cajaOriginalMenor = [];
  //       var uniques = Array.from(new Set(element.tallasCajaCm));
  //       var hash = {};
  //       element.tallasFinales = element.tallasFinales.filter(function (current) {
  //         var exists = !hash[current.valor];
  //         hash[current.valor] = true;
  //         return exists;
  //       });
  //       var uniquesCajaString = Array.from(new Set(element.tallasDeCaja));
  //       element.tallasCajaCm = uniques.sort(comparar);
  //       element.tallasFinales.sort((a, b) => a.codigo - b.codigo);
  //       element.tallasDeCaja = uniquesCajaString;
  //       element.tallaSeleccionada = element.tallasDeCaja[0];
  //       var resultadoVariedad = element.variedades.filter(x => x.tallaCm == tallaOriginalMenor)
  //       for (let item of resultadoVariedad) {
  //         cajaOriginalMenor.push(item.cantidadPorCaja);
  //       }
  //       var minCaja = Math.min(...cajaOriginalMenor)
  //       element.cajaSeleccionada = minCaja;
  //     }
  //     function comparar(a, b) { return a - b; }
  //   });

  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 960) ? this.sidenavClose = false : this.sidenavClose = true;
    // (window.innerWidth < 960) ? this.viewCol = 100 : this.viewCol = 33.3;
  }


  public seleccionarMarcacion() {
    this.getInfoShipping();
  }

  public clienteLogueado() {
    const cli = JSON.parse(localStorage.getItem('Usuario'));
    this.clienteSeLeccionado = cli;
  }

  public ValidacionDias() {
    var datePipe = new DatePipe("en-US")
    if (localStorage.getItem("_ls_dateConecction") != null || localStorage.getItem("_ls_dateConecction") != undefined) {
      this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecction')));
      this.dateNowInit = datePipe.transform(this.date.value, 'yyyy-MM-dd');
      return;
    }
  }

  public bigPicture(imagen) {
    const dialogRef = this.dialog.open(DetailProductImageComponent, {
      data: { image: imagen, editar: false },
      panelClass: 'img-producto'
    });
    dialogRef.afterClosed().subscribe(res => {
      this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"))
      if (res) {
      }
    });
  }

  public rutaSeleccionada() {
    const dialogRef = this.dialog.open(DifferentdestinationComponent, {
      data: { null: null, editar: false },
      panelClass: 'app-differentdestination'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.seleccionarMarcacion()
      }
    });
  }

  public limpiarInput(event) {
    this.productos.forEach(element => {
      element.cantidadCajas = null;
    });
  }

  public tipoCajaInput(parametro) {
    this.cajaInput = parametro
  }


  public increment() {
    swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'To buy this item, please contact your sales representative. Thank you.',
    })
  }

  public _updateDate(event) {
    this.appService.readFiles().subscribe(dataFound => {
      this.appService.datePipe = new DatePipe("en-US");
      this.appService.dateFormat = this.appService.datePipe.transform(event.value, 'yyyy-MM-dd')
      this.appService.priceFound = dataFound.filter(x => this.appService.dateFormat >= x.fechaInicio.toString() && this.appService.dateFormat <= x.fechaFin.toString())
      if (this.appService.priceFound.length > 0) {
        for (let item of this.appService.priceFound) {
          this.appService.urlJsonGeneral = item.urlJson
        }
      }
      else {
        this.appService.urlJsonGeneral = "texto.json"
      }
    //  this.getproductosWebShop()
      localStorage.setItem("_ls_urlJson", this.appService.urlJsonGeneral)
      localStorage.setItem("_ls_dateConecction", event.value)
    });
  }

  public _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  public _informationDialog(marcacion) {
    let camionNombre = ''
    if (this.camionSeleccionado == undefined) {
      camionNombre = 'SN'
    } else {
      camionNombre = this.camionSeleccionado.nombre
    }
    const dialogRef = this.dialog.open(InformationComponent, {
      data: { data: EnumSiNo.N, marcacion: marcacion, camion: camionNombre, pagina: 'HUB' },
      panelClass: 'information'
    });
    dialogRef.afterClosed().subscribe(respuesta => {
      if (respuesta != null) {
        this.actualizarDatos();
        this.appService.guardarShippingInformation(
          this.marcacionSleccionada,
          this.camionSeleccionado,
          this.destinoSeleccionado,
          EnumPagina.HUB);
      }
    });
  }

  public actualizarDatos() {
    this.camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
    this.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"))
    this.marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"))
    this.validacionDias()
  }

  public validacionDias() {

    if (localStorage.getItem("_ls_dateConecction") != null || localStorage.getItem("_ls_dateConecction") != undefined) {
      var dateEspecial
      this.datePipe = new DatePipe("en-US");
      dateEspecial = new Date();
      dateEspecial.setDate(dateEspecial.getDate() + 5);
      this.dateChange = new FormControl(new Date(dateEspecial))
      this.date = new FormControl(new Date(localStorage.getItem('_ls_dateConecction')));
      this.dateNowInit = this.datePipe.transform(this.dateChange.value, 'yyyy-MM-dd')
      localStorage.removeItem("_ls_dateConecction")
      localStorage.setItem("_ls_dateConecction", this.date.value)
      return;
    }

    var fechaOriginal
    var dateEspecial
    fechaOriginal = new Date()
    dateEspecial = new Date();
    fechaOriginal.setDate(fechaOriginal.getDate() + 4);
    dateEspecial.setDate(dateEspecial.getDate() + 5);
    this.dateChange = new FormControl(new Date(dateEspecial))
    this.date = new FormControl(new Date(fechaOriginal));
    var datePipe = new DatePipe("en-US");
    this.dateNowInit = datePipe.transform(this.dateChange.value, 'yyyy-MM-dd')
    localStorage.setItem("_ls_dateConecction", this.date.value)
  }

  buscarProductosFiltro(event, arg) {
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

  getInfoShipping() {
    const cli = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.getInfoShipping(parseInt(cli.codigoPersona), EnumPagina.HUB).subscribe(data => {
      if (data[0].informacion != undefined) {
        var info = JSON.parse(data[0].informacion);
        this.marcacionSleccionada = info.marcacion;
        this.camionSeleccionado = info.camion;
        this.destinoSeleccionado = info.destino;
        sessionStorage.setItem("Marcacion", JSON.stringify(this.marcacionSleccionada));
        sessionStorage.setItem("Camion", JSON.stringify(this.camionSeleccionado));
        sessionStorage.setItem("Destino", JSON.stringify(this.destinoSeleccionado));
      }
    });
  }

}

