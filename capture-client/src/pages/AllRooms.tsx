import React, { useContext } from "react";
import { RoomContext } from "../contexts/RoomsContext";
import Room from '../components/Room'


const AllRooms = () => {

    // get rooms from room context
    const { rooms } = useContext(RoomContext);

    console.log(rooms);
  
    // get only men's and women's clothing category
    const filteredRooms = rooms.filter((item) => {
      return (
        item.category === "men's clothing" || item.category === "women's clothing" || item.category === "jewelery"
      );
    });

  return (
    <div>
      <section className="py-20">
        <div className="container mx-auto">
          <h1 className="text-3xl font-semibold mb-10 text-center">Explore Our rooms</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:mx-8 gap-[30px] max-w-sm mx-auto md:max-w-none md:mx-0">
            {filteredRooms.map((room) => {
              return (
                <Room room={room} key={room.id}/>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AllRooms