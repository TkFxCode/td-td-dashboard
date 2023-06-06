import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import ReactCountryFlag from 'react-country-flag';
import { Separator } from '@/app/components/ui/separator';
import { useUser } from '@/app/appwrite/useUser';
import {
  getUserNewsDocument,
  removeNewsFromUserDocument,
} from '@/app/appwrite/services/NewsService';
import styles from './userNewsComponent.module.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { RefreshNewsContext } from './RefreshNewsContext';
interface NewsEvent {
  title: string;
  country: string;
  date: string;
  time: string;
}

const UserNewsComponent = () => {
  const { user } = useUser();
  const [userNews, setUserNews] = useState<NewsEvent[]>([]);
  const [countdowns, setCountdowns] = useState<string[]>([]);

  const refreshNews = React.useContext(RefreshNewsContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userNewsDocument = await getUserNewsDocument(user.$id);
        if (userNewsDocument) {
          const newsEvents = JSON.parse(userNewsDocument.userNews);
          setUserNews(newsEvents);
        }
      }
    };

    fetchData();
  }, [user, refreshNews]);

  useEffect(() => {
    setCountdowns(
      userNews.map((event: NewsEvent) =>
        calculateCountdown(event.date, event.time)
      )
    );

    const intervalId = setInterval(() => {
      setCountdowns(
        userNews.map((event: NewsEvent) =>
          calculateCountdown(event.date, event.time)
        )
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [userNews]);

  const handleRemoveFromWatchlist = async (newsEvent: NewsEvent) => {
    await removeNewsFromUserDocument(user.$id, newsEvent);

    setUserNews((prevUserNews) =>
      prevUserNews.filter((news) => news.title !== newsEvent.title)
    );
  };
  const calculateCountdown = (dateString: string, timeString: string) => {
    const [month, day, year] = dateString.split('-');
    const [hour, minutePart] = timeString.split(':');
    const minute = minutePart.slice(0, 2);
    const period = minutePart.slice(2);

    let hour24 = parseInt(hour);
    if (period.toLowerCase() === 'pm' && hour24 < 12) {
      hour24 += 12;
    } else if (period.toLowerCase() === 'am' && hour24 === 12) {
      hour24 = 0;
    }

   
    const eventDate = new Date(
      Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hour24,
        parseInt(minute)
      )
    );

    
    const now = new Date();

    
    let diffInMilliseconds = eventDate.getTime() - now.getTime();
    

    if (diffInMilliseconds < 0) {
      return 'Event Passed';
    }

    const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    diffInMilliseconds %= 1000 * 60 * 60;
    const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
    diffInMilliseconds %= 1000 * 60;
    const seconds = Math.floor(diffInMilliseconds / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Card className="w-full pb-2">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold py-2">
            News Watchlist
          </CardTitle>
        </CardHeader>
        {userNews.length === 0 && (
          <CardContent>
            <p className="text-center py-2">
              Select from the table below to create your personalised watchlist
            </p>
          </CardContent>
        )}
        {userNews.map((newsEvent, index) => (
          <Card
            key={index}
            className="mx-2 mb-1 relative flex justify-between items-center z-10"
          >
            <div className="w-full h-[75px] overflow-hidden ">
              <ReactCountryFlag
                countryCode={convertToTwoLetterCode(newsEvent.country)} 
                svg
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                className="absolute z-10 rounded-lg"
              />
              <div className="w-4/5 h-4/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg z-20">
                <Card className="opacity-80 w-full h-full">
                  <div className="flex flex-row opacity-100 items-center justify-evenly h-full">
                    <div className="w-1/3">
                      <p
                        className={`text-sm break-words ${styles.customClamp}`}
                      >
                        {newsEvent.title}
                      </p>
                    </div>

                    <div>
                      <Separator
                        orientation="vertical"
                        className="border-black dark:border-white border-r-2 min-h-[15px]"
                      />
                    </div>

                    <div className="w-1/3">
                      <p
                        className={`text-sm break-words ${styles.customClamp}`}
                      >
                        Countdown: {countdowns[index] || 'Calculating...'}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div className="relative z-30 scale-110 ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <MoreVertical className="mr-2 h-4 rounded-full w-auto bg-primary-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Edit Event</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleRemoveFromWatchlist(newsEvent)}
                  >
                    Remove from Watchlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </Card>
    </>
  );
};

export default UserNewsComponent;

type CurrencyCode =
  | 'NZD'
  | 'AUD'
  | 'CNY'
  | 'EUR'
  | 'CHF'
  | 'GBP'
  | 'USD'
  | 'JPY'
  | 'CAD';

function convertToTwoLetterCode(threeLetterCode: string) {
  const map: Record<CurrencyCode, string> = {
    NZD: 'NZ',
    AUD: 'AU',
    CNY: 'CN',
    EUR: 'EU',
    CHF: 'CH',
    GBP: 'GB',
    USD: 'US',
    JPY: 'JP',
    CAD: 'CA',
  };

  return map[threeLetterCode as CurrencyCode] || 'ALL';
}
