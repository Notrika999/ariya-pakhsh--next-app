export interface Product {
  id: number;
  title: string;
  image: string;
  imageSlider: [];
  brandId: number;
  discount: string;
  price: number;
  oldPrice: number;
  rating: number;
  colors: string[];
  href: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface ProductResponse {
  products: Product[];
  brands: Brand[];
}

export interface ApiError {
  error: true;
  message: string;
}
