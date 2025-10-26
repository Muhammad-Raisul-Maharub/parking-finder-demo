import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MapPin, Car, Bike, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BottomNav } from '../BottomNav';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner@2.0.3';

export const AdminPanelScreen: React.FC = () => {
  const { parkingSlots, updateSlotStatus, setParkingSlots } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSlotName, setNewSlotName] = useState('');
  const [newSlotAddress, setNewSlotAddress] = useState('');
  const [newSlotType, setNewSlotType] = useState<'car' | 'bike'>('car');
  const [newSlotPrice, setNewSlotPrice] = useState('5');
  const [newSlotStatus, setNewSlotStatus] = useState<'available' | 'reserved' | 'occupied'>('available');

  const handleStatusToggle = (slotId: string, currentStatus: string) => {
    const statusCycle: Array<'available' | 'reserved' | 'occupied'> = ['available', 'reserved', 'occupied'];
    const currentIndex = statusCycle.indexOf(currentStatus as any);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    
    updateSlotStatus(slotId, nextStatus);
    toast.success('Status updated', {
      description: `Changed to ${nextStatus}`
    });
  };

  const handleAddSlot = () => {
    if (!newSlotName || !newSlotAddress) {
      toast.error('Please fill in all fields');
      return;
    }

    const newSlot = {
      id: Date.now().toString(),
      name: newSlotName,
      address: newSlotAddress,
      lat: 40.7589 + (Math.random() - 0.5) * 0.01,
      lng: -73.9851 + (Math.random() - 0.5) * 0.01,
      status: newSlotStatus,
      type: newSlotType,
      price: parseFloat(newSlotPrice),
      distance: `${Math.floor(Math.random() * 1000)}m`
    };

    setParkingSlots([...parkingSlots, newSlot]);
    toast.success('Slot added successfully!');
    
    // Reset form
    setNewSlotName('');
    setNewSlotAddress('');
    setNewSlotType('car');
    setNewSlotPrice('5');
    setNewSlotStatus('available');
    setIsAddDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      available: { label: 'Available', className: 'bg-[#00B894] text-white hover:bg-[#00B894]' },
      reserved: { label: 'Reserved', className: 'bg-[#FFB800] text-white hover:bg-[#FFB800]' },
      occupied: { label: 'Occupied', className: 'bg-[#FF6B6B] text-white hover:bg-[#FF6B6B]' }
    };
    return config[status as keyof typeof config];
  };

  const statusCounts = parkingSlots.reduce((acc, slot) => {
    acc[slot.status] = (acc[slot.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card shadow-sm px-6 py-4 z-10">
        <h1>Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage parking slots and availability
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#00B894]/10 border border-[#00B894]/20 rounded-2xl p-3 text-center">
            <div className="text-2xl text-[#00B894] mb-1">
              {statusCounts.available || 0}
            </div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
          <div className="bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-2xl p-3 text-center">
            <div className="text-2xl text-[#FFB800] mb-1">
              {statusCounts.reserved || 0}
            </div>
            <div className="text-xs text-muted-foreground">Reserved</div>
          </div>
          <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-2xl p-3 text-center">
            <div className="text-2xl text-[#FF6B6B] mb-1">
              {statusCounts.occupied || 0}
            </div>
            <div className="text-xs text-muted-foreground">Occupied</div>
          </div>
        </div>
      </div>

      {/* Slots List */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-3">
        <AnimatePresence>
          {parkingSlots.map((slot, index) => {
            const statusConfig = getStatusBadge(slot.status);
            return (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl shadow-sm border border-border p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1">{slot.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">{slot.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {slot.type === 'car' ? (
                      <Car className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Bike className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusToggle(slot.id, slot.status)}
                    className="h-8 rounded-lg"
                  >
                    <ToggleRight className="w-4 h-4 mr-1" />
                    Toggle
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* FAB - Add Slot */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-24 right-6 w-16 h-16 bg-[#1E90FF] rounded-full shadow-xl flex items-center justify-center z-20"
          >
            <Plus className="w-8 h-8 text-white" />
          </motion.button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Parking Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="slot-name">Slot Name</Label>
              <Input
                id="slot-name"
                placeholder="Downtown Parking"
                value={newSlotName}
                onChange={(e) => setNewSlotName(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slot-address">Address</Label>
              <Input
                id="slot-address"
                placeholder="123 Main St"
                value={newSlotAddress}
                onChange={(e) => setNewSlotAddress(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slot-type">Type</Label>
                <Select value={newSlotType} onValueChange={(value: any) => setNewSlotType(value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slot-price">Price/hr</Label>
                <Input
                  id="slot-price"
                  type="number"
                  placeholder="5"
                  value={newSlotPrice}
                  onChange={(e) => setNewSlotPrice(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slot-status">Initial Status</Label>
              <Select value={newSlotStatus} onValueChange={(value: any) => setNewSlotStatus(value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAddSlot}
              className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white rounded-xl h-12"
            >
              Add Slot
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};
