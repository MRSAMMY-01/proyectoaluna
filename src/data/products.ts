export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  category: string;
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Vestido Floral Embarazo',
    price: 24990,
    image: 'https://images.pexels.com/photos/4918030/pexels-photo-4918030.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    images: [
      'https://images.pexels.com/photos/4918030/pexels-photo-4918030.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4918032/pexels-photo-4918032.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4918035/pexels-photo-4918035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ],
    description: 'Vestido largo fluido con estampado floral, ideal para el segundo y tercer trimestre.',
    category: 'Vestidos',
  },
  {
    id: 'p2',
    name: 'Maxi Dress Elegante',
    price: 29990,
    image: 'https://images.pexels.com/photos/4918046/pexels-photo-4918046.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    images: [
      'https://images.pexels.com/photos/4918046/pexels-photo-4918046.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4918049/pexels-photo-4918049.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ],
    description: 'Maxi dress de tela suave que se adapta a tu cuerpo durante toda la gestación.',
    category: 'Vestidos',
  },
  {
    id: 'p3',
    name: 'Blazer Maternal Tan',
    price: 32990,
    image: 'https://images.pexels.com/photos/9267513/pexels-photo-9267513.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    images: [
      'https://images.pexels.com/photos/9267513/pexels-photo-9267513.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/9267511/pexels-photo-9267511.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ],
    description: 'Blazer de corte moderno para un look elegante y profesional durante el embarazo.',
    category: 'Abrigos',
  },
  {
    id: 'p4',
    name: 'Vestido Blanco Clásico',
    price: 27990,
    image: 'https://images.pexels.com/photos/8693642/pexels-photo-8693642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    images: [
      'https://images.pexels.com/photos/8693642/pexels-photo-8693642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/8693638/pexels-photo-8693638.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ],
    description: 'Vestido blanco clásico con corte imperial, perfecto para sesiones de fotos y eventos.',
    category: 'Vestidos',
  },
  {
    id: 'p5',
    name: 'Vestido Rosa Bosque',
    price: 25990,
    image: 'https://images.pexels.com/photos/5824634/pexels-photo-5824634.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    images: [
      'https://images.pexels.com/photos/5824634/pexels-photo-5824634.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/5824641/pexels-photo-5824641.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ],
    description: 'Vestido azul fluido inspirado en la naturaleza, cómodo y fresco para días especiales.',
    category: 'Vestidos',
  },
  {
    id: 'p6',
    name: 'Blazer Blanco Maternidad',
    price: 34990,
    image: 'https://images.pexels.com/photos/12702885/pexels-photo-12702885.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    images: [
      'https://images.pexels.com/photos/12702885/pexels-photo-12702885.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/12702875/pexels-photo-12702875.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/12702876/pexels-photo-12702876.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ],
    description: 'Blazer blanco de corte amplio, versátil para combinar con tus looks de maternidad.',
    category: 'Abrigos',
  },
];

export const ADMIN_PASSWORD = 'aluna2024';
export const WHATSAPP_NUMBER = '56998944867';
export const STORAGE_KEY = 'aluna_products';
export const AUTH_KEY = 'aluna_admin_auth';
