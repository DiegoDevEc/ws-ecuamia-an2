export class Category {
  constructor(public id: number,
    public name: string,
    public hasSubCategory: boolean,
    public parentId: number) { }
}

export class Product {
  constructor(public id: number,
    public name: string,
    public images: string, // Array<any>,
    public oldPrice: number,
    public newPrice: number,
    public discount: number,
    public ratingsCount: number,
    public ratingsValue: number,
    public description: string,
    public availibilityCount: number,
    public cartCount: number,
    public color: Array<string>,
    public size: Array<string>,
    public weight: number,
    public categoryId: number,
    public bunches: number,
    public tipoCaja: string,
    public talla: string,
    public totalUnidades: number,
    public stockActual: number,
    public categoria: string,
    public subcategoria: string) { }
}

export class ProductDTO {
  constructor(public id: number,
    public nombre: string,
    public precio: number,
    public descripcion: string,
    public bunches: number,
    public disponibilidad: number,
    public idCategoria: number,
    public idSubcategoria: number,
    public categoria: CategoriaDTO,
    public precioTalla: number,
    public tallaSeleccionada: string,
    public subcategoria: SubategoriaDTO,
    public listaImagenes: Array<ImagenDTO>,
    public listaTallas: Array<TallaDTO>) { }
}

export class VentaDTO {
  constructor(public idCliente: number,
    public fechaVenta: any,
    public fechaVuelo: any,
    public fechaCarga: any,
    public estado: string,
    public totalVenta: number,
    public listaDetalles: Array<VentaDetalleDTO>) { }
}

export class VentaDetalleDTO {
  constructor(public idProducto: number,
    public idVenta: number,
    public cantidadVenta: number) { }
}

export class CategoriaDTO {
  constructor(public id: number,
    public nombre: string,
    public estado: string) { }
}

export class SubategoriaDTO {
  constructor(public id: number,
    public idCategoria: number,
    public nombre: string,
    public estado: string,
    public categoria: CategoriaDTO) { }
}

export class ImagenDTO {
  constructor(public id: number,
    public idProducto: number,
    public ruta: string,
    public tipo: string,
    public estado: string) { }
}

export class TallaDTO {
  constructor(public id: number,
    public talla: string,
    public estado: string) { }
}

export class ClienteDTO {
  constructor(public id: number,
    public nombre: string,
    public apellido: string,
    public email: string,
    public porcentaje: number,
    public fechaIngreso: Date,
    public codigoPersona: string,
    public codigoTipoCliente: string,
    public cliente: Cliente,
    public codigoClientePadre: number,
    public codigoUsuario: string,
    public direcciones: Direccion[],
    public nombrePersona: string,
    public numeroTelefonico: string,
    public imagenLogo: string,
    public esFloristeria: string
  ) { }
}

export class Cliente {
  constructor(public id: number,
    public codigoTipoCliente: string,
    public codigoPersona: string,
    public persona: Persona
  ) { }
}

export class Persona {
  constructor(public numeroTelefonico: string,
    public nombres: string,
    public direcciones: Direccion[]
  ) { }
}
export class Direccion {
  constructor(public direccion: string,
    public ciudad: Ciudad,
    public codigoPostal: string
  ) { }
}
export class Ciudad {
  constructor(public nombre: string,
    public pais: Pais
  ) { }
} export class Pais {
  constructor(public nombre: string
  ) { }
}
export class Orders {
  constructor(public number: number,
    public date: string,
    public status: string,
    public total: number,
    public invoice: Date
  ) { }
}

export class Address {
  constructor(public firstName: string,
    public lastName: string,
    public middle: string,
    public company: string,
    public email: string,
    public phone: string,
    public country: string,
    public city: string,
    public state: string,
    public codePostal: string,
    public address: string
  ) { }
}

export class ClientUserUpdate {
  public clientId: string//
  public userCode: string//
  public userName: string//
  public userEmail: string//
  public userPassword: string//
  public userImage: string//
  public clientName: string//
  public clientAdress: string//
  public clientCity: string//
  public clientState: string//
  public clientZipCode: string//
  public clientPhone: string//
  public clientCarrier: string//
  public clientPO: string//
  public fileName: string//
  public numberAccount:string
  public contactName:string
  constructor(
  ) { }
}

export class ParametrosProducto {
  constructor(
    public nombreVariedad: string, // PRO para productos, COL para color y BOX para tipo de caja.
    public nombreProducto: string,
  ) { }
}

export class CamionMarcacionDiasDTO {
  codigoMarcacion: string;
  codigoCamion: string;
  nombreCamion: string;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  domingo: string;
  fechaMaxima: string;
  diasDeshabilitados: number[] = [];

  constructor(
    codigoMarcacion: string,
    codigoCamion: string,
    nombreCamion: string,
    lunes: string,
    martes: string,
    miercoles: string,
    jueves: string,
    viernes: string,
    sabado: string,
    domingo: string,
    fechaMaxima: string,
    diasDeshabilitados: number[]
  ) {
    this.codigoMarcacion = codigoMarcacion;
    this.codigoCamion = codigoCamion;
    this.nombreCamion = nombreCamion;
    this.lunes = lunes;
    this.martes = martes;
    this.miercoles = miercoles;
    this.jueves = jueves;
    this.viernes = viernes;
    this.sabado = sabado;
    this.domingo = domingo;
    this.fechaMaxima = fechaMaxima;
    this.diasDeshabilitados = diasDeshabilitados;
  }
}
