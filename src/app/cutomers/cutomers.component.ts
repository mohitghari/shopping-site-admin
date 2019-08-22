import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../firebase-auth.service';

@Component({
  selector: 'app-cutomers',
  templateUrl: './cutomers.component.html',
  styleUrls: ['./cutomers.component.css']
})
export class CutomersComponent implements OnInit {
  products:any[] = [];
  cartProducts:any[] = [];
  constructor(private auth:FirebaseAuthService) { }

  ngOnInit() {

    this.auth.getCartData().subscribe(
      data => {
        console.log('data', data);
        this.cartProducts = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          };
        })
      }
    );

    this.auth.getProducts().subscribe(data => {
      this.products = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      })
    });
  }
  addProductToUserCart(product){
    this.auth.addTocart(product);
  }
  logOut() {
    this.auth.logOut();
    //console.log(this.data);
  }

}
