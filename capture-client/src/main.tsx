import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import RoomProvider from "./contexts/RoomsContext.tsx";
import SidebarProvider from "./contexts/SidebarContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SidebarProvider>
      <RoomProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </RoomProvider>
  </SidebarProvider>,
)