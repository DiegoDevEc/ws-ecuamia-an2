import { AppService } from 'src/app/app.service';
import { caracterEspecial, MarcacionEditar } from '../../../app.modelsWebShop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material';
import { ViewposubclientComponent } from 'src/app/shared/products-carousel/viewposubclient/viewposubclient.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  @ViewChild(MatPaginator, {}) paginator: MatPaginator;
  public subclientes: Array<any> = [];
  public personasFiltro: any
  public dataSource;
  public displayedColumns: string[] = ['PO', 'Name', 'Addres', 'City', 'State', 'Zip', 'Chosse'];
  public marcacionesClientes: MarcacionEditar[] = []
  public page: number = 1;
  public config: any
  public count: number = 0
  public marcaciones: string[] = []
  public marcacionesControl = new FormControl();
  public filtrosOpcionesMarcaciones: Observable<string[]>;
  public mostrarMensaje: boolean = false

  public filterValue: string = '';
  public user = JSON.parse(localStorage.getItem("Usuario"));

  constructor(public appService: AppService, private router: Router, public dialog: MatDialog) {
    this.getSubclientes();
  }

  ngOnInit() {
    localStorage.removeItem("_lsIndividualC")
    this.appService._botonMenuSeleccionado(this.router.url)
    this.appService.cargosAdicionalesLocal = null
    this.appService._botonMenuSeleccionado(this.router.url)
  }

  public getSubclientes() {
    const cli = JSON.parse(localStorage.getItem('Usuario'));
    this.appService.getMarcaciones(cli.codigoPersona, this.page).subscribe((data: any) => {
      this.subclientes = data;
      if (this.subclientes.length > 0) {
        this.count = this.subclientes[0].totalConsulta - 1;
      } else {
        this.mostrarMensaje = true
      }
      for (var dataCustomer of this.subclientes) {
        this.marcacionesClientes.push({
          nombre: dataCustomer.marcacion.nombre,
          ciudad: dataCustomer.marcacion.ciudad,
          destino: dataCustomer.marcacion.destino,
          codigoGenerico: dataCustomer.marcacion.codigoGenerico,
          codigoPais: dataCustomer.marcacion.codigoPais,
          codigoCiudad: dataCustomer.marcacion.codigoCiudad,
          codigoCiudadDestino: dataCustomer.marcacion.codigoCiudadDestino,
          nombreEtiqueta: dataCustomer.marcacion.nombreEtiqueta,
          telefonoEtiqueta: dataCustomer.marcacion.telefonoEtiqueta,
          direccionEtiqueta: dataCustomer.marcacion.direccionEtiqueta,
          codigoPostal: dataCustomer.marcacion.codigoPostal,
          codigoSeleccion: dataCustomer.marcacion.codigoSeleccion,
          pk: dataCustomer.marcacion.pk,
          listaDestinos: dataCustomer.listaDestinos,
          estado: dataCustomer.cliente.activeWebshop,
        })
      }
      var hash = {};
      this.marcacionesClientes = this.marcacionesClientes.filter(function (marcacion) {
        var exists = !hash[marcacion.nombre];
        hash[marcacion.nombre] = true;
        return exists;
      });
    });
  }

  public editarCustomer(subClient) {
    var dataCliente = this.subclientes.filter(x => x.marcacion.nombreEtiqueta === subClient)
    localStorage.removeItem("_lsIndividualC")
    localStorage.setItem("_lsIndividualC", JSON.stringify(dataCliente))
    this.router.navigate(['/account/customers-form'])

  }

  public applyFilter(busquedaConEnter: any, busquedaConBoton: string) {

    if (this.filterValue === "" || this.filterValue === null) {
      this.marcacionesClientes = []
      //this.count = 1
      //this.page = 1
      this.mostrarMensaje = false
      this.getSubclientes()
      return;
    }

    //this.page = 1

    const cli = JSON.parse(localStorage.getItem('Usuario'));
    if (busquedaConBoton == "S") {

      this.appService.getMarcacionesConFiltro(
        cli.codigoPersona,
        this.page,
        this.filterValue.replace(caracterEspecial.arg, "")).subscribe(data => {
          this.marcacionesClientes = []
          this.subclientes = []

          this.subclientes = data;
          if (this.subclientes.length > 0) {
            this.count = this.subclientes[0].totalConsulta;
          } else {
            this.marcacionesClientes = []
            this.mostrarMensaje = true
            return;
          }
          for (var dataCustomer of this.subclientes) {
            this.marcacionesClientes.push({
              nombre: dataCustomer.marcacion.nombre,
              ciudad: dataCustomer.marcacion.ciudad,
              destino: dataCustomer.marcacion.destino,
              codigoGenerico: dataCustomer.marcacion.codigoGenerico,
              codigoPais: dataCustomer.marcacion.codigoPais,
              codigoCiudad: dataCustomer.marcacion.codigoCiudad,
              codigoCiudadDestino: dataCustomer.marcacion.codigoCiudadDestino,
              nombreEtiqueta: dataCustomer.marcacion.nombreEtiqueta,
              telefonoEtiqueta: dataCustomer.marcacion.telefonoEtiqueta,
              direccionEtiqueta: dataCustomer.marcacion.direccionEtiqueta,
              codigoPostal: dataCustomer.marcacion.codigoPostal,
              codigoSeleccion: dataCustomer.marcacion.codigoSeleccion,
              pk: dataCustomer.marcacion.pk,
              listaDestinos: dataCustomer.listaDestinos,
              estado: dataCustomer.cliente.activeWebshop,
            })
          }
          var hash = {};
          this.marcacionesClientes = this.marcacionesClientes.filter(function (marcacion) {
            var exists = !hash[marcacion.nombre];
            hash[marcacion.nombre] = true;
            return exists;
          });
        });

      return;
    }

    if (busquedaConEnter.keyCode === 13) {
      this.appService.getMarcacionesConFiltro(
        cli.codigoPersona,
        this.page,
        this.filterValue.replace(caracterEspecial.arg, "")).subscribe(data => {
          this.marcacionesClientes = []
          this.subclientes = []
          this.subclientes = data;

          if (this.subclientes.length > 0) {
            this.count = this.subclientes[0].totalConsulta;
          } else {
            this.marcacionesClientes = []
            this.mostrarMensaje = true
            return;
          }
          for (var dataCustomer of this.subclientes) {
            this.marcacionesClientes.push({
              nombre: dataCustomer.marcacion.nombre,
              ciudad: dataCustomer.marcacion.ciudad,
              destino: dataCustomer.marcacion.destino,
              codigoGenerico: dataCustomer.marcacion.codigoGenerico,
              codigoPais: dataCustomer.marcacion.codigoPais,
              codigoCiudad: dataCustomer.marcacion.codigoCiudad,
              codigoCiudadDestino: dataCustomer.marcacion.codigoCiudadDestino,
              nombreEtiqueta: dataCustomer.marcacion.nombreEtiqueta,
              telefonoEtiqueta: dataCustomer.marcacion.telefonoEtiqueta,
              direccionEtiqueta: dataCustomer.marcacion.direccionEtiqueta,
              codigoPostal: dataCustomer.marcacion.codigoPostal,
              codigoSeleccion: dataCustomer.marcacion.codigoSeleccion,
              pk: dataCustomer.marcacion.pk,
              listaDestinos: dataCustomer.listaDestinos,
              estado: dataCustomer.cliente.activeWebshop,
            })
          }
          var hash = {};
          this.marcacionesClientes = this.marcacionesClientes.filter(function (marcacion) {
            var exists = !hash[marcacion.nombre];
            hash[marcacion.nombre] = true;
            return exists;
          });
        });
      return;
    }

  }

  public registrarCliente() {
    localStorage.removeItem("_lsIndividualC")
    localStorage.removeItem("_lsBoxesTrucking")
    this.router.navigate(['/account/customers-formNew'])
  }


  public getPoSubclient(listaDestinos) {
    const dialogRef = this.dialog.open(ViewposubclientComponent, {
      data: { po: listaDestinos, editar: false },
      panelClass: 'destinos-lista'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      }
    });
  }

  // public onPageChanged(event) {
  //   this.marcacionesClientes = []
  //   this.page = event;
  //   window.scrollTo(0, 0);
  //   this.getSubclientes()
  // }

  onPageChanged2(event: number) {
    //this.marcacionesClientes = [];
    this.page = event; // Actualiza el número de página actual
    window.scrollTo(0, 0);
    this.applyFilter(null, "S");
    //this.getSubclientes();
    console.log('Página actual:', this.page);
  }

  goToFirstPage() {
    this.page = 1; 
    this.onPageChanged2(this.page);
  }

  goToLastPage() {
    this.page = (this.subclientes[0].totalConsulta)-1; 
    this.onPageChanged2(this.page);
  }  


  /*public _getMarcacionesAutocomplete() {
    this.filtrosOpcionesMarcaciones = null
    this.filtrosOpcionesMarcaciones = this.marcacionesControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filtrosMarcacionesAuto(value))
      );
  }

  private _filtrosMarcacionesAuto(value: string): string[] {
    this.marcaciones = []
    this.marcacionesClientes.forEach(x => {
      this.marcaciones.push(x.nombreEtiqueta)
    })
    var hash = {};
    this.marcaciones = this.marcaciones.filter(function (current) {
      var exists = !hash[current] || false;
      hash[current] = true;
      return exists;
    });
    const filterValue = value.toLowerCase();
    return this.marcaciones.filter(option => option.toLowerCase().includes(filterValue));
  }*/

}




