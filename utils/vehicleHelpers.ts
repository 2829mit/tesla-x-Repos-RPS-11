
import { CONSUMPTION_OPTIONS } from '../constants';
import { RfidOption, TankOption, SafetyUpgradeOption } from '../types';

export const getRecommendedTankId = (consumption: string): TankOption['id'] => {
  const index = CONSUMPTION_OPTIONS.indexOf(consumption);
  if (index === 0) return '22kl'; // 50-100KL
  if (index === 1) return '30kl'; // 100-200KL
  if (index === 2) return '45kl'; // 200-300KL
  if (index === 3) return '60kl'; // 300-1000KL
  return '22kl';
};

export const getVehicleImageUrl = (
  rfidOption: RfidOption | null,
  tank: TankOption['id'],
  safetyUpgrades: SafetyUpgradeOption[]
): string => {
    const isSmallTank = tank === '22kl' || tank === '30kl';
    const isLargeTank = tank === '45kl' || tank === '60kl';
    
    // Handle null selection (default to standard look)
    const isStandardVisual = !rfidOption; 
    
    // Map new IDs to Logic
    const is1ActiveReader = rfidOption?.id === '1-active-reader';
    const is2ActiveReader = rfidOption?.id === '2-active-reader';
    
    let baseIndex = 13; // Default fallback

    // Determine base index based on Tank Size and RFID selection
    if (isSmallTank) {
      if (isStandardVisual) baseIndex = 13;      // Default Visual
      else if (is1ActiveReader) baseIndex = 5;   // 1 Reader
      else if (is2ActiveReader) baseIndex = 9;   // 2 Readers
      else baseIndex = 1;                        // Fallback
    } else if (isLargeTank) {
      if (isStandardVisual) baseIndex = 29;      // Default Visual
      else if (is1ActiveReader) baseIndex = 21;  // 1 Reader
      else if (is2ActiveReader) baseIndex = 25;  // 2 Readers
      else baseIndex = 17;                       // Fallback
    }

    // Apply offsets based on Safety Upgrades
    const hasFireSystem = safetyUpgrades.some(u => u.id === 'fire-suppression');
    const hasBarrier = safetyUpgrades.some(u => u.id === 'crash-barrier');

    // DEFAULT MAPPING (Matches Standard Visuals: Base 13, 29)
    // Offset 1 (+1) -> Crash Barrier
    // Offset 2 (+2) -> Fire Suppression System
    let barrierOffset = 1;
    let fireOffset = 2;

    // ASSET CORRECTION:
    // The image sets for RFID Trims (Base 5, 9, 21, 25) have inverted layering.
    // For these sets: Offset 1 is Fire, Offset 2 is Barrier.
    const rfidBaseIndices = [5, 9, 21, 25];
    
    if (rfidBaseIndices.includes(baseIndex)) {
        barrierOffset = 2;
        fireOffset = 1;
    }

    let offset = 0;
    if (hasBarrier && !hasFireSystem) {
      offset = barrierOffset; 
    } else if (!hasBarrier && hasFireSystem) {
      offset = fireOffset; 
    } else if (hasBarrier && hasFireSystem) {
      offset = 3; 
    }

    const imageIndex = baseIndex + offset;

    const s3BaseUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/';
    return `${s3BaseUrl}${imageIndex}.png`;
};

export const getSafetyImage = (
  rfidOption: RfidOption | null,
  tank: TankOption['id'],
  upgradeId: string
): string => {
    // Simulate a configuration where only this upgrade is selected to get its thumbnail
    const dummyUpgrade = { id: upgradeId } as SafetyUpgradeOption;
    return getVehicleImageUrl(rfidOption, tank, [dummyUpgrade]);
};
