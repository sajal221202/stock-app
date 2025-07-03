import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import stockApi from '../api/stockApi';
import StockCard from '../components/StockCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

const ExploreScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const result = await stockApi.getTopGainersLosers();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleStockPress = (stock) => {
    navigation.navigate('Product', { stock });
  };

  const handleViewAll = (type, stocks) => {
    navigation.navigate('ViewAll', { 
      type, 
      stocks, 
      title: type === 'gainers' ? 'Top Gainers' : 'Top Losers' 
    });
  };

  const SectionHeader = ({ title, onViewAll, showViewAll = true }) => (
    <View style={[styles.sectionHeader, { borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      {showViewAll && (
        <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
            View All
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderStockGrid = (stocks, type) => (
    <View style={styles.stockGrid}>
      {stocks.slice(0, 6).map((stock, index) => (
        <StockCard
          key={`${stock.ticker}-${index}`}
          stock={stock}
          onPress={() => handleStockPress(stock)}
          style={styles.stockCard}
        />
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Stocks App
          </Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Ionicons 
              name={theme.mode === 'light' ? 'moon' : 'sunny'} 
              size={24} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
        </View>
        <LoadingSpinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Stocks App
          </Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Ionicons 
              name={theme.mode === 'light' ? 'moon' : 'sunny'} 
              size={24} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
        </View>
        <ErrorState
          message={error}
          onRetry={fetchData}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Stocks App
        </Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Ionicons 
            name={theme.mode === 'light' ? 'moon' : 'sunny'} 
            size={24} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {data?.top_gainers && data.top_gainers.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Top Gainers"
              onViewAll={() => handleViewAll('gainers', data.top_gainers)}
            />
            {renderStockGrid(data.top_gainers, 'gainers')}
          </View>
        )}

        {data?.top_losers && data.top_losers.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Top Losers"
              onViewAll={() => handleViewAll('losers', data.top_losers)}
            />
            {renderStockGrid(data.top_losers, 'losers')}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  viewAllButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
  stockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  stockCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 15,
  },
  bottomPadding: {
    height: 100,
  },
});

export default ExploreScreen; 