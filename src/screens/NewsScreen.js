import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import stockApi from '../api/stockApi';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const NewsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const topics = [
    { key: 'all', label: 'All News', value: null },
    { key: 'technology', label: 'Technology', value: 'technology' },
    { key: 'earnings', label: 'Earnings', value: 'earnings' },
    { key: 'financial_markets', label: 'Markets', value: 'financial_markets' },
    { key: 'ipo', label: 'IPO', value: 'ipo' },
    { key: 'economy_monetary', label: 'Economy', value: 'economy_monetary' },
    { key: 'blockchain', label: 'Crypto', value: 'blockchain' },
    { key: 'manufacturing', label: 'Manufacturing', value: 'manufacturing' },
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedTopic]);

  useEffect(() => {
    if (searchQuery === '') {
      fetchNews();
    }
  }, [searchQuery]);

  const fetchNews = async () => {
    try {
      setError(null);
      const tickers = searchQuery.trim() ? searchQuery.toUpperCase() : null;
      const topicValue = selectedTopic === 'all' ? null : selectedTopic;
      
      console.log('Fetching news with:', { tickers, topics: topicValue });
      
      const result = await stockApi.getNewsSentiment(
        tickers,
        topicValue,
        null,
        null,
        'LATEST',
        50
      );

      if (result.feed) {
        setNews(result.feed);
      } else {
        setNews([]);
      }
    } catch (err) {
      setError(err.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  const handleSearch = () => {
    setLoading(true);
    fetchNews();
  };

  const handleTopicSelect = (topic) => {
    if (selectedTopic !== topic.key) {
      setSelectedTopic(topic.key);
      setLoading(true);
    }
  };

  const renderTopicSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.topicContainer}
      contentContainerStyle={styles.topicContent}
    >
      {topics.map((topic) => (
        <TouchableOpacity
          key={topic.key}
          style={[
            styles.topicButton,
            {
              backgroundColor: selectedTopic === topic.key ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => handleTopicSelect(topic)}
        >
          <Text
            style={[
              styles.topicButtonText,
              {
                color: selectedTopic === topic.key ? '#FFFFFF' : theme.colors.text,
              },
            ]}
          >
            {topic.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSearchBar = () => (
    <View style={[styles.searchContainer, { 
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    }]}>
      <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
      <TextInput
        style={[styles.searchInput, { color: theme.colors.text }]}
        placeholder="Search by ticker (e.g., AAPL, TSLA)"
        placeholderTextColor={theme.colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderNewsItem = ({ item }) => (
    <NewsCard
      article={item}
      onPress={(article) => {
        console.log('News article pressed:', article.title);
      }}
      onTickerPress={(ticker) => {
        const mockStock = {
          ticker: ticker,
          price: "150.00",
          change_amount: "2.50",
          change_percentage: "1.69%",
          volume: "50000000"
        };
        navigation.navigate('Product', { stock: mockStock });
      }}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {renderSearchBar()}
      {renderTopicSelector()}
      <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}>
        {news.length} articles found
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner text="Loading market news..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchNews} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface, 
        borderBottomColor: theme.colors.border 
      }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Market News
        </Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="newspaper-outline"
            title="No News Found"
            subtitle={
              searchQuery.trim()
                ? `No articles found for "${searchQuery}"`
                : "No news articles available"
            }
            actionText="Refresh"
            onAction={fetchNews}
          />
        }
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
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
  refreshButton: {
    padding: 8,
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
  topicContainer: {
    marginBottom: 16,
  },
  topicContent: {
    paddingRight: 16,
  },
  topicButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  topicButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsCount: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default NewsScreen; 