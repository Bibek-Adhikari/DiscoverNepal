import React, { createContext, useContext, useMemo } from 'react';
import { 
  useProvinces, 
  useDestinations, 
  useImpactMetrics, 
  useMonthlyVisitorData 
} from '@/hooks/useNepalData';
import { 
  provinces as staticProvinces, 
  destinations as staticDestinations, 
  impactMetrics as staticImpactMetrics, 
  monthlyVisitorData as staticMonthlyVisitorData 
} from '@/data/nepalData';
import type { Province, Destination, ImpactMetric } from '@/types';

interface DataContextType {
  provinces: Province[];
  destinations: Destination[];
  impactMetrics: ImpactMetric[];
  monthlyVisitorData: any[];
  isLoading: boolean;
  isError: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: dbProvinces, isLoading: loadingProvinces, isError: errorProvinces } = useProvinces();
  const { data: dbDestinations, isLoading: loadingDestinations, isError: errorDestinations } = useDestinations();
  const { data: dbImpactMetrics, isLoading: loadingMetrics, isError: errorMetrics } = useImpactMetrics();
  const { data: dbVisitorData, isLoading: loadingVisitors, isError: errorVisitors } = useMonthlyVisitorData();

  const provinces = useMemo(() => 
    (dbProvinces && dbProvinces.length > 0) ? dbProvinces : staticProvinces
  , [dbProvinces]);

  const destinations = useMemo(() => 
    (dbDestinations && dbDestinations.length > 0) ? dbDestinations : staticDestinations
  , [dbDestinations]);

  const impactMetrics = useMemo(() => 
    (dbImpactMetrics && dbImpactMetrics.length > 0) ? dbImpactMetrics : staticImpactMetrics
  , [dbImpactMetrics]);

  const monthlyVisitorData = useMemo(() => 
    (dbVisitorData && dbVisitorData.length > 0) ? dbVisitorData : staticMonthlyVisitorData
  , [dbVisitorData]);

  const isLoading = loadingProvinces || loadingDestinations || loadingMetrics || loadingVisitors;
  const isError = errorProvinces || errorDestinations || errorMetrics || errorVisitors;

  const value = useMemo(() => ({
    provinces,
    destinations,
    impactMetrics,
    monthlyVisitorData,
    isLoading,
    isError
  }), [provinces, destinations, impactMetrics, monthlyVisitorData, isLoading, isError]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
