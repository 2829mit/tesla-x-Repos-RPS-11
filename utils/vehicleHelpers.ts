
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

// Helper to extract priority from filename based on the new convention:
// 1. If the filename (after cleaning prefixes) starts with "Number-Separator-Number" (e.g., "1-3-DU" or "-0-11-Crash"),
//    the FIRST number is the priority.
// 2. Higher priority number = Higher Z-Index (placed on top).
// 3. If the filename only has one number at the start (e.g., "2-kl tank"), it has no priority rule and defaults to base (-100).
const getLayerPriority = (url: string): number => {
  try {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    let decodedFilename = decodeURIComponent(filename);
    
    // Clean specific prefixes if present to normalize the start of the string
    // Removes "Common-" and any leading dashes or underscores
    decodedFilename = decodedFilename.replace(/^Common-/i, '').replace(/^[-_]+/, '');

    // Regex to capture the "Two Numbers" pattern at the start
    // ^                  : Start of string
    // (\d+(?:\.\d+)?)    : Capture Group 1 (Priority Number) - Integer or Float
    // [-_\s]+            : Separator (dash, underscore, or space)
    // (\d+(?:\.\d+)?)    : Capture Group 2 (Second Number)
    const twoNumberRegex = /^(\d+(?:\.\d+)?)[-_\s]+(\d+(?:\.\d+)?)/;
    
    const match = decodedFilename.match(twoNumberRegex);
    
    if (match && match[1]) {
       // Return the first number as the priority
       return parseFloat(match[1]);
    }
  } catch (e) {
    // console.warn("Error parsing priority", url);
  }
  
  // Default priority for files that don't match the "Two Numbers" rule 
  // (e.g. "2-kl tank" or "6-Fuel Level" where the second part isn't a number).
  // We return a very low number to ensure these act as base layers.
  return -100;
};

export const getVisualizerLayers = (
  tank: TankOption['id'],
  mechanicalOptions: AccessoryOption[],
  dispensingUnits: DispensingUnitOption[],
  safetyUnits: AccessoryOption[],
  safetyUpgrades: SafetyUpgradeOption[],
  decantation: IotOption[] = [],
  hasPlatform: boolean = false
): string[] => {
    // Exclusive View: If RPS Platform is selected, show ONLY the platform image
    if (hasPlatform) {
         return ['https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/60kl%20platform-min.png'];
    }

    const layers: string[] = [];
    const isSmallTank = tank === '22kl' || tank === '30kl';

    // 1. Base Tank Layer
    if (isSmallTank) {
         layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/2-kl%20tank30-min.png');
    } else {
         layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/2-kl%20tank60-min.png');
    }

    // 2. Dispensing Units (Single DU)
    const hasSingleDU = dispensingUnits.some(du => du.id === 'single-du');
    if (hasSingleDU) {
        // Use the common Single DU image for all tank sizes
        layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-4-3-DU%20with%20rfid2-common-min.png');
    }

    // 3. Safety Units
    // IoT Controller
    if (safetyUnits.some(o => o.id === 'iot-controller-safety')) {
         layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-6-8-IOT%20controller-common-min.png');
    }

    // Fuel Level Sensors
    if (safetyUnits.some(o => o.id === 'fuel-level-sensors')) {
         if (isSmallTank) {
             layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-1-6-Fuel%20Level30-min.png');
         } else {
             layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-1-6-Fuel%20Level60-min.png');
         }
    }

    // Leak Detection System
    if (safetyUnits.some(o => o.id === 'leak-detection-system')) {
        if (isSmallTank) {
            layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-2-7a-Leak%20Detection%20System30-min.png');
        } else {
            layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-2-7a-Leak%20Detection%20System60-min.png');
        }
    }

    // Overfill Sensors
    if (safetyUnits.some(o => o.id === 'overfill-sensors')) {
        if (isSmallTank) {
            layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-3-9-overfill%20sensor30-min.png');
        } else {
            layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-3-9-overfill%20sensor60-min.png');
        }
    }

    // Wireless Synchronised Mobile
    if (safetyUnits.some(o => o.id === 'mobile-device')) {
        layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-7-9-human%20with%20tab-common-min.png');
    }

    // 4. Safety Upgrades (Outer Shells)
    safetyUpgrades.forEach(option => {
        if (option.id === 'crash-barrier') {
            if (isSmallTank) {
                layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-0-11-Crash%20barrier30-min.png');
            } else {
                layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-0-11-Crash%20barrier60-min.png');
            }
        }
        
        if (option.id === 'fire-suppression') {
            layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-5-12-Fire%20supression-common-min.png');
        }
     });

    // 5. Mechanical Inclusions - Overlays
    
    // Flame Proof Illumination
    if (mechanicalOptions.some(o => o.id === 'flame-proof-illumination')) {
        layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-6-5-Flame%20Proof-common-min.png');
    }
    // Filtration Mechanism
    if (mechanicalOptions.some(o => o.id === 'filtration-mechanism')) {
        layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-6-4b-Filteration%20mechanism-option-common-min.png');
    }

    // 6. Decantation - Advanced Skid
    if (decantation.some(d => d.id === 'advanced-skid')) {
         layers.push('https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-7-10-Advanced%20Skid-%20Flowmeter-common-min.png');
    }

    // Sort layers based on priority extracted from filename
    // Lower priority number = Rendered first (Bottom)
    // Higher priority number = Rendered last (Top)
    return layers.sort((a, b) => getLayerPriority(a) - getLayerPriority(b));
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
