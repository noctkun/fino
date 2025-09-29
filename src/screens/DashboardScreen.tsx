import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useSpending } from '../contexts/SpendingContext';
import { THEME } from '../constants/colors';
import { PieChartData } from '../types';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;

const DashboardScreen: React.FC = () => {
  const { state, getMonthlyData } = useSpending();
  
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const yearsWithData = new Set<number>();
    
    // Find all years that have spending data
    state.spendings.forEach(spending => {
      if (spending.year >= currentYear) {
        yearsWithData.add(spending.year);
      }
    });
    
    // Convert to array and sort descending (most recent first)
    return Array.from(yearsWithData).sort((a, b) => b - a);
  };

  const getAvailableMonths = (year: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const monthsWithData = new Set<number>();
    
    // Find all months that have spending data for the given year
    state.spendings.forEach(spending => {
      if (spending.year === year) {
        const spendingMonth = new Date(spending.date).getMonth();
        // Only include months from current month onwards for current year
        if (year === currentYear) {
          if (spendingMonth >= currentMonth) {
            monthsWithData.add(spendingMonth);
          }
        } else {
          // For future years, include all months with data
          monthsWithData.add(spendingMonth);
        }
      }
    });
    
    // Convert to array and sort
    return Array.from(monthsWithData).sort((a, b) => a - b);
  };

  const availableYears = getAvailableYears();
  const [selectedYear, setSelectedYear] = useState(() => {
    return availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();
  });
  
  const availableMonths = getAvailableMonths(selectedYear);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentMonth = new Date().getMonth();
    if (availableMonths.length > 0) {
      return availableMonths[0];
    }
    return currentMonth;
  });
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const chartRef = React.useRef<View>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthData = getMonthlyData(selectedYear).find(
    data => data.month === months[selectedMonth]
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Update available months when selected year changes
  useEffect(() => {
    const newAvailableMonths = getAvailableMonths(selectedYear);
    if (newAvailableMonths.length > 0 && !newAvailableMonths.includes(selectedMonth)) {
      setSelectedMonth(newAvailableMonths[0]);
    }
  }, [selectedYear]);

  const getPieChartData = (): PieChartData[] => {
    if (!currentMonthData) return [];

    return currentMonthData.categories
      .filter(category => category.totalSpent > 0)
      .map((category, index) => ({
        name: category.name,
        population: category.totalSpent,
        color: category.color,
        legendFontColor: THEME.colors.black,
        legendFontSize: 12,
      }));
  };

  const getTotalSpent = (): number => {
    return currentMonthData?.totalSpent || 0;
  };

  const handleCategoryPress = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };

  const handleShare = async () => {
    try {
      if (chartRef.current) {
        const uri = await captureRef(chartRef.current, {
          format: 'png',
          quality: 0.8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share your spending chart',
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share chart');
    }
  };

  const renderCategoryCard = (category: any, index: number) => {
    const isExpanded = expandedCategory === category.name;
    const percentage = getTotalSpent() > 0 
      ? ((category.totalSpent / getTotalSpent()) * 100).toFixed(1)
      : '0';

    return (
      <Animated.View
        key={category.name}
        style={[
          styles.categoryCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.categoryHeader,
            { backgroundColor: category.color + '20' },
          ]}
          onPress={() => handleCategoryPress(category.name)}
          activeOpacity={0.7}
        >
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <View style={styles.categoryDetails}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryAmount}>
                ₹{category.totalSpent.toFixed(2)} ({percentage}%)
              </Text>
            </View>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={THEME.colors.black}
          />
        </TouchableOpacity>

        {isExpanded && (
          <Animated.View
            style={[
              styles.categoryExpanded,
              {
                opacity: fadeAnim,
                transform: [{ scaleY: scaleAnim }],
              },
            ]}
          >
            <View style={styles.expandedContent}>
              <Text style={styles.expandedText}>
                You spent ₹{category.totalSpent.toFixed(2)} on {category.name.toLowerCase()} this month.
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percentage}%`,
                      backgroundColor: category.color,
                    },
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const pieData = getPieChartData();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            })}],
          },
        ]}
      >
        <Text style={styles.greeting}>Welcome to Fino! 💰</Text>
        <Text style={styles.subtitle}>Track your spending smartly</Text>
      </Animated.View>

      {/* Month/Year Selector */}
      {availableYears.length > 0 && availableMonths.length > 0 ? (
        <Animated.View
          style={[
            styles.selectorContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => {
              const currentIndex = availableMonths.indexOf(selectedMonth);
              if (currentIndex > 0) {
                setSelectedMonth(availableMonths[currentIndex - 1]);
              } else if (currentIndex === 0) {
                // Go to previous year
                const currentYearIndex = availableYears.indexOf(selectedYear);
                if (currentYearIndex < availableYears.length - 1) {
                  const prevYear = availableYears[currentYearIndex + 1];
                  const prevYearMonths = getAvailableMonths(prevYear);
                  if (prevYearMonths.length > 0) {
                    setSelectedYear(prevYear);
                    setSelectedMonth(prevYearMonths[prevYearMonths.length - 1]);
                  }
                }
              }
            }}
          >
            <Ionicons name="chevron-back" size={20} color={THEME.colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.monthText}>
            {months[selectedMonth]} {selectedYear}
          </Text>
          
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => {
              const currentIndex = availableMonths.indexOf(selectedMonth);
              if (currentIndex < availableMonths.length - 1) {
                setSelectedMonth(availableMonths[currentIndex + 1]);
              } else if (currentIndex === availableMonths.length - 1) {
                // Go to next year
                const currentYearIndex = availableYears.indexOf(selectedYear);
                if (currentYearIndex > 0) {
                  const nextYear = availableYears[currentYearIndex - 1];
                  const nextYearMonths = getAvailableMonths(nextYear);
                  if (nextYearMonths.length > 0) {
                    setSelectedYear(nextYear);
                    setSelectedMonth(nextYearMonths[0]);
                  }
                }
              }
            }}
          >
            <Ionicons name="chevron-forward" size={20} color={THEME.colors.primary} />
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.selectorContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No spending data available</Text>
            <Text style={styles.noDataSubtext}>Add some expenses to see your dashboard</Text>
          </View>
        </Animated.View>
      )}

      {availableYears.length > 0 && availableMonths.length > 0 && (
        <>
          {/* Total Spending Card */}
          <Animated.View
            style={[
              styles.totalCard,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.totalLabel}>Total Spent This Month</Text>
            <Text style={styles.totalAmount}>₹{getTotalSpent().toFixed(2)}</Text>
          </Animated.View>

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <Animated.View
              ref={chartRef}
              style={[
                styles.chartContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Spending Breakdown</Text>
                <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                  <Ionicons name="share-outline" size={20} color={THEME.colors.primary} />
                </TouchableOpacity>
              </View>
              
              <PieChart
                data={pieData}
                width={chartWidth}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                absolute
              />
            </Animated.View>
          )}

          {/* Categories List */}
          <Animated.View
            style={[
              styles.categoriesContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })}],
              },
            ]}
          >
            <Text style={styles.categoriesTitle}>Categories</Text>
            {currentMonthData?.categories
              .filter(category => category.totalSpent > 0)
              .map((category, index) => renderCategoryCard(category, index))}
          </Animated.View>

          {pieData.length === 0 && (
            <Animated.View
              style={[
                styles.emptyState,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>No spending data yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first expense to see beautiful charts!
              </Text>
            </Animated.View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    padding: THEME.spacing.lg,
    alignItems: 'center',
  },
  greeting: {
    fontSize: THEME.fontSize.xxxl,
    fontWeight: 'bold',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.gray,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  selectorButton: {
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.white,
    ...THEME.shadows.sm,
  },
  monthText: {
    fontSize: THEME.fontSize.lg,
    fontWeight: 'bold',
    color: THEME.colors.black,
    marginHorizontal: THEME.spacing.lg,
  },
  totalCard: {
    backgroundColor: THEME.colors.white,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    ...THEME.shadows.md,
  },
  totalLabel: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.gray,
    marginBottom: THEME.spacing.sm,
  },
  totalAmount: {
    fontSize: THEME.fontSize.xxxl,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  chartContainer: {
    backgroundColor: THEME.colors.white,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    ...THEME.shadows.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  chartTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: 'bold',
    color: THEME.colors.black,
  },
  shareButton: {
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.lightGray,
  },
  categoriesContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
  },
  categoriesTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: 'bold',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.md,
  },
  categoryCard: {
    backgroundColor: THEME.colors.white,
    marginBottom: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    ...THEME.shadows.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: THEME.spacing.md,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: THEME.fontSize.md,
    fontWeight: '600',
    color: THEME.colors.black,
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.gray,
  },
  categoryExpanded: {
    backgroundColor: THEME.colors.lightGray,
    padding: THEME.spacing.md,
  },
  expandedContent: {
    alignItems: 'center',
  },
  expandedText: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.black,
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: THEME.colors.white,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: THEME.spacing.xl,
    marginHorizontal: THEME.spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: THEME.spacing.md,
  },
  emptyTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: 'bold',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.sm,
  },
  emptySubtitle: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.gray,
    textAlign: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  noDataText: {
    fontSize: THEME.fontSize.lg,
    fontWeight: 'bold',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.sm,
  },
  noDataSubtext: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.gray,
    textAlign: 'center',
  },
});

export default DashboardScreen;
