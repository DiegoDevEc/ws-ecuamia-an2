import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public productoRespaldo: any;

  imageUpdated: EventEmitter<string> = new EventEmitter<string>();
  dataProductUpdate: EventEmitter<string> = new EventEmitter<string>();
  dateUpdate: EventEmitter<void> = new EventEmitter<void>();

  private carritoFuente = new Subject<string>();
  carritoActual = this.carritoFuente.asObservable();

  respaldarDatosProductoAgregar(datos: any) {
    this.productoRespaldo = datos;
  }
  actulizarProductosHome(carrito: any) {
    this.carritoFuente.next(carrito);
  }

}