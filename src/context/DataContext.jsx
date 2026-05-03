import React, { createContext, useContext } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ initialData, children }) => {
  return (
    <DataContext.Provider value={initialData}>
      {children}
    </DataContext.Provider>
  );
};

export const useInitialData = () => {
  return useContext(DataContext);
};
