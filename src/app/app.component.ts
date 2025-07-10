import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { WebsocketService } from './websocket.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceSession } from './app.modelsWebShop';
import { AppService } from './app.service';
import { DeviceSessionService } from './device-session.service';
import { InactivityService } from './inactivity.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading = false;
  deviceInfo: any;
  deviceSession: any;

  public settings: Settings;
  constructor(public appSettings: AppSettings, public router: Router, private websocketService: WebsocketService,
    private inactivityService: InactivityService,
    private deviceService: DeviceDetectorService, public _appService: AppService, private deviceSessionService: DeviceSessionService) {
    this.settings = this.appSettings.settings;
  }

  /* @HostListener('window:beforeunload', ['$event'])
   clearLocalStorage(event: any) {
     console.log("Limpiando LocalStorage...");
     localStorage.clear();
   }*/

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(event.urlAfterRedirects != '/'){ 
          this.reconectar();
        }  
      }
    })
    //this.deviceinfo();
    
    // this.router.navigate(['']);  //redirect other pages to homepage on browser refresh    
  }


  public reconectar() {
    console.log("Reconectando Websocket...");

    const cliente: any = JSON.parse(localStorage.getItem('Usuario'));
    if (cliente) {
      this.deviceSessionService.deviceAndConectivity().then((session) => {
        this.deviceSession = session;
        this.deviceSession.typeMessage = 'RECONECTAR';
        this.deviceSession.user = cliente.codigoUsuario;
        this.websocketService.connect();
        this.websocketService.sendMessage(this.deviceSession);
      });
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    })
  }
}
