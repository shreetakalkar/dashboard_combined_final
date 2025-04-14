import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState('Home');

  return (
    <SidebarContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </SidebarContext.Provider>
  );
};
