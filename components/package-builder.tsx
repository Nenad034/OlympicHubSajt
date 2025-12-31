'use client';

/**
 * Package Builder Component
 * 
 * Features:
 * - Split-screen layout with itinerary timeline and interactive map
 * - Drag-and-drop functionality
 * - Framer Motion layoutId animations
 * - Sticky summary footer
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Hotel, Car, Calendar, Users, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Flight, Hotel as HotelType, Transfer, PackageBuilderState } from '@/types/package';

// Mock data for demonstration
const mockFlights: Flight[] = [
  {
    id: '1',
    flightNumber: 'W6 320',
    carrier: 'Wizz Air',
    departureTime: new Date('2024-07-15T06:00:00'),
    arrivalTime: new Date('2024-07-15T09:30:00'),
    origin: 'BEG',
    destination: 'ATH',
    cabinClass: 'Economy',
    availableSeats: 45,
    netPrice: 150,
    currency: 'EUR',
  },
];

const mockHotels: HotelType[] = [
  {
    id: '1',
    name: 'Sunset Beach Resort',
    stars: 5,
    location: 'Santorini Beach',
    city: 'Santorini',
    country: 'Greece',
    latitude: 36.3932,
    longitude: 25.4615,
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Beach Access'],
    description: 'Luxury beachfront resort with stunning sunset views',
    imageUrl: '/placeholder-hotel.jpg',
  },
];

const mockTransfers: Transfer[] = [
  {
    id: '1',
    transferType: 'PRIVATE',
    vehicleType: 'Sedan',
    origin: 'Athens Airport',
    destination: 'Santorini Port',
    capacity: 4,
    pricePerPerson: 50,
    currency: 'EUR',
    available: true,
  },
];

export default function PackageBuilder() {
  const [builderState, setBuilderState] = useState<PackageBuilderState>({
    dates: {
      checkIn: new Date('2024-07-15'),
      checkOut: new Date('2024-07-22'),
    },
    travelers: 2,
    step: 'FLIGHT',
  });

  const [selectedItems, setSelectedItems] = useState({
    flight: null as Flight | null,
    hotel: null as HotelType | null,
    transfer: null as Transfer | null,
  });

  const selectFlight = (flight: Flight) => {
    setSelectedItems({ ...selectedItems, flight });
    setBuilderState({ ...builderState, step: 'HOTEL' });
  };

  const selectHotel = (hotel: HotelType) => {
    setSelectedItems({ ...selectedItems, hotel });
    setBuilderState({ ...builderState, step: 'TRANSFER' });
  };

  const selectTransfer = (transfer: Transfer) => {
    setSelectedItems({ ...selectedItems, transfer });
    setBuilderState({ ...builderState, step: 'REVIEW' });
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedItems.flight) total += selectedItems.flight.netPrice;
    if (selectedItems.hotel) total += 100 * 7; // Mock price per night * nights
    if (selectedItems.transfer) total += selectedItems.transfer.pricePerPerson * builderState.travelers;
    return total;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 min-h-[600px]">
      {/* Left: Itinerary Timeline */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Itinerary</CardTitle>
            <CardDescription>
              {builderState.travelers} travelers • {builderState.dates.checkIn.toLocaleDateString()} - {builderState.dates.checkOut.toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Flight Selection */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Flight</h3>
                  {selectedItems.flight ? (
                    <motion.div
                      layoutId={`flight-${selectedItems.flight.id}`}
                      className="p-4 bg-white border rounded-lg"
                    >
                      <p className="font-medium">{selectedItems.flight.flightNumber} - {selectedItems.flight.carrier}</p>
                      <p className="text-sm text-gray-600">{selectedItems.flight.origin} → {selectedItems.flight.destination}</p>
                      <p className="text-sm font-medium text-blue-600 mt-2">€{selectedItems.flight.netPrice}</p>
                    </motion.div>
                  ) : (
                    <p className="text-sm text-gray-500">No flight selected</p>
                  )}
                </div>
              </div>

              {/* Hotel Selection */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Hotel className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Hotel</h3>
                  {selectedItems.hotel ? (
                    <motion.div
                      layoutId={`hotel-${selectedItems.hotel.id}`}
                      className="p-4 bg-white border rounded-lg"
                    >
                      <p className="font-medium">{selectedItems.hotel.name}</p>
                      <p className="text-sm text-gray-600">{selectedItems.hotel.city}, {selectedItems.hotel.country}</p>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: selectedItems.hotel.stars }).map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-sm text-gray-500">No hotel selected</p>
                  )}
                </div>
              </div>

              {/* Transfer Selection */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Car className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Transfer</h3>
                  {selectedItems.transfer ? (
                    <motion.div
                      layoutId={`transfer-${selectedItems.transfer.id}`}
                      className="p-4 bg-white border rounded-lg"
                    >
                      <p className="font-medium">{selectedItems.transfer.transferType} - {selectedItems.transfer.vehicleType}</p>
                      <p className="text-sm text-gray-600">{selectedItems.transfer.origin} → {selectedItems.transfer.destination}</p>
                      <p className="text-sm font-medium text-purple-600 mt-2">€{selectedItems.transfer.pricePerPerson}/person</p>
                    </motion.div>
                  ) : (
                    <p className="text-sm text-gray-500">No transfer selected</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Selection Area / Map */}
      <div className="space-y-6">
        {builderState.step === 'FLIGHT' && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your Flight</CardTitle>
              <CardDescription>Choose from available flights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFlights.map((flight) => (
                  <motion.div
                    key={flight.id}
                    layoutId={`flight-${flight.id}`}
                    className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    onClick={() => selectFlight(flight)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{flight.flightNumber} - {flight.carrier}</p>
                        <p className="text-sm text-gray-600">{flight.origin} → {flight.destination}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {flight.departureTime.toLocaleTimeString()} - {flight.arrivalTime.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">€{flight.netPrice}</p>
                        <p className="text-xs text-gray-500">{flight.availableSeats} seats</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {builderState.step === 'HOTEL' && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your Hotel</CardTitle>
              <CardDescription>Choose your accommodation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHotels.map((hotel) => (
                  <motion.div
                    key={hotel.id}
                    layoutId={`hotel-${hotel.id}`}
                    className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    onClick={() => selectHotel(hotel)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{hotel.name}</p>
                        <div className="flex gap-1 my-1">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{hotel.city}, {hotel.country}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {hotel.amenities.slice(0, 3).map((amenity) => (
                            <span key={amenity} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {builderState.step === 'TRANSFER' && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your Transfer</CardTitle>
              <CardDescription>Airport and hotel transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransfers.map((transfer) => (
                  <motion.div
                    key={transfer.id}
                    layoutId={`transfer-${transfer.id}`}
                    className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    onClick={() => selectTransfer(transfer)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{transfer.transferType} - {transfer.vehicleType}</p>
                        <p className="text-sm text-gray-600">{transfer.origin} → {transfer.destination}</p>
                        <p className="text-xs text-gray-500 mt-1">Capacity: {transfer.capacity} passengers</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">€{transfer.pricePerPerson}</p>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {builderState.step === 'REVIEW' && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Package</CardTitle>
              <CardDescription>Confirm your selections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Your package is ready!</p>
                  <p className="text-2xl font-bold mt-2">€{calculateTotal()}</p>
                  <p className="text-xs text-gray-500">Total for {builderState.travelers} travelers</p>
                </div>
                <Button className="w-full" size="lg">
                  Continue to Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sticky Summary Footer */}
      <AnimatePresence>
        {(selectedItems.flight || selectedItems.hotel || selectedItems.transfer) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Package Total</p>
                <p className="text-2xl font-bold">€{calculateTotal()}</p>
              </div>
              <Button size="lg">Continue</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
