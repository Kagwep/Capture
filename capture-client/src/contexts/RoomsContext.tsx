import React, { createContext, useState, useEffect, ReactNode } from "react";

interface Room {
  id: number;
  image: string;
  category: string;
  description: string;
  title: string;
  price: number;
}

interface RoomContextType {
  rooms: Room[];
}

export const RoomContext = createContext<RoomContextType>({
  rooms: []
});

const RoomProvider = ({ children }: { children: ReactNode }) => {
  // Rooms state
  const [rooms, setRooms] = useState<Room[]>([]);
  
  // fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/Products");
        const data: Room[] = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <RoomContext.Provider value={{ rooms }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
