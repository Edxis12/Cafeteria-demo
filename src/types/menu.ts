export type Category = 'todos' | 'cafe' | 'metodos' | 'reposteria' | 'bebidas-frias';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  tags?: string[]; 
  popular?: boolean;
}