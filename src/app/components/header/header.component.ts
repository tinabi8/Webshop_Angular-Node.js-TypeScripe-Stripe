import { Component, Input, OnInit } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartComponent } from 'src/app/pages/cart/cart.component';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private _cart: Cart = { 
    items: [],
    next: (arg: { items: CartItem[] }) => {
      console.log('HeaderComponent next called with:', arg);
    }
  };
  
  
  itemsQuantity= 0;
  private _snackBar: any;
  @Input()
  get cart( ): Cart {
    return this._cart;
  }
  
  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
        .map((item) => item.quantity)
        .reduce((prev, current) => prev+ current, 0);
  }

  

  constructor(private cartService: CartService) { }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  ngOnInit(): void {
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }
  

}
