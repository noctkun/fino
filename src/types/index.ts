export interface Spending {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  month: string;
  year: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  totalSpent: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  totalSpent: number;
  categories: Category[];
}

export interface PieChartData {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export interface TabNavigationParamList {
  Dashboard: undefined;
  AddSpend: undefined;
  History: undefined;
  Analysis: undefined;
  [key: string]: undefined;
}
