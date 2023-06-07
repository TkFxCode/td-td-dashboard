import axios from 'axios';
import { account, databases, Query } from '@/app/appwrite/appwrite';
import csvtojson from 'csvtojson';

export const listTradeHistory = async (userId: string, apiKey: string) => {
  try {
    const response = await databases.listDocuments(
      '6456b05eb0764a873d05',
      '646fba38d877c98f969c',
      [Query.equal('AccountKey', apiKey)]
    );
    // console.log(response);

    return response;
  } catch (error) {
    console.error('Failed to fetch trading account document:', error);
    return null;
  }
};

export const getallTradingAccountDocument = async (userId: string) => {
  try {
    const response = await databases.getDocument(
      '6456b05eb0764a873d05',
      '646f2225aa07cd89f076',
      userId
    );
    const accounts = [
      ...response['personal-accounts'],
      ...response['FTMO'],
      ...response['MyForexFunds'],
      ...response['MyFundedFx'],
      ...response['BespokeFunding'],
      ...response['TrueForexFunds'],
    ];
    return accounts;
  } catch (error) {
    console.error('Failed to fetch trading account document:', error);
    return [];
  }
};

export const getTradingAccountDocument = async (userId: string) => {
  try {
    const response = await databases.getDocument(
      '6456b05eb0764a873d05',
      '646f2225aa07cd89f076',
      userId
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch trading account document:', error);
    return null;
  }
};

export const createTradingAccountDocument = async (userId: string) => {
  try {
    const response = await databases.createDocument(
      '6456b05eb0764a873d05',
      '646f2225aa07cd89f076',
      `${userId}`,
      {
        UserId: userId,
        'personal-accounts': [],
        FTMO: [],
        MyForexFunds: [],
        MyFundedFx: [],
        BespokeFunding: [],
        TrueForexFunds: [],
      }
    );
    console.log('Trading account document created:', response);
    return response;
  } catch (error) {
    console.error('Trading account document creation failed:', error);
    return null;
  }
};

export const addTradingAccount = async (
  userId: string,
  propFirm: string,
  accountSize: string,
  accountPhase: string,
  accountNumber: string,
  shareURL: string,
  csvData: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const processCSVData = async (csv: string) => {
      const jsonArray = await csvtojson({ delimiter: ';' }).fromString(csv);
      return jsonArray.map(
        ({
          Ticket,
          Open,
          Type,
          Volume,
          Symbol,
          OpenPrice,
          SL,
          TP,
          Close,
          ClosePrice,
          Swap,
          Commissions,
          Profit,
          Pips,
          'Trade duration in seconds': duration,
          Partials = '0',
        }) => ({
          symbol: Symbol,
          tradeType:
            Type.toLowerCase() === 'buy' ? 'DEAL_TYPE_BUY' : 'DEAL_TYPE_SELL',
          volume: parseFloat(Volume),
          entryPrice: parseFloat(OpenPrice),
          exitPrice: parseFloat(ClosePrice),
          commission: parseFloat(Commissions),
          swap: parseFloat(Swap),
          profit: parseFloat(Profit),
          partials: parseInt(Partials),
          entryTime: Open,
          exitTime: Close,
        })
      );
    };

    let userDoc = await getTradingAccountDocument(userId);

    if (!userDoc) {
      userDoc = await createTradingAccountDocument(userId);
    }

    if (!userDoc) {
      console.error('Failed to fetch or create trading account document');
      return;
    }

    let tradingHistoryString = '';
    if (shareURL) {
      const updatedPropFirm = userDoc[propFirm] || [];
      updatedPropFirm.push(
        JSON.stringify({
          propFirm,
          shareURL,
          accountSize,
          accountPhase,
          accountNumber,
          startDate,
          endDate,
        })
      );

      const response = await databases.updateDocument(
        '6456b05eb0764a873d05',
        '646f2225aa07cd89f076',
        userId,
        {
          [propFirm]: updatedPropFirm,
        }
      );
      console.log('Trading account added:', response);

      console.log(shareURL);
      const apiKey = shareURL.split('share/')[1];
      console.log(apiKey);

      const apiResponse = await axios.get(`/api/trades/${apiKey}`);
      const tradingHistory = apiResponse.data;
      tradingHistoryString = JSON.stringify(tradingHistory);

      const document = await databases.createDocument(
        '6456b05eb0764a873d05',
        '646fba38d877c98f969c',
        'unique()',
        { AccountKey: `${apiKey}`, TradingHistory: `${tradingHistoryString}` }
      );
      console.log('New document created:', document);
    } else if (csvData) {
      const shareURL = '39847232910847';
      const updatedPropFirm = userDoc[propFirm] || [];
      updatedPropFirm.push(
        JSON.stringify({
          propFirm,
          shareURL,
          accountSize,
          accountPhase,
          accountNumber,
          startDate,
          endDate,
        })
      );

      const response = await databases.updateDocument(
        '6456b05eb0764a873d05',
        '646f2225aa07cd89f076',
        userId,
        {
          [propFirm]: updatedPropFirm,
        }
      );
      console.log('Trading account added:', response);
      const tradesData = await processCSVData(csvData);

      const tradingHistory = {
        status: 'success',
        startingBalance: 10000,
        totalTrades: tradesData.length,
        trades: tradesData,
      };

      tradingHistoryString = JSON.stringify(tradingHistory);

      const document = await databases.createDocument(
        '6456b05eb0764a873d05',
        '646fba38d877c98f969c',
        'unique()',
        { AccountKey: `${shareURL}`, TradingHistory: `${tradingHistoryString}` }
      );
      console.log('New document created:', document);
    }
  } catch (error) {
    console.error('Trading account addition failed:', error);
  }
};
