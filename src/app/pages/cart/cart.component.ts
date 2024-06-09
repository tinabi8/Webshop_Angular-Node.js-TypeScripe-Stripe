import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [{
    product: 'http://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 1,
    id: 1,
    },
    {
    product: 'http://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 1,
    id: 2,
    },
  ],
  next: (arg: { items: CartItem[] }) => {
    console.log('CartComponent next called with:', arg);
  }
};

  dataSource: Array<CartItem> = [];
  displayedColumns : Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ]

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.dataSource = this.cart.items;
      this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
    });
  }
  
  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFormCart(item: CartItem): void{
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void{
    this.cartService.addToCart(item);
  }
  onReQuantity(item: CartItem): void{
    this.cartService.removeQuantity(item);
  }
  async onCheckout(): Promise<void>  { 

    try {
      const res: any = await this.http.post('http://localhost:4242/checkout', { 
        items: this.cart.items
      }).toPromise(); 

      const stripe = await loadStripe(environment.STRIPE_SECRET_KEY); 
      stripe?.redirectToCheckout({
        sessionId: res.id
      });
    } catch (error) {
      console.error('Error during checkout:', error);
    }
}}
