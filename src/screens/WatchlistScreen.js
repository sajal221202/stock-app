import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const WatchlistScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { watchlists, loading, createWatchlist, deleteWatchlist } = useWatchlist();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      Alert.alert('Error', 'Please enter a watchlist name');
      return;
    }

    setCreating(true);
    try {
      await createWatchlist(newWatchlistName.trim());
      setNewWatchlistName('');
      setShowCreateModal(false);
      Alert.alert('Success', 'Watchlist created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create watchlist');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWatchlist = (watchlist) => {
    Alert.alert(
      'Delete Watchlist',
      `Are you sure you want to delete "${watchlist.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWatchlist(watchlist.id);
              Alert.alert('Success', 'Watchlist deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete watchlist');
            }
          },
        },
      ]
    );
  };

  const handleWatchlistPress = (watchlist) => {
    navigation.navigate('WatchlistDetail', { watchlist });
  };

  const renderWatchlistItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.watchlistItem, { 
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
      }]}
      onPress={() => handleWatchlistPress(item)}
    >
      <View style={styles.watchlistContent}>
        <View style={styles.watchlistHeader}>
          <Text style={[styles.watchlistName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={() => handleDeleteWatchlist(item)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.stockCount, { color: theme.colors.textSecondary }]}>
          {item.stocks.length} {item.stocks.length === 1 ? 'stock' : 'stocks'}
        </Text>
        
        {item.stocks.length > 0 && (
          <View style={styles.stockPreview}>
            {item.stocks.slice(0, 3).map((stock, index) => (
              <View key={stock.ticker} style={styles.stockChip}>
                <Text style={[styles.stockTicker, { color: theme.colors.text }]}>
                  {stock.ticker}
                </Text>
              </View>
            ))}
            {item.stocks.length > 3 && (
              <Text style={[styles.moreText, { color: theme.colors.textSecondary }]}>
                +{item.stocks.length - 3} more
              </Text>
            )}
          </View>
        )}
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: theme.colors.modalBackground }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Create New Watchlist
          </Text>
          
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            }]}
            placeholder="Watchlist name"
            placeholderTextColor={theme.colors.textSecondary}
            value={newWatchlistName}
            onChangeText={setNewWatchlistName}
            autoFocus
            maxLength={50}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleCreateWatchlist}
              disabled={creating}
            >
              <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                {creating ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          My Watchlists
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {watchlists.length === 0 ? (
        <EmptyState
          icon="bookmark-outline"
          title="No Watchlists Yet"
          subtitle="Create your first watchlist to start tracking stocks"
          actionText="Create Watchlist"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <FlatList
          data={watchlists}
          renderItem={renderWatchlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderCreateModal()}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  watchlistContent: {
    flex: 1,
  },
  watchlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  watchlistName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
  },
  stockCount: {
    fontSize: 14,
    marginBottom: 8,
  },
  stockPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stockChip: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  stockTicker: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WatchlistScreen; 