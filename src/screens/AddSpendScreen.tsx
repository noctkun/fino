import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSpending } from '../contexts/SpendingContext';
import { THEME } from '../constants/colors';

const AddSpendScreen: React.FC = () => {
  const { state, addSpending, addCategory } = useSpending();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const triggerAnimations = useCallback(() => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    
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

  const handleAddSpending = async () => {
    if (!amount || !description || (!selectedCategory && !customCategory)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const categoryName = customCategory || selectedCategory;
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    try {
      await addSpending({
        amount: numericAmount,
        category: categoryName,
        description,
        date: currentDate,
        month,
        year,
      });

      // Reset form
      setAmount('');
      setDescription('');
      setSelectedCategory('');
      setCustomCategory('');
      setShowCustomCategory(false);

      Alert.alert('Success', 'Expense added successfully!', [
        { text: 'OK', style: 'default' }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    }
  };

  const handleAddCustomCategory = async () => {
    if (!customCategory.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const categoryExists = state.categories.some(
      cat => cat.name.toLowerCase() === customCategory.toLowerCase()
    );

    if (categoryExists) {
      Alert.alert('Error', 'Category already exists');
      return;
    }

    try {
      await addCategory({
        name: customCategory,
        color: THEME.colors.chartColors[state.categories.length % THEME.colors.chartColors.length],
        icon: '📝',
      });

      setSelectedCategory(customCategory);
      setShowCustomCategory(false);
      Alert.alert('Success', 'Custom category added!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add category');
    }
  };

  const renderCategoryButton = (category: any) => {
    const isSelected = selectedCategory === category.name;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryButton,
          {
            backgroundColor: isSelected ? category.color : THEME.colors.white,
            borderColor: category.color,
          },
        ]}
        onPress={() => {
          setSelectedCategory(category.name);
          setShowCustomCategory(false);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text
          style={[
            styles.categoryText,
            {
              color: isSelected ? THEME.colors.white : category.color,
            },
          ]}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Add New Expense</Text>
          <Text style={styles.subtitle}>Track your spending easily</Text>
        </Animated.View>

        {/* Amount Input */}
        <Animated.View
          style={[
            styles.inputContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.inputLabel}>Amount (₹)</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.dollarSign}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={THEME.colors.gray}
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>
        </Animated.View>

        {/* Description Input */}
        <Animated.View
          style={[
            styles.inputContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="What did you spend on?"
            placeholderTextColor={THEME.colors.gray}
            multiline
            numberOfLines={2}
            returnKeyType="next"
          />
        </Animated.View>

        {/* Category Selection */}
        <Animated.View
          style={[
            styles.inputContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.inputLabel}>Category</Text>
          
          {/* Existing Categories */}
          <View style={styles.categoriesGrid}>
            {state.categories.map(renderCategoryButton)}
          </View>

          {/* Custom Category Toggle */}
          <TouchableOpacity
            style={styles.customCategoryToggle}
            onPress={() => setShowCustomCategory(!showCustomCategory)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showCustomCategory ? 'remove-circle' : 'add-circle'}
              size={20}
              color={THEME.colors.primary}
            />
            <Text style={styles.customCategoryText}>
              {showCustomCategory ? 'Hide' : 'Add'} Custom Category
            </Text>
          </TouchableOpacity>

          {/* Custom Category Input */}
          {showCustomCategory && (
            <Animated.View
              style={[
                styles.customCategoryContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim }],
                },
              ]}
            >
              <TextInput
                style={styles.textInput}
                value={customCategory}
                onChangeText={setCustomCategory}
                placeholder="Enter custom category name"
                placeholderTextColor={THEME.colors.gray}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addCustomButton}
                onPress={handleAddCustomCategory}
                activeOpacity={0.7}
              >
                <Text style={styles.addCustomButtonText}>Add Category</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        {/* Add Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddSpending}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={THEME.colors.white} />
            <Text style={styles.addButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
  inputContainer: {
    marginBottom: THEME.spacing.lg,
  },
  inputLabel: {
    fontSize: THEME.fontSize.md,
    fontWeight: '600',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.sm,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    ...THEME.shadows.sm,
  },
  dollarSign: {
    fontSize: THEME.fontSize.xl,
    fontWeight: 'bold',
    color: THEME.colors.primary,
    marginRight: THEME.spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: THEME.fontSize.xl,
    fontWeight: 'bold',
    color: THEME.colors.black,
    paddingVertical: THEME.spacing.md,
  },
  textInput: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    fontSize: THEME.fontSize.md,
    color: THEME.colors.black,
    ...THEME.shadows.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: THEME.spacing.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    marginRight: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    ...THEME.shadows.sm,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: THEME.spacing.xs,
  },
  categoryText: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '600',
  },
  customCategoryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  customCategoryText: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.primary,
    marginLeft: THEME.spacing.sm,
    fontWeight: '600',
  },
  customCategoryContainer: {
    marginTop: THEME.spacing.sm,
  },
  addCustomButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
  },
  addCustomButtonText: {
    color: THEME.colors.white,
    fontSize: THEME.fontSize.md,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: THEME.spacing.lg,
  },
  addButton: {
    backgroundColor: THEME.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.lg,
    ...THEME.shadows.md,
  },
  addButtonText: {
    color: THEME.colors.white,
    fontSize: THEME.fontSize.lg,
    fontWeight: 'bold',
    marginLeft: THEME.spacing.sm,
  },
});

export default AddSpendScreen;
