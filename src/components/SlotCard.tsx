import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Car, Bike } from 'lucide-react';
import { Badge } from './ui/badge';
import { ParkingSlot } from '../context/AppContext';

interface SlotCardProps {
  slot: ParkingSlot;
  onClick: () => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({ slot, onClick }) => {
  const getStatusBadge = () => {
    const config = {
      available: { label: 'Available', className: 'bg-[#00B894] text-white hover:bg-[#00B894]' },
      reserved: { label: 'Reserved', className: 'bg-[#FFB800] text-white hover:bg-[#FFB800]' },
      occupied: { label: 'Occupied', className: 'bg-[#FF6B6B] text-white hover:bg-[#FF6B6B]' }
    };
    return config[slot.status];
  };

  const statusConfig = getStatusBadge();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-foreground mb-1">{slot.name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4" />
            <span>{slot.distance} away</span>
          </div>
        </div>
        <Badge className={statusConfig.className}>
          {statusConfig.label}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{slot.address}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {slot.type === 'car' ? (
            <Car className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Bike className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground capitalize">{slot.type}</span>
        </div>
        <span className="text-[#1E90FF]">${slot.price}/hr</span>
      </div>
    </motion.div>
  );
};
