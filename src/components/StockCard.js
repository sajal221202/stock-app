import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency, formatPercentage, getChangeColor, isPositiveChange } from '../utils/cache';

const StockCard = ({ stock, onPress, style }) => {
  const { theme } = useTheme();
  
  const changeColor = getChangeColor(stock.change_percentage || stock.change_amount, theme);
  const isPositive = isPositiveChange(stock.change_percentage || stock.change_amount);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.ticker, { color: theme.colors.text }]} numberOfLines={1}>
          {stock.ticker}
        </Text>
        <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
          <Text style={[styles.changePercentage, { color: changeColor }]}>
            {formatPercentage(stock.change_percentage)}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.price, { color: theme.colors.text }]} numberOfLines={1}>
        {formatCurrency(stock.price)}
      </Text>
      
      <View style={styles.changeRow}>
        <Text style={[styles.changeAmount, { color: changeColor }]}>
          {isPositive ? '+' : ''}{formatCurrency(stock.change_amount)}
        </Text>
      </View>
      
      {stock.volume && (
        <Text style={[styles.volume, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          Vol: {stock.volume}
        </Text>
      )}
    </TouchableOpacity>
  );
};

StockCard.propTypes = {
  stock: PropTypes.shape({
    ticker: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    change_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    change_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    volume: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onPress: PropTypes.func,
  style: PropTypes.object,
};

StockCard.defaultProps = {
  onPress: () => {},
  style: {},
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticker: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  changeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  changePercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  volume: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default StockCard; 