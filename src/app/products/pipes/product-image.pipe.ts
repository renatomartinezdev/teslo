import { Pipe, PipeTransform } from '@angular/core';
import {environment} from 'src/environments/environment'

const baseUrl = environment.baseUrl

@Pipe({
  name: 'productImage'  // Este será el nombre del pipe que usarás en las plantillas
})
export class ProductImagePipe implements PipeTransform {


  transform(value: string | string[]): string {

    if(typeof value === 'string'){
      return `${baseUrl}/files/product/${value}`
    }

    const image = value.at(0)

    if(!image){
      return './assets/images/noImage.avif'
    }

    return `${baseUrl}/files/product/${image}`
  }
}
