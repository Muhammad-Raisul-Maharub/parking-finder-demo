import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation } from 'lucide-react';
import { ParkingSlot } from '../context/AppContext';

interface ParkingMapProps {
  slots: ParkingSlot[];
  userLocation: { lat: number; lng: number };
  onMarkerClick: (slot: ParkingSlot) => void;
  selectedSlot?: ParkingSlot | null;
}

export const ParkingMap: React.FC<ParkingMapProps> = ({
  slots,
  userLocation,
  onMarkerClick,
  selectedSlot
}) => {
  // Convert lat/lng to pixel coordinates (simplified)
  const latToY = (lat: number) => {
    const minLat = 40.755;
    const maxLat = 40.765;
    return ((maxLat - lat) / (maxLat - minLat)) * 100;
  };

  const lngToX = (lng: number) => {
    const minLng = -73.990;
    const maxLng = -73.980;
    return ((lng - minLng) / (maxLng - minLng)) * 100;
  };

  const getMarkerColor = (status: ParkingSlot['status']) => {
    switch (status) {
      case 'available':
        return '#00B894';
      case 'reserved':
        return '#FFB800';
      case 'occupied':
        return '#FF6B6B';
      default:
        return '#6C757D';
    }
  };

  return (
    <div className="relative w-full h-full bg-[#E5E3DF] overflow-hidden rounded-2xl">
      {/* Map grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#999" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Roads/streets */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 right-0 h-8 bg-white/50" />
        <div className="absolute top-1/2 left-0 right-0 h-10 bg-white/70" />
        <div className="absolute top-3/4 left-0 right-0 h-8 bg-white/50" />
        <div className="absolute left-1/3 top-0 bottom-0 w-8 bg-white/50" />
        <div className="absolute left-2/3 top-0 bottom-0 w-8 bg-white/50" />
      </div>

      {/* User location */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute z-20"
        style={{
          left: `${lngToX(userLocation.lng)}%`,
          top: `${latToY(userLocation.lat)}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="relative">
          <div className="w-4 h-4 bg-[#1E90FF] rounded-full border-2 border-white shadow-lg" />
          <div className="absolute inset-0 w-4 h-4 bg-[#1E90FF] rounded-full animate-ping opacity-75" />
        </div>
      </motion.div>

      {/* Parking slot markers */}
      {slots.map((slot, index) => (
        <motion.div
          key={slot.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="absolute z-10 cursor-pointer"
          style={{
            left: `${lngToX(slot.lng)}%`,
            top: `${latToY(slot.lat)}%`,
            transform: 'translate(-50%, -100%)'
          }}
          onClick={() => onMarkerClick(slot)}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={
              selectedSlot?.id === slot.id
                ? { y: [0, -8, 0] }
                : {}
            }
            transition={
              selectedSlot?.id === slot.id
                ? { repeat: Infinity, duration: 0.6 }
                : {}
            }
          >
            <MapPin
              className="w-10 h-10 drop-shadow-lg"
              fill={getMarkerColor(slot.status)}
              color="white"
              strokeWidth={1.5}
            />
            {selectedSlot?.id === slot.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-lg whitespace-nowrap text-xs"
              >
                {slot.name}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ))}

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-3 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-[#00B894]" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
          <span>Occupied</span>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50">
          +
        </button>
        <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50">
          −
        </button>
        <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50">
          <Navigation className="w-5 h-5 text-[#1E90FF]" />
        </button>
      </div>
    </div>
  );
};
