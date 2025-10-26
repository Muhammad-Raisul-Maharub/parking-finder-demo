import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ParkingSlot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: 'available' | 'reserved' | 'occupied';
  type: 'car' | 'bike';
  price: number;
  distance: string;
}

export interface Reservation {
  id: string;
  slotId: string;
  slotName: string;
  location: string;
  startTime: Date;
  duration: number;
  status: 'active' | 'expired';
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  parkingSlots: ParkingSlot[];
  setParkingSlots: (slots: ParkingSlot[]) => void;
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  cancelReservation: (id: string) => void;
  updateSlotStatus: (slotId: string, status: ParkingSlot['status']) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  selectedSlot: ParkingSlot | null;
  setSelectedSlot: (slot: ParkingSlot | null) => void;
  userLocation: { lat: number; lng: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock parking slots data
const initialParkingSlots: ParkingSlot[] = [
  {
    id: '1',
    name: 'KhUshi Parking Lot',
    address: 'West khulshi',
    lat: 40.7589,
    lng: -73.9851,
    status: 'available',
    type: 'car',
    price: 50,
    distance: '200m'
  },
  {
    id: '2',
    name: 'City Center Garage',
    address: '456 Center Ave',
    lat: 40.7599,
    lng: -73.9841,
    status: 'available',
    type: 'car',
    price: 80,
    distance: '350m'
  },
  {
    id: '3',
    name: 'Sanmar Parking',
    address: 'Sanmar Road, 2 no gate',
    lat: 40.7579,
    lng: -73.9861,
    status: 'occupied',
    type: 'car',
    price: 40,
    distance: '450m'
  },
  {
    id: '4',
    name: 'GEC Parking Lot',
    address: 'GEC Mor',
    lat: 40.7609,
    lng: -73.9831,
    status: 'reserved',
    type: 'car',
    price: 60,
    distance: '500m'
  },
  {
    id: '5',
    name: 'Park View Parking',
    address: 'Panchlaish R/A',
    lat: 40.7569,
    lng: -73.9871,
    status: 'available',
    type: 'bike',
    price: 20,
    distance: '600m'
  },
  {
    id: '6',
    name: 'Wireless Road Parking',
    address: 'Wireless Rd',
    lat: 40.7619,
    lng: -73.9821,
    status: 'available',
    type: 'car',
    price: 60,
    distance: '750m'
  },
  {
    id: '7',
    name: 'University Parking',
    address: 'USTC Campus',
    lat: 40.7559,
    lng: -73.9881,
    status: 'occupied',
    type: 'car',
    price: 50,
    distance: '800m'
  },
  {
    id: '8',
    name: 'Yunosco Mall Parking',
    address: 'GEC Mor',
    lat: 40.7629,
    lng: -73.9811,
    status: 'available',
    type: 'car',
    price: 100,
    distance: '900m'
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>(initialParkingSlots);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [userLocation] = useState({ lat: 40.7589, lng: -73.9851 });

  const addReservation = (reservation: Reservation) => {
    setReservations(prev => [...prev, reservation]);
    updateSlotStatus(reservation.slotId, 'reserved');
  };

  const cancelReservation = (id: string) => {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      updateSlotStatus(reservation.slotId, 'available');
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  const updateSlotStatus = (slotId: string, status: ParkingSlot['status']) => {
    setParkingSlots(prev =>
      prev.map(slot => (slot.id === slotId ? { ...slot, status } : slot))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        parkingSlots,
        setParkingSlots,
        reservations,
        addReservation,
        cancelReservation,
        updateSlotStatus,
        darkMode,
        setDarkMode,
        currentScreen,
        setCurrentScreen,
        selectedSlot,
        setSelectedSlot,
        userLocation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
