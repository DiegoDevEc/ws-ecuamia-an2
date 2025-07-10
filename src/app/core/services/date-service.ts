import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private horarioDeEcuador: Date;
  private dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private datePipe: DatePipe) {
    this.horarioDeEcuador = new Date();
    this.horarioDeEcuador.setHours(this.horarioDeEcuador.getHours() - 5); // Ajuste Ecuador
  }

  getDiaSemanaActual(): string {
    return this.dias[this.horarioDeEcuador.getDay()];
  }

  getHoraActual(): number {
    return this.horarioDeEcuador.getHours();
  }

  getMinutoActual(): number {
    return this.horarioDeEcuador.getMinutes();
  }

  calcularFechaEntrega(usuarioCodigoClientePadre: number): string {
    let fecha = new Date(this.horarioDeEcuador);
    const diaSemana = this.getDiaSemanaActual();

    if (usuarioCodigoClientePadre === 1940) {
      if (['Sunday', 'Monday', 'Tuesday'].includes(diaSemana)) {
        fecha.setDate(fecha.getDate() + 4);
      } else {
        fecha.setDate(fecha.getDate() + 5);
      }
    } else {
      if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(diaSemana)) {
        fecha.setDate(fecha.getDate() + 3);
      } else if (diaSemana === 'Saturday') {
        fecha.setDate(fecha.getDate() + 5);
      } else if (diaSemana === 'Sunday') {
        fecha.setDate(fecha.getDate() + 4);
      }
    }

    return this.datePipe.transform(fecha, 'yyyy-MM-dd')!;
  }

  formatearFecha(fecha: Date | string, formato: string = 'yyyy-MM-dd'): string {
    return this.datePipe.transform(new Date(fecha), formato)!;
  }
}
