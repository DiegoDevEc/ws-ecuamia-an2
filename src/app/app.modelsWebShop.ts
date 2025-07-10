import { CamionMarcacionDiasDTO } from "./app.models"

export const ambiente = {
  //urlServicioRest: 'https://app.florexsales.com/florex-web/webresources/rest/', //Produccion,
  //urlFlorex: 'https://app.florexsales.com/florex-web/indice.jsf?token=', //Produccion
  //urlFotos: 'https://usc1.contabostorage.com/a2b07c4ae5cf47edaad369d1b668e71a:ariel/florex/fotos/',//Fotos Contabo
  //urlSocket: 'wss://app.florexsales.com/florex-web/ws', //Sockets,

  //urlServicioRest: 'https://app.gestionhumanitaria.org:8443/florex-web/webresources/rest/', //Pruebas,
  //urlFlorex: 'https://app.gestionhumanitaria.org:8443/florex-web/indice.jsf?token=', //Pruebas
  //urlSocket: 'wss://app.gestionhumanitaria.org:8443/florex-web/ws', //Sockets,

  urlFotos: '',   //Produccion

  urlServicioRest: 'http://localhost:8080/florex-web/webresources/rest/', //Local,
  urlFlorex: 'http://localhost:8080/florex-web/indice.jsf?token=', //Local
  urlSocket: 'ws://localhost:8080/florex-web/ws', //Local

  urlServicioRest1: 'http://localhost:3000/products/', //Local,
}


export const caracterEspecial = {
  arg: /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi
}

export class Caja {
  constructor(
    public tipoProducto: string, // B Descripcion por variedad, C Descripcion por Caja
    public tipoAgrega: string,   // B Descripcion por Bunches, C Descripcion por Caja
    public imagenes: string,
    public color: string,
    public cartCount: number,
    public promocion: string,
    public variedades: Variedad[],
    public tipoCaja: string,
    public totalPiezas: number,
    public totalPrecio: number,
    public totalPrecioJv: number,
    public totalProcentajeLleno: number,
    public nombreCaja: string,
    public mostrarDetalle: boolean,
    public tallasDeCaja: string[],
    public tallasCajaCm: number[],
    public stadingOrder: boolean,
    public codigoCliente: string,
    public codigoTipoCliente: string,
    public tipoCajaFlorex: string,
    public combo: string,
    public indexVariedadSeleccionada: number,
    public cantidadIngresada: number,
    public cantidadCajas: number,
    public cajaSeleccionada: number,
    public tallaSeleccionada: string,
    public tallasFinales: Talla[],
    public imagen: string,
    public cajasDisponiblesMixtas: number[],
    public tallaSeleccionadaMostrar: string,
    public proveedores: string[],
    public fincaPreferida: string,
    public codigoProveedorWS: number,
    public verificarVariedadCaja: string,
    public nombreProducto: string,
    public totalCantidadPorBunche: number,
    public indexPorTipoCaja: number,
    public botonBox: string,
    public botonBunches: string,
    public argumentoDeBusqueda: string,
    public destinoSeleccionado: Destino,
    public destinoNombre: string
  ) { }
}

export class ResultadoBusquedaP{
  constructor(
    public json: string,
    public numRegistros: number
  ){}
}

export class Variedad {
  constructor(
    public codigoVariedad: string,
    public nombreVariedad: string,
    public producto: string,
    public cantidadPorBunche: number,
    public caja: string,
    public cantidadPorCaja: number,
    public talla: string,
    public tallaCm: number,
    public imagenes: string,
    public precio: number,
   // public precioSO: number,
   // public precioFinca: number,
 //   public precioJv: number,
    public precioCliente: number,
  //  public stadingOrder: boolean,
    public cajaCombo: string,
    public cartCount: number,
 //   public precios: Precio[],
 //   public codigosProveedor: [],
  //  public seguridad: string,
 //   public cajasCantidad: number[],
  //  public disabled: boolean,
   // public mostrarPrecioPorCaja: string,
//    public cantidadPorCajaMixta: number,
   // public sePuedeMezclar: string,
  //  public nombresProveedor: [],
 //   public disabledBox: boolean,
 //   public disabledBunches: boolean,
   // public productOriginal: Caja[],
  //  public tallasVariedadSeleccionada: Talla[],
   // public indexPorVariedad: number,
  //  public cajasPorVariedad: Cajas[],
   // public cajaMinima: string,
   // public fincaPreferida: string
  ) { }
}

export class Precio {
  constructor(
    public codigoTipoCliente: string,
    public tipoPrecio: string,
    public precioCliente: number,
    public precio: number,
    public precioJv: number
  ) { }
}

export class Filtro {
  constructor(
    public tipo: string, // PRO para productos, COL para color y BOX para tipo de caja.
    public valor: string,
    public seleccionado: string
  ) { }
}

export class Usuario {
  constructor(
    public clave: string,
    public nombre: string,
    public email: string,
    public token: string
  ) { }
}

export class MenuActivo {
  constructor(
    public id: number,
    public nombre: string,
    public activo: string
  ) { }
}

export class Orden {
  constructor(
    public id: number,
    public cliente: string,
    public usuario: string,
    public fechaConexion: string,
    public marcacion: string,
    public po: string,
    public boxes: number,
    public total: number,
    public estado: string,
    public carrier: string,
    public cajas: Caja[],
    public codigoClientePadre: number,
    public truckingCharges: number,
    public typeClient: number,
    public shipTo: string,
    public esFloristeria: string,
    public observacion: string
  ) { }
}

export class OrdenS {
  constructor(
    public id: number,
    public cliente: string,
    public usuario: string,
    public fechaConexion: Date,
    public marcacion: string,
    public po: string,
    public boxes: number,
    public total: number,
    public estado: string,
    public carrier: string,
    public cajas: Caja[],
    public codigoClientePadre: number,
    public truckingCharges: number,
    public typeClient: number,
    public shipTo: string,
    public esFloristeria: string,
    public observacion: string,
    public totalConsulta: number
  ) { }
}

export class EstadoCuenta {
  constructor(
    public fecha: Date,
    public descripcion: string,
    public referencia: string,
    public tipo: string,
    public valor: number,
    public saldo: number,
  ) { }
}

export class NotaDeCredito {
  constructor(
    public creditDate: Date,
    public numero: number,
    public invoice: string,
    public po: string,
    public cliente: string,
    public amount: number,
    public totalConsulta: number,
    public numeroNotaCredito: number,
    public subCliente: string
  ) { }
}

export class Factura {
  constructor(
    public idEmpresa: number,
    public secFactura: number,
    public cliente: string,
    public nombre: string,
    public connectionDate: Date,
    public carrier: string,
    public shipTo: string,
    public po: string[],
    public boxes: number,
    public total: number,
    public numeroFactura: number,
    public totalConsulta: number
  ) { }
}

export class Subcliente {
  constructor(
    public nombre: string,
    public email: string,
    public direccion: string,
    public ciudad: string,
    public estado: string,
    public zipCode: string,
    public telefono: string,
    public carrier: string,
    public po: string,
    public active: string,
    public comision: number,
    public persona: Persona[]
  ) { }
}

export class SubclienteWs {
  constructor(
    public codigoPersona: number,
    public nombre: string,
    public marginSubcliente: number,
    public orderSubcliente: boolean,
    public activeWebshop: boolean
  ) { }
}

export class Persona {
  constructor(
    public nombrespersona: string,
    public apellidospersona: string,
    public usuariopersona: string,
    public passwordpersona: string,
    public confirmpasswordpersona: string,
    public tarifapersona: string,
    public email: string
  ) { }

}

export class UsuarioMarcacionSubcliente {
  constructor(
    public marcacion: Marcacion,
    public usuario: UsuarioSubcliente,
    public cliente: SubclienteWs
  ) { }
}

export class Marcacion {
  constructor(
    public orderWebShop: string,
    public nombre: string,
    public ciudad: string,
    public destino: string,
    public codigoGenerico: string,
    public codigoPais: string,
    public codigoCiudad: string,
    public codigoCiudadDestino: string,
    public nombreEtiqueta: string,
    public direccionEtiqueta: string,
    public telefonoEtiqueta: string,
    public codigoPostal: string,
    public codigoSeleccion: string,
    public esPrincipal: string
  ) { }
}

export class UsuarioSubcliente {
  constructor(
    public codigoSeleccion: string,
    public codigoUsuario: string,
    public email: string,
    public nombre: string,
    public nombreSeleccion: string
  ) { }
}

export class ClienteUsuario {
  constructor(
    public codigoCliente: string,
    public nombre: string,
    public direccion: string,
    public telefono: string,
    public destino: string,
    public codigoPostal: string,
    public ciudad: string,
    public codigoCiudad: string,
    public cliente: ClienteDTO
  ) { }
}

export class ClienteDTO {
  constructor(
    public nombre: string,
    public persona: PersonaDTO
  ) { }
}

export class PersonaDTO {
  constructor(
    public direccion: string,
    public numeroTelefonico: string,
    public direcciones: DireccionDTO[],
    public telefonos: telefonoDTO[]
  ) { }
}
export class DireccionDTO {
  constructor(
    public direccion: string,
    public ciudad: CiudadDTO,
    public codigoPostal: string
  ) { }
}
export class telefonoDTO {
  constructor(
    public telefono: string,
  ) { }
}
export class CiudadDTO {
  constructor(
    public nombre: string,
  ) { }
}
export class Destino {
  constructor(
    public nombre: string,
    public codigoDestino: string,
    public ciudad: string,
    public codigoPostal: string,
    public direccion: string,
    public direccion2: string,
    public estado: string,
    public nombreCliente: string,
    public telefono: string,
    public subcliente: SubclienteDestino,
    public logo: string
  ) { }
}
export class SubclienteDestino {
  constructor(
    public marginSubcliente: number,
    public infoShippingHub: any,
    public carrito: any
  ) { }
}

export class Camion {
  constructor(
    public nombre: string,
    public codigoCamion: string,
    public camionMarcacionDiasDTO: CamionMarcacionDiasDTO
  ) { }
}

export class MensajeCliente {
  constructor(
    public usuario: string,
    public cantidad: number,
    public tipocaja: string,
    public variedad: string,
    public observacion: string
  ) { }
}

export class CargosAdicionales {
  constructor(
    public EB: number,
    public QB: number,
    public HB: number
  ) { }
}

export class BuzonClient {
  constructor(
    public nombre: string,
    public nombre_compania: string,
    public fecha: Date,
    public telefono: string,
    public correo: string,
    public mensaje: string,
    public estado: string
  ) { }
}

export class SubClientInformation {
  constructor(
    public codeClientFather: number,
    public codeSubClient: any,
    public codeCustomer: number,
    public nameClientFather: string,
    public subClientName: string,
    public subClientAdress: string,
    public subClientCity: string,
    public subClientState: string,
    public subClientZipCode: string,
    public subClientPhone: string,
    public subClientCarrier: string,
    public subClientPo: string,
    public subClientAccount: string,
    public subClientUserAllName: string,
    public subClientUserLastName: string,
    //public subClientUserName: string,
    //public subClientUserEmail: string,
    //public subClientUserPassword: string,
    //public subClientUserConfirmPassword: string,
    public subClientUserMargin: number,
    public subClientUserTruckingCharges: CargosAdicionales[],
    public subClientUserOrder: boolean,
    public subClientUserActive: boolean,
    public camionDias: CamionMarcacionDiasDTO
  ) { }
}

export class SubClientUser {
  constructor(
    public codeClientFather: number,
    public codeSubClient: any,
    public codeCustomer: number,
    public nameClientFather: string,
    public subClientName: string,
    public subClientUserName: string,
    public subClientUserEmail: string,
    public subClientUserPassword: string,
    public subClientUserConfirmPassword: string,
    public subClientUserMargin: number,
    public subClientUserTruckingCharges: CargosAdicionales[],
    public subClientUserOrder: boolean,
    public subClientUserActive: boolean
  ) { }
}


export class BoxesType {
  constructor(
    public caja: string,
    public cantidadPorBunche: number,
    public cantidadPorCaja: number,
    public nombreVariedad: string,
    public precio: number,
    public talla: string
  ) { }
}


export class SeasonPrices {
  constructor(
    public fechaInicio: Date,
    public fechaFin: Date,
    public urlJson: string
  ) { }
}

export class MarcacionEditar {
  constructor(
    public nombre: string,
    public ciudad: string,
    public destino: string,
    public codigoGenerico: string,
    public codigoPais: string,
    public codigoCiudad: string,
    public codigoCiudadDestino: string,
    public nombreEtiqueta: string,
    public direccionEtiqueta: string,
    public telefonoEtiqueta: string,
    public codigoPostal: string,
    public codigoSeleccion: string,
    public estado: string,
    public pk: [],
    public listaDestinos: []
  ) { }
}

export class PkMarcacion {
  constructor(
    public codigoMarcacion: string,
  ) { }
}

export class Talla {
  constructor(
    public codigo: number,
    public valor: string
  ) { }
}

export class Cajas {
  constructor(
    public caja: string,
    public valor: number
  ) { }
}

export class IndiceTallaValor {
  constructor(
    public indice: number,
    public talla: string,
    public caja: number,
    public producto: string,
    public variedad: string,
    public indicePorCaja: number
  ) { }
}

export class FiltroColores {
  constructor(
    public color: string,
    public seleccionado: string
  ) { }
}

export class CarritoDetalle {
  constructor(
    public carritoDetalle: string
  ) { }
}


export class EnviarDatos {
  constructor(
    public tipoAccion: string,
    public nuevaVariedad: any,
    public variedadRespaldo: DatosActualizados[]
  ) { }
}

export class DatosActualizados {
  constructor(
    public talla: Talla,
    public productOriginal: Caja[],
    public variedad: Variedad
  ) { }
}

export class EditarVariedad {
  constructor(
    public caja: Caja[],
    public variedad: Variedad[],
    public indexVariedad: number,
    public codigosProveedor: number[]
  ) { }
}

export class Colores {
  constructor(
    public nombre: string,
    public codigoGrupo: string,
    public colorHex: string,
    public color2Hex: string,
    public color: string,
    public estilo: string,
    public select: string
  ) { }
}

export class Etiquetas {
  constructor(
    public etiqueta: string,
    public codigoEtiqueta: string,
  ) { }
}

export class Productos {
  constructor(
    public codigoAuxiliar: string,
    public codigoProducto: string,
    public nombre: string,
    public select: string
  ) { }
}

export class ResultadoBusqueda {
  constructor(
    public objeto: any[],
    public totalRegistros: number
  ) { }
}

export class Busqueda {
  constructor(
    public arg: string,
  ) { }
}

export class Information {
  constructor(
    public marcacion: any,
    public camion: any,
    public destino: any,
    public tipoInformation: string
  ) { }
}

export class InformationData {
  constructor(
    public informacion: string
  ) { }
}

export class PaginadorProducto {
  constructor(
    public numEmpresa: string = '120',
    public fecha: string= '',
    public filtroNombre: string= '',
    public filtroProducto:  string[] = [],
    public pagina: number = 1,
    public numRegistros: number = 3,
    public colores: string[] = [],
    public isPromo: boolean = false,
    public isLimited: boolean = false,
    public isTinted: boolean = false,
    public permiteMezclar: boolean = false,
    public proveedores: string[] = [],
    public isTropical = false,
    public orden = 'PRO',
    public cajaMixta: Variedad[] = [], 
    public codigoTipoCliente: string = '',
    public margen: number = 0,
    public aplicaFedex : boolean = false,
    public aplicaFedexCarrito : boolean = false
  ) { }
}

export class DeviceSession {
  constructor(
    public typeMessage: string = '',
    public user: string = '',
    public typeDevice: string = '',
    public browser: string = '',
    public browserVersion: string= '',
    public device: string= '',
    public osVersion: string= '',
    public os: string= '',
    public ip: string= ''
  ) { }
}