import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSpending } from '../contexts/SpendingContext';
import { THEME } from '../constants/colors';
import { Spending } from '../types';

const HistoryScreen: React.FC = () => {
  const { state, deleteSpending } = useSpending();
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const triggerAnimations = useCallback(() => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useFocusEffect(triggerAnimations);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleDeleteSpending = (spending: Spending) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${spending.description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSpending(spending.id),
        },
      ]
    );
  };

  const getCategoryIcon = (categoryName: string): string => {
    const category = state.categories.find(cat => cat.name === categoryName);
    return category?.icon || '📝';
  };

  const getCategoryColor = (categoryName: string): string => {
    const category = state.categories.find(cat => cat.name === categoryName);
    return category?.color || THEME.colors.gray;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSpendingItem = ({ item, index }: { item: Spending; index: number }) => {
    const categoryColor = getCategoryColor(item.category);
    const categoryIcon = getCategoryIcon(item.category);

    return (
      <Animated.View
        style={[
          styles.spendingItem,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.spendingContent}
          onPress={() => {
            Alert.alert(
              'Expense Details',
              `Amount: ₹${item.amount.toFixed(2)}\nCategory: ${item.category}\nDescription: ${item.description}\nDate: ${formatDate(item.date)}\nTime: ${formatTime(item.date)}`,
              [{ text: 'OK' }]
            );
          }}
          activeOpacity={0.7}
        >
          <View style={styles.spendingLeft}>
            <View
              style={[
                styles.categoryIconContainer,
                { backgroundColor: categoryColor + '20' },
              ]}
            >
              <Text style={styles.categoryIcon}>{categoryIcon}</Text>
            </View>
            <View style={styles.spendingDetails}>
              <Text style={styles.description} numberOfLines={1}>
                {item.description}
              </Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.date}>
                {formatDate(item.date)} • {formatTime(item.date)}
              </Text>
            </View>
          </View>
          <View style={styles.spendingRight}>
            <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteSpending(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color={THEME.colors.gray} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View
      style={[
        styles.emptyState,
        {
          opacity: fadeAnim,
          transform: [{ scale: fadeAnim }],
        },
      ]}
    >
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No spending history yet</Text>
      <Text style={styles.emptySubtitle}>
        Start adding expenses to see your spending history here!
      </Text>
    </Animated.View>
  );

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.title}>Spending History</Text>
      <Text style={styles.subtitle}>
        {state.spendings.length} expense{state.spendings.length !== 1 ? 's' : ''} recorded
      </Text>
    </Animated.View>
  );

  const sortedSpendings = [...state.spendings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedSpendings}
        renderItem={renderSpendingItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[THEME.colors.primary]}
            tintColor={THEME.colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  listContainer: {
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  title: {
    fontSize: THEME.fontSize.xxxl,
    fontWeight: 'bold',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.gray,
  },
  spendingItem: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.borderRadius.lg,
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.sm,
  },
  spendingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  spendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  categoryIcon: {
    fontSize: 20,
  },
  spendingDetails: {
    flex: 1,
  },
  description: {
    fontSize: THEME.fontSize.md,
    fontWeight: '600',
    color: THEME.colors.black,
    marginBottom: 2,
  },
  category: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.gray,
    marginBottom: 2,
  },
  date: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.gray,
  },
  spendingRight: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: THEME.fontSize.lg,
    fontWeight: 'bold',
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.xs,
  },
  deleteButton: {
    padding: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.lightGray,
  },
  emptyState: {
    alignItems: 'center',
    padding: THEME.spacing.xl,
    marginTop: THEME.spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: THEME.spacing.lg,
  },
  emptyTitle: {
    fontSize: THEME.fontSize.xl,
    fontWeight: 'bold',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HistoryScreen;
