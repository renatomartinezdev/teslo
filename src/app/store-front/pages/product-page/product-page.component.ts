import { ProductService } from '@/products/services/products.service';
import { Component,inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarouselComponent } from "../../../products/components/product-carousel/product-carousel.component";


@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html'
})
export class ProductPageComponent {
  /*rxResource*/
  /**
   1️⃣ Toma el idSlug de la URL (el identificador del producto).
   2️⃣ Hace una consulta a la API para traer la información del producto.
   3️⃣ Guarda el resultado en productResource, listo para ser usado en la pantalla.
   */
  //permite acceder a la informacion de la ruta en la que se encuantra el usuario
  activatedRoute = inject(ActivatedRoute)

  productService = inject(ProductService)

  //obtenemos el valor del parametro idSlug de la url actual
  productIdSlug = this.activatedRoute.snapshot.params['idSlug']

  productResource = rxResource({
    //Cuando necesites el producto, usa este idSlug como identificador"
    request: () => ({idSlug: this.productIdSlug}),
    //Pedimos el producto a la API
    loader:({request}) => {
      return this.productService.getProductByIdSlug(request.idSlug)
    }
  })

}
