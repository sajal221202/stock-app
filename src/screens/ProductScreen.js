import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import stockApi from '../api/stockApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import {
  formatCurrency,
  formatPercentage,
  formatMarketCap,
  getChangeColor,
  isPositiveChange,
} from '../utils/cache';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CHART_MARGIN = 40;
const CHART_PADDING = 40;
const CHART_WIDTH = screenWidth - CHART_MARGIN - CHART_PADDING;
const CHART_HEIGHT = Math.min(220, screenHeight * 0.25);

const ProductScreen = ({ route, navigation }) => {
  const { stock } = route.params;
  const { theme } = useTheme();
  const {
    watchlists,
    addStockToWatchlist,
    removeStockFromWatchlist,
    isStockInWatchlist,
    createWatchlist,
  } = useWatchlist();

  const [stockDetails, setStockDetails] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    fetchStockData();
    setIsInWatchlist(isStockInWatchlist(stock.ticker));
  }, [stock.ticker]);

  const fetchStockData = async () => {
    try {
      setError(null);
      const [overview, timeSeries] = await Promise.all([
        stockApi.getCompanyOverview(stock.ticker),
        stockApi.getTimeSeriesDaily(stock.ticker),
      ]);

      setStockDetails(overview);
      
      if (timeSeries['Time Series (Daily)']) {
        const dailyData = timeSeries['Time Series (Daily)'];
        const dates = Object.keys(dailyData).slice(0, 30).reverse();
        const prices = dates.map(date => {
          const price = parseFloat(dailyData[date]['4. close']);
          return isNaN(price) ? 0 : price;
        }).filter(price => price > 0);
        
        if (prices.length > 0) {
          const labels = dates.slice(0, prices.length).map((date, index) => {
            if (index % 5 === 0 || index === dates.length - 1) {
              return date.split('-')[1] + '/' + date.split('-')[2];
            }
            return '';
          });
          
          setChartData({
            labels: labels,
            datasets: [{
              data: prices,
              color: (opacity = 1) => theme.colors.primary,
              strokeWidth: 2,
            }],
          });
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      Alert.alert(
        'Remove from Watchlist',
        'Remove this stock from all watchlists?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              try {
                const watchlistsWithStock = watchlists.filter(w =>
                  w.stocks.some(s => s.ticker === stock.ticker)
                );
                for (const watchlist of watchlistsWithStock) {
                  await removeStockFromWatchlist(watchlist.id, stock.ticker);
                }
                setIsInWatchlist(false);
                Alert.alert('Success', 'Stock removed from watchlists');
              } catch (error) {
                Alert.alert('Error', 'Failed to remove stock from watchlists');
              }
            },
          },
        ]
      );
    } else {
      setShowWatchlistModal(true);
    }
  };

  const handleAddToWatchlist = async (watchlistId) => {
    try {
      await addStockToWatchlist(watchlistId, {
        ticker: stock.ticker,
        price: stock.price,
        change_percentage: stock.change_percentage,
        change_amount: stock.change_amount,
      });
      setIsInWatchlist(true);
      setShowWatchlistModal(false);
      Alert.alert('Success', 'Stock added to watchlist');
    } catch (error) {
      Alert.alert('Error', 'Failed to add stock to watchlist');
    }
  };

  const handleCreateAndAddToWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      Alert.alert('Error', 'Please enter a watchlist name');
      return;
    }

    try {
      const newWatchlist = await createWatchlist(newWatchlistName.trim());
      await handleAddToWatchlist(newWatchlist.id);
      setNewWatchlistName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create watchlist');
    }
  };

  const renderWatchlistModal = () => (
    <Modal
      visible={showWatchlistModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowWatchlistModal(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: theme.colors.modalBackground }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Add to Watchlist
            </Text>
            <TouchableOpacity onPress={() => setShowWatchlistModal(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={watchlists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.watchlistOption, { borderBottomColor: theme.colors.border }]}
                onPress={() => handleAddToWatchlist(item.id)}
              >
                <Text style={[styles.watchlistOptionText, { color: theme.colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.stockCount, { color: theme.colors.textSecondary }]}>
                  {item.stocks.length} stocks
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No watchlists yet
              </Text>
            }
          />

          <View style={styles.createSection}>
            <Text style={[styles.createLabel, { color: theme.colors.text }]}>
              Or create a new watchlist:
            </Text>
            <View style={styles.createRow}>
              <TextInput
                style={[styles.createInput, {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }]}
                placeholder="Watchlist name"
                placeholderTextColor={theme.colors.textSecondary}
                value={newWatchlistName}
                onChangeText={setNewWatchlistName}
              />
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleCreateAndAddToWatchlist}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return <LoadingSpinner text="Loading stock details..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchStockData} />;
  }

  const changeColor = getChangeColor(stock.change_percentage || stock.change_amount, theme);
  const isPositive = isPositiveChange(stock.change_percentage || stock.change_amount);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.ticker, { color: theme.colors.text }]}>
              {stock.ticker}
            </Text>
            <Text style={[styles.companyName, { color: theme.colors.textSecondary }]}>
              {stockDetails?.Name || `${stock.ticker} Inc.`}
            </Text>
            
            <View style={styles.priceSection}>
              <Text style={[styles.price, { color: theme.colors.text }]}>
                {formatCurrency(stock.price)}
              </Text>
              <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
                <Text style={[styles.change, { color: changeColor }]}>
                  {isPositive ? '+' : ''}{formatCurrency(stock.change_amount)} ({formatPercentage(stock.change_percentage)})
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.watchlistButton, {
              backgroundColor: isInWatchlist ? theme.colors.positive : theme.colors.primary,
            }]}
            onPress={handleWatchlistToggle}
          >
            <Ionicons
              name={isInWatchlist ? "bookmark" : "bookmark-outline"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.chartContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Price Chart (30 days)
          </Text>
          {chartData ? (
            <View style={styles.chartWrapper}>
              <LineChart
                data={chartData}
                width={CHART_WIDTH}
                height={CHART_HEIGHT}
                chartConfig={{
                  backgroundColor: theme.colors.card,
                  backgroundGradientFrom: theme.colors.card,
                  backgroundGradientTo: theme.colors.card,
                  decimalPlaces: 2,
                  color: () => theme.colors.primary,
                  labelColor: () => theme.colors.textSecondary,
                  strokeWidth: 2,
                  barPercentage: 0.5,
                  useShadowColorFromDataset: false,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "0",
                    strokeWidth: "0",
                    stroke: theme.colors.primary,
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: "",
                    strokeOpacity: 0.1,
                    stroke: theme.colors.textSecondary,
                  },
                  propsForLabels: {
                    fontSize: 12,
                  },
                  fillShadowGradient: theme.colors.primary,
                  fillShadowGradientOpacity: 0.1,
                }}
                bezier
                style={styles.chart}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                withInnerLines={false}
                withOuterLines={false}
              />
            </View>
          ) : (
            <View style={styles.chartPlaceholder}>
              <Ionicons 
                name="analytics-outline" 
                size={48} 
                color={theme.colors.textSecondary} 
              />
              <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
                Chart data not available
              </Text>
            </View>
          )}
        </View>

        {stockDetails && (
          <View style={[styles.detailsContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Company Details
            </Text>
            
            <View style={styles.detailsGrid}>
              <DetailItem
                label="Market Cap"
                value={formatMarketCap(stockDetails.MarketCapitalization)}
                theme={theme}
              />
              <DetailItem
                label="P/E Ratio"
                value={stockDetails.PERatio || 'N/A'}
                theme={theme}
              />
              <DetailItem
                label="52W High"
                value={formatCurrency(stockDetails['52WeekHigh'])}
                theme={theme}
              />
              <DetailItem
                label="52W Low"
                value={formatCurrency(stockDetails['52WeekLow'])}
                theme={theme}
              />
              <DetailItem
                label="Dividend Yield"
                value={stockDetails.DividendYield ? `${(parseFloat(stockDetails.DividendYield) * 100).toFixed(2)}%` : 'N/A'}
                theme={theme}
              />
              <DetailItem
                label="Beta"
                value={stockDetails.Beta || 'N/A'}
                theme={theme}
              />
            </View>
            
            {stockDetails.Description && (
              <View style={styles.descriptionContainer}>
                <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>
                  About
                </Text>
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                  {stockDetails.Description}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      
      {renderWatchlistModal()}
    </View>
  );
};

const DetailItem = ({ label, value, theme }) => (
  <View style={styles.detailItem}>
    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
      {label}
    </Text>
    <Text style={[styles.detailValue, { color: theme.colors.text }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    margin: 20,
    marginBottom: 10,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flex: 1,
  },
  ticker: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    marginBottom: 16,
  },
  priceSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  changeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
  },
  watchlistButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    margin: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  chartPlaceholder: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  detailsContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  watchlistOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  watchlistOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  stockCount: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
  createSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  createLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 12,
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ProductScreen; 