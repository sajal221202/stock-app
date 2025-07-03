import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_CONFIG } from '../constants';

export const getCachedData = async (key) => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const parsedData = JSON.parse(cached);
      const now = new Date().getTime();
      
      if (parsedData.timestamp && (now - parsedData.timestamp) > CACHE_CONFIG.EXPIRATION_TIME) {
        await AsyncStorage.removeItem(key);
        return null;
      }
      
      return parsedData.data;
    }
    return null;
  } catch (error) {
    console.error('Error reading cached data:', error);
    return null;
  }
};

export const setCachedData = async (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: new Date().getTime(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const clearCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => 
      key.startsWith('topGainersLosers') || 
      key.startsWith('companyOverview_') || 
      key.startsWith('timeSeries_') || 
      key.startsWith('search_')
    );
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

export const formatCurrency = (value, currency = 'USD') => {
  if (!value) return '$0.00';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numValue);
};

export const formatPercentage = (value) => {
  if (!value) return '0.00%';
  const stringValue = value.toString();
  if (stringValue.includes('%')) return stringValue;
  return `${parseFloat(value).toFixed(2)}%`;
};

export const formatVolume = (volume) => {
  if (!volume) return '0';
  const num = typeof volume === 'string' ? parseInt(volume) : volume;
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatMarketCap = (marketCap) => {
  if (!marketCap) return 'N/A';
  const num = typeof marketCap === 'string' ? parseInt(marketCap) : marketCap;
  
  if (num >= 1000000000000) {
    return `$${(num / 1000000000000).toFixed(2)}T`;
  }
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  }
  return `$${num.toLocaleString()}`;
};

export const isPositiveChange = (changeValue) => {
  if (!changeValue) return false;
  const stringValue = changeValue.toString();
  return !stringValue.startsWith('-');
};

export const getChangeColor = (changeValue, theme) => {
  return isPositiveChange(changeValue) ? theme.colors.positive : theme.colors.negative;
}; 