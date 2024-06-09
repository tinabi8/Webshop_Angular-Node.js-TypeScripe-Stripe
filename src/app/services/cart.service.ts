import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ 
    items: [],
    next: (arg: { items: CartItem[] }) => {
      console.log('CartService next called with:', arg);
    }
  });
  private _snackBar: any;

  constructor(private snackBar: MatSnackBar) { }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items]

    const itemInCart = items.find((_item) => _item.id === item.id)
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ 
      items, 
      next: (arg: { items: CartItem[] }) => {
        console.log('CartService next called with:', arg);
      }
    });
    this.snackBar.open('1 item added to cart.', 'ok',{ duration: 3000});  
  }
  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;
    let filteredItems = this.cart.value.items.map((_item)=>{
      if(_item.id === item.id) {
        _item.quantity--;
        if(_item.quantity === 0) {
          itemForRemoval =_item;
        }
      }
      return _item; 
      
    });
    if (itemForRemoval) {
      this.removeFromCart(itemForRemoval, false)
    }
    this.cart.next({
      items: filteredItems,
      next: function (arg: { items: CartItem[]; }): void {
        throw new Error('Function not implemented.');
      }
    });
    this._snackBar.open('1 item removed from cart', 'ok',{
      duration: 3000

    })

  }

  getTotal(items: Array<CartItem>): number {
    return items.
    map((item) => item.price * item.quantity)
    .reduce((prev, current) => prev +current, 0)
  }

  clearCart(): void {
    this.cart.next({
      items: [], 
      next: (arg: { items: CartItem[] }) => {
        console.log('CartService next called with:', arg);
      }
    });
    this._snackBar.open('Cart is cleared.','ok',{
      duration: 3000
    });

  }
  removeFromCart(item: CartItem, update = true): Array<CartItem> { 
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );
    if(update){ 
    this.cart.next({ 
      ...this.cart.value,
      items: filteredItems
    }); 
    this.snackBar.open('1 item removed from cart.', 'ok', { 
      duration: 3000
    });
    }
    return filteredItems;
  }  
}
