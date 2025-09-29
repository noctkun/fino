import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useSpending } from '../contexts/SpendingContext';
import { THEME } from '../constants/colors';
import { PieChartData } from '../types';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;

const AnalysisScreen: React.FC = () => {
  const { state, getMonthlyData, getCategorySpending } = useSpending();
  
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

  const [selectedYear, setSelectedYear] = useState(() => {
    const availableYears = getAvailableYears();
    return availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const years = getAvailableYears();

  useEffect(() => {
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
  }, []);

  const getYearlyData = () => {
    const monthlyData = getMonthlyData(selectedYear);
    const totalSpent = monthlyData.reduce((sum, month) => sum + month.totalSpent, 0);
    
    const categoryTotals = state.categories.map(category => {
      const categorySpent = getCategorySpending(category.id, selectedYear);
      return {
        ...category,
        totalSpent: categorySpent,
      };
    }).filter(category => category.totalSpent > 0);

    return {
      totalSpent,
      categoryTotals,
      monthlyData: monthlyData.filter(month => month.totalSpent > 0), // Only include months with data
    };
  };

  const getPieChartData = (): PieChartData[] => {
    const { categoryTotals } = getYearlyData();
    
    return categoryTotals.map((category, index) => ({
      name: category.name,
      population: category.totalSpent,
      color: category.color,
      legendFontColor: THEME.colors.black,
      legendFontSize: 12,
    }));
  };

  const getTopCategory = () => {
    const { categoryTotals } = getYearlyData();
    return categoryTotals.reduce((top, category) => 
      category.totalSpent > top.totalSpent ? category : top, 
      { totalSpent: 0, name: 'None' }
    );
  };


  const renderYearSelector = () => {
    if (years.length === 0) {
      return (
        <Animated.View
          style={[
            styles.yearSelector,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No spending data available</Text>
            <Text style={styles.noDataSubtext}>Add some expenses to see analysis</Text>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.yearSelector,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.yearSelectorContent}
        >
          {years.map(year => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearButton,
                selectedYear === year && styles.yearButtonActive,
              ]}
              onPress={() => setSelectedYear(year)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.yearButtonText,
                  selectedYear === year && styles.yearButtonTextActive,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderSummaryCards = () => {
    const { totalSpent, categoryTotals } = getYearlyData();
    const topCategory = getTopCategory();
    const averageSpending = totalSpent / 12;

    return (
      <Animated.View
        style={[
          styles.summaryContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: THEME.colors.primary }]}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>₹{totalSpent.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: THEME.colors.secondary }]}>
            <Text style={styles.summaryLabel}>Categories</Text>
            <Text style={styles.summaryValue}>{categoryTotals.length}</Text>
          </View>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: THEME.colors.accent }]}>
            <Text style={styles.summaryLabel}>Monthly Avg</Text>
            <Text style={styles.summaryValue}>₹{averageSpending.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: THEME.colors.warning }]}>
            <Text style={styles.summaryLabel}>Top Category</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>
              {topCategory.name}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderPieChart = () => {
    const pieData = getPieChartData();
    
    if (pieData.length === 0) {
      return (
        <Animated.View
          style={[
            styles.emptyChart,
            {
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }],
            },
          ]}
        >
          <Text style={styles.emptyChartIcon}>📊</Text>
          <Text style={styles.emptyChartText}>No data for {selectedYear}</Text>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.chartContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }],
          },
        ]}
      >
        <Text style={styles.chartTitle}>Yearly Spending Breakdown</Text>
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
    );
  };

  const renderCategoryDetails = () => {
    const { categoryTotals } = getYearlyData();
    const totalSpent = categoryTotals.reduce((sum, cat) => sum + cat.totalSpent, 0);

    const getCategoryExpenses = (categoryName: string) => {
      return state.spendings
        .filter(spending => 
          spending.category === categoryName && 
          spending.year === selectedYear
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    return (
      <Animated.View
        style={[
          styles.categoryDetailsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.categoryDetailsTitle}>Category Breakdown</Text>
        {categoryTotals.map((category, index) => {
          const percentage = totalSpent > 0 
            ? ((category.totalSpent / totalSpent) * 100).toFixed(1)
            : '0';
          const isExpanded = selectedCategory === category.name;
          const categoryExpenses = getCategoryExpenses(category.name);
          
          return (
            <View key={category.id}>
              <TouchableOpacity
                style={[
                  styles.categoryDetailItem,
                  isExpanded && styles.categoryDetailItemSelected,
                ]}
                onPress={() => setSelectedCategory(
                  isExpanded ? null : category.name
                )}
                activeOpacity={0.7}
              >
                <View style={styles.categoryDetailLeft}>
                  <View
                    style={[
                      styles.categoryDetailIcon,
                      { backgroundColor: category.color + '20' },
                    ]}
                  >
                    <Text style={styles.categoryDetailIconText}>{category.icon}</Text>
                  </View>
                  <View style={styles.categoryDetailInfo}>
                    <Text style={styles.categoryDetailName}>{category.name}</Text>
                    <Text style={styles.categoryDetailAmount}>
                      ₹{category.totalSpent.toFixed(2)} ({percentage}%)
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={THEME.colors.gray}
                />
              </TouchableOpacity>

              {isExpanded && (
                <Animated.View
                  style={[
                    styles.expandedExpensesContainer,
                    {
                      opacity: fadeAnim,
                      transform: [{ scaleY: fadeAnim }],
                    },
                  ]}
                >
                  <Text style={styles.expandedExpensesTitle}>
                    Individual Expenses ({categoryExpenses.length})
                  </Text>
                  {categoryExpenses.length > 0 ? (
                    categoryExpenses.map((expense, expenseIndex) => (
                      <View key={expense.id} style={styles.expenseItem}>
                        <View style={styles.expenseLeft}>
                          <View style={styles.expenseAmountContainer}>
                            <Text style={styles.expenseAmount}>₹{expense.amount.toFixed(2)}</Text>
                          </View>
                          <View style={styles.expenseDetails}>
                            <Text style={styles.expenseDescription} numberOfLines={2}>
                              {expense.description}
                            </Text>
                            <Text style={styles.expenseDate}>
                              {formatDate(expense.date)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={styles.noExpensesContainer}>
                      <Text style={styles.noExpensesText}>No expenses found for this category</Text>
                    </View>
                  )}
                </Animated.View>
              )}
            </View>
          );
        })}
      </Animated.View>
    );
  };


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Detailed Analysis</Text>
        <Text style={styles.subtitle}>Insights into your spending patterns</Text>
      </Animated.View>

      {renderYearSelector()}
      
      {years.length > 0 && (
        <>
          {renderSummaryCards()}
          {renderPieChart()}
          {renderCategoryDetails()}
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
    alignItems: 'center',
    padding: THEME.spacing.lg,
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
    textAlign: 'center',
  },
  yearSelector: {
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  yearSelectorContent: {
    paddingHorizontal: THEME.spacing.sm,
  },
  yearButton: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    marginHorizontal: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.lg,
    backgroundColor: THEME.colors.white,
    ...THEME.shadows.sm,
  },
  yearButtonActive: {
    backgroundColor: THEME.colors.primary,
  },
  yearButtonText: {
    fontSize: THEME.fontSize.md,
    fontWeight: '600',
    color: THEME.colors.gray,
  },
  yearButtonTextActive: {
    color: THEME.colors.white,
  },
  summaryContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.md,
  },
  summaryCard: {
    flex: 1,
    padding: THEME.spacing.md,
    marginHorizontal: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    ...THEME.shadows.sm,
  },
  summaryLabel: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.white,
    marginBottom: THEME.spacing.xs,
    opacity: 0.9,
  },
  summaryValue: {
    fontSize: THEME.fontSize.lg,
    fontWeight: 'bold',
    color: THEME.colors.white,
  },
  chartContainer: {
    backgroundColor: THEME.colors.white,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    ...THEME.shadows.md,
  },
  chartTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: 'bold',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.md,
  },
  emptyChart: {
    backgroundColor: THEME.colors.white,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    padding: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    ...THEME.shadows.md,
  },
  emptyChartIcon: {
    fontSize: 48,
    marginBottom: THEME.spacing.md,
  },
  emptyChartText: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.gray,
  },
  categoryDetailsContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  categoryDetailsTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: 'bold',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.md,
  },
  categoryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.white,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.lg,
    ...THEME.shadows.sm,
  },
  categoryDetailItemSelected: {
    backgroundColor: THEME.colors.lightGray,
  },
  categoryDetailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDetailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  categoryDetailIconText: {
    fontSize: 18,
  },
  categoryDetailInfo: {
    flex: 1,
  },
  categoryDetailName: {
    fontSize: THEME.fontSize.md,
    fontWeight: '600',
    color: THEME.colors.black,
    marginBottom: 2,
  },
  categoryDetailAmount: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.gray,
  },
  expandedExpensesContainer: {
    backgroundColor: THEME.colors.lightGray,
    padding: THEME.spacing.md,
    marginTop: -THEME.spacing.sm,
    borderBottomLeftRadius: THEME.borderRadius.lg,
    borderBottomRightRadius: THEME.borderRadius.lg,
  },
  expandedExpensesTitle: {
    fontSize: THEME.fontSize.md,
    fontWeight: '600',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.md,
  },
  expenseItem: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.sm,
    padding: THEME.spacing.md,
    ...THEME.shadows.sm,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  expenseAmountContainer: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    marginRight: THEME.spacing.md,
    minWidth: 60,
    alignItems: 'center',
  },
  expenseAmount: {
    fontSize: THEME.fontSize.sm,
    fontWeight: 'bold',
    color: THEME.colors.white,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.black,
    marginBottom: THEME.spacing.xs,
    lineHeight: 20,
  },
  expenseDate: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.gray,
  },
  noExpensesContainer: {
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  noExpensesText: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.gray,
    fontStyle: 'italic',
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

export default AnalysisScreen;
