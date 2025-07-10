import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Decimal } from 'decimal.js';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { FincaPreferida } from "./FincaPreferida";
import { CamionMarcacionDiasDTO, Category, ClientUserUpdate, ClienteDTO, Product, ProductDTO } from './app.models';
import {
    BuzonClient,
    Caja,
    Cajas,
    Camion,
    CargosAdicionales,
    CarritoDetalle,
    Destino,
    DeviceSession,
    EditarVariedad,
    EstadoCuenta,
    Factura,
    Filtro,
    Information,
    InformationData,
    Marcacion,
    MarcacionEditar,
    MensajeCliente,
    NotaDeCredito,
    Orden,
    OrdenS,
    PaginadorProducto,
    ResultadoBusquedaP,
    SeasonPrices,
    SubClientInformation,
    Subcliente,
    Talla,
    Usuario,
    Variedad,
    ambiente
} from './app.modelsWebShop';
import { EnumTipoCaja } from './enumeration/enumeration';
import { CargosTransporte, DataCar, OrdenCompraWebShop, ProductoWebShop, TallaWebShop } from './app.modelsWebShopV2';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppWebshopService } from './app-webshop.service';
//prueba de edicion de codigo

export class Data {

    constructor(public categories: Category[],
        public compareList: Product[],
        public wishList: Product[],
        public cartList: Product[],
        public cartListCaja: Caja[],
        public totalPrice: number,
        public totalCartCount: number
    ) { }
}

@Injectable()
export class AppService implements OnDestroy { 
    public dataAct = this.getCartLocalStorageAct();
    public Data = this.getCartLocalStorage();
    public c: ClienteDTO;
    public dataFormCustomer: string;
    public totalTuckingBoxes: number = 0;
    public totalWithTruckiBoxes = 0;
    public countBunches: number = 0;
    public clientLogin: ClienteDTO;
    public createSubClient: boolean;
    public updateSubClient: boolean;
    public createUsuarioSubcliente: boolean;
    public updateUsuarioSubcliente: boolean;
    public deleteSubClient: boolean;
    public sumarPorcentaje: number;
    public urlJsonGeneral: string;
    public datePipe = new DatePipe("en-US");
    public dateFormat;
    public priceFound: Array<SeasonPrices> = [];
    public params = new HttpParams().append('#6{+¿s', '{+3-p}');
    public urlImagen: string;
    public codigosProveedorRespaldo = [];
    public codigosProveedorFinales = [];
    public cajaSeleccionadaNumber: number;
    public cajaSeleccionada: string;
    public cajasConValor: Cajas[] = [];
    public busquedaGeneralWs: string;
    public opcionesDeBusquedaWs: Observable<string[]>;
    public listaFinalBusquedaWS: string[] = [];
    public controlBusquedaWs = new FormControl();
    public respaldoListaProductosFiltrada: Caja[] = [];
    public limpiarFiltroColor;
    public listaProductosBusquedaMezcla: Caja[] = [];
    public realizoBusquedaProducto: boolean = false;
    public busquedaGeneralColorWS: string[] = [];
    public filtrosDeBusquedaGeneral = [];
    public proveedoresFinalesMostrar: string[] = [];
    public validarSoloRoses: string = '';
    public habilitarQueryRoses = [];
    public activarQueryRoses: boolean = false;
    public resultadoBusqueda = false;
    public showNabvarCard = false;
    public showNabvarCardActive = true;
    public showBoxProgress = false;
    public mostrarPromociones = false;
    public mostrarLimited = false;
    public mostrarTinted = false;
    public barraProgresoImagen: string[] = [];
    public activarEdicionVariedad: boolean = false;
    public activarAgregarBunches: boolean = false;
    public datosEdicionVariedad: EditarVariedad;
    public btnHub: number = 0;
    public btnStading: number = 0;
    public btnCombo: number = 0;
    public btnCustomers: number = 0;
    public btnOrders: number = 0;
    public btnBilling: number = 0;
    public cambioMenu: boolean = false;
    public setCondicionTab: boolean;
    public esFloristeria: string = 'N';
    public totalValorFloristeria = 0;
    public activarBusquedaCuandoElimina: boolean = false;
    public detalleOrdenSeleccionado: any;
    public orderWebShop = 'S';
    public cargosAdicionalesLocal: CargosAdicionales;
    public partner: ClienteDTO;

    public ngOnDestroy() {
        localStorage.clear();
        sessionStorage.clear();
    }

    public obtenerUsuario() {
        this.c = JSON.parse(localStorage.getItem('Usuario'));
    }

    public CajaArmada = new Caja(
        null, null, null, null, null, null, [], '', 0, 0, 0, 0,
        null, false, null, null, null, null, null, null, null, 0,
        0, 0, null, null, [], "", [], "", [], "", 0, "", "", 0,
        0, 'N', 'N', "", null, ""
    );

    public url = 'assets/data/';

    constructor(public http: HttpClient, public snackBar: MatSnackBar, public dialog: MatDialog, private sanitizer: DomSanitizer,
         private deviceService: DeviceDetectorService, private appWebshopService: AppWebshopService) {
        this.params = this.params.append("nameResponse", "UserIvalid")
        if ((localStorage.getItem("_ls_urlJson")) != null || (localStorage.getItem("_ls_urlJson")) != undefined) {
            this.urlJsonGeneral = localStorage.getItem("_ls_urlJson")
        }
        this.urlImagen = ambiente.urlFotos
    }

    public getColoresWebShop() {
        return this.http.get<ResultadoBusquedaP>(ambiente.urlServicioRest + 'consultarColores');
    }

    public getProductosWebShopParaFiltros(filtros: PaginadorProducto) {

        let fecha = filtros.fecha.replace(/-/g,'')
        
        return this.http.get<ResultadoBusquedaP>(ambiente.urlServicioRest + 'consultarProductos?numEmpresa=' + filtros.numEmpresa + '&fecha=' + fecha);
    }

    public existenProveedoresEb(codigoVariedad) {
      //  let endpoint = "localhost:3001/proveedor&codigoVariedad=" + codigoVariedad;
        let endpoint = "http://localhost:3001/proveedor";
        //return this.http.get<Boolean>(endpoint);
        //return this.http.get<Boolean>(ambiente.urlServicioRest + 'validarProveedoresEb/' + codigoVariedad);
        return this.http.get<Boolean>(`${ambiente.urlServicioRest}validarProveedoresEb/${codigoVariedad}`);

    }

    public readFiles() {
        return this.http.get<SeasonPrices[]>(ambiente.urlServicioRest + 'leerArchivos');
    }

    public getProductosFiltro(): Observable<Filtro[]> {
        return this.http.get<Filtro[]>(this.url + 'product-filter.json');
    }

    public getImagenBarraProgreso() {
        return this.http.get<any[]>(this.url + 'box-progress/box-imagen.json')
    }

    // public getProductosWebShop(idCliente: string, fecha: string, filtroProducto: string, numeroPagina: number, cantidadItems: number ) {
    //     console.log(ambiente.urlServicioRest + 'consultarPreciosV1?numEmpresa='+ idCliente + '&fecha=' + fecha + '&filtroProducto='+ filtroProducto +'&pagina=' + numeroPagina + '&numRegistros=' + cantidadItems)
    //     return this.http.get<ResultadoBusquedaP>(ambiente.urlServicioRest + 'consultarPrecios?numEmpresa='+ idCliente + '&fecha=' + fecha + '&filtroProducto='+ filtroProducto +'&pagina=' + numeroPagina + '&numRegistros=' + cantidadItems);
    // }

    public getProductosWebShopPost(filtros: PaginadorProducto) {
        return this.http.post<ResultadoBusquedaP>(ambiente.urlServicioRest + 'consultarPrecios', filtros);
    }

    public getProveedoresConCodigo(): Observable<FincaPreferida[]> {
        // TODO: End point de proveedores 
        //return this.http.get<FincaPreferida[]>(this.url + "proveedores.json");
        return this.http.get<FincaPreferida[]>(ambiente.urlServicioRest + 'consultarProveedores');
    }

    public obtenerMensajePublicidad() {
        return this.http.get<any[]>(ambiente.urlServicioRest + 'obtenerMensajePublicidad');
    }

    public obtenerEtiquetaWebShop() {
        return this.http.get<ResultadoBusquedaP>(ambiente.urlServicioRest + 'obtenerEtiquetasWebShop');
    }

    public obtenerPartners() {
        return this.http.get<any[]>(ambiente.urlServicioRest + 'partners/120')
    }

    public getProductos() {
        let c: ClienteDTO = JSON.parse(localStorage.getItem('Usuario'));
        if (c === null) {
            c = new ClienteDTO(null, null, null, null, null, null, this.c.codigoPersona, this.c.codigoTipoCliente, null, null, null, null, null, null, null, null);
        }
        return this.http.post(ambiente.urlServicioRest + 'productos', c);
    }

    public getMarcaciones(idCliente: string, numeroPagina: number) {
        return this.http.get<MarcacionEditar[]>(ambiente.urlServicioRest + 'obtenerMarcaciones?numEmpresa=120&idCliente=' + idCliente + '&numeroPagina=' + numeroPagina);
    }

    public getMarcacionesConFiltro(idCliente: string, numeroPagina: number, filtro: string) {
        return this.http.get<MarcacionEditar[]>(ambiente.urlServicioRest + 'obtenerMarcaciones?numEmpresa=120&idCliente=' + idCliente + '&numeroPagina=' + numeroPagina + '&filtro=' + filtro);
    }

    public getMarcacionesPrincipal(idCliente, tipoCliente: string) {
        return this.http.get<[Marcacion[]]>(ambiente.urlServicioRest + 'obtenerMarcacionesPrincipal/' + idCliente + '/' + tipoCliente);
    }

    public getSubClient(idCliente) {
        return this.http.get<[Subcliente[]]>(ambiente.urlServicioRest + 'obtenerSubCliente/' + idCliente);
    }

    public getDestinos(codigoMarcacion) {
        return this.http.get<[Destino[]]>(ambiente.urlServicioRest + 'obtenerDestinos/' + codigoMarcacion);
    }
    public getCamionSeleccionado(codigoMarcacion) {
        return this.http.get<[Camion[]]>(ambiente.urlServicioRest + 'obtenerCamionOmision/' + codigoMarcacion);
    }
    public getAllCamiones() {
        return this.http.get<[Camion[]]>(ambiente.urlServicioRest + 'obtenerCamiones');
    }
    public getFechaListaPreciosActiva(){
        return this.http.get<string>(ambiente.urlServicioRest + 'fechaListaPreciosActiva');
    }

    public getEstadoCuenta(idCliente: string, fechaInicio: String, fechaFin: String) {
        return this.http.get<EstadoCuenta[]>(ambiente.urlServicioRest + 'obtenerEstadoCuentaCliente/' + idCliente + '/' + fechaInicio + '/' + fechaFin);
    }

    public getNotasDeCredito(idCliente: string, pagina: number) {
        return this.http.get<NotaDeCredito[]>(ambiente.urlServicioRest + 'obtenerNCCliente/' + idCliente + '/' + pagina);
    }

    public getNotasDeCreditoFiltro(idCliente: string, pagina: number, fechaInicio: String, fechaFin: String, filtro: String) {
        return this.http.get<NotaDeCredito[]>(ambiente.urlServicioRest + 'obtenerNCClienteFiltrado/' + idCliente + '/' + pagina + '/' + fechaInicio + '/' + fechaFin + '/' + filtro);
    }

    public getfacturas(idCliente: string, pagina: number) {
        return this.http.get<Factura[]>(ambiente.urlServicioRest + 'obtenerFacturaCliente/' + idCliente + '/' + pagina);
    }

    public generarPdfFacturaPorCliente(idCliente: string, idFactura: number) {
        return this.http.get(ambiente.urlServicioRest + `facturaPdfPorCliente/${idCliente}/${idFactura}`, { responseType: 'blob' }).pipe(
            map((res: Blob) => {
                var blob = new Blob([res], { type: 'application/pdf' });

                const filename = 'Packing-' + idFactura + '.pdf';

                if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(res, filename);
                } else {
                    const link = document.createElement('a');
                    if (link.download !== undefined) {
                        const url = window.URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');
                        link.click();
                    }
                }
            })
        );
    }

    public generarPdfPackingPorCliente(idCliente: string, idFactura: number, tipo: number) {
        return this.http.get(ambiente.urlServicioRest + `packingPdfPorCliente/${idCliente}/${idFactura}/${tipo}`,
            { responseType: 'blob' }).pipe(
                map((res: Blob) => {
                    var blob = new Blob([res], { type: 'application/pdf' });

                    const filename = 'Voice-' + idFactura + '.pdf';

                    if (navigator.msSaveBlob) {
                        navigator.msSaveBlob(res, filename);
                    } else {
                        const link = document.createElement('a');
                        if (link.download !== undefined) {
                            const url = window.URL.createObjectURL(blob);
                            link.setAttribute('href', url);
                            link.setAttribute('target', '_blank');
                            link.click();
                        }
                    }
                })
            );
    }

    public generarPdfNotaCreditoPorCliente(idCliente: string, idNotaCredito: number, numeroPdfNotaCredito: number) {
        return this.http.get(ambiente.urlServicioRest + `NotaCreditoPdfPorCliente/${idCliente}/${idNotaCredito}`, { responseType: 'blob' }).pipe(
            map((res: Blob) => {
                const filename = 'Credit-Note-' + numeroPdfNotaCredito + '.pdf';
                var blob = new Blob([res], { type: 'application/pdf' });
                if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(res, filename);
                } else {
                    const link = document.createElement('a');
                    if (link.download !== undefined) {
                        //const url = URL.createObjectURL(res);
                        const url = window.URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('target', '_blank');
                        //link.style.visibility = 'hidden';
                        //document.body.appendChild(link);
                        link.click();
                        //document.body.removeChild(link);
                    }
                }
            })
        );
    }

    public generarPdfEstadoCuenta(idCliente: string, fechaInicial: string, fechaFinal: string, tipo: string) {
        return this.http.get(ambiente.urlServicioRest + `EstadoCuentaPdfPorCliente/${idCliente}/${fechaInicial}/${fechaFinal}/${tipo}`, { responseType: 'blob' }).pipe(
            map((res: Blob) => {
                let filename = '';
                var blob = new Blob([res], { type: 'application/pdf' });
                if (tipo === 'PDF') {
                    filename = 'Statement-PDF.pdf';
                }

                if (tipo === 'EXCEL') {
                    filename = 'Statement-XLS.xls';
                }

                if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(res, filename);
                } else {
                    const link = document.createElement('a');
                    if (link.download !== undefined) {
                        //const url = URL.createObjectURL(res);
                        const url = window.URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        //link.setAttribute('download', filename);
                        link.setAttribute('target', '_blank');
                        //link.style.visibility = 'hidden';
                        //document.body.appendChild(link);
                        link.click();
                        //document.body.removeChild(link);
                    }
                }
            })
        );
    }

    public generarPdfEstadoCuentaUrl(idCliente: string, fechaInicial: string, fechaFinal: string, tipo: string) {
        return this.http.get(ambiente.urlServicioRest + `EstadoCuentaPdfPorCliente/${idCliente}/${fechaInicial}/${fechaFinal}/${tipo}`, { responseType: 'blob' as 'json' }).pipe(
            map((res: Blob) => {
                let newBlob = new Blob([res], { type: "application/pdf" });

                const datalocalURL = window.URL.createObjectURL(newBlob);

                return datalocalURL;
            })
        );
    }

    public getfacturasFiltro(idCliente: string, pagina: number, fechaInicio: String, fechaFin: String, filter: String) {
        return this.http.get<Factura[]>(ambiente.urlServicioRest + 'obtenerFacturaClienteFiltrado/' + idCliente + '/' + pagina + '/' + fechaInicio + '/' + fechaFin + '/' + filter);
    }

    //WEBSERVICES ANTERIOR PARA GUARDAR PO
     public persistirDestinoTropical(destino: string, codigoMarcacion: string, nombreCliente:string, direccion: string, direccion2: string, ciudad: string, codigoDestino: string, codigoPostal: string, telefono: string) {
         return this.http.get<Destino>(ambiente.urlServicioRest + 'guardarDestinoTropical/' + destino + '/' + codigoMarcacion + '/'+
             `${nombreCliente}/${direccion}/${direccion2}/${ciudad}/${codigoDestino}/${codigoPostal}/${telefono}`);
     }

    public persistirDestino(destino: string, codigoMarcacion: string): Observable<Destino> {
        const body = { destino, codigoMarcacion };  // Crear un objeto con los datos a enviar

        return this.http.post<Destino>(ambiente.urlServicioRest + 'guardarDestino', body);
    }

    public getObtenerPedidoCliente(codigoCliente: number, codMarcacion: String, esSubcliente: string, pagina: number) {
        return this.http.get<OrdenS[]>(ambiente.urlServicioRest + 'obtenerPedidoCliente/' + codigoCliente + '/' + codMarcacion + '/' + esSubcliente+ '/' + pagina)
        .pipe(
            map((response: OrdenS[]) => {
              return response.map((order: OrdenS) => {
                return {
                  ...order,
                  totalConsulta: order.totalConsulta, // or some other calculation
                } as OrdenS;
              });
            }),
          );
    }

    public getObtenerPedidoClienteFiltro(codigoCliente: number, codMarcacion: String, esSubcliente: string, pagina: number, fechaInicio: String, fechaFin: String, filter: String) {
        return this.http.get<OrdenS[]>(ambiente.urlServicioRest + 'obtenerPedidoClienteFiltrado/' + codigoCliente + '/' + codMarcacion + '/' + esSubcliente+ '/' + pagina + '/' + fechaInicio + '/' + fechaFin + '/' + filter)
        .pipe(
            map((response: OrdenS[]) => {
              return response.map((order: OrdenS) => {
                return {
                  ...order,
                  totalConsulta: order.totalConsulta, // or some other calculation
                } as OrdenS;
              });
            }),
          );
    }

    public getNotaCreditoCliente(codigoCliente: number) {
        return this.http.get<any[]>(ambiente.urlServicioRest + 'notaCreditoCliente/' + codigoCliente)
    }

    public getIPAddress() {
        return this.http.get("https://api.ipify.org/?format=json");
    }
      
    public loginUsuarioPorPerfil(user: Usuario, ipRemota) {
        return this.http.get(ambiente.urlServicioRest + 'validateCliente/' + user.nombre, { params: this.params });
    }

    public validarUsuarioActivo(user: Usuario) {
        return this.http.get(ambiente.urlServicioRest + 'validateUsuarioActivo/' + user.nombre);
    }

    public loginUsuario(user: Usuario, tipoLogin, ipRemota) {
        let params = this.params
        if (tipoLogin == 'web') {
            return this.http.get(ambiente.urlServicioRest + 'validateCliente/' + user.nombre.toUpperCase() + '/' + user.clave, { params: this.params });
        } else {
            return this.http.get(ambiente.urlServicioRest + 'validateCliente/' + user.nombre.toUpperCase() + '/' + user.clave + '/' + ipRemota, { params: this.params });
        }
    }
    public loginUsuarioSuplantar(token: string) {
        return this.http.get(ambiente.urlServicioRest + 'suplantar/' + token, { params: this.params });
    }

    public menusActivos(idCliente: any) {
        return this.http.get<any[]>(ambiente.urlServicioRest + 'menusActivos/' + idCliente);
    }

    public cambiarPrecio(product: ProductDTO) {
        return this.http.post(ambiente.urlServicioRest + 'cambiarPrecioPorTalla', product);
    }

    public registrarCompra(orden: OrdenCompraWebShop) {
        return this.http.post(ambiente.urlServicioRest + 'guardarPedido', orden);
    }

    public eliminarCarritoHistorial(idCarrito: string) {
        return this.http.post(ambiente.urlServicioRest + 'eliminarCarritoHistortial', idCarrito);
    }

    public getProductById(id): Observable<Product> {
        return this.http.get<Product>(this.url + 'product-' + id + '.json');
    }

    public getProductosFiltrosJson(): Observable<Filtro[]> {
        return this.http.get<Filtro[]>(this.url + 'info/filtrospro.json')
    }

    public postEnviarMensajeCliente(mensaje: MensajeCliente[]) {
        const messageClient = JSON.stringify(mensaje);
        return this.http.post(ambiente.urlServicioRest + 'mensajeCliente', messageClient)
    }

    public registrarNuevoContacto(usuario: BuzonClient[]) {
        const buzonClient = JSON.stringify(usuario);
        return this.http.post(ambiente.urlServicioRest + 'buzonCliente', buzonClient)
    }

    public updateClientWS(data: ClientUserUpdate, update: Boolean, tipoCliente: string) {
        const options = { responseType: 'text' as 'json' };
        const client = JSON.stringify(data);
        const modificar = update ? "1" : "0";
        return this.http.post(ambiente.urlServicioRest + `buzonClienteActualizar/${modificar}${tipoCliente}`, client, options)
    }

    public getRegisterSubClient(registrocliente: SubClientInformation[]) {
        const datacliente = JSON.stringify(registrocliente);
        return this.http.post(ambiente.urlServicioRest + 'registrarMarcacion', datacliente)
    }

    public getUpdateSubclient(registrocliente: SubClientInformation[]) {
        const options = { responseType: 'text' as 'json' };
        const datacliente = JSON.stringify(registrocliente);
        return this.http.post(ambiente.urlServicioRest + `actualizarSubCliente`, datacliente, options)
    }

    public getUpdateSubclientCamiones(camiones: CamionMarcacionDiasDTO[]) {
        const options = { responseType: 'text' as 'json' };
        return this.http.post(ambiente.urlServicioRest + `actualizarSubClienteCamiones`, camiones, options)
    }

    public getDeleteSubclient(registrocliente: SubClientInformation[]) {
        const datacliente = JSON.stringify(registrocliente);
        return this.http.post(ambiente.urlServicioRest + 'eliminarSubCliente', datacliente)
    }

    public _getCargosAdicionalesMarcacion(codigoSubcliente: string) {
        return this.http.get<any[]>(ambiente.urlServicioRest + 'obtenerCargasTransporte/' + codigoSubcliente)
    }

    public _getCargasTransportePorMarcacion(codigoMarcacion: string) {
        return this.http.get<any[]>(ambiente.urlServicioRest + 'obtenerCargosPorMarcacion/' + codigoMarcacion)
    }

    public _persistirCargosAdicionales(cargos: CargosAdicionales, codigoUsuarioMarcacion: number, codigoClientePadre: number) {
        return this.http.post
            (ambiente.urlServicioRest + 'persistirCargosAdicionales/' + codigoUsuarioMarcacion + "/" + codigoClientePadre, cargos);
    }

    public getPoSubclient(codigoMarcacion: any) {
        return this.http.get<any[]>(ambiente.urlServicioRest + 'obtenerDestinosSubCliente/' + codigoMarcacion)
    }

    public getCarrierSubclient(codigoMarcacion: any) {
        return this.http.get<any[]>(ambiente.urlServicioRest + 'obtenerCamionesSubCliente/' + codigoMarcacion)
    }

    public getCarrierSubclienteDias(codigoMarcacion: any) {
        return this.http.get<CamionMarcacionDiasDTO>(ambiente.urlServicioRest + 'obtenerCamionesSubClienteDias/' + codigoMarcacion)
    }

    public getCarriersSubclienteDias(codigoMarcacion: any) {
        return this.http.get<CamionMarcacionDiasDTO[]>(ambiente.urlServicioRest + 'obtenerCamionesSubClienteDiasPorCliente/' + codigoMarcacion)
    }

    public resetearPassword(email: string) {
        return this.http.post(ambiente.urlServicioRest + 'resetearPassword', email)
    }

    //actualizar carrito por cliente WS
  /*  public _registrarCarritoDetallePorCliente(codigoCliente: number, accion: string, dataAn: string, idCarrito: string, tipoCarrtitoTropical: string) {
        
    var datePipe = new DatePipe("en-US");
    var fechaFormataeda = datePipe.transform(localStorage.getItem('_ls_dateConecction'), 'dd-MM-yyyy');

    const c = JSON.parse(localStorage.getItem('Usuario'));
    const camionSeleccionado = JSON.parse(sessionStorage.getItem('Camion'));
    const destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"));
    const marcacionSleccionada = JSON.parse(sessionStorage.getItem("Marcacion"));

    let ordenPedido = new OrdenCompraWebShop(fechaFormataeda, marcacionSleccionada.codigoSeleccion,
      camionSeleccionado.codigoCamion,
      destinoSeleccionado.codigoDestino,
      c.codigoClientePadre != undefined ? c.codigoClientePadre : c.codigoPersona, this.dataAct.cartListCaja, "", this.dataAct.cargosTransporte.totalCargosPorTransporte)
      ordenPedido.dataCar.forEach(caja =>{
        caja.detalle.forEach(detalle =>{
          const tallaDetalle = this.obtenerTallaProducto(detalle.producto)
          detalle.precioFinca = tallaDetalle.precioFinca
          detalle.producto.productoBuncheActivado= undefined
          detalle.producto.productoSeleccionado= undefined
        })
      })

        return ordenPedido.dataCar.length > 0 ? this.http.post(ambiente.urlServicioRest + "registrarCarritoDetalle/" + codigoCliente + "/" + accion + "/" + idCarrito + "/" + tipoCarrtitoTropical, ordenPedido): null
    }*/

    obtenerTallaProducto(producto: ProductoWebShop): TallaWebShop {
        const indexTallaSeleccionada = producto.tallas.findIndex(item => item.tallaSeleccionada)
        return producto.tallas[indexTallaSeleccionada]
      }

    // obtener carrito por cliente
    public _obtenerCarritoPorCliente(codigoCliente: number, filtros: PaginadorProducto) {
        const codigoTipoCliente =filtros.codigoTipoCliente
        const marginSubcliente =filtros.margen

        return this.http.get<any[]>(ambiente.urlServicioRest + 'obtenerCarritoPorCliente/' + codigoCliente + "/" + codigoTipoCliente + "/" + marginSubcliente)
    }
    
    public _obtenerCarritoPorClienteActualizarFecha(codigoCliente: number, filtros: PaginadorProducto, fechaActualizar: string, idCarrito: number) {
        const codigoTipoCliente =filtros.codigoTipoCliente
        const marginSubcliente =filtros.margen
        return this.http.get<any[]>(ambiente.urlServicioRest + 'obtenerCarritoPorCliente/cambioFecha/' + codigoCliente + "/" + codigoTipoCliente + "/" + marginSubcliente+ "/" + fechaActualizar+ "/" + idCarrito)
    }

    public guardarInformationSeleccionada(codigoCliente: number, data: string, accion: string) {
        return this.http.post(ambiente.urlServicioRest + "guardarInformacion/" + codigoCliente + "/" + accion, data);
    }

    public getInfoShipping(codigoCliente: number, tipoInfo: string) {
        return this.http.get<InformationData[]>(ambiente.urlServicioRest + 'getInfoShipping/' + codigoCliente + '/' + tipoInfo)
    }

    //consultar costo envios de cajas cuando floristeria
    public _getCargosPorFloristeria(codigoCamion: string, codigoMarcacion: string) {
        return this.http.get<any[]>(ambiente.urlServicioRest + "obtenerCargosPorFloristeria/" + codigoCamion + "/" + codigoMarcacion)
    }

    public _eliminarChatCliente(codigoPersona: number) {
        return this.http.get<any>(ambiente.urlServicioRest + "eliminarRegistroChatCliente/" + codigoPersona)
    }

    public mostraDetallesCaja(index: number) {
        for (let x = 0; x < this.Data.cartListCaja.length; x++) {
            const element = this.Data.cartListCaja[x];
            if (x === index) {
                if (this.Data.cartListCaja[x].mostrarDetalle) {
                    element.mostrarDetalle = false;
                    return;
                }
                element.mostrarDetalle = true;
                return;
            }
        }
    }

   /* public addToCartCaja(caja: Caja): boolean {

        this.Data.totalPrice = null;
        this.Data.totalCartCount = null;
        caja.nombreCaja = this.obtenerNombreCaja(caja);

        switch (caja.variedades[0].producto) {
            case "ROSES": {
                caja.verificarVariedadCaja = "ROSES"
                break;
            }
            case "GARDEN ROSES": {
                caja.verificarVariedadCaja = "GARDEN ROSES"
                break;
            }
            case "MAYRAS GARDEN ROSES": {
                caja.verificarVariedadCaja = "MAYRAS GARDEN ROSES"
                break;
            }
            case "SPRAY ROSES": {
                caja.verificarVariedadCaja = "SPRAY ROSES"
                break;
            }
            default: {
                caja.verificarVariedadCaja = this.obtenerNombreCajaPorVariedad(caja)
                break;
            }
        }

        //verificar registros repetidos
        var proveedoresFinalesMostrar: string[] = []

        proveedoresFinalesMostrar.push(...caja.proveedores)
        let uniques = Array.from(new Set(proveedoresFinalesMostrar));
        proveedoresFinalesMostrar = uniques


        caja.proveedores = proveedoresFinalesMostrar
        caja.tallasFinales.push({
            codigo: caja.variedades[0].tallaCm,
            valor: caja.variedades[0].talla
        });

        this.Data.cartListCaja.push(caja);
        this.totalCarritoCajas();
        this.obtenerUsuario();
        this.CajaArmada = new Caja(
            null, null, null, null, null, null, [], '', 0, 0, 0, 0,
            null, false, null, null, null, null, null, null, null, 0,
            0, 0, null, null, [], "", [], "", [], "", 0, "", "", 0,
            0, 'N', 'N', "", null, ""
        );
        this.addCartLocalStorage();

        return true;
    }*/


    public totalCarritoCajas() {
        this.Data.totalPrice = 0;
        this.Data.totalCartCount = 0
        this.Data.cartListCaja.forEach(caja => {
            this.Data.totalPrice += caja.totalPrecio;
            this.Data.totalCartCount += caja.cantidadIngresada
        });
    }


    public obtenerNombreCaja(caja: Caja): string {
        let nombreAux: string = null;
        if (caja.tipoAgrega === 'B') {
            for (let i = 0; i < caja.variedades.length; i++) {
                if (i > 0 && caja.variedades[i].nombreVariedad !== nombreAux) {
                    return 'ASSORTED';
                }
                nombreAux = caja.variedades[i].nombreVariedad;
            }
            return caja.variedades[0].nombreVariedad;
        }

        if (caja.tipoAgrega === 'C') {
            return caja.variedades[0].nombreVariedad;
        }

        if (caja.tipoAgrega === 'A') {
            return caja.nombreCaja;
        }
    }

    public obtenerNombreCajaPorVariedad(caja: Caja): string {

        let nombreAux: string = null;
        if (caja.tipoAgrega === 'B') {
            for (let i = 0; i < caja.variedades.length; i++) {
                if (i > 0 && caja.variedades[i].producto !== nombreAux) {
                    return 'BOX MIX';
                }
                nombreAux = caja.variedades[i].producto;
            }
            return caja.variedades[0].producto;
        }

        if (caja.tipoAgrega === 'C') {
            return caja.variedades[0].producto;
        }

        if (caja.tipoAgrega === 'A') {
            return caja.nombreCaja;
        }
    }

    public obtenerTipoCajaFlorex(caja: Caja): string {
        let nombreAux: string = null;
        let tallaAux: string = null;
        if (caja.tipoAgrega === 'B' || caja.tipoAgrega === 'C') {
            for (let i = 0; i < caja.variedades.length; i++) {
                if (i > 0 && (caja.variedades[i].nombreVariedad !== nombreAux || caja.variedades[i].talla !== tallaAux)) {
                    return 'M';
                }
                nombreAux = caja.variedades[i].nombreVariedad;
                tallaAux = caja.variedades[i].talla;
            }
            return 'S';

        }
    }



    public eliminarVariedad(variedad: Variedad) {
        this.CajaArmada.variedades = this.CajaArmada.variedades.filter(item => item.codigoVariedad !== variedad.codigoVariedad)
        if (this.CajaArmada.variedades.length > 0) {
            this._calcularPorcentajeCajaArmada(this.cajaSeleccionada);
        } else {
            this.CajaArmada.totalProcentajeLleno = 0;
        }
    }

    public recalcularCaja(variedad, cantidad) {


        this.CajaArmada.variedades = this.CajaArmada.variedades.filter(item => item.codigoVariedad !== variedad.codigoVariedad);
        for (let i = 0; i < cantidad; i++) {
            this.CajaArmada.variedades.push(variedad);
        }

        if (this.CajaArmada.variedades.length > 0) {
            this._calcularPorcentajeCajaArmada(this.cajaSeleccionada);
        } else {
            this.CajaArmada.totalProcentajeLleno = 0;
        }

        this.CajaArmada.totalCantidadPorBunche = 0

        this.CajaArmada.variedades.forEach(variedad => {
            this.CajaArmada.totalCantidadPorBunche += variedad.cantidadPorBunche
        });

    }

    obtenerTipoCaja(cajaPorVariedad: Cajas[]): Cajas[] {
        var resultadoCaja: Cajas[] = [];
        switch (this.cajaSeleccionada) {
            case 'EB': {
                if (cajaPorVariedad.filter(x => x.caja === EnumTipoCaja.EB).length > 0) {
                    resultadoCaja = cajaPorVariedad.filter(x => x.caja === EnumTipoCaja.EB)
                }
                return resultadoCaja;
            }
            case 'QB': {
                if (cajaPorVariedad.filter(x => x.caja === EnumTipoCaja.QB).length > 0) {
                    resultadoCaja = cajaPorVariedad.filter(x => x.caja === EnumTipoCaja.QB)
                }
                return resultadoCaja;
            }
            case 'HB': {
                if (cajaPorVariedad.filter(x => x.caja === EnumTipoCaja.HB).length > 0) {
                    resultadoCaja = cajaPorVariedad.filter(x => x.caja === EnumTipoCaja.HB)
                }
                return resultadoCaja;
            }
        }
    }

    public agregarAcajaDesdeCarrito(caja: Caja) {

        this.cajaSeleccionada = caja.tipoCaja
        var resultado = this.obtenerTipoCaja([])[0]; //Revisar

        this.cajaSeleccionadaNumber = this.totalCaja(this.cajaSeleccionada, resultado.valor);
        this.cajaSeleccionadaNumber = resultado.valor;

        for (let index = 0; index < caja.variedades.length; index++) {
            const variedad = caja.variedades[index];
            this.agregarACaja(
                variedad,
                this.cajaSeleccionada,
                variedad.imagenes,
                caja.tallasFinales,
                [caja],
                0, //Revisar
                null,
                this.cajaSeleccionadaNumber
            )
        }
    }

    public agregarACaja(variedad: Variedad, cajaSeleccionada: string,
        imagen: string, tallasFinales: Talla[],
        producto: Caja[], tiposCajaProducto, cajasDisponiblesMixtas, totalCaja): Boolean {


        this.obtenerUsuario();
        this.CajaArmada.codigoTipoCliente = this.c.codigoTipoCliente;
        this.CajaArmada.imagenes = imagen;
        this.CajaArmada.codigoCliente = this.c.codigoPersona;
        this.CajaArmada.tipoAgrega = 'B';
        this.CajaArmada.tipoCaja = cajaSeleccionada;
        this.CajaArmada.cantidadIngresada = 1;
        // this.CajaArmada.proveedores.push(...variedad.nombresProveedor);
        this.CajaArmada.totalCantidadPorBunche += variedad.cantidadPorBunche;
        this.CajaArmada.cajasDisponiblesMixtas = cajasDisponiblesMixtas;
        this.CajaArmada.combo = 'N';
        var tallaFinalUnica: Talla[] = [];
        tallasFinales.forEach(talla => {
            tallaFinalUnica.push({ codigo: talla.codigo, valor: talla.valor });
        });
        var hash = {};
        tallaFinalUnica = tallaFinalUnica.filter(function (current) {
            var exists = !hash[current.valor];
            hash[current.valor] = true;
            return exists;
        });
        this.CajaArmada.variedades.push({
            codigoVariedad: variedad.codigoVariedad,
            nombreVariedad: variedad.nombreVariedad.toLowerCase(),
            producto: variedad.producto.toLowerCase(),
            cantidadPorBunche: variedad.cantidadPorBunche,
            caja: variedad.caja,
            cantidadPorCaja: variedad.cantidadPorCaja,
            talla: variedad.talla,
            tallaCm: variedad.tallaCm,
            imagenes: imagen,
            precio: variedad.precio,
            //   precioSO: variedad.precioSO,
            // precioFinca: variedad.precioFinca,
            // precioJv: variedad.precioJv,
            precioCliente: variedad.precioCliente,
            //    stadingOrder: variedad.stadingOrder,
            cajaCombo: variedad.cajaCombo,
            cartCount: variedad.cartCount,
            //  precios: variedad.precios,
            //  codigosProveedor: variedad.codigosProveedor,
            //  seguridad: variedad.seguridad,
            //  cajasCantidad: variedad.cajasCantidad,
            //  disabled: undefined,
            // mostrarPrecioPorCaja: variedad.mostrarPrecioPorCaja,
            // cantidadPorCajaMixta: variedad.cantidadPorCajaMixta,
            // sePuedeMezclar: variedad.sePuedeMezclar,
            // nombresProveedor: variedad.nombresProveedor,
            // disabledBox: variedad.disabledBox,
            // disabledBunches: variedad.disabledBunches,
            // productOriginal: undefined,
            // tallasVariedadSeleccionada: tallaFinalUnica,
            // indexPorVariedad: producto[0].indexVariedadSeleccionada,
            // cajasPorVariedad: tiposCajaProducto,
            // cajaMinima: variedad.cajaMinima,
            // fincaPreferida: undefined
        });
        this.CajaArmada.variedades.sort(function (a, b) {
            return a.nombreVariedad.localeCompare(b.nombreVariedad);
        });
        this.calcularPrecioTotalCaja();

        var resultado = this.calularPorcentajeAntesDeAgregar(cajaSeleccionada, variedad, totalCaja);

        this.CajaArmada.totalProcentajeLleno = new Decimal(resultado).toDecimalPlaces(3).toNumber();
        return true;
    }


   /* public agregarCajaCart(producto: ProductoWebShop, imagen: string, cantidadIngresada: number): Boolean {

        const indexTallaSeleccionada = producto.tallas.findIndex(talla => talla.tallaSeleccionada === true);
        const tallaSeleccionada = producto.tallas[indexTallaSeleccionada]

        const indexCajaSeleccionada = tallaSeleccionada.cajas.findIndex(caja => caja.cajaSeleccionada === true)
        const cajaSeleccionada = tallaSeleccionada.cajas[indexCajaSeleccionada]

        this.obtenerUsuario();
        const cajaAgregar = new Caja(
            null, null, null, null, null, null, [], '', 0, 0, 0, 0,
            null, false, null, null, null, null, null, null, null, 0,
            0, 0, null, null, [], "", [], "", [], "", 0, "", "", 0,
            0, 'N', 'N', "", null, ""
        );

        cajaAgregar.tipoAgrega = 'C';
        cajaAgregar.tipoCaja = cajaSeleccionada.caja;
        cajaAgregar.imagenes = producto.imagenes[0];
        cajaAgregar.verificarVariedadCaja = producto.producto.toLowerCase();
        cajaAgregar.cantidadIngresada = cantidadIngresada
        //cajaAgregar.tallasFinales = producto.tallasFinales
        //cajaAgregar.proveedores.push(...variedad.nombresProveedor)
        //  cajaAgregar.indexVariedadSeleccionada = producto.indexVariedadSeleccionada
        cajaAgregar.tallasCajaCm = [parseInt(tallaSeleccionada.tallaCm)]
        cajaAgregar.tallasDeCaja = [tallaSeleccionada.talla]
        cajaAgregar.stadingOrder = false
        cajaAgregar.combo = 'N'
        cajaAgregar.destinoSeleccionado = null;
        cajaAgregar.variedades.push({
            codigoVariedad: producto.codigoVariedad,
            nombreVariedad: producto.nombreVariedad,
            producto: producto.producto,
            cantidadPorBunche: cajaSeleccionada.cantidadPorBunche,
            caja: cajaSeleccionada.caja,
            cantidadPorCaja: cajaSeleccionada.cantidadPorCaja,
            talla: tallaSeleccionada.talla,
            tallaCm: parseInt(tallaSeleccionada.tallaCm),
            imagenes: imagen,
            precio: cajaSeleccionada.precio,
            //   precioSO: variedad.precioSO,
            //   precioFinca: variedad.precioFinca,
            //      precioJv: variedad.precioJv,
            precioCliente: cajaSeleccionada.precio,
            //    stadingOrder: variedad.stadingOrder,
            cajaCombo: 'N',
            cartCount: cantidadIngresada,
            //  precios: variedad.precios,
            //   codigosProveedor: variedad.codigosProveedor,
            //    seguridad: variedad.seguridad,
            //     cajasCantidad: variedad.cajasCantidad,
            //   disabled: null,
            //        mostrarPrecioPorCaja: variedad.mostrarPrecioPorCaja,
            //    cantidadPorCajaMixta: variedad.cantidadPorCajaMixta,
            //       sePuedeMezclar: variedad.sePuedeMezclar,
            //        nombresProveedor: variedad.nombresProveedor,
            //  disabledBox: false,
            //      disabledBunches: false,
            //  productOriginal: [producto],
            //  tallasVariedadSeleccionada: producto.tallasFinales,
            // indexPorVariedad: producto.indexVariedadSeleccionada,
            // cajasPorVariedad: variedad.cajasPorVariedad,
            //    cajaMinima: variedad.cajaMinima,
            //   fincaPreferida: undefined
        });

        cajaAgregar.totalPiezas = cajaSeleccionada.cantidadPorCaja;
        var precioTotal = cajaSeleccionada.precio * cajaSeleccionada.cantidadPorCaja;
        //calculo por comison JV
        // var precioTotalJv = variedad.precioJv * variedad.cantidadPorCaja;

        cajaAgregar.totalPrecio = precioTotal * cantidadIngresada
        //  cajaAgregar.totalPrecioJv = precioTotalJv * cantidadIngresada
        cajaAgregar.totalProcentajeLleno = (cajaAgregar.totalPiezas * 100) / cajaSeleccionada.cantidadPorCaja;
        cajaAgregar.nombreCaja = this.obtenerNombreCaja(cajaAgregar).toLowerCase();
        cajaAgregar.tallasDeCaja = this.obtenerTallasCaja(cajaAgregar);
        cajaAgregar.tipoCajaFlorex = this.obtenerTipoCajaFlorex(cajaAgregar);

        const index = this.Data.cartListCaja.findIndex(
            x =>
                x.tipoAgrega === "C" &&
                x.tipoCaja === cajaAgregar.tipoCaja &&
                x.variedades[0].talla === cajaAgregar.variedades[0].talla
        );

        if (index != -1) {

            cajaAgregar.cantidadIngresada = this.Data.cartListCaja[index].cantidadIngresada + cantidadIngresada
            var precioTotal = cajaSeleccionada.precio * cajaSeleccionada.cantidadPorCaja;
            cajaAgregar.totalPrecio = precioTotal * cajaAgregar.cantidadIngresada
            this.Data.cartListCaja.splice(index, 1);
            this.Data.cartListCaja.splice(index, 0, cajaAgregar);
        } else {
            this.Data.cartListCaja.push(cajaAgregar);
        }


        this.totalCarritoCajas();
        this.addCartLocalStorage();
        return true;
    }*/


    //caja combo
    public agregarCajaCartCompleta(caja: Caja, cantidadIngresada: number, productOriginal: Caja): Boolean {

        var codigoProveedores = [];
        // caja.variedades.filter(x => codigoProveedores.push(x.nombresProveedor))

        this.c = JSON.parse(localStorage.getItem('Usuario'));
        caja.codigoTipoCliente = this.c.codigoTipoCliente;
        caja.codigoCliente = this.c.codigoPersona;
        caja.cantidadIngresada = cantidadIngresada;
        caja.stadingOrder = false;
        caja.combo = 'S';
        caja.nombreCaja = caja.nombreCaja.toLowerCase();
        caja.verificarVariedadCaja = caja.nombreCaja.toLowerCase();
        caja.destinoSeleccionado = null;
        this.Data.cartListCaja.push({
            tipoProducto: caja.tipoProducto,
            tipoAgrega: caja.tipoAgrega,
            imagenes: caja.imagen,
            color: caja.color,
            cartCount: caja.cartCount,
            promocion: caja.promocion,
            variedades: caja.variedades,
            tipoCaja: caja.tipoCaja,
            totalPiezas: caja.totalPiezas,
            totalPrecio: caja.totalPrecio * cantidadIngresada,
            totalPrecioJv: caja.totalPrecioJv * cantidadIngresada,
            totalProcentajeLleno: caja.totalProcentajeLleno,
            nombreCaja: caja.nombreCaja,
            mostrarDetalle: caja.mostrarDetalle,
            tallasDeCaja: caja.tallasDeCaja,
            tallasCajaCm: caja.tallasCajaCm,
            stadingOrder: false,
            codigoCliente: caja.codigoCliente,
            codigoTipoCliente: caja.codigoTipoCliente,
            tipoCajaFlorex: caja.tipoCajaFlorex,
            combo: caja.combo,
            indexVariedadSeleccionada: caja.indexVariedadSeleccionada,
            cantidadIngresada: caja.cantidadIngresada,
            cantidadCajas: caja.cantidadCajas,
            cajaSeleccionada: caja.cajaSeleccionada,
            tallaSeleccionada: caja.tallaSeleccionada,
            tallasFinales: caja.tallasFinales,
            imagen: caja.imagen,
            cajasDisponiblesMixtas: caja.cajasDisponiblesMixtas,
            tallaSeleccionadaMostrar: caja.tallaSeleccionadaMostrar,
            proveedores: codigoProveedores,
            fincaPreferida: caja.fincaPreferida,
            codigoProveedorWS: 0,
            verificarVariedadCaja: caja.verificarVariedadCaja,
            nombreProducto: "",
            totalCantidadPorBunche: 0,
            indexPorTipoCaja: 0,
            botonBox: 'N',
            botonBunches: 'N',
            argumentoDeBusqueda: caja.argumentoDeBusqueda,
            destinoSeleccionado: caja.destinoSeleccionado,
            destinoNombre: caja.destinoNombre
        });
        this.totalCarritoCajas();
        this.appWebshopService.addCartLocalStorage();


        return true;
    }

   /* public agregarCajaCartCompletaVarias(caja: Caja): Boolean {
        this.obtenerUsuario();
        caja.codigoTipoCliente = this.c.codigoTipoCliente;
        caja.codigoCliente = this.c.codigoPersona;
        this.Data.cartListCaja.push(caja);
        this.totalCarritoCajas();
        this.addCartLocalStorage();
        return true;
    }*/

    public obtenerTallasCaja(caja: Caja): string[] {
        const tallasDeCaja: string[] = [];
        caja.variedades.forEach(variedad => {
            tallasDeCaja.push(variedad.talla);
        });
        return tallasDeCaja.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
    }

    /*public addCartLocalStorage() {
        try {

            // Verifica que this.Data tenga datos válidos antes de almacenarlos
            if (this.Data) {
                var dataLocalStorage = JSON.stringify(this.Data);

                localStorage.removeItem('Data');
                localStorage.setItem('Data', dataLocalStorage);
                console.log("Datos almacenados en localStorage con éxito.");
                //this.setRegistrarCarritoDetallePorCliente();
            } else {
                console.error("this.Data está vacío o nulo.");
            }
        } catch (error) {
            console.error("Ocurrió un error:", error);
        }
    }*/


  /*  public setRegistrarCarritoDetallePorCliente() {
        var data = JSON.parse(localStorage.getItem("DataCar"))
        if (data != null || data != undefined) {
            data.destinoSeleccionado = JSON.parse(sessionStorage.getItem("Destino"))
            data.camionSeleccionado = JSON.parse(sessionStorage.getItem("Camion"))
            data.fecha = localStorage.getItem("_ls_dateConecction")
        }
        var usuario = JSON.parse(localStorage.getItem('Usuario'));
        var codigoCliente = parseInt(usuario.codigoPersona)
        var idcarrito = JSON.parse(localStorage.getItem('idCarrito'));
        var paginador = JSON.parse(sessionStorage.getItem('Paginador'));
        console.log("idcarrito", idcarrito);
        this._registrarCarritoDetallePorCliente(codigoCliente, 'A', JSON.stringify(data), idcarrito == null ? 'noId' : idcarrito, paginador.isTropical ? 'S' : 'N').subscribe(data => {
            localStorage.setItem('idCarrito', JSON.stringify(data));
        }, (err: any) => {
            console.log("error")
        })
    }*/

    public removeCartLocalStorage() {
        localStorage.removeItem('Data');
    }

    public getCartLocalStorage(): Data {
        var dataLocalStorage = JSON.parse(localStorage.getItem('Data'));
        if (dataLocalStorage != null) {
            return JSON.parse(localStorage.getItem('Data'));
        }
        return new Data(
            [], // categories
            [], // compareList
            [], // wishList
            [], // cartList,
            [], // Carro de Compras Caja
            null, // totalPrice,
            0, // totalCartCount
        );
    }  
    
    public getCartLocalStorageAct(): DataCar {
        var dataLocalStorage = JSON.parse(localStorage.getItem('DataCar'));
        if (dataLocalStorage != null) {
          return JSON.parse(localStorage.getItem('DataCar'));
        }
        return new DataCar(
          [], // Carro de Compras Cajas
          0, // totalPrice,
          0,
          0,
          new CargosTransporte(0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
          0
        );
      }

    public calcularPrecioTotalCaja() {
        this.CajaArmada.totalPiezas = 0;
        this.CajaArmada.totalPrecio = 0;
        this.CajaArmada.totalPrecioJv = 0;
        this.CajaArmada.variedades.forEach(variedad => {
            this.CajaArmada.totalPiezas += variedad.cantidadPorBunche;
            this.CajaArmada.totalPrecio += variedad.precio * variedad.cantidadPorBunche;
            //  this.CajaArmada.totalPrecioJv += variedad.precioJv * variedad.cantidadPorBunche;
        });
    }

    public calularPorcentajeAntesDeAgregar(cajaSeleccionada: string, variedad: Variedad, totalAgregar: number): number {
        var porcentaje = 0;
        const variedadesUnicas = [];
        let variedadesUnicasConPosibleAumento = this.CajaArmada.variedades;

        //  for (let index = 0; index < totalAgregar; index++) {
        //        variedadesUnicasConPosibleAumento.push(variedad) 
        //   }

        variedadesUnicasConPosibleAumento.forEach(variedadAgregada => {
            const existeVariedad = variedadesUnicas.some(variedadUnica => variedadUnica.codigoVariedad === variedadAgregada.codigoVariedad);

            if (!existeVariedad) {
                variedadesUnicas.push(variedadAgregada);
            }
        });

        variedadesUnicas.forEach(variedad => {
            var cantidadBonches = variedadesUnicasConPosibleAumento.filter(x => x.codigoVariedad === variedad.codigoVariedad).length
            var cajaVariedad = variedad.cajasPorVariedad.filter(x => x.caja === cajaSeleccionada);

            if (cajaVariedad.length > 0) {
                var tallosPorCaja = cajaVariedad[0].valor
                var totalTallos = cantidadBonches * variedad.cantidadPorBunche;
                porcentaje += ((100 / tallosPorCaja) * totalTallos);
            }
        })
        return new Decimal(porcentaje).toDecimalPlaces(3).toNumber();
    }

    public _calcularPorcentajeCajaArmada(cajaSeleccionada: string): number {

        this.CajaArmada.totalProcentajeLleno = 0;

        const variedadesUnicas = [];

        this.CajaArmada.variedades.forEach(variedadAgregada => {
            const existeVariedad = variedadesUnicas.some(variedadUnica => variedadUnica.codigoVariedad === variedadAgregada.codigoVariedad);

            if (!existeVariedad) {
                variedadesUnicas.push(variedadAgregada);
            }
        });

        variedadesUnicas.forEach(variedad => {
            var cantidadBonches = this.CajaArmada.variedades.filter(x => x.codigoVariedad === variedad.codigoVariedad).length
            var cajaVariedad = variedad.cajasPorVariedad.filter(x => x.caja === cajaSeleccionada);

            if (cajaVariedad.length > 0) {
                var tallosPorCaja = cajaVariedad[0].valor
                var totalTallos = cantidadBonches * variedad.cantidadPorBunche;
                this.CajaArmada.totalProcentajeLleno += ((100 / tallosPorCaja) * totalTallos);
            }
        })

        this.getImagenBarraProgreso().subscribe(data => {
            this._validarCajaSeleccionada(cajaSeleccionada, data);
        });
        return new Decimal(this.CajaArmada.totalProcentajeLleno).toDecimalPlaces(3).toNumber();
    }

    // public _calcularPorcentajeCajaArmada(cajaSeleccionada: string): number {
    //     this.CajaArmada.totalProcentajeLleno = 0;
    //     if (cajaSeleccionada === "EB") {
    //         this.CajaArmada.variedades.forEach(variedad => {
    //             var caja = variedad.cajasPorVariedad.filter(x => x.caja == "EB");
    //             if (caja.length > 0) {
    //                 var bunchesPorCajaEB = caja[0].valor / variedad.cantidadPorBunche;
    //                 this.CajaArmada.totalProcentajeLleno += ((1 * 100) / bunchesPorCajaEB);
    //             }
    //         });
    //     }
    //     if (cajaSeleccionada === "QB") {
    //         this.CajaArmada.variedades.forEach(variedad => {
    //             var caja = variedad.cajasPorVariedad.filter(x => x.caja == "QB");
    //             if (caja.length > 0) {
    //                 var bunchesPorCajaQB = caja[0].valor / variedad.cantidadPorBunche;
    //                 this.CajaArmada.totalProcentajeLleno += ((1 * 100) / bunchesPorCajaQB);
    //             }
    //         });
    //     }
    //     if (cajaSeleccionada === "HB") {
    //         this.CajaArmada.variedades.forEach(variedad => {
    //             var caja = variedad.cajasPorVariedad.filter(x => x.caja == "HB");
    //             if (caja.length > 0) {
    //                 var bunchesPorCajaHB = caja[0].valor / variedad.cantidadPorBunche;
    //                 this.CajaArmada.totalProcentajeLleno += ((1 * 100) / bunchesPorCajaHB);
    //             }
    //         });
    //     }
    //     this.getImagenBarraProgreso().subscribe(data => {
    //         this._validarCajaSeleccionada(cajaSeleccionada, data);
    //     });
    //     return new Decimal(this.CajaArmada.totalProcentajeLleno).toDecimalPlaces(3).toNumber();
    // }

    public totalCaja(tipoCaja: string, cajaNumber: number): number {
        let totalCaja = 0;

        if (tipoCaja === 'EB') {
            totalCaja = cajaNumber;
        }
        if (tipoCaja === 'QB') {
            totalCaja = cajaNumber;
        }
        if (tipoCaja === 'HB') {
            totalCaja = cajaNumber;
        }
        return totalCaja;
    }


    public actualizarCajaSeleccionada(cajaSeleccionada): string {

        if (cajaSeleccionada === 'EB') {
            cajaSeleccionada = 'QB';
            return cajaSeleccionada;
        }
        if (cajaSeleccionada === 'QB') {
            cajaSeleccionada = 'HB';
            return cajaSeleccionada;
        }
        if (cajaSeleccionada === 'HB') {

            swal.fire({
                icon: 'warning',
                title: 'Alert',
                text: "You can't enlarge the box anymore",
            });

            return cajaSeleccionada;
        }
    }

    public isLogged() {
        if (localStorage.getItem('Usuario') != null) {
            return true;
        }
        return false;
    }

    public marcacionSeleccionada(marcacion: Marcacion) {
        if (marcacion != null || marcacion != undefined) {
            sessionStorage.setItem('Marcacion', JSON.stringify(marcacion));
            var marcacionSeleccionada = JSON.parse(sessionStorage.getItem('Marcacion'))
            sessionStorage.setItem("CodigoMarcacion", marcacionSeleccionada.codigoSeleccion)
        }
    }

    public marcacionSeleccionadaStading(marcacion: Marcacion) {
        if (marcacion != null || marcacion != undefined) {
            sessionStorage.setItem('MarcacionStading', JSON.stringify(marcacion));
            var marcacionSeleccionada = JSON.parse(sessionStorage.getItem('Marcacion'))
            sessionStorage.setItem("CodigoMarcacionStading", marcacionSeleccionada.codigoSeleccion)
        }
    }

    //Devuelve el producto buscado en el input
    public _getFiltroGeneralProductos(valorBusqueda: string, listaProdutos: Caja[], opcion: string, filtrosBusqueda: string[]) {

        var listaFiltradaProductos;

        if (opcion === 'I') {
            listaFiltradaProductos = listaProdutos.filter
                (x => x.variedades[0].producto === valorBusqueda.toUpperCase() ||
                    x.variedades[0].nombreVariedad === valorBusqueda.toUpperCase()
                );
        } else {
            listaFiltradaProductos = listaProdutos.filter(x => x.color === valorBusqueda.toUpperCase());
        }

        return listaFiltradaProductos

    }

    _validarCajaSeleccionada(tipoCaja: string, data) {

        this.barraProgresoImagen = []
        this.barraProgresoImagen.push("")
        this.barraProgresoImagen.shift()

        switch (tipoCaja) {
            case "EB": {
                var filtroCaja = data.filter(x => x.caja === "EB")
                this._getTipoCajaProgresoConImagen(filtroCaja);
                break;
            }
            case "QB": {
                var filtroCaja = data.filter(x => x.caja === "QB")
                this._getTipoCajaProgresoConImagen(filtroCaja);
                break;
            }
            case "HB": {
                var filtroCaja = data.filter(x => x.caja === "HB")
                this._getTipoCajaProgresoConImagen(filtroCaja);
                break;
            }

        }
    }

    public _botonMenuSeleccionado(url: string) {
        this.btnHub = 0
        this.btnStading = 0
        this.btnCombo = 0
        this.btnCustomers = 0
        this.btnOrders = 0
        this.btnBilling = 0

        switch (url) {
            case "/home": {
                this.btnHub = 1
                break;
            }
            case "/stading": {
                this.btnStading = 1
                break;
            }
            case "/comboBox": {
                this.btnCombo = 1
                break;
            }
            case "/account/mycustomers": {
                this.btnCustomers = 1
                break;
            }
            case "/account/orders": {
                this.btnOrders = 1
                break;
            }
            case "/account/files": {
                this.btnBilling = 1
                break;
            }
            default: {
                this.btnHub = 0
                this.btnStading = 0
                this.btnCombo = 0
                this.btnCustomers = 0
                this.btnOrders = 0
                this.btnBilling = 0
                break;
            }
        }

    }

    public _getTipoCajaProgresoConImagen(data) {

        if (this.CajaArmada.totalProcentajeLleno < 50) {
            this.barraProgresoImagen.push(data[0].imagen)
        }
        if (this.CajaArmada.totalProcentajeLleno >= 50 && this.CajaArmada.totalProcentajeLleno < 75) {
            this.barraProgresoImagen.push(data[1].imagen)
        }
        if (this.CajaArmada.totalProcentajeLleno >= 75 && this.CajaArmada.totalProcentajeLleno < 90) {
            this.barraProgresoImagen.push(data[2].imagen)
        }
        if (this.CajaArmada.totalProcentajeLleno >= 90) {
            this.barraProgresoImagen.push(data[3].imagen)
        }

    }

    //calcula total caja por tipo de carrito hub o standing
    public _calcularTotalCajaPorTipoCarrito(condicion: boolean) {
        this.Data.totalPrice = 0
        this.Data.cartListCaja.forEach(caja => {
            if (caja.stadingOrder === condicion) {
                if (caja.tipoAgrega === 'B' && caja.combo == 'N') {
                    caja.totalPrecio = 0
                    caja.totalPiezas = 0
                    caja.totalPrecioJv = 0
                    caja.totalCantidadPorBunche = 0
                    caja.variedades.forEach(variedad => {
                        caja.totalPiezas += variedad.cantidadPorBunche;
                        caja.totalPrecio += variedad.precio * variedad.cantidadPorBunche;
                        //  caja.totalPrecioJv += variedad.precioJv * variedad.cantidadPorBunche
                        caja.totalCantidadPorBunche += variedad.cantidadPorBunche
                    });
                }
                if (caja.tipoAgrega === 'C' && caja.combo == 'N') {
                    caja.variedades.forEach(variedad => {
                        var precioTotal = variedad.precio * variedad.cantidadPorCaja;
                        //  var precioTotalJv = variedad.precioJv * variedad.cantidadPorCaja;
                        caja.totalPrecio = precioTotal * caja.cantidadIngresada
                        //   caja.totalPrecioJv = precioTotalJv * caja.cantidadIngresada
                    });
                }
                if (caja.tipoAgrega === 'C' && caja.combo == 'S') {
                    caja.totalPiezas = 0;
                    caja.totalPrecio = 0;
                    let totalAux = 0;
                    let totalAuxJv = 0;
                    let tipocaja = '';
                    caja.variedades.forEach(variedad => {
                        caja.totalPiezas += variedad.cantidadPorCaja;
                        totalAux = variedad.precio * variedad.cantidadPorCaja;
                        // totalAuxJv = variedad.precioJv * variedad.cantidadPorCaja;
                        caja.totalPrecio += totalAux * caja.cantidadIngresada;
                        caja.totalPrecioJv += totalAuxJv * caja.cantidadIngresada;
                        tipocaja = variedad.caja;
                    });
                }

                this.Data.totalPrice += caja.totalPrecio;
            }
        });
    }

    //tiene que validar cuando viene de stading o hub validar con la condicion y enviar argumento
    // public _productosfiltradosPorProveedor(
    //     listaProductos: Caja[],
    //     c: ClienteDTO,
    //     ruta: string,
    //     sePuedeMezclar: string,
    //     nombreProducto: string,
    //     productos: Caja[],
    //     esStadingOrder: boolean): Caja[] {

    //     var listaFiltradaCaja: Caja[] = [];
    //     for (let index = 0; index < listaProductos.length; index++) {
    //         const element = listaProductos[index];
    //         element.tallasDeCaja = [];
    //         element.tallasCajaCm = [];
    //         element.cajasDisponiblesMixtas = [];
    //         element.tallasFinales = [];
    //         element.imagen = this.urlImagen + element.imagenes[0];
    //         element.nombreProducto = element.variedades[0].nombreVariedad.toLowerCase() + " - " + element.variedades[0].producto.toLowerCase();
    //         element.stadingOrder = esStadingOrder;
    //         for (let x = 0; x < element.variedades.length; x++) {
    //             const variedad = element.variedades[x];
    //             variedad.cajasPorVariedad = [];
    //             var buscarVariedadesPorTalla = element.variedades.filter(x => x.talla == variedad.talla);
    //             if (buscarVariedadesPorTalla.length > 0) {
    //                 buscarVariedadesPorTalla.forEach(caja => {
    //                     variedad.cajasPorVariedad.push({
    //                         caja: caja.caja,
    //                         valor: caja.cantidadPorCajaMixta
    //                     })
    //                 });
    //                 var hash = {};
    //                 variedad.cajasPorVariedad = variedad.cajasPorVariedad.filter(function (productoCaja) {
    //                     var exists = !hash[productoCaja.caja];
    //                     hash[productoCaja.caja] = true;
    //                     return exists;
    //                 });
    //             }
    //             element.cajasDisponiblesMixtas.push(variedad.cantidadPorCajaMixta)
    //             if (variedad.cantidadPorCaja > 0) {
    //                 element.tallasDeCaja.push(variedad.talla);
    //                 element.tallasCajaCm.push(variedad.tallaCm)
    //                 variedad.disabledBox = false
    //                 variedad.disabledBunches = false
    //                 element.botonBox = 'S'
    //                 element.botonBunches = 'S'
    //                 variedad.cajaCombo = "N";
    //                 variedad.stadingOrder = esStadingOrder
    //                 if (variedad.mostrarPrecioPorCaja == 'no') {
    //                     element.botonBunches = 'N'
    //                 }
    //                 element.tallasFinales.push({ codigo: variedad.tallaCm, valor: variedad.talla })
    //                 for (let z = 0; z < variedad.precios.length; z++) {
    //                     const precio = variedad.precios[z];
    //                     if (ruta === '/stading') {
    //                         if (precio.tipoPrecio == "F") {
    //                             if (precio.codigoTipoCliente === c.codigoTipoCliente) {
    //                                 variedad.precioJv = precio.precioJv
    //                                 variedad.precio = precio.precio;
    //                                 variedad.precioCliente = precio.precioCliente
    //                             }
    //                         }
    //                     }
    //                     else {
    //                         if (precio.tipoPrecio == "N") {
    //                             if (precio.codigoTipoCliente === c.codigoTipoCliente) {
    //                                 variedad.precioJv = precio.precioJv
    //                                 variedad.precio = precio.precio;
    //                                 variedad.precioCliente = precio.precioCliente
    //                             }
    //                         }
    //                     }
    //                 }
    //                 element.cajasDisponiblesMixtas = Array.from(new Set(element.cajasDisponiblesMixtas));
    //                 if (element.combo === 'N') {
    //                     //mezcla entre variedades
    //                     if (sePuedeMezclar === "no") {
    //                         if (variedad.mostrarPrecioPorCaja != "si") {
    //                             if (variedad.producto.toUpperCase() === nombreProducto.toUpperCase()) {
    //                                 listaFiltradaCaja.push(element);
    //                             }
    //                         }
    //                     }
    //                     //mezcla entre variedades diferentes
    //                     if (sePuedeMezclar === "si") {
    //                         if (variedad.mostrarPrecioPorCaja != "si") {
    //                             if (variedad.sePuedeMezclar === "si") {
    //                                 listaFiltradaCaja.push(element)
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         var tallaOriginalMenor = element.tallasCajaCm[0];
    //         var cajaOriginalMenor = [];
    //         if (element.combo == 'N') {
    //             var uniques = Array.from(new Set(element.tallasCajaCm));
    //             var tallaStr = element.tallasDeCaja[0]
    //             var hash = {};
    //             element.tallasFinales = element.tallasFinales.filter(function (current) {
    //                 var exists = !hash[current.valor];
    //                 hash[current.valor] = true;
    //                 return exists;
    //             });
    //             element.tallasCajaCm = uniques.sort(comparar);
    //             element.tallasFinales.sort((a, b) => a.codigo - b.codigo);
    //             element.tallasDeCaja = Array.from(new Set(element.tallasDeCaja));
    //             element.tallaSeleccionada = element.tallasDeCaja[0];
    //             var variedadBusqueda = [];
    //             element.variedades.forEach(variedad => {
    //                 if (variedad.cantidadPorCaja > 0) {
    //                     if (variedad.tallaCm == tallaOriginalMenor && variedad.talla == tallaStr) {
    //                         variedadBusqueda.push(variedad)
    //                     }
    //                 }
    //             });
    //             variedadBusqueda.forEach(item => {
    //                 cajaOriginalMenor.push(item.cantidadPorCaja)
    //             });
    //             var minCaja = Math.min(...cajaOriginalMenor);
    //             element.cajaSeleccionada = minCaja;
    //             element.indexVariedadSeleccionada = this._tallaProducto(tallaStr, element, minCaja, productos);
    //             element.indexPorTipoCaja = this.actualizarIndexPorTipoCaja(element, tallaStr, listaProductos)
    //         }
    //     }
    //     listaProductos = listaFiltradaCaja;
    //     var eliminarRepetidos = Array.from(new Set(listaProductos));
    //     listaProductos = eliminarRepetidos;
    //     function comparar(a, b) { return a - b; };
    //     listaProductos = this.filtrarSoloRosasVSOtros(listaProductos, nombreProducto);
    //     return listaProductos;
    // }

    public filtrarSoloRosasVSOtros(listaProductos: Caja[], nombreProducto: string) {
        let nombreProductoS = nombreProducto.toUpperCase()
        if (listaProductos.length > 0) {
            if (nombreProductoS == 'ROSES' || nombreProductoS == 'GARDEN ROSES' || nombreProductoS == 'GARDEN SPRAY ROSES'
                || nombreProductoS == 'MAYRAS GARDEN ROSES' || nombreProductoS == 'SPRAY ROSES') {
                listaProductos = listaProductos.filter(x => x.variedades[0].producto == 'ROSES' || x.variedades[0].producto == 'GARDEN ROSES' || x.variedades[0].producto == 'GARDEN SPRAY ROSES'
                    || x.variedades[0].producto == 'MAYRAS GARDEN ROSES' || x.variedades[0].producto == 'SPRAY ROSES')
            } else {
                listaProductos = listaProductos.filter(x => !(x.variedades[0].producto == 'ROSES' || x.variedades[0].producto == 'GARDEN ROSES' || x.variedades[0].producto == 'GARDEN SPRAY ROSES'
                    || x.variedades[0].producto == 'MAYRAS GARDEN ROSES' || x.variedades[0].producto == 'SPRAY ROSES'))
            }
        }
        return listaProductos;
    }

    // public _recalcularPreciosDeProductos(listaProductos: Caja[], c: any, ruta: string, sePuedeMezclar: string,
    //     nombreProducto: string, productos: Caja[], esStadingOrder: boolean) {

    //     var listaFiltradaCaja: Caja[] = [];
    //     for (let index = 0; index < listaProductos.length; index++) {
    //         const element = listaProductos[index];
    //         element.tallasDeCaja = [];
    //         element.tallasCajaCm = [];
    //         element.cajasDisponiblesMixtas = [];
    //         element.tallasFinales = [];
    //         element.imagen = this.urlImagen + element.imagenes[0];
    //         element.nombreProducto = element.variedades[0].nombreVariedad.toLowerCase() + " - " + element.variedades[0].producto.toLowerCase();
    //         element.stadingOrder = esStadingOrder;
    //         for (var x = 0; x < element.variedades.length; x++) {
    //             const variedad = element.variedades[x];
    //             variedad.cajasPorVariedad = [];
    //             element.cajasDisponiblesMixtas.push(variedad.cantidadPorCajaMixta);
    //             element.cajasDisponiblesMixtas = Array.from(new Set(element.cajasDisponiblesMixtas));
    //             var buscarVariedadesPorTalla = element.variedades.filter(x => x.talla == variedad.talla);
    //             if (buscarVariedadesPorTalla.length > 0) {
    //                 buscarVariedadesPorTalla.forEach(caja => {
    //                     variedad.cajasPorVariedad.push({
    //                         caja: caja.caja,
    //                         valor: caja.cantidadPorCajaMixta
    //                     })
    //                 });
    //                 var hash = {};
    //                 variedad.cajasPorVariedad = variedad.cajasPorVariedad.filter(function (productoCaja) {
    //                     var exists = !hash[productoCaja.caja];
    //                     hash[productoCaja.caja] = true;
    //                     return exists;
    //                 });
    //             }
    //             if (variedad.cantidadPorCaja > 0) {
    //                 element.tallasDeCaja.push(variedad.talla);
    //                 element.tallasCajaCm.push(variedad.tallaCm);
    //                 variedad.disabledBox = false;
    //                 variedad.disabledBunches = false;
    //                 element.botonBox = 'S';
    //                 element.botonBunches = 'S';
    //                 variedad.cajaCombo = "N";
    //                 variedad.stadingOrder = esStadingOrder;
    //                 if (variedad.mostrarPrecioPorCaja == 'no') {
    //                     element.botonBunches = 'N';
    //                 }
    //                 element.tallasFinales.push({ codigo: variedad.tallaCm, valor: variedad.talla });
    //                 for (var z = 0; z < variedad.precios.length; z++) {
    //                     const precio = variedad.precios[z];
    //                     var totalAux = 0;
    //                     var totalAuxJv = 0;
    //                     if (ruta === '/stading') {
    //                         if (precio.tipoPrecio == "F") {
    //                             if (c.codigoClientePadre != undefined) {
    //                                 var porcentajeSumar = c.porcentajeSubcliente / 100;
    //                                 var sumarPrecio = precio.precio * porcentajeSumar
    //                                 var sumarPrecioJv = precio.precioJv * porcentajeSumar
    //                                 precio.precio += sumarPrecio
    //                                 precio.precioJv += sumarPrecioJv
    //                             }
    //                             if (precio.codigoTipoCliente === c.codigoTipoCliente) {
    //                                 variedad.precio = precio.precio;
    //                                 variedad.precioCliente = precio.precioCliente
    //                                 variedad.precioJv = precio.precioJv
    //                                 if (element.combo == 'S') {
    //                                     variedad.cajaCombo = "S"
    //                                     totalAux = variedad.precio * variedad.cantidadPorCaja
    //                                     totalAuxJv = variedad.precioJv * variedad.cantidadPorCaja
    //                                     element.totalPrecio += totalAux
    //                                     element.totalPrecioJv += totalAuxJv
    //                                 }
    //                             }
    //                         }
    //                     }
    //                     else {
    //                         if (precio.tipoPrecio == "N") {
    //                             if (c.codigoClientePadre != undefined) {
    //                                 var porcentajeSumar = c.porcentajeSubcliente / 100;
    //                                 var sumarPrecio = precio.precio * porcentajeSumar
    //                                 var sumarPrecioJv = precio.precioJv * porcentajeSumar
    //                                 precio.precio += sumarPrecio
    //                                 precio.precioJv += sumarPrecioJv
    //                             }
    //                             if (precio.codigoTipoCliente === c.codigoTipoCliente) {
    //                                 variedad.precio = precio.precio;
    //                                 variedad.precioCliente = precio.precioCliente
    //                                 variedad.precioJv = precio.precioJv
    //                                 if (element.combo == 'S') {
    //                                     variedad.cajaCombo = "S"
    //                                     totalAux = variedad.precio * variedad.cantidadPorCaja
    //                                     totalAuxJv = variedad.precioJv * variedad.cantidadPorCaja
    //                                     element.totalPrecio += totalAux
    //                                     element.totalPrecioJv += totalAuxJv
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //                 if (element.combo === 'N') {
    //                     if (sePuedeMezclar === "no") {
    //                         if (variedad.mostrarPrecioPorCaja != "si") {
    //                             if (variedad.producto.toUpperCase() === nombreProducto.toUpperCase()) {
    //                                 listaFiltradaCaja.push(element);
    //                             }
    //                         }
    //                     }
    //                     if (sePuedeMezclar === "si") {
    //                         if (variedad.mostrarPrecioPorCaja != "si") {
    //                             if (variedad.sePuedeMezclar === "si") {
    //                                 listaFiltradaCaja.push(element);
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         var tallaOriginalMenor = element.tallasCajaCm[0];
    //         var cajaOriginalMenor = [];
    //         if (element.combo == 'N') {
    //             var uniques = Array.from(new Set(element.tallasCajaCm));
    //             var tallaStr = element.tallasDeCaja[0];
    //             var hash = {};
    //             element.tallasFinales = element.tallasFinales.filter(function (current) {
    //                 var exists = !hash[current.valor];
    //                 hash[current.valor] = true;
    //                 return exists;
    //             });
    //             element.tallasCajaCm = uniques.sort(comparar);
    //             element.tallasFinales.sort((a, b) => a.codigo - b.codigo);
    //             element.tallasDeCaja = Array.from(new Set(element.tallasDeCaja));
    //             element.tallaSeleccionada = element.tallasDeCaja[0];
    //             var variedadBusqueda = [];
    //             element.variedades.forEach(variedad => {
    //                 if (variedad.cantidadPorCaja > 0) {
    //                     if (variedad.tallaCm == tallaOriginalMenor && variedad.talla == tallaStr) {
    //                         variedadBusqueda.push(variedad);
    //                     }
    //                 }
    //             });
    //             variedadBusqueda.forEach(item => {
    //                 cajaOriginalMenor.push(item.cantidadPorCaja);
    //             });
    //             var minCaja = Math.min(...cajaOriginalMenor);
    //             element.cajaSeleccionada = minCaja;
    //             element.indexVariedadSeleccionada = this._tallaProducto(tallaStr, element, minCaja, productos);
    //             element.indexPorTipoCaja = this.actualizarIndexPorTipoCaja(element, tallaStr, listaProductos);
    //         }
    //     }
    //     listaProductos = listaFiltradaCaja;
    //     let eliminarRepetidos = Array.from(new Set(listaProductos));
    //     listaProductos = eliminarRepetidos;
    //     function comparar(a, b) { return a - b; }
    //     return listaProductos;

    // }

    // public _tallaProducto(talla: string, producto: any, cajaSeleccionada: number, productos: Caja[]) {
    //     var indexVariedad: number;
    //     const index: number = productos.indexOf(producto);
    //     const productoSeleccionado = productos[index];
    //     for (var x = 0; x < productoSeleccionado.variedades.length; x++) {
    //         var variedad = productoSeleccionado.variedades[x];
    //         variedad.cajasCantidad = [];
    //         if (variedad.cantidadPorCaja > 0) {
    //             if (productoSeleccionado.combo === 'S') {
    //                 return 0;
    //             }
    //             var variedadABuscar = productoSeleccionado.variedades.filter(x => x.talla == talla && x.cantidadPorCaja > 0);
    //             variedadABuscar.forEach(item => {
    //                 if (item.cantidadPorCaja > 0) {
    //                     variedad.cajasCantidad.push(item.cantidadPorCaja);
    //                 }
    //             });
    //             for (var dataCajas of variedad.cajasCantidad) {
    //                 if (variedad.cantidadPorCaja == dataCajas && variedad.talla == talla) {
    //                     cajaSeleccionada = dataCajas
    //                 } else if (producto.cajaSeleccionada == dataCajas && producto.tallaSeleccionada == talla) {
    //                     cajaSeleccionada = dataCajas
    //                     break;
    //                 }
    //             }
    //             if (variedad.talla == talla && variedad.cantidadPorCaja == cajaSeleccionada) {
    //                 var indexCaja = variedad.cajasCantidad.indexOf(variedad.cantidadPorCaja)
    //                 variedad.cajasCantidad.splice(indexCaja, 1)
    //                 variedad.cajasCantidad.splice(0, 0, cajaSeleccionada)
    //                 variedad.cajasCantidad.sort((a, b) => a - b)
    //                 indexVariedad = productoSeleccionado.variedades.indexOf(variedad);
    //                 break;
    //             }

    //         }
    //     }
    //     return indexVariedad;
    // }

    public actualizarIndexPorTipoCaja(producto, talla: string, productos): number {

        let indexCaja: number;
        const index: number = productos.indexOf(producto);
        const productoSeleccionado = productos[index];

        var resultadoCajaEB = productoSeleccionado.variedades.filter(x => x.caja === "EB" && x.talla === talla && x.cantidadPorCaja > 0)
        var resultadoCajaQB = productoSeleccionado.variedades.filter(x => x.caja === "QB" && x.talla === talla && x.cantidadPorCaja > 0)
        var resultadoCajaHB = productoSeleccionado.variedades.filter(x => x.caja === "HB" && x.talla === talla && x.cantidadPorCaja > 0)


        // si tiene qb selecciona el precio del bunche qb
        if (resultadoCajaQB.length > 0) {
            resultadoCajaQB.forEach(variedad => {
                indexCaja = productoSeleccionado.variedades.indexOf(variedad);
            });
            return indexCaja;
        }
        // si tiene hb selecciona el precio del bunche hb
        if (resultadoCajaHB.length > 0) {
            resultadoCajaHB.forEach(variedad => {
                indexCaja = productoSeleccionado.variedades.indexOf(variedad);
            });
            return indexCaja;
        }
        // si tiene eb selecciona el precio del bunche eb
        if (resultadoCajaEB.length > 0) {
            resultadoCajaEB.forEach(variedad => {
                indexCaja = productoSeleccionado.variedades.indexOf(variedad);
            });
            return indexCaja;
        }
    }

    public _barraProgresoPorcentaje(variedad: Variedad,) {
        this.sumarPorcentaje = this.cajaSeleccionadaNumber / variedad.cantidadPorBunche
        if (this.CajaArmada.variedades.length === 1) {
            this.countBunches = this.sumarPorcentaje - 1
            this.countBunches = Math.trunc(this.countBunches)
        } else {
            this.countBunches = this.sumarPorcentaje - this.CajaArmada.variedades.length
            if (this.CajaArmada.totalProcentajeLleno == 100) {
                this.countBunches = 0
            }
        }

        this.getImagenBarraProgreso().subscribe(data => {
            this._validarCajaSeleccionada(this.cajaSeleccionada, data);
        });
    }

    public _calcularPorcentajeCajaEditada(indexCaja: number) {

        this.CajaArmada.totalProcentajeLleno = 0;
        this.Data.cartListCaja[indexCaja].totalPiezas = 0;
        this.Data.cartListCaja[indexCaja].totalPrecio = 0;
        this.Data.cartListCaja[indexCaja].totalPrecioJv = 0;
        this.Data.cartListCaja[indexCaja].variedades.forEach(variedad => {
            this.Data.cartListCaja[indexCaja].totalPiezas += variedad.cantidadPorBunche;
            this.Data.cartListCaja[indexCaja].totalPrecio += variedad.precio * variedad.cantidadPorBunche;
            // this.Data.cartListCaja[indexCaja].totalPrecioJv += variedad.precioJv * variedad.cantidadPorBunche;
        });

        this._calcularPorcentajeCajaArmada(this.cajaSeleccionada);
    }

    public contadorCarrito() {
        this.Data.totalCartCount = 0;
        this.Data.cartListCaja.forEach(caja => {
            this.Data.totalCartCount += caja.cantidadIngresada;
        });
    }

    public _contadorCarritoPorTipoCaja(condicion: boolean): number {
        var contador = 0;
        this.Data.cartListCaja.forEach(caja => {
            if (caja.stadingOrder === condicion) {
                contador += caja.cantidadIngresada;
            }
        });
        return contador;
    }

    public _removerOrdenPorTipoCaja(tipoCaja: Caja[]) {
        tipoCaja.forEach(caja => {
            const indexCaja = this.Data.cartListCaja.indexOf(caja);
            if (indexCaja != -1) {
                this.Data.cartListCaja.splice(indexCaja, 1)
            }
        });
    }

    public _consultarSiEsFloristeria(): string {
        let usuario = JSON.parse(localStorage.getItem("Usuario"));
        return usuario.esFloristeria
    }

    public obtenerCajaReversa(caja: string) {
        var cajaObtenida: string = "";

        if (caja === "HB") {
            cajaObtenida = "QB";
        }
        if (caja === "QB") {
            cajaObtenida = "EB";
        }

        return cajaObtenida;
    }
    // public _boxProgressReversa(cajaSeleccionada: string) {
    //     if (cajaSeleccionada != "EB") {
    //         var resultado = this.obtenerCajaReversa(cajaSeleccionada);
    //         var porcentaje = 0;
    //         if (resultado === "QB") {
    //             this.CajaArmada.variedades.forEach(variedad => {
    //                 var caja = variedad.cajasPorVariedad.filter(x => x.caja == "QB");
    //                 if (caja.length > 0) {
    //                     var bunchesPorCajaQB = caja[0].valor / variedad.cantidadPorBunche;
    //                     porcentaje += ((1 * 100) / bunchesPorCajaQB);
    //                 }
    //             });
    //             if (porcentaje <= 100) {
    //                 this.cajaSeleccionada = "QB";
    //                 this.CajaArmada.totalProcentajeLleno = 0;
    //                 this.CajaArmada.totalProcentajeLleno = new Decimal(porcentaje).toDecimalPlaces(3).toNumber();
    //             }
    //         }
    //         if (resultado === "EB") {
    //             this.CajaArmada.variedades.forEach(variedad => {
    //                 var caja = variedad.cajasPorVariedad.filter(x => x.caja == "EB");
    //                 if (caja.length > 0) {
    //                     var bunchesPorCajaEB = caja[0].valor / variedad.cantidadPorBunche;
    //                     porcentaje += ((1 * 100) / bunchesPorCajaEB);
    //                 }
    //             });
    //             if (porcentaje <= 100) {
    //                 this.cajaSeleccionada = "EB";
    //                 this.CajaArmada.totalProcentajeLleno = 0;
    //                 this.CajaArmada.totalProcentajeLleno = new Decimal(porcentaje).toDecimalPlaces(3).toNumber();
    //             }
    //         }
    //         this.getImagenBarraProgreso().subscribe(data => {
    //             this._validarCajaSeleccionada(this.cajaSeleccionada, data);
    //         });
    //     }
    // }

    guardarShippingInformation(marcacion: any, camion: any, destino: Destino, tipoInfo: string) {
        const cli = JSON.parse(localStorage.getItem('Usuario'));
        var information = new Information(
            marcacion,
            camion,
            destino,
            tipoInfo
        );
        this.guardarInformationSeleccionada(
            parseInt(cli.codigoPersona),
            JSON.stringify(information),
            tipoInfo
        ).subscribe(data => {
            console.log("1");
        });
    }

    public tropfilter = ['TROPICAL FLOWERS', 'FOLIAGE MAGIC'];

    public nameEmitter: EventEmitter<string> = new EventEmitter();

    //method to get question
    changeName(name: string) {
        this.nameEmitter.emit(name)
    }

    eventoSeleccionaCamionYPo: EventEmitter<void> = new EventEmitter<void>();
    eventoSeleccionaCamionYPoMixBox: EventEmitter<void> = new EventEmitter<void>();
    eventoEditaCajaMixta: EventEmitter<void> = new EventEmitter<void>();
    aumentarCajaMixta = false;

    dispararEventoCamionYPo() {
        this.eventoSeleccionaCamionYPo.emit();
    }

    dispararEventoCamionYPoMixBox() {
        this.eventoSeleccionaCamionYPoMixBox.emit();
    }

    dispararEditaCajaMixta() {
        this.eventoEditaCajaMixta.emit();
    }

    actualizarAumentarCajaMixta(value: string) {
        this.aumentarCajaMixta = value === 'mixBox' ? true : false
    }
}
