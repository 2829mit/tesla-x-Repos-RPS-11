
import React from 'react';
import type { TrimOption, TankOption, SafetyUpgradeOption } from '../types';

interface CarVisualizerProps {
  trim: TrimOption;
  tank: TankOption['id'];
  safetyUpgrades: SafetyUpgradeOption[];
}

const CarVisualizer: React.FC<CarVisualizerProps> = ({ trim, tank, safetyUpgrades }) => {
  
  const getImageUrl = (): string => {
    const isSmallTank = tank === '22kl' || tank === '30kl';
    const isLargeTank = tank === '45kl' || tank === '60kl';
    const isDuWithoutRfid = trim.id === 'rwd'; // 3 RFID Nozzle (mapped to base 1)
    const isDuWith1Rfid = trim.id === 'lr';    // 1 RFID Nozzle (mapped to base 5)
    const isDuWith2Rfid = trim.id === 'lr-awd'; // 2 RFID Nozzle (mapped to base 9)
    
    const hasBarrier = safetyUpgrades.some(u => u.id === 'crash-barrier');
    const hasFireSystem = safetyUpgrades.some(u => u.id === 'fire-suppression');

    let imageIndex = 13; // Default fallback

    // Determine base index based on Tank Size and RFID selection
    if (isSmallTank) {
      if (isDuWithoutRfid) imageIndex = 1;
      else if (isDuWith1Rfid) imageIndex = 5;
      else if (isDuWith2Rfid) imageIndex = 9;
      else imageIndex = 13;
    } else if (isLargeTank) {
      if (isDuWithoutRfid) imageIndex = 17;
      else if (isDuWith1Rfid) imageIndex = 21;
      else if (isDuWith2Rfid) imageIndex = 25;
      else imageIndex = 29;
    }

    // Apply offsets based on Safety Upgrades
    // Fire System adds 1 (matches image 2.png series)
    // Barrier adds 2 (matches image 3.png series)
    // Both adds 3 (matches image 4.png series)
    if (!hasBarrier && hasFireSystem) {
      imageIndex += 1;
    } else if (hasBarrier && !hasFireSystem) {
      imageIndex += 2;
    } else if (hasBarrier && hasFireSystem) {
      imageIndex += 3;
    }

    const s3BaseUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/';
    return `${s3BaseUrl}${imageIndex}.png`;
  };
  
  const imageUrl = getImageUrl();

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden group">
      <img
        key={imageUrl}
        src={imageUrl}
        alt={`Your configuration`}
        className="object-contain w-5/6 h-5/6 animate-fade-in"
      />
    </div>
  );
};

export default CarVisualizer;
