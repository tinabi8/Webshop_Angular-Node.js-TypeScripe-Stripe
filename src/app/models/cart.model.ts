export interface Cart {
    items: CartItem[];
    next: (arg: { items: CartItem[] }) => void;
  }


export interface CartItem {
    product: string;
    name: string;
    price: number;
    quantity: number;
    id: number;
}