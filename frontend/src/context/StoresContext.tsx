import { createContext, useState, useContext } from "react";
import type { Store, Filters } from "@/types";

type StoreContextType = {
  stores: Store[];
  hasStore: (id: string) => boolean;
  addStore: (store: Store) => void;
  removeStore: (id: string) => void;
  clearStores: () => void;
  filters: Filters;
  toggleFilter: (filter: keyof Filters, value: string) => void;
  filterIsApplied: (filter: keyof Filters, value: string) => boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [stores, setStores] = useState<Store[]>([]); // list of stores user have selected
  const [filters, setFilters] = useState<Filters>({ // list of filters user have selected
    category: [],
    priceRange: [],
    brand: [],
  });

  const addStore = (newStore: Store) => {
    setStores((prevStores) => [...prevStores, newStore]);
  };

  const removeStore = (id: string) => {
    setStores((prevStores) => prevStores.filter((store) => store._id !== id));
  };

  const clearStores = () => {
    setStores([]);
  };

  const hasStore = (id: string) => {
    return stores.some((store) => store._id === id);
  };

  const addFilter = (filter: keyof Filters, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: [...new Set([...prevFilters[filter], value])],
    }));
  };

  const removeFilter = (filter: keyof Filters, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: prevFilters[filter].filter((item) => item !== value),
    }));
  };

  const filterIsApplied = (filter: keyof Filters, value: string): boolean => {
    return filters[filter].includes(value);
  };

  const toggleFilter = (filter: keyof Filters, value: string) => {
    if (filterIsApplied(filter, value)) {
      removeFilter(filter, value);
    } else {
      addFilter(filter, value);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        addStore,
        removeStore,
        clearStores,
        hasStore,
        filters,
        toggleFilter,
        filterIsApplied,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useMyStores = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("not inside of StoreProvider");
  }
  return context;
};
