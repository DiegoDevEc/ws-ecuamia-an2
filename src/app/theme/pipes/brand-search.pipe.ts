import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'buscarProducto', pure: false })

export class BrandSearchPipe implements PipeTransform {

  transform(items: any[], texto: string, columnaBuscar: string): any[] {

    
    let searchText = new RegExp(texto, 'ig');

    if (items) {
      return items.filter(item => {
        if (item) {
          return item[columnaBuscar].search(searchText) !== -1;
        }
      });
    }
  }

}