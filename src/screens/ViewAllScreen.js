import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import StockCard from '../components/StockCard';
import EmptyState from '../components/EmptyState';

const ViewAllScreen = ({ route, navigation }) => {
  const { stocks, title, type } = route.params;
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks;

    if (searchQuery.trim()) {
      filtered = stocks.filter(stock =>
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case 'alphabetical':
        sorted.sort((a, b) => a.ticker.localeCompare(b.ticker));
        break;
      case 'price':
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'change':
        sorted.sort((a, b) => {
          const changeA = parseFloat(a.change_percentage?.replace('%', '') || '0');
          const changeB = parseFloat(b.change_percentage?.replace('%', '') || '0');
          return changeB - changeA;
        });
        break;
      default:
        break;
    }

    return sorted;
  }, [stocks, searchQuery, sortBy]);

  const handleStockPress = (stock) => {
    navigation.navigate('Product', { stock });
  };

  const renderStockItem = ({ item, index }) => (
    <View style={styles.stockItem}>
      <StockCard
        stock={item}
        onPress={() => handleStockPress(item)}
        style={styles.stockCard}
      />
    </View>
  );

  const renderSortButton = (label, value) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        {
          backgroundColor: sortBy === value ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => setSortBy(value)}
    >
      <Text
        style={[
          styles.sortButtonText,
          {
            color: sortBy === value ? '#FFFFFF' : theme.colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={[styles.searchContainer, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search stocks..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: theme.colors.text }]}>
          Sort by:
        </Text>
        <View style={styles.sortButtons}>
          {renderSortButton('Default', 'default')}
          {renderSortButton('Name', 'alphabetical')}
          {renderSortButton('Price', 'price')}
          {renderSortButton('Change', 'change')}
        </View>
      </View>

      <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}>
        {filteredAndSortedStocks.length} {filteredAndSortedStocks.length === 1 ? 'stock' : 'stocks'}
        {searchQuery.trim() && ` matching "${searchQuery}"`}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={filteredAndSortedStocks}
        renderItem={renderStockItem}
        keyExtractor={(item, index) => `${item.ticker}-${index}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No Results"
            subtitle={
              searchQuery.trim()
                ? `No stocks found matching "${searchQuery}"`
                : "No stocks available"
            }
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * Math.floor(index / 2),
          index,
        })}
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
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  sortContainer: {
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsCount: {
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stockItem: {
    width: '48%',
    marginBottom: 16,
  },
  stockCard: {
    width: '100%',
  },
});

export default ViewAllScreen; 