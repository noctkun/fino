import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spending, Category, MonthlyData } from '../types';

interface SpendingState {
  spendings: Spending[];
  categories: Category[];
  monthlyData: MonthlyData[];
  isLoading: boolean;
}

type SpendingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_SPENDING'; payload: Spending }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'SET_SPENDINGS'; payload: Spending[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'UPDATE_MONTHLY_DATA'; payload: MonthlyData[] }
  | { type: 'DELETE_SPENDING'; payload: string };

const initialState: SpendingState = {
  spendings: [],
  categories: [
    { id: '1', name: 'Food', color: '#FF6B6B', icon: '🍔', totalSpent: 0 },
    { id: '2', name: 'Shopping', color: '#4ECDC4', icon: '🛍️', totalSpent: 0 },
    { id: '3', name: 'Transport', color: '#45B7D1', icon: '🚗', totalSpent: 0 },
    { id: '4', name: 'Entertainment', color: '#FFA07A', icon: '🎬', totalSpent: 0 },
    { id: '5', name: 'Health', color: '#98D8C8', icon: '🏥', totalSpent: 0 },
    { id: '6', name: 'Education', color: '#DDA0DD', icon: '📚', totalSpent: 0 },
    { id: '7', name: 'Travel', color: '#20B2AA', icon: '✈️', totalSpent: 0 },
    { id: '8', name: 'Bills', color: '#F0E68C', icon: '💡', totalSpent: 0 },
  ],
  monthlyData: [],
  isLoading: true,
};

function spendingReducer(state: SpendingState, action: SpendingAction): SpendingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'ADD_SPENDING':
      const newSpendings = [...state.spendings, action.payload];
      return { ...state, spendings: newSpendings };
    
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    
    case 'SET_SPENDINGS':
      return { ...state, spendings: action.payload };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'UPDATE_MONTHLY_DATA':
      return { ...state, monthlyData: action.payload };
    
    case 'DELETE_SPENDING':
      return {
        ...state,
        spendings: state.spendings.filter(spending => spending.id !== action.payload)
      };
    
    default:
      return state;
  }
}

interface SpendingContextType {
  state: SpendingState;
  addSpending: (spending: Omit<Spending, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id' | 'totalSpent'>) => void;
  deleteSpending: (id: string) => void;
  getMonthlyData: (year: number) => MonthlyData[];
  getCategorySpending: (categoryId: string, year: number) => number;
}

const SpendingContext = createContext<SpendingContextType | undefined>(undefined);

export const SpendingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(spendingReducer, initialState);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData();
  }, []);

  // Update monthly data when spendings change
  useEffect(() => {
    if (state.spendings.length > 0) {
      updateMonthlyData();
    }
  }, [state.spendings]);

  const loadData = async () => {
    try {
      const [spendingsData, categoriesData] = await Promise.all([
        AsyncStorage.getItem('spendings'),
        AsyncStorage.getItem('categories'),
      ]);

      if (spendingsData) {
        const spendings = JSON.parse(spendingsData).map((s: any) => ({
          ...s,
          date: new Date(s.date),
        }));
        dispatch({ type: 'SET_SPENDINGS', payload: spendings });
      }

      if (categoriesData) {
        dispatch({ type: 'SET_CATEGORIES', payload: JSON.parse(categoriesData) });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const updateMonthlyData = () => {
    const monthlyMap = new Map<string, MonthlyData>();
    const currentYear = new Date().getFullYear();

    state.spendings.forEach(spending => {
      if (spending.year === currentYear) {
        const monthKey = `${spending.month}-${spending.year}`;
        
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, {
            month: spending.month,
            year: spending.year,
            totalSpent: 0,
            categories: state.categories.map(cat => ({ ...cat, totalSpent: 0 })),
          });
        }

        const monthlyData = monthlyMap.get(monthKey)!;
        monthlyData.totalSpent += spending.amount;

        const categoryIndex = monthlyData.categories.findIndex(
          cat => cat.name === spending.category
        );
        if (categoryIndex !== -1) {
          monthlyData.categories[categoryIndex].totalSpent += spending.amount;
        }
      }
    });

    const monthlyDataArray = Array.from(monthlyMap.values());
    dispatch({ type: 'UPDATE_MONTHLY_DATA', payload: monthlyDataArray });
  };

  const addSpending = async (spendingData: Omit<Spending, 'id'>) => {
    const newSpending: Spending = {
      ...spendingData,
      id: Date.now().toString(),
    };

    dispatch({ type: 'ADD_SPENDING', payload: newSpending });
    
    const updatedSpendings = [...state.spendings, newSpending];
    await saveData('spendings', updatedSpendings);
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'totalSpent'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      totalSpent: 0,
    };

    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    
    const updatedCategories = [...state.categories, newCategory];
    await saveData('categories', updatedCategories);
  };

  const deleteSpending = async (id: string) => {
    dispatch({ type: 'DELETE_SPENDING', payload: id });
    
    const updatedSpendings = state.spendings.filter(spending => spending.id !== id);
    await saveData('spendings', updatedSpendings);
  };

  const getMonthlyData = (year: number): MonthlyData[] => {
    return state.monthlyData.filter(data => data.year === year);
  };

  const getCategorySpending = (categoryId: string, year: number): number => {
    const category = state.categories.find(cat => cat.id === categoryId);
    if (!category) return 0;

    return state.spendings
      .filter(spending => 
        spending.category === category.name && 
        spending.year === year
      )
      .reduce((total, spending) => total + spending.amount, 0);
  };

  const value: SpendingContextType = {
    state,
    addSpending,
    addCategory,
    deleteSpending,
    getMonthlyData,
    getCategorySpending,
  };

  return (
    <SpendingContext.Provider value={value}>
      {children}
    </SpendingContext.Provider>
  );
};

export const useSpending = () => {
  const context = useContext(SpendingContext);
  if (context === undefined) {
    throw new Error('useSpending must be used within a SpendingProvider');
  }
  return context;
};
