import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Caja } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';

interface Filtros {
  letra: string,
  valor: string,
  seleccionado: string
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  public filtrosOrden: Filtros[] = []
  public filtrosSeleccioados: string[] = []
  //public a: string

  public categorias: string[] = []
  public categoriasControl = new FormControl();
  public filtrosOpcionesCat: Observable<string[]>;
  public valorBusquedaCat = ''


  constructor(public appService: AppService, public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FiltersComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.data.filtros.forEach(element => {
        this.filtrosOrden.push({
          letra: element.nombre.substring(0, 1).toUpperCase(),
          valor: element.nombre.toLowerCase(),
          seleccionado: 'N'
        })
      });
     // this._getCategoriasAutocomplete();
    }, 30)
  }

  // public _getCategoriasAutocomplete() {
  //   this.filtrosOpcionesCat = null
  //   this.filtrosOpcionesCat = this.categoriasControl.valueChanges
  //     .pipe(
  //       startWith(''),
  //       map(value => this._filtrosCategoriasAuto(value))
  //     );
  // }

  private _filtrosCategoriasAuto(value: string): string[] {
    this.data.filtros.forEach(element => {

      this.categorias.push(element.nombre)
    }
    // this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
    //   const cajas: Caja[] = JSON.parse(data.json);
    //   this.categorias = []
    //   cajas.forEach(x => {
        
    //   });
    //   var hash = {};
    //   this.categorias = this.categorias.filter(function (current) {
    //     var exists = !hash[current] || false;
    //     hash[current] = true;
    //     return exists;
    //   });
     );
    const filterValue = value.toLowerCase();
    return this.categorias.filter(option => option.toLowerCase().includes(filterValue));
  }



  _buscarCategoriasConFiltro(evento, tipoBusqueda) {
    if (this.valorBusquedaCat != '') {
      if (tipoBusqueda == 'N') {
        if (evento.keyCode == 13) {
          this.filtrosSeleccioados.push(this.valorBusquedaCat.toLowerCase())
          this._aplicarFiltros()
        }
        return;
      }

      if (tipoBusqueda == 'S') {
        this.filtrosSeleccioados.push(this.valorBusquedaCat.toLowerCase())
        this._aplicarFiltros()
      }
    }
  }

  _aplicarFiltros() {
    this.dialogRef.close(this.filtrosSeleccioados)
  }


  _filtroSeleccionado(filtro: Filtros) {

    for (let index = 0; index < this.filtrosOrden.length; index++) {
      const element = this.filtrosOrden[index];
      if (element === filtro) {
        element.seleccionado = 'S';
        break;
      }
    }

    if (this.filtrosSeleccioados.length == 0) {
      this.filtrosSeleccioados.push(filtro.valor)
      this._aplicarFiltros()
    }

    if (this.filtrosSeleccioados.filter(x => x === filtro.valor).length > 0) {
      return;
    } else {
      this.filtrosSeleccioados.push(filtro.valor)
      this._aplicarFiltros()
    }

    
    

  }

  _close() {
    this.dialogRef.close()
  }




}
