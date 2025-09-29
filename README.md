# Fino - Personal Finance Management App 💰

A beautiful and interactive React Native app built with Expo for tracking personal expenses and visualizing spending patterns.

## Features ✨

### 🏠 Dashboard
- Interactive pie chart showing spending breakdown by category
- Monthly analysis with smooth animations
- Expandable category cards with detailed insights
- Share functionality for pie chart snapshots
- Beautiful and fun color theme

### ➕ Add Expense
- Easy expense entry with amount (in INR), description, and category
- Pre-defined categories with custom icons and colors
- Custom category creation
- Smooth form animations and validation

### 📋 History
- Complete spending history with search and filter
- Detailed expense information
- Delete functionality with confirmation
- Pull-to-refresh support

### 📊 Analysis
- Yearly spending analysis with year selector
- Category breakdown with percentages
- Monthly trend visualization
- Summary cards with key metrics
- Interactive category details

## Tech Stack 🛠️

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for tab navigation
- **React Native Chart Kit** for beautiful charts
- **AsyncStorage** for local data persistence
- **React Native Reanimated** for smooth animations
- **Expo Sharing** for social media sharing

## Installation & Setup 🚀

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on device/simulator:**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web
   ```

## App Structure 📁

```
src/
├── components/          # Reusable UI components
├── constants/          # App constants and theme
├── contexts/           # React Context for state management
├── screens/            # Main app screens
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Features Explained 🔍

### Color Theme
The app uses a fun, vibrant color palette:
- Primary: Coral Red (#FF6B6B)
- Secondary: Turquoise (#4ECDC4)
- Accent: Sky Blue (#45B7D1)
- Each category has its own unique color

### Animations
- Smooth fade and slide animations on screen loads
- Interactive category expansion with spring animations
- Chart animations and transitions
- Pull-to-refresh with loading states

### Data Management
- Local storage using AsyncStorage
- Context API for state management
- Automatic data persistence
- Real-time updates across screens

### Charts & Visualization
- Interactive pie charts with category breakdowns
- Monthly trend bar charts
- Responsive design for different screen sizes
- Share functionality for charts

## Usage Guide 📖

1. **Adding Expenses:**
   - Go to the "Add Expense" tab
   - Enter amount (in INR), description, and select category
   - Create custom categories if needed
   - Tap "Add Expense" to save

2. **Viewing Dashboard:**
   - See your monthly spending breakdown
   - Tap categories to expand and see details
   - Use month selector to view different months
   - Share your spending chart

3. **Checking History:**
   - View all your expenses chronologically
   - Tap on expenses for detailed information
   - Delete expenses with confirmation

4. **Analyzing Spending:**
   - Switch between different years
   - See category breakdowns and percentages
   - View monthly trends and patterns
   - Get insights into your spending habits

## Customization 🎨

### Adding New Categories
Categories are defined in `src/contexts/SpendingContext.tsx`. You can add new categories by modifying the initial state.

### Changing Colors
Update the color scheme in `src/constants/colors.ts` to match your preferences.

### Modifying Animations
Animation configurations are in each screen component. Adjust timing and easing for different effects.

## Requirements 📱

- Node.js 16+ 
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Contributing 🤝

Feel free to submit issues and enhancement requests!

## License 📄

This project is open source and available under the MIT License.
