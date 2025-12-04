
import React from 'react';
import type { TankOption, AccessoryOption, DispensingUnitOption, SafetyUpgradeOption, IotOption } from '../types';
import { getVisualizerLayers } from '../utils/vehicleHelpers';

interface CarVisualizerProps {
  tank: TankOption['id'];
  mechanicalOptions?: AccessoryOption[];
  dispensingUnits?: DispensingUnitOption[];
  safetyUnits?: AccessoryOption[];
  safetyUpgrades: SafetyUpgradeOption[];
  decantation?: IotOption[];
  showInternalDetails?: boolean;
}

const CarVisualizer: React.FC<CarVisualizerProps> = ({ 
  tank, 
  mechanicalOptions = [], 
  dispensingUnits = [], 
  safetyUnits = [], 
  safetyUpgrades,
  decantation = [],
  showInternalDetails = true
}) => {
  const layers = getVisualizerLayers(
      tank, 
      mechanicalOptions, 
      dispensingUnits, 
      safetyUnits, 
      safetyUpgrades, 
      decantation,
      showInternalDetails
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden group">
      <div className="relative w-5/6 h-5/6 flex items-center justify-center">
        {layers.map((layerUrl, index) => (
            <img
                key={`${layerUrl}-${index}`}
                src={layerUrl}
                alt={`Configuration Layer ${index}`}
                className="absolute inset-0 object-contain w-full h-full animate-fade-in"
                style={{ zIndex: index * 10 }}
            />
        ))}
        {layers.length === 0 && (
             <p className="text-gray-400">Loading Configuration...</p>
        )}
      </div>
    </div>
  );
};

export default CarVisualizer;
