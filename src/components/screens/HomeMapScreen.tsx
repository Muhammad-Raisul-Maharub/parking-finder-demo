import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Plus, CheckCircle2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ParkingMap } from '../ParkingMap';
import { SlotCard } from '../SlotCard';
import { BottomNav } from '../BottomNav';
import { useApp } from '../../context/AppContext';

export const HomeMapScreen: React.FC = () => {
  const {
    parkingSlots,
    userLocation,
    selectedSlot,
    setSelectedSlot,
    setCurrentScreen,
    reservations
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  const filteredSlots = parkingSlots.filter(
    (slot) =>
      slot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableSlots = filteredSlots.filter((slot) => slot.status === 'available');
  const hasActiveReservation = reservations.some(r => r.status === 'active');

  const handleSlotClick = (slot: typeof parkingSlots[0]) => {
    setSelectedSlot(slot);
    setIsPanelExpanded(false);
  };

  const handleReserveClick = () => {
    if (selectedSlot) {
      setCurrentScreen('slot-details');
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Top Bar */}
      <div className="bg-card shadow-sm px-4 py-4 z-30">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search location or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-12 rounded-xl bg-muted/50 border-0"
            />
          </div>
          <button className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <ParkingMap
          slots={filteredSlots}
          userLocation={userLocation}
          onMarkerClick={handleSlotClick}
          selectedSlot={selectedSlot}
        />

        {/* FAB - Reserve/Active indicator */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={hasActiveReservation ? () => setCurrentScreen('reservations') : handleReserveClick}
          disabled={!hasActiveReservation && !selectedSlot}
          className={`absolute bottom-24 right-6 w-16 h-16 rounded-full shadow-xl flex items-center justify-center z-20 ${
            hasActiveReservation
              ? 'bg-[#00B894]'
              : selectedSlot
              ? 'bg-[#1E90FF]'
              : 'bg-gray-300'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {hasActiveReservation ? (
            <CheckCircle2 className="w-8 h-8 text-white" />
          ) : (
            <Plus className="w-8 h-8 text-white" />
          )}
        </motion.button>
      </div>

      {/* Bottom Draggable Panel */}
      <motion.div
        initial={{ y: '70%' }}
        animate={{ y: isPanelExpanded ? '0%' : '70%' }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.y < -50) {
            setIsPanelExpanded(true);
          } else if (info.offset.y > 50) {
            setIsPanelExpanded(false);
          }
        }}
        className="bg-card rounded-t-3xl shadow-2xl z-30 pb-20"
        style={{ maxHeight: '70%' }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-border rounded-full" />
        </div>

        {/* Panel Header */}
        <div className="px-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground">Nearby Parking Slots</h2>
            <span className="text-sm text-muted-foreground">
              {availableSlots.length} available
            </span>
          </div>
        </div>

        {/* Slot List */}
        <div className="overflow-y-auto px-6 py-4 space-y-3" style={{ maxHeight: 'calc(70vh - 120px)' }}>
          <AnimatePresence>
            {filteredSlots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <SlotCard slot={slot} onClick={() => handleSlotClick(slot)} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredSlots.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No parking slots found</p>
            </div>
          )}
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
};
