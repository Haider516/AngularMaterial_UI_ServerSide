import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';

const HttpOptions = {
  'headers': new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
//Api Product Via  Strapi


export interface Product {
  title: string; // Text
  slug: string; // UID
  description: string; // Rich text (Blocks)
  image: string; // Media URL
  category: Category; // Enumeration
  size: string; // Text
  color: Color; // Enumeration
  price: number; // Number
  availableQty: number; // Number
}

export enum Category {
  // Add your specific categories here
  Category1 = 'pen',
  Category2 = 'pencil',
  Category3 = 'pointer'
}

export enum Color {
  // Add your specific colors here
  Red = 'Red',
  Blue = 'Blue',
  Green = 'Green',
  Yellow = 'Yellow',
  Black = 'Black',
  White = 'White'
}

export interface ApiResponse {
  data: Product[];
  meta: {
    pagination: any;
  };
}

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  dataChange = new BehaviorSubject<Product[]>([]);

  get data(): Product[] { return this.dataChange.value; }

  constructor(private http: HttpClient) {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children
    const responsereceived = this.getProduct();
    console.log("treeFIle", responsereceived);

    // Notify the change.
    this.dataChange.next(responsereceived!);
  }


  // error :: Property 'data' does not exist on type 'Object'.

  getProduct() {

    let products;
    this.http
      .get<ApiResponse>("http://localhost:1337/api/products", {
        params: { populate: "*" },
      })
      .subscribe({
        next: (response: ApiResponse) => {
          // console.log('Full Response:', response);
          products = response.data;
          debugger
          //  console.log('Products:', products);
          //  return products;
          //   this.dataChange.next(products);
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
    return products;
  }


  // addProduct() {
  //   this.http.post<ApiResponse>("http://localhost:1337/api/products").

  // }

}