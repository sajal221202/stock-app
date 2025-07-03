import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_CONFIG } from '../constants';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWatchlists();
  }, []);

  const loadWatchlists = async () => {
    try {
      setLoading(true);
      const savedWatchlists = await AsyncStorage.getItem(CACHE_CONFIG.KEYS.WATCHLISTS);
      if (savedWatchlists) {
        setWatchlists(JSON.parse(savedWatchlists));
      }
    } catch (error) {
      console.error('Error loading watchlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWatchlists = async (updatedWatchlists) => {
    try {
      await AsyncStorage.setItem(CACHE_CONFIG.KEYS.WATCHLISTS, JSON.stringify(updatedWatchlists));
      setWatchlists(updatedWatchlists);
    } catch (error) {
      console.error('Error saving watchlists:', error);
      throw error;
    }
  };

  const createWatchlist = async (name) => {
    try {
      const newWatchlist = {
        id: Date.now().toString(),
        name,
        stocks: [],
        createdAt: new Date().toISOString(),
      };
      const updatedWatchlists = [...watchlists, newWatchlist];
      await saveWatchlists(updatedWatchlists);
      return newWatchlist;
    } catch (error) {
      console.error('Error creating watchlist:', error);
      throw error;
    }
  };

  const deleteWatchlist = async (watchlistId) => {
    try {
      const updatedWatchlists = watchlists.filter(w => w.id !== watchlistId);
      await saveWatchlists(updatedWatchlists);
    } catch (error) {
      console.error('Error deleting watchlist:', error);
      throw error;
    }
  };

  const addStockToWatchlist = async (watchlistId, stock) => {
    try {
      const updatedWatchlists = watchlists.map(watchlist => {
        if (watchlist.id === watchlistId) {
          const stockExists = watchlist.stocks.some(s => s.ticker === stock.ticker);
          if (!stockExists) {
            return {
              ...watchlist,
              stocks: [...watchlist.stocks, stock],
            };
          }
        }
        return watchlist;
      });
      await saveWatchlists(updatedWatchlists);
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
      throw error;
    }
  };

  const removeStockFromWatchlist = async (watchlistId, stockTicker) => {
    try {
      const updatedWatchlists = watchlists.map(watchlist => {
        if (watchlist.id === watchlistId) {
          return {
            ...watchlist,
            stocks: watchlist.stocks.filter(s => s.ticker !== stockTicker),
          };
        }
        return watchlist;
      });
      await saveWatchlists(updatedWatchlists);
    } catch (error) {
      console.error('Error removing stock from watchlist:', error);
      throw error;
    }
  };

  const isStockInWatchlist = (stockTicker) => {
    return watchlists.some(watchlist => 
      watchlist.stocks.some(stock => stock.ticker === stockTicker)
    );
  };

  const getWatchlistsForStock = (stockTicker) => {
    return watchlists.filter(watchlist =>
      watchlist.stocks.some(stock => stock.ticker === stockTicker)
    );
  };

  const value = {
    watchlists,
    loading,
    createWatchlist,
    deleteWatchlist,
    addStockToWatchlist,
    removeStockFromWatchlist,
    isStockInWatchlist,
    getWatchlistsForStock,
    loadWatchlists,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}; 