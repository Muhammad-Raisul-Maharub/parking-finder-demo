import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Car, Bike, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner@2.0.3';
import { ParkingMap } from '../ParkingMap';

export const SlotDetailsScreen: React.FC = () => {
  const { selectedSlot, setCurrentScreen, addReservation, userLocation } = useApp();
  const [duration, setDuration] = useState('1');
  const [isReserved, setIsReserved] = useState(false);

  if (!selectedSlot) {
    setCurrentScreen('home');
    return null;
  }

  const handleReserve = () => {
    if (selectedSlot.status !== 'available') {
      toast.error('This slot is not available');
      return;
    }

    const reservation = {
      id: Date.now().toString(),
      slotId: selectedSlot.id,
      slotName: selectedSlot.name,
      location: selectedSlot.address,
      startTime: new Date(),
      duration: parseInt(duration),
      status: 'active' as const,
      lat: selectedSlot.lat,
      lng: selectedSlot.lng
    };

    addReservation(reservation);
    setIsReserved(true);

    // Animate button change
    setTimeout(() => {
      toast.success('Slot reserved successfully!', {
        description: `${selectedSlot.name} for ${duration} hour(s)`
      });
    }, 300);
  };

  const handleGoBack = () => {
    setCurrentScreen('home');
  };

  const totalPrice = selectedSlot.price * parseInt(duration);

  const getStatusBadge = () => {
    const config = {
      available: { label: 'Available', className: 'bg-[#00B894] text-white hover:bg-[#00B894]' },
      reserved: { label: 'Reserved', className: 'bg-[#FFB800] text-white hover:bg-[#FFB800]' },
      occupied: { label: 'Occupied', className: 'bg-[#FF6B6B] text-white hover:bg-[#FF6B6B]' }
    };
    return config[selectedSlot.status];
  };

  const statusConfig = getStatusBadge();

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card shadow-sm px-4 py-4 flex items-center gap-3 z-10">
        <button
          onClick={handleGoBack}
          className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="flex-1">Slot Details</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Map Preview */}
        <div className="h-48 relative">
          <ParkingMap
            slots={[selectedSlot]}
            userLocation={userLocation}
            onMarkerClick={() => {}}
            selectedSlot={selectedSlot}
          />
        </div>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-6 space-y-6"
        >
          {/* Header Section */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="flex-1">{selectedSlot.name}</h1>
              <Badge className={statusConfig.className}>
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{selectedSlot.address}</span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Distance</span>
              </div>
              <p className="text-foreground">{selectedSlot.distance}</p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                {selectedSlot.type === 'car' ? (
                  <Car className="w-4 h-4" />
                ) : (
                  <Bike className="w-4 h-4" />
                )}
                <span className="text-sm">Type</span>
              </div>
              <p className="text-foreground capitalize">{selectedSlot.type}</p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Price</span>
              </div>
              <p className="text-foreground">${selectedSlot.price}/hr</p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Duration</span>
              </div>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-8 border-0 p-0 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">30 min</SelectItem>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Price</span>
              <span className="text-[#1E90FF]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Reserve Button */}
          <motion.div
            initial={false}
            animate={isReserved ? { backgroundColor: '#00B894' } : {}}
          >
            <Button
              onClick={handleReserve}
              disabled={selectedSlot.status !== 'available' || isReserved}
              className={`w-full h-14 rounded-xl text-white ${
                isReserved
                  ? 'bg-[#00B894] hover:bg-[#00B894]'
                  : 'bg-[#1E90FF] hover:bg-[#1E90FF]/90'
              } disabled:bg-gray-300`}
            >
              <motion.div
                initial={false}
                animate={isReserved ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2"
              >
                {isReserved && <CheckCircle2 className="w-5 h-5" />}
                {isReserved ? 'Reserved!' : 'Reserve Slot'}
              </motion.div>
            </Button>
          </motion.div>

          {isReserved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={() => setCurrentScreen('reservations')}
                variant="outline"
                className="w-full h-12 rounded-xl"
              >
                View My Reservations
              </Button>
            </motion.div>
          )}

          {selectedSlot.status !== 'available' && !isReserved && (
            <p className="text-center text-sm text-muted-foreground">
              This slot is currently {selectedSlot.status}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
