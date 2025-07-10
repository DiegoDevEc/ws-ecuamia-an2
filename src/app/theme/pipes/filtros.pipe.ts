import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Caja } from '../../app.modelsWebShop';

@Pipe({
  name: 'filtro'
})
export class FiltrosPipe implements PipeTransform {

  transform(items: any[], filter: any): any[] {

    if (filter === '') { return items };

    if (filter && Array.isArray(items)) {

      const filterKeys = Object.keys(filter);

      return items.filter(item => {
        return filterKeys.some((columnaArray) => {
          if (filter[columnaArray]) {
            const fil = filter[columnaArray].split(' ');
            let check = false;
            for (const f of fil) {
              if (new RegExp(f, 'gi').test(item[columnaArray]) || f === '') {
                check = true;
              } else {
                check = false;
                break;
              }
            }
            return check;
          } else {
            return true;
          }
        });
      });

    }
  }


}
