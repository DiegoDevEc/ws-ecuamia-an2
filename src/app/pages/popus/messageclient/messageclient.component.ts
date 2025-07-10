import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { AppService } from 'src/app/app.service';
import { MensajeCliente, Filtro, ClienteDTO, Caja } from 'src/app/app.modelsWebShop';



@Component({
  selector: 'app-messageclient',
  templateUrl: './messageclient.component.html',
  styleUrls: ['./messageclient.component.scss']
})
export class MessageclientComponent implements OnInit {
  public pushnumber: number = 1
  public inputFiltro = [1]
  public messageForm
  public mensajeDescripcion: Array<MensajeCliente> = []
  public listaFiltros: Filtro[];
  public listaVariedad = []
  public resultadoVariedad = []

  //variables para recuprerar la data del mensaje
  public quantity: number = null
  public flowerType: string = ""
  public variety: string = ""
  public observation: string = ""


  constructor(public appService: AppService, public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<MessageclientComponent>) {
  }

  ngOnInit() {

    setTimeout(() => {
      this.obtenerTipoFlor();
    }, 20)

  }


  public agregarFiltroInput() {

    if (this.quantity == null || this.quantity == undefined) {
      return
    }
    if (this.flowerType == "") {
      return
    }
    if (this.variety == "") {
      return
    }

    var user: ClienteDTO = JSON.parse(localStorage.getItem('Usuario'));
    this.mensajeDescripcion.push({
      usuario: user.nombre,
      cantidad: this.quantity,
      tipocaja: this.flowerType,
      variedad: this.variety,
      observacion: this.observation
    });
    this.quantity = null
    this.flowerType = ""
    this.variety = ""
    this.observation = ""
    this.pushnumber = this.pushnumber + 1
    this.inputFiltro.push(this.pushnumber)

  }

  public enviarMensaje() {
    if (this.mensajeDescripcion.length == 0) {
      return
    }
    var datos
    this.mensajeDescripcion[0].observacion += ' (message from florexsales.com)';
    datos = JSON.parse(JSON.stringify(this.mensajeDescripcion))
    this.appService.postEnviarMensajeCliente(datos).subscribe(
      (data: any) => {
        this.dialogRef.close()
        this.snackBar.open('Confirmation:Message sent succesfully !', '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
      },
      (err: any) => {
        if (err.status === 404) {
          this.snackBar.open('Error: Could not connect to server, try later', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }
        else if (err.status === 401) {
          this.snackBar.open('Error: Could not connect to server, try later', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }
        else {
          this.snackBar.open('Error: Could not connect to server, try later', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }

      });
  }


  public obtenerTipoFlor() {
    this.appService.getProductosFiltrosJson().subscribe(data => {
      this.listaFiltros = data.sort(function (a, b) {
        return a.valor.localeCompare(b.valor);
      });
    })
  }

  public seleccionaTipoFlor(event, index) {

    this.resultadoVariedad = []
    // this.appService.getProductosWebShop('120' , '20230610'  , 'ROSES' , 1 , 24).subscribe(data => {
    //   const cajas: Caja[] = JSON.parse(data.json);
    //   this.listaVariedad = cajas.filter(x => x.variedades.find(y => y.producto == event))

    //   for (var variedad of this.listaVariedad) {
    //     this.resultadoVariedad.push(variedad.variedades[0].nombreVariedad)
    //   }
    //   var hash = {};
    //   this.resultadoVariedad = this.resultadoVariedad.filter(function (current) {
    //     var exists = !hash[current] || false;
    //     hash[current] = true;
    //     return exists;
    //   });
    // });
  }


}


