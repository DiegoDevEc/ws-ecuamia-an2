import { FincaPreferida } from "./FincaPreferida"

export class ResponseWebShop {
  constructor(public json: string, public numRegistros: number) { }
}

export class ProductoWebShop {
  constructor(
    public productoSeleccionado: boolean = false,
    public productoBuncheActivado: boolean = false,
    public producto: string = '',
    public nombreVariedad: string = '',
    public codigoVariedad: string = '',
    public sePuedeMezclar: string = '',
    public color: string = '',
    public promocion: string = '',
    public codigosProveedor: number[],
    public tipoPrecioVariedad: string,
    public ilimitado: string = '',
    public permitirMezclar: string = '',
    public tinturado: string = '',
    public tallas: TallaWebShop[],
    public imagenes: string[],
  ) { }
}

export class TallaWebShop {
  constructor(
    public tallaSeleccionada: boolean = false,
    public precioFinca: number = 0.0,
    public precioMixta: number = 0.0,
    public cajaMinima: string = '',
    public talla: string = '',
    public tallaCm: string = '',
    public cajas: CajaWebShop[] = []
  ) { }
}

export class CajaWebShop {
  constructor(
    public cajaSeleccionada: boolean = false,
    public caja: string = '',
    public cantidadPorBunche: number = 0.0,
    public cantidadPorCaja: number = 0.0,
    public precio: number = 0.0
  ) {
  }
}

export class CajaCarritoWebShop {
  constructor(
    public detalle: CajaCarritoDetalleWebShop[] = [],
    public nombreCaja: string = '',
    public tamanioCaja: string = '',
    public tipoCaja: string = '',
    public talla: string = '',
    public porcentajeLleno: number = 0.0,
    public cantidadCajas: number = 0.0,// 1 Si es Mixta(M) y variable si es Solida(S)
    public precioTotalCaja: number = 0.0,
    public fincaPreferida: FincaPreferida = new FincaPreferida(0, "Finca",""),
    public fincasComunes: FincaPreferida[] = [],
    public destinoDetalle: string = '',
    public nameCliente: string = '',
    public phoneCliente: string = '',
    public addressCliente: string = '',
    public address2Cliente: string = '',
    public cityCliente: string = '',
    public stateCliente: string = '',
    public zipCliente: string = '',
  ) {
  }
}

export class CajaCarritoDetalleWebShop {
  constructor(
    public producto: ProductoWebShop,
    public cantidadBunches: number = 0.0, // Cantidad Ingresada (M)
    public cantidadBunchePorCaja: number = 0.0, // Cantidad de bunches por caja
    public precio: number = 0.0,
    public totalTallos: number = 0.0, // para calcular precio y porcentaje
    public precioCajaMixta: number = 0.0, // para calcular precio y porcentaje
    public cantidadTallosPorCaja: number = 0.0, // para calcular precio y porcentaje
    public porcentaje: number = 0.0, // para calcular precio y porcentaje
    public talla: string, // para validar si existe en la caja armada
    public precioFinca: number = 0.0,
    public variedadInactiva : boolean = false
  ) {
    this.precio = this.precioCajaMixta * this.totalTallos
    this.porcentaje = (this.totalTallos / this.cantidadTallosPorCaja) * 100
  }
}

export class DataCar {
  constructor(
    public cartListCaja: CajaCarritoWebShop[],
    public totalPrice: number,
    public carCount: number,
    public totalCartCount: number,
    public cargosTransporte: CargosTransporte,
    public totalCartCliente: number
  ) { }
}

export class CargosTransporte {
  constructor(
    public cantidadQb: number,
    public cantidadHb: number,
    public cantidadEb: number,
    public precioQb: number,
    public precioHb: number,
    public precioEb: number,
    public totalQb: number,
    public totalHb: number,
    public totalEb: number,
    public totalCargosPorTransporte: number
  ) { }
}

export class OrdenCompraWebShop {
  constructor(
    public fechaPedido: any,
    public codMarcacion: string,
    public codCamion: string,
    public codDestino: string,
    public codCliente: string,
    public dataCar : CajaCarritoWebShop[],
    public observacion: string,
    public totalCargosTransporte: number,
    public destinoSeleccionado: string = '',
    public nombreCamion: string = '',
    public nombreEtiqueta: string = '',
    public destinoNombre: string = '',
  ) { }

}