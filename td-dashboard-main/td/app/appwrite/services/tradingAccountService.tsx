import axios from 'axios';
import { databases, Query } from '@/app/appwrite/appwrite';
import csvtojson from 'csvtojson';

export const listTradeHistory = async (userId: string, apiKey: string) => {
  try {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (
      !process.env.NEXT_PUBLIC_APPWRITE_USER_TRADING_ACCOUNT_DATA_COLLECTION_ID
    ) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_TRADING_ACCOUNT_DATA_COLLECTION_ID is not defined'
      );
    }
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_TRADING_ACCOUNT_DATA_COLLECTION_ID,
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
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID is not defined'
      );
    }
    const response = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID,
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
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID is not defined'
      );
    }
    const response = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID,
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
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID) {
      throw new Error(
        'NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID is not defined'
      );
    }
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID,
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
const processMetaTraderCSVData = async (csv: string) => {
  const jsonArray = await csvtojson({ delimiter: ';' }).fromString(csv);
  return jsonArray
    .filter(({ TYPE }) => TYPE === 'SELL' || TYPE === 'BUY')
    .map(
      ({
        ASSET: Symbol,
        VOLUME: Volume,
        TYPE: Type,
        PROFIT: Profit,
        'OPEN DATE': Open,
        'CLOSE DATE': Close,
      }) => ({
        symbol: Symbol,
        tradeType:
          Type.toLowerCase() === 'buy' ? 'DEAL_TYPE_BUY' : 'DEAL_TYPE_SELL',
        volume: parseFloat(Volume.replace(',', '.')),
        entryPrice: 'null',
        exitPrice: 'null',
        commission: 'null',
        swap: 'null',
        profit: parseFloat(Profit.replace(',', '.')),
        partials: 'null',
        entryTime: Open,
        exitTime: Close,
      })
    );
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
  endDate: Date,
  csvProcessor: string
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
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID is not defined'
        );
      }
      const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID,
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
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (
        !process.env
          .NEXT_PUBLIC_APPWRITE_USER_TRADING_ACCOUNT_DATA_COLLECTION_ID
      ) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_TRADING_ACCOUNT_DATA_COLLECTION_ID is not defined'
        );
      }
      const document = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env
          .NEXT_PUBLIC_APPWRITE_USER_TRADING_ACCOUNT_DATA_COLLECTION_ID,
        'unique()',
        { AccountKey: `${apiKey}`, TradingHistory: `${tradingHistoryString}` }
      );
      console.log('New document created:', document);
    } else if (csvData) {
      const shareURL = accountNumber;
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
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (!process.env.NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID is not defined'
        );
      }
      const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_USER_PROPFIRMGROUPS_COLLECTION_ID,
        userId,
        {
          [propFirm]: updatedPropFirm,
        }
      );
      console.log('Trading account added:', response);
      let tradesData;
      if (csvProcessor === 'processMetaTraderCSVData') {
        tradesData = await processMetaTraderCSVData(csvData);
      } else {
        tradesData = await processCSVData(csvData);
      }

      const tradingHistory = {
        status: 'success',
        startingBalance: accountSize,
        totalTrades: tradesData.length,
        trades: tradesData,
      };

      tradingHistoryString = JSON.stringify(tradingHistory);
      if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
        throw new Error('NEXT_PUBLIC_APPWRITE_DATABASE_ID is not defined');
      }
      if (
        !process.env
          .NEXT_PUBLIC_APPWRITE_USER_TRADING_ACCOUNT_DATA_COLLECTION_ID
      ) {
        throw new Error(
          'NEXT_PUBLIC_APPWRITE_USER_TRADING_ACCOUNT_DATA_COLLECTION_ID is not defined'
        );
      }
      const document = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env
          .NEXT_PUBLIC_APPWRITE_USER_TRADING_ACCOUNT_DATA_COLLECTION_ID,
        'unique()',
        { AccountKey: `${shareURL}`, TradingHistory: `${tradingHistoryString}` }
      );
      console.log('New document created:', document);
    }
  } catch (error) {
    console.error('Trading account addition failed:', error);
  }
};
