
import React from 'react';
import type { RfidOption, TankOption, SafetyUpgradeOption } from '../types';
import { getVehicleImageUrl } from '../utils/vehicleHelpers';

interface CarVisualizerProps {
  rfidOption: RfidOption | null;
  tank: TankOption['id'];
  safetyUpgrades: SafetyUpgradeOption[];
}

const CarVisualizer: React.FC<CarVisualizerProps> = ({ rfidOption, tank, safetyUpgrades }) => {
  const imageUrl = getVehicleImageUrl(rfidOption, tank, safetyUpgrades);

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
