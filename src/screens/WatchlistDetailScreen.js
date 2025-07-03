import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import StockCard from '../components/StockCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const WatchlistDetailScreen = ({ route, navigation }) => {
  const { watchlist: initialWatchlist } = route.params;
  const { theme } = useTheme();
  const { watchlists, removeStockFromWatchlist } = useWatchlist();
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const updatedWatchlist = watchlists.find(w => w.id === initialWatchlist.id);
    if (updatedWatchlist) {
      setWatchlist(updatedWatchlist);
      navigation.setOptions({ title: updatedWatchlist.name });
    }
  }, [watchlists, initialWatchlist.id, navigation]);

  const handleStockPress = (stock) => {
    navigation.navigate('Product', { stock });
  };

  const handleRemoveStock = (stock) => {
    Alert.alert(
      'Remove Stock',
      `Remove ${stock.ticker} from "${watchlist.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeStockFromWatchlist(watchlist.id, stock.ticker);
              Alert.alert('Success', 'Stock removed from watchlist');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove stock from watchlist');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderStockItem = ({ item, index }) => (
    <View style={styles.stockItem}>
      <StockCard
        stock={item}
        onPress={() => handleStockPress(item)}
        style={styles.stockCard}
      />
      <TouchableOpacity
        style={[styles.removeButton, { backgroundColor: theme.colors.error }]}
        onPress={() => handleRemoveStock(item)}
      >
        <Ionicons name="close" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={[styles.watchlistName, { color: theme.colors.text }]}>
          {watchlist.name}
        </Text>
        <Text style={[styles.stockCount, { color: theme.colors.textSecondary }]}>
          {watchlist.stocks.length} {watchlist.stocks.length === 1 ? 'stock' : 'stocks'}
        </Text>
        {watchlist.createdAt && (
          <Text style={[styles.createdDate, { color: theme.colors.textSecondary }]}>
            Created {new Date(watchlist.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="bookmark-outline"
      title="No Stocks in Watchlist"
      subtitle="Add stocks to this watchlist by tapping the bookmark icon on any stock's detail page"
      actionText="Explore Stocks"
      onAction={() => navigation.navigate('Explore')}
    />
  );

  if (!watchlist) {
    return <LoadingSpinner text="Loading watchlist..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={watchlist.stocks}
        renderItem={renderStockItem}
        keyExtractor={(item, index) => `${item.ticker}-${index}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={watchlist.stocks.length > 0 ? styles.row : null}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerContent: {
    alignItems: 'center',
  },
  watchlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  stockCount: {
    fontSize: 16,
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 14,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stockItem: {
    width: '48%',
    marginBottom: 16,
    position: 'relative',
  },
  stockCard: {
    width: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
});

export default WatchlistDetailScreen; 