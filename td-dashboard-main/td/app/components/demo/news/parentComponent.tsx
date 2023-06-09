import React, { useState, useEffect } from 'react';
import { createOrUpdateNewsDocument } from '@/app/appwrite/services/NewsService';
import DailyHighImpact from './DailyHighImpact';
import LoadingScreen from '../../loading/LoadingScreen';
import NewsComponent from './NewsComponent';
import CountryPieChart from './CountryPieChart';
import { Event, ApiData } from './types';
import UserNewsComponent from './userNewsComponent';
import { RefreshNewsContext } from './RefreshNewsContext';

const ParentComponent: React.FC = () => {
  const [data, setData] = useState<Array<Event>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let responseData = await createOrUpdateNewsDocument();
      //console.log('component response', responseData);
      if (responseData.length > 0) {
        setData(responseData);
        setLoading(false);
      } else {
        console.error('Could not fetch news data:', responseData);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <RefreshNewsContext.Provider
      value={() => setRefreshTrigger((old) => old + 1)}
    >
      <div>
        <div className="flex flex-col gap-3 mb-5  justify-between  lg:grid lg:gap-3  lg:grid-cols-3 ">
          <DailyHighImpact data={data} />
          <CountryPieChart data={data} />

          <div className="max-h-[600px] overflow-auto">
            <UserNewsComponent />
          </div>
        </div>
        <NewsComponent data={data} />
      </div>
    </RefreshNewsContext.Provider>
  );
};

export default ParentComponent;
