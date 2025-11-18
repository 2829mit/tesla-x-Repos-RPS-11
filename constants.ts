import type { PaintOption, WheelOption, InteriorOption, PerformanceSpec, TrimOption, AccessoryOption, ChargingOption, AccessoryPackOption, IotOption, TankOption, WarrantyOption } from './types';

export const BASE_PRICE = 3500000;
export const BASE_FINANCE_PER_MONTH = 48000;

export const TRIM_OPTIONS: TrimOption[] = [
  { 
    id: 'rwd', 
    name: 'Basic Nozzle', 
    drive: 'Already Included', 
    price: 0, 
    financePerMonth: 0,
    specs: [
      { value: '420km', label: 'Range (WLTP)' },
      { value: '217km/h', label: 'Top Speed' },
      { value: '6.9sec', label: '0-100 km/h' },
    ],
    imageUrl: 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1763010429/15_a79ols.png',
  },
  { 
    id: 'lr', 
    name: '1 RFID Nozzle', 
    drive: '50 RFID Tags', 
    price: 30000, 
    financePerMonth: 7000,
    specs: [
      { value: '500km', label: 'Range (WLTP)' },
      { value: '217km/h', label: 'Top Speed' },
      { value: '5.0sec', label: '0-100 km/h' },
    ],
    imageUrl: 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1763010390/14_sdtrkr.png',
  },
  { 
    id: 'lr-awd', 
    name: '2 RFID Nozzle', 
    drive: '100 RFID Tags', 
    price: 50000, 
    financePerMonth: 12000,
    specs: [
      { value: '500km', label: 'Range (WLTP)' },
      { value: '217km/h', label: 'Top Speed' },
      { value: '5.0sec', label: '0-100 km/h' },
    ],
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
  },
  { 
    id: 'p-awd', 
    name: 'Performance', 
    drive: 'All-Wheel Drive', 
    price: 1700000, 
    financePerMonth: 23000,
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

export const IOT_OPTIONS: IotOption[] = [
  { id: 'iot-controller', name: 'Repos IOT Controller', price: 0, subtext: 'Already Included' },
  { id: 'fuel-sensors', name: 'Fuel Level sensors', price: 0, subtext: 'Already Included' },
  { id: 'cctv', name: 'CCTV Camera', price: 0, subtext: 'Already Included' },
];

export const REPOS_OS_OPTIONS: AccessoryOption[] = [
  { id: 'reports-analytics', name: 'Reports & Analytics', price: 0 },
  { id: 'operator-manager-apps', name: 'Operator & Manager Apps', price: 0 },
  { id: 'real-time-inventory', name: 'Real-time Fuel Level Inventory', price: 0 },
  { id: 'erp-integration', name: 'ERP Integration', price: 30000 },
];

export const DECANTATION_OPTIONS: IotOption[] = [
  { id: 'advanced-skid', name: 'Advanced Skid', subtext: 'Flow meter Included', price: 25000 },
  { id: 'basic-skid', name: 'Basic Skid', subtext: 'Already Included', price: 0 },
];

export const SAFETY_UNIT_OPTIONS: AccessoryOption[] = [
  { id: 'leak-detection', name: 'Leak Detection System', price: 0 },
  { id: 'overfill-sensors', name: 'Overfill Sensors', price: 0 },
  { id: 'decantation-cutoff', name: 'Decantation Cutoff', price: 0 },
  { id: 'flame-proof-illumination', name: 'Flame Proof Illumination', price: 0 },
  { id: 'glasswood-shield', name: 'Glasswood Shield', price: 0 },
];

export const TANK_OPTIONS: TankOption[] = [
  { id: '22kl', name: '22KL' },
  { id: '30kl', name: '30KL' },
  { id: '45kl', name: '45KL' },
  { id: '60kl', name: '60KL' },
];

export const CONSUMPTION_OPTIONS: string[] = [
  '50-100KL',
  '100-200KL',
  '200-300KL',
  '300-1000KL',
];

export const WARRANTY_OPTIONS: WarrantyOption[] = [
  { id: 'limited-1-year', name: 'Limited 1 Year', price: 0 },
  { id: '1-year-amc', name: '1 Year AMC', price: 25000 },
  { id: '2-year-amc', name: '2 Year AMC', price: 30000 },
];

export const ACCESSORY_OPTIONS: AccessoryOption[] = [
  { id: 'crash-barrier', name: 'Crash Barrier', price: 60000 },
  { id: 'fire-Suppression', name: 'Fire Suppression', price: 75000 },
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
    id: 'crash-barrier-pack', 
    name: 'Crash Barrier', 
    price: 350000, 
    imageUrl:'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1763010390/14_sdtrkr.png',
    description: 'Enhanced safety package including a robust crash barrier for front-end protection.'
  },
  { 
    id: 'fire-extinguisher-pack', 
    name: 'Fire Suppression Systmem', 
    price: 280000, 
     imageUrl:'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1763010429/15_a79ols.png',
    description: 'Safety-focused package featuring an integrated fire extinguisher for emergency situations.'
  },
];


export const DESTINATION_FEE = 125000;
export const ORDER_FEE = 25000;