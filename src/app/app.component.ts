import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from './models/cart.model';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  template: `
  <app-header [cart]="cart"></app-header>
  <router-outlet></router-outlet>
  `,
  styles: ['']
})
export class AppComponent implements OnInit {
  title = 'my-project';
  cart: Cart = { 
    items: [],
    next: (arg: { items: CartItem[] }) => {
      console.log('AppComponent next called with:', arg);
    }
  };

  constructor(private cartService: CartService) {

  }

  ngOnInit() {
    this.cartService.cart.subscribe((_cart) =>{
      this.cart = _cart;
    });

  }
}
