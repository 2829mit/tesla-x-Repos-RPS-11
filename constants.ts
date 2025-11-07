import type { PaintOption, WheelOption, InteriorOption, PerformanceSpec, TrimOption, AccessoryOption, ChargingOption, AccessoryPackOption } from './types';

export const TRIM_OPTIONS: TrimOption[] = [
  { 
    id: 'rwd', 
    name: 'Standard', 
    drive: 'Rear-Wheel Drive', 
    price: 3500000, 
    financePerMonth: 48000,
    specs: [
      { value: '420km', label: 'Range (WLTP)' },
      { value: '217km/h', label: 'Top Speed' },
      { value: '6.9sec', label: '0-100 km/h' },
    ]
  },
  { 
    id: 'lr', 
    name: 'Premium', 
    drive: 'Rear-Wheel Drive', 
    price: 4000000, 
    financePerMonth: 55000,
    specs: [
      { value: '515km', label: 'Range (WLTP)' },
      { value: '217km/h', label: 'Top Speed' },
      { value: '5.0sec', label: '0-100 km/h' },
    ]
  },
  { 
    id: 'lr-awd', 
    name: 'Premium', 
    drive: 'All-Wheel Drive', 
    price: 4400000, 
    financePerMonth: 60000,
    specs: [
      { value: '500km', label: 'Range (WLTP)' },
      { value: '217km/h', label: 'Top Speed' },
      { value: '5.0sec', label: '0-100 km/h' },
    ]
  },
  { 
    id: 'p-awd', 
    name: 'Performance', 
    drive: 'All-Wheel Drive', 
    price: 5200000, 
    financePerMonth: 71000,
    specs: [
      { value: '321mi', label: 'Range (EPA est.)' },
      { value: '125mph', label: 'Top Speed' },
      { value: '6.8sec', label: '0-60 mph' },
    ]
  },
];


export const PAINT_OPTIONS: PaintOption[] = [
  { 
    id: 'stealth-grey', 
    name: 'Stealth Grey', 
    price: 0, 
    colorCode: 'bg-gray-600', 
    imageUrls: {
      'rwd': 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1762515708/halfrps_gonsz4.png',
      'lr': 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1762515708/halfrps_gonsz4.png',
      'lr-awd': 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
      'p-awd': 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
    }
  },
  { 
    id: 'pearl-white', 
    name: 'Pearl White Multi-Coat', 
    price: 100000, 
    colorCode: 'bg-gray-100', 
    imageUrls: {
      'rwd': 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1762515708/halfrps_gonsz4.png',
      'lr': 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1762515708/halfrps_gonsz4.png',
      'lr-awd': 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
      'p-awd': 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
    } 
  },
  { 
    id: 'diamond-black', 
    name: 'Diamond Black', 
    price: 150000, 
    colorCode: 'bg-black', 
    imageUrls: {
      'rwd': 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1762515708/halfrps_gonsz4.png',
      'lr': 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1762515708/halfrps_gonsz4.png',
      'lr-awd': 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
      'p-awd': 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
    } 
  },
  { 
    id: 'ultra-red', 
    name: 'Ultra Red', 
    price: 200000, 
    colorCode: 'bg-red-700', 
    imageUrls: {
      'rwd': 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1762515708/halfrps_gonsz4.png',
      'lr': 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1762515708/halfrps_gonsz4.png',
      'lr-awd': 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
      'p-awd': 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
    } 
  },
];

export const WHEEL_OPTIONS: WheelOption[] = [
  { 
    id: 'gemini', 
    name: '19" Gemini Wheels', 
    price: 0, 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtZq7Hvs4vqO2006_avH4wH2Cx9n0R0qU6LA&s', 
     closeUpImageUrl: 'https://stimg.cardekho.com/images/car-images/large/Tesla/Model-Y/6390/1752498018984/Diamond-Black_0a0a0d.jpg?impolicy=resize&imwidth=420'
  },
  { 
    id: 'induction', 
    name: '20" Induction Wheels', 
    price: 150000, 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtZq7Hvs4vqO2006_avH4wH2Cx9n0R0qU6LA&s', 
    closeUpImageUrl: 'https://stimg.cardekho.com/images/car-images/large/Tesla/Model-Y/6390/1752498018984/Diamond-Black_0a0a0d.jpg?impolicy=resize&imwidth=420' 
  },
];

export const INTERIOR_OPTIONS: InteriorOption[] = [
  { id: 'black', name: 'All Black', price: 0 },
  { id: 'white', name: 'Black and White', price: 100000 },
];

export const ACCESSORY_OPTIONS: AccessoryOption[] = [
  { id: 'console-trays', name: 'Center Console Trays', price: 3000 },
  { id: 'projection-lights', name: 'Projection Lights', price: 5000 },
  { id: 'trunk-liner', name: 'All-Weather Rear Trunk + Seatback Liner', price: 20000 },
  { id: 'interior-liners', name: 'All-Weather Interior Liners', price: 25000 },
  { id: 'roof-rack', name: 'Roof Rack', price: 50000 },
];

export const CHARGING_OPTIONS: ChargingOption[] = [
    {
      id: 'home-charger-1',
      name: 'Home Charger',
      price: 40000,
      description: 'Up to 70 km range /hr, install required',
      imageUrl: 'https://digitalassets-shop.tesla.com/image/upload/f_auto,q_auto/v1/content/dam/tesla/CAR_ACCESSORIES/MODEL_3/CHARGING_ADAPTERS/WC_ConfigV4.png?&'
    },
    {
      id: 'home-charger-2',
      name: 'Home Charger',
      price: 40000,
      description: 'Up to 70 km range /hr, install required',
      imageUrl: 'https://digitalassets-shop.tesla.com/image/upload/f_auto,q_auto/v1/content/dam/tesla/CAR_ACCESSORIES/MODEL_3/CHARGING_ADAPTERS/WC_ConfigV4.png?&'
    }
];

export const ACCESSORY_PACK_OPTIONS: AccessoryPackOption[] = [
  { 
    id: 'explorer', 
    name: 'Explorer Pack', 
    price: 350000, 
    imageUrl:'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
    description: 'Freedom for all. With eight seats as standard and best-in-class space. Options of seven seats and five seats for ultimate versatility.'
  },
  { 
    id: 'adventure', 
    name: 'Adventure Pack', 
    price: 280000, 
     imageUrl:'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
    description: 'Built for the wild. Includes expedition roof rack, an integrated air compressor, and a side-mounted gear carrier for all your equipment.'
  },
];


export const DESTINATION_FEE = 125000;
export const ORDER_FEE = 25000;