import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Destino, Marcacion } from 'src/app/app.modelsWebShop';

@Injectable({
    providedIn: 'root'
})
export class InformationService {
    
    private _phoneInfo: string;
    private _addressInfo: string;
    private _addressInfo2: string;
    private _cityInfo: string;
    private _stateInfo: string;
    private _zipInfo: string;
    private _nameInfo: string;

    private _dateInformation: string;

    private _dateConnection: string;
    private _marcacion: Marcacion;
    private _destino: Destino;
    private _aplicaDestinatarioPedidoCompleto: boolean = false;

    constructor() { }

    get dateInformation(): string {
        return this._dateInformation;
    }

    set dateInformation(value: string) {
        this._dateInformation = value;
    }

    get phoneInfo(): string {
        return this._phoneInfo;
    }

    set phoneInfo(value: string) {
        this._phoneInfo = value;
    }

    get addressInfo(): string {
        return this._addressInfo;
    }

    set addressInfo(value: string) {
        this._addressInfo = value;
    }

    get addressInfo2(): string {
        return this._addressInfo2;
    }

    set addressInfo2(value: string) {
        this._addressInfo2 = value;
    }

    get cityInfo(): string {
        return this._cityInfo;
    }

    set cityInfo(value: string) {
        this._cityInfo = value;
    }

    get stateInfo(): string {
        return this._stateInfo;
    }

    set stateInfo(value: string) {
        this._stateInfo = value;
    }

    get zipInfo(): string {
        return this._zipInfo;
    }

    set zipInfo(value: string) {
        this._zipInfo = value;
    }

    get nameInfo(): string {
        return this._nameInfo;
    }

    set nameInfo(value: string) {
        this._nameInfo = value;
    }

    get aplicaDestinatarioPedidoCompleto(): boolean {
        return this._aplicaDestinatarioPedidoCompleto;
    }

    set aplicaDestinatarioPedidoCompleto(value: boolean) {
        this._aplicaDestinatarioPedidoCompleto = value;
    }

    get dateConnection(): string {        
        if (!this._dateConnection) {
          const stored = localStorage.getItem('_ls_dateConecction');          
          if (stored) {
            const datePipe = new DatePipe('en-US');
            this._dateConnection = datePipe.transform(stored, 'MMM-dd-yyyy');
          }
        }
        return this._dateConnection;
    }

    set dateConnection(value: string) {
        const datePipe = new DatePipe('en-US');
        this._dateConnection = datePipe.transform(value, 'MMM-dd-yyyy');
        localStorage.setItem('_ls_dateConnection', value);
    }

    get marcacion(): Marcacion {
        if (!this._marcacion) {
            const stored = sessionStorage.getItem('Marcacion');
            if (stored) {
                this._marcacion = JSON.parse(stored);
            }
        }
        return this._marcacion;
    }

    set marcacion(value: Marcacion) {
        var json = JSON.stringify(value);
        sessionStorage.setItem('Marcacion', json);
    }

    get destino(): Destino {
        if (!this._destino) {
            const stored = sessionStorage.getItem('Destino');
            if (stored) {
                this._destino = JSON.parse(stored);
            }
        }
        return this._destino;
    }

    set destino(value: Destino) {
        var json = JSON.stringify(value);
        sessionStorage.setItem('Destino', json);
    }

}
