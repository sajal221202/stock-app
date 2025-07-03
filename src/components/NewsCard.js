import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const NewsCard = ({ article, onPress, onTickerPress }) => {
  const { theme } = useTheme();

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'Bullish') return theme.colors.positive;
    if (sentiment === 'Bearish') return theme.colors.negative;
    return theme.colors.neutral;
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'Bullish') return 'trending-up';
    if (sentiment === 'Bearish') return 'trending-down';
    return 'remove';
  };

  const formatTimeAgo = (timeString) => {
    try {
      const now = new Date();
      let articleTime;
      
      // Handle different date formats
      if (timeString.includes('T')) {
        // ISO format: "20221201T1030"
        if (timeString.length === 13 && !timeString.includes(':')) {
          const year = timeString.substring(0, 4);
          const month = timeString.substring(4, 6);
          const day = timeString.substring(6, 8);
          const hour = timeString.substring(9, 11);
          const minute = timeString.substring(11, 13);
          articleTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`);
        } else {
          // Standard ISO format
          articleTime = new Date(timeString);
        }
      } else {
        // Regular date string
        articleTime = new Date(timeString);
      }
      
      // Check if date is valid
      if (isNaN(articleTime.getTime())) {
        return 'Recently';
      }
      
      const diffInMilliseconds = now - articleTime;
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays < 7) return `${diffInDays}d ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
      
      return articleTime.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error, timeString);
      return 'Recently';
    }
  };

  const handlePress = () => {
    if (article.url) {
      Linking.openURL(article.url);
    }
    if (onPress) onPress(article);
  };

  const handleTickerPress = (ticker) => {
    if (onTickerPress) {
      onTickerPress(ticker);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { 
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
      }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {article.banner_image && (
        <Image
          source={{ uri: article.banner_image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.source, { color: theme.colors.primary }]} numberOfLines={1}>
            {article.source || 'Market News'}
          </Text>
          <View style={styles.sentimentContainer}>
            <Ionicons
              name={getSentimentIcon(article.overall_sentiment_label)}
              size={14}
              color={getSentimentColor(article.overall_sentiment_label)}
            />
            <Text style={[styles.sentiment, { 
              color: getSentimentColor(article.overall_sentiment_label) 
            }]}>
              {article.overall_sentiment_label || 'Neutral'}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={3}>
          {article.title}
        </Text>
        
        <Text style={[styles.summary, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {article.summary}
        </Text>
        
        <View style={styles.footer}>
          <Text style={[styles.timeAgo, { color: theme.colors.textSecondary }]}>
            {formatTimeAgo(article.time_published)}
          </Text>
          {article.ticker_sentiment && article.ticker_sentiment.length > 0 && (
            <View style={styles.tickerContainer}>
              {article.ticker_sentiment.slice(0, 3).map((ticker, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTickerPress(ticker.ticker)}
                >
                  <Text
                    style={[styles.ticker, { 
                      backgroundColor: theme.colors.primary + '20',
                      color: theme.colors.primary 
                    }]}
                  >
                    {ticker.ticker}
                  </Text>
                </TouchableOpacity>
              ))}
              {article.ticker_sentiment.length > 3 && (
                <Text style={[styles.moreTickers, { color: theme.colors.textSecondary }]}>
                  +{article.ticker_sentiment.length - 3}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  source: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentiment: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: 12,
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticker: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  moreTickers: {
    fontSize: 10,
    marginLeft: 4,
  },
});

export default NewsCard; 