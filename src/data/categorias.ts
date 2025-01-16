import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const categorias = [
  {
    id: 'historia',
    name: 'Historia y Cultura',
    icon: { library: Ionicons, name: 'color-palette', size: 30, color: '#F26F25' },
    subcategories: [
      { name: 'Arquitectura Colonial', icon: 'home' , background: '#FFD700' },
      { name: 'Iglesias', icon: 'church', background: '#FF6347' },
      { name: 'Monumentos', icon: 'monument', background: '#FF4500' },
      { name: 'Museos', icon: 'museum', background: '#FF69B4' },
      
    ],
  },
  {
    id: 'naturaleza',
    name: 'Naturaleza y Aventura',
    icon: { library: Ionicons, name: 'leaf', size: 30, color: '#9400D3' },
    subcategories: [
      { name: 'Miradores', icon: 'binoculars', background: '#32CD32' },
      { name: 'Haciendas', icon: 'water', background: '#1E90FF' },
      { name: 'Parques Naturales', icon: 'tree', background: '#228B22' }, 
      { name: 'Ríos y Cascadas', icon: 'water', background: '#1E90FF' },
    ],
  },
  {
    id: 'gastronomia',
    name: 'Gastronomía Local',
    icon: { library: MaterialIcons, name: 'restaurant', size: 30, color: '#00FFFF' },
    subcategories: [
      { name: 'Restaurantes', icon: 'restaurant', background: '#FF6347' },
      { name: 'Cafeterías', icon: 'local-cafe', background: '#A52A2A' },
      { name: 'Heladerías', icon: 'local-ice-cream', background: '#FFD700' },
      { name: 'Mercado y Plazas', icon: 'local-grocery-store', background: '#32CD32' },
    ],
  },
  {
    id: 'entretenimiento',
    name: 'Entretenimiento y Vida Nocturna',
    icon: { library: FontAwesome, name: 'glass', size: 30, color: '#F9715D' },
    subcategories: [
      { name: 'Bares', icon: 'glass', background: '#FF6347' },
      { name: 'Discotecas', icon: 'music', background: '#FFD700' },
      { name: 'Teatros', icon: 'theater', background: '#1E90FF' },
      { name: 'Cines', icon: 'film', background: '#32CD32' },
    ],
  },
];
