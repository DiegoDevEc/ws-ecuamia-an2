import { Injectable } from '@angular/core';
import { AppWebshopService } from 'src/app/app-webshop.service';
import { Filtro } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private appWebshopService: AppWebshopService, private appService: AppService) {}

  limpiarFiltros() {
    this.appWebshopService.paginador.numRegistros = 50;
    this.appWebshopService.paginador.pagina = 1;
    this.appWebshopService.paginador.isTropical = false;
    this.appWebshopService.paginador.colores = [];
    this.appWebshopService.paginador.filtroProducto = [];
    this.appWebshopService.paginador.isPromo = false;
    this.appWebshopService.paginador.isLimited = false;
    this.appWebshopService.paginador.isTinted = false;
    this.appWebshopService.paginador.orden = 'PRO';
    this.appWebshopService.listaFiltrosSeleccionados = [];
    this.appWebshopService.addPaginadorLocalStorage();

    this.appService.mostrarPromociones = false;
    this.appService.mostrarLimited = false;
    this.appService.mostrarTinted = false;
    this.appService.showNabvarCardActive = true;
  }

  agregarFiltro(filtro: Filtro) {
    this.appWebshopService.listaFiltrosSeleccionados.push(filtro);
    this.appWebshopService.addPaginadorLocalStorage();
  }

  eliminarFiltro(valor: string) {
    this.appWebshopService.listaFiltrosSeleccionados = this.appWebshopService.listaFiltrosSeleccionados
      .filter(f => f.valor !== valor.toLowerCase());
    this.appWebshopService.addPaginadorLocalStorage();
  }

  toggleColor(color: string) {
    const colorLower = color.toLowerCase();
    const colorUpper = color.toUpperCase();
    const existe = this.appWebshopService.paginador.colores.includes(colorUpper);

    if (existe) {
      this.appWebshopService.paginador.colores = this.appWebshopService.paginador.colores.filter(c => c !== colorUpper);
    } else {
      this.appWebshopService.paginador.colores.push(colorUpper);
    }

    this.appWebshopService.addPaginadorLocalStorage();
  }
}
