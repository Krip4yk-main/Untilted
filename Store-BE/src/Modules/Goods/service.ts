import { of, Observable } from 'rxjs';
import type { Good } from '../../Models/good.model.js';

export class GoodsService {
  public getGoods(): Observable<Good[]> {
    const mockGoods: Good[] = [
      {
        id: 1,
        name: 'Laptop',
        description: 'High-performance laptop',
        fullDescription: 'Detailed description of the high-performance laptop.',
        price: 1200,
        imageUrl: 'https://via.placeholder.com/150',
        count: 10,
        priceHistory: [{ price: 1200, date: new Date().toISOString() }]
      },
      {
        id: 2,
        name: 'Smartphone',
        description: 'Latest model smartphone',
        fullDescription: 'Detailed description of the latest model smartphone.',
        price: 800,
        imageUrl: 'https://via.placeholder.com/150',
        count: 20,
        priceHistory: [{ price: 800, date: new Date().toISOString() }]
      }
    ];
    return of(mockGoods);
  }
}

export const goodsService = new GoodsService();
