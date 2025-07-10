import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ambiente } from './app.modelsWebShop';
import { DeleteComponent } from './pages/popus/delete/delete.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  public socket$: WebSocketSubject<any>;
  public isConnected: boolean = false;

  constructor(public dialog: MatDialog, public router: Router) { }

  ngOnDestroy() {
    this.close();
   // localStorage.clear();
  }

  public connect(): void {
  //  if (this.isConnected) {
  //    console.warn('A connection is already established.');
  //    return;
   // }

    this.socket$ = webSocket(ambiente.urlSocket);

    this.socket$.subscribe(
      (message) => this.onMessage(message),
      (err) => this.onError(err)
      //,
      //() => this.onComplete()
    );

    this.isConnected = true;
    console.log('WebSocket connection established.');
  }

  private onMessage(message: any): void {
    console.log('Received message:', message);
    if (typeof message === 'string' && message.startsWith('Error:')) {
      this.isConnected = false;
      throw new Error(message);
    }

    // Verifica si el mensaje indica que otro usuario ha iniciado sesión
    if (typeof message.message === 'string' &&  message.message.startsWith('replaceUser :')) {
     // this.isConnected = false;

 
      localStorage.removeItem("usuario");
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate([""])

      console.log("Error: Estas logueado en otro dispositivo.");

      // Abre el diálogo informando al usuario
      const dialogRef = this.dialog.open(DeleteComponent, {
        data: {
          titulo: 'Session Ended',
          mensaje: 'Your session has ended, which could be due to the following reasons:',
          items: [
            'Another user signed in with the same credentials.',
            'The session has been idle beyond the time limit.'
          ],
          mensajeDos: 'If you suspect improper or fraudulent use of your credentials, or if you need to add more users, please contact your administrator. Otherwise, you can log back in at any time.',
          starbuttons: "L"
        },
        panelClass: 'delete-boxes'
      });
      dialogRef.afterClosed().subscribe(result => {
       
        this.router.navigate([""])
      });
    }


  }

  private onError(err: any): void {
    console.error('WebSocket error:', err);
    this.isConnected = false;  // Reset connection state on error
    throw new Error('WebSocket connection error');
  }

  //private onComplete(): void {
  //  console.warn('WebSocket connection closed.');
  //  this.isConnected = false;  // Reset connection state on close
 // }

  public sendMessage(message: any): void {
    if (this.isConnected) {
      this.socket$.next(message);
    } else {
      console.warn('Cannot send message, WebSocket is not connected.');
    }
  }

  public close(): void {
    if (this.isConnected) {
      this.socket$.complete();
      this.isConnected = false;
      localStorage.clear();
      sessionStorage.clear();
      console.log('WebSocket connection closed by client.');
    }
  }


}
