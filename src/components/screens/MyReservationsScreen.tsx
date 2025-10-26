import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Calendar, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BottomNav } from '../BottomNav';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner@2.0.3';
import { ParkingMap } from '../ParkingMap';

export const MyReservationsScreen: React.FC = () => {
  const { reservations, cancelReservation, userLocation } = useApp();

  const handleCancelReservation = (id: string, slotName: string) => {
    cancelReservation(id);
    toast.success('Reservation cancelled', {
      description: slotName
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card shadow-sm px-6 py-4 z-10">
        <h1>My Reservations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {reservations.length} {reservations.length === 1 ? 'reservation' : 'reservations'}
        </p>
      </div>

      {/* Reservations List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 space-y-4">
        <AnimatePresence>
          {reservations.map((reservation, index) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden"
            >
              {/* Mini Map */}
              <div className="h-32 relative overflow-hidden">
                <ParkingMap
                  slots={[
                    {
                      id: reservation.slotId,
                      name: reservation.slotName,
                      address: reservation.location,
                      lat: reservation.lat,
                      lng: reservation.lng,
                      status: 'reserved',
                      type: 'car',
                      price: 0,
                      distance: '0m'
                    }
                  ]}
                  userLocation={userLocation}
                  onMarkerClick={() => {}}
                />
              </div>

              {/* Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1">
                      {reservation.slotName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{reservation.location}</span>
                    </div>
                  </div>
                  <Badge
                    className={
                      reservation.status === 'active'
                        ? 'bg-[#00B894] text-white hover:bg-[#00B894]'
                        : 'bg-gray-400 text-white hover:bg-gray-400'
                    }
                  >
                    {reservation.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {formatDate(reservation.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {formatTime(reservation.startTime)}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground">
                      {reservation.duration} {reservation.duration === 1 ? 'hour' : 'hours'}
                    </span>
                  </div>
                </div>

                {reservation.status === 'active' && (
                  <Button
                    onClick={() =>
                      handleCancelReservation(reservation.id, reservation.slotName)
                    }
                    variant="outline"
                    className="w-full rounded-xl text-[#FF6B6B] border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Release Slot
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {reservations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2">No active reservations yet</h3>
            <p className="text-muted-foreground text-center max-w-xs">
              Find and reserve a parking spot to see it here
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};
