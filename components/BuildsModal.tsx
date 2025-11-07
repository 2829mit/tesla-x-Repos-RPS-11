import React from 'react';
import type { SavedBuild } from '../types';

interface BuildsModalProps {
  isOpen: boolean;
  onClose: () => void;
  builds: SavedBuild[];
  onLoad: (build: SavedBuild) => void;
  onDelete: (buildId: string) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
};

const BuildsModal: React.FC<BuildsModalProps> = ({ isOpen, onClose, builds, onLoad, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative p-8 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800" aria-label="Close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-900">My Saved Builds</h2>

        <div className="flex-grow overflow-y-auto pr-2">
          {builds.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-4 font-semibold">You have no saved builds.</p>
              <p className="text-sm">Configure your vehicle and click "Save Build" to add one here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {builds.map(build => (
                <div key={build.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-100 transition-colors">
                  <img src={build.imageUrl} alt={build.name} className="w-32 h-20 object-contain rounded-md bg-gray-200 flex-shrink-0" />
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-800">{build.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{build.config.selectedTrim.name} &bull; {build.config.selectedPaint.name} &bull; {build.config.selectedWheels.name}</p>
                    <p className="text-md font-semibold text-gray-900 mt-1">{formatCurrency(build.finalPrice)}</p>
                  </div>
                  <div className="flex flex-col space-y-2 flex-shrink-0">
                    <button onClick={() => onLoad(build)} className="bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      Load
                    </button>
                    <button onClick={() => onDelete(build.id)} className="bg-gray-200 text-gray-700 text-sm font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildsModal;
