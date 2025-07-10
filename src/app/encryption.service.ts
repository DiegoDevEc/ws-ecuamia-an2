import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private key: string = 'your-secret-key'; // Define una clave secreta

  constructor() { }

  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.key).toString();
  }

  decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}