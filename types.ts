export interface PerformanceSpec {
  value: string;
  label: string;
}

export interface TrimOption {
  id: 'rwd' | 'lr' | 'lr-awd' | 'p-awd';
  name: string;
  drive: string;
  price: number;
  financePerMonth: number;
  specs: PerformanceSpec[];
  imageUrl?: string;
}

export interface PaintOption {
  id: 'stealth-grey' | 'pearl-white' | 'diamond-black' | 'ultra-red';
  name: string;
  price: number;
  colorCode: string;
  imageUrls: {
    [key in TrimOption['id']]: string | string[];
  };
}

export interface WheelOption {
  id: 'gemini' | 'induction';
  name: string;
  price: number;
  imageUrl: string;
  closeUpImageUrl: string;
}

export interface InteriorOption {
  id: 'black' | 'white';
  name: string;
  price: number;
}

export interface AccessoryOption {
  id: string;
  name: string;
  price: number;
}

export interface ChargingOption {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface AccessoryPackOption {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface SavedBuild {
  id: string;
  name: string;
  imageUrl: string;
  finalPrice: number;
  config: {
    selectedTrim: TrimOption;
    selectedPaint: PaintOption;
    selectedWheels: WheelOption;
    selectedInterior: InteriorOption;
    selectedAccessories: AccessoryOption[];
    selectedCharging: ChargingOption[];
    selectedPacks: AccessoryPackOption[];
  };
}