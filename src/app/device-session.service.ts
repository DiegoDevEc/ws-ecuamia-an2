import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeviceSession } from './app.modelsWebShop';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs-compat';

@Injectable({
  providedIn: 'root'
})
export class DeviceSessionService {

  private deviceSession: DeviceSession;

  constructor(private http: HttpClient, private deviceService: DeviceDetectorService) { }

  public getIPAddress(): Observable<any> {
    return this.http.get('https://api.ipify.org?format=json');
  }


  public deviceAndConectivity(): Promise<DeviceSession> {
    return new Promise((resolve, reject) => {
      const deviceInfo = this.deviceService.getDeviceInfo();
      
      this.getIPAddress().subscribe((res: any) => {
        let deviceSession = new DeviceSession();
        deviceSession.typeDevice = (this.deviceService.isMobile() ? 'Teléfono' : 'PC/Tablet');
        deviceSession.device = deviceInfo.device;
        deviceSession.os = deviceInfo.os;
        deviceSession.osVersion = deviceInfo.os_version;
        deviceSession.browser = deviceInfo.browser;
        deviceSession.browserVersion = deviceInfo.browser_version;
        deviceSession.ip = res.ip;

        resolve(deviceSession);
      }, (error) => {
        reject(error);
      });
    });
  }
}
