
import { CONSUMPTION_OPTIONS } from '../constants';
import { TankOption, AccessoryOption, DispensingUnitOption, SafetyUpgradeOption, IotOption } from '../types';

export const getRecommendedTankId = (consumption: string): TankOption['id'] => {
  const index = CONSUMPTION_OPTIONS.indexOf(consumption);
  if (index === 0) return '22kl'; // 50-100KL
  if (index === 1) return '30kl'; // 100-200KL
  if (index === 2) return '45kl'; // 200-300KL
  if (index === 3) return '60kl'; // 300-1000KL
  return '22kl';
};

export const getVisualizerLayers = (
  tank: TankOption['id'],
  mechanicalOptions: AccessoryOption[],
  dispensingUnits: DispensingUnitOption[],
  safetyUnits: AccessoryOption[],
  safetyUpgrades: SafetyUpgradeOption[],
  decantation: IotOption[] = [] // Default to empty array
): string[] => {
    const layers: string[] = [];
    const isSmallTank = tank === '22kl' || tank === '30kl';
    
    // 1. Base Tank Layer
    if (isSmallTank) {
         layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764569016/30kl_Tank_n5ydhj.png');
    } else {
         layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764569016/60kl_Tank_axa7sm.png');
    }

    // 2. Dispensing Units (Single DU)
    // Rendered before accessories so accessories can overlap if needed
    const hasSingleDU = dispensingUnits.some(du => du.id === 'single-du');
    if (hasSingleDU) {
        if (isSmallTank) {
            layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764846286/2rfid-30_rodi0u.png');
        } else {
            layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764846277/2rfid-60_yinrl4.png');
        }
    }

    // 3. Decantation - Advanced Skid
    // Check array for 'advanced-skid'
    if (decantation.some(d => d.id === 'advanced-skid')) {
         layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764438688/Flowmeter_additional_skid_rxrbz5.png');
    }

    // 4. Safety Units
    // IoT Controller
    if (safetyUnits.some(o => o.id === 'iot-controller-safety')) {
         layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764438688/IOT_controller_jytcne.png');
    }

    // 5. Safety Upgrades
    // Crash Barrier
    if (safetyUpgrades.some(o => o.id === 'crash-barrier')) {
        if (isSmallTank) {
            layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764850226/crash-30_r7qmus.png');
        } else {
            layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764850225/60-crash_glxekq.png');
        }
    }
    
    // Fire Suppression System
    if (safetyUpgrades.some(o => o.id === 'fire-suppression')) {
        layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764850635/firesupp_uqa5mh.png');
    }

    // 6. Mechanical Inclusions - Overlays (Superimposed on top of everything)
    // Flame Proof Illumination
    if (mechanicalOptions.some(o => o.id === 'flame-proof-illumination')) {
        layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764438687/flameproof_light_htefu8.png');
    }
    // Filtration Mechanism
    if (mechanicalOptions.some(o => o.id === 'filtration-mechanism')) {
        layers.push('https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764438688/Filteration_mechanism_ucoqse.png');
    }

    return layers;
};

// Deprecated single-image helper kept for backward compatibility if needed, 
// but UI now uses layers.
export const getVehicleImageUrl = (
  tank: TankOption['id'],
  safetyUpgrades: SafetyUpgradeOption[]
): string => {
   return 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764569016/30kl_Tank_n5ydhj.png';
};

export const getSafetyImage = (
  tank: TankOption['id'],
  upgradeId: string
): string => {
    // Return standard images for learning modal
    if (upgradeId === 'crash-barrier') return 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/3.png';
    if (upgradeId === 'fire-suppression') return 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/2.png';
    return '';
};
