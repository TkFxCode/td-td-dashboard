import React, { useState, useEffect } from 'react';
import { createOrUpdateNewsDocument } from '@/app/appwrite/services/NewsService';
import DailyHighImpact from './DailyHighImpact';
import LoadingScreen from '../../loading/LoadingScreen';
import NewsComponent from './NewsComponent';
import CountryPieChart from './CountryPieChart';
import { Event, ApiData } from './types';

const ParentComponent: React.FC = () => {
  const [data, setData] = useState<Array<Event>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let responseData = await createOrUpdateNewsDocument();
      console.log('component response', responseData);
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
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DailyHighImpact data={data} />
        <CountryPieChart data={data} />
        <DailyHighImpact data={data} />
        <CountryPieChart data={data} />
      </div>
      <NewsComponent data={data} />
    </div>
  );
};

export default ParentComponent;
