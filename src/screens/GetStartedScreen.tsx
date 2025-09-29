import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GetStartedScreenProps {
  onGetStarted: () => void;
}

const GetStartedScreen: React.FC<GetStartedScreenProps> = ({ onGetStarted }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const features = [
    {
      icon: '📊',
      title: 'Smart Dashboard',
      description: 'Track your spending with beautiful charts and real-time insights',
      color: THEME.colors.primary,
    },
    {
      icon: '➕',
      title: 'Easy Expense Tracking',
      description: 'Add expenses quickly with categories, descriptions, and custom categories',
      color: THEME.colors.secondary,
    },
    {
      icon: '📋',
      title: 'Complete History',
      description: 'View all your expenses with search, filter, and detailed information',
      color: THEME.colors.accent,
    },
    {
      icon: '📈',
      title: 'Detailed Analysis',
      description: 'Analyze spending patterns by year with category breakdowns and trends',
      color: THEME.colors.warning,
    },
    {
      icon: '🔒',
      title: '100% Private',
      description: 'Your data stays on your device - no cloud, no accounts, no tracking',
      color: THEME.colors.success,
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
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

  const handleNext = () => {
    if (currentPage < features.length - 1) {
      // Animate out current card
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update page and animate in new card
        setCurrentPage(currentPage + 1);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      onGetStarted();
    }
  };

  const handleSkip = () => {
    onGetStarted();
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      // Animate out current card
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update page and animate in new card
        setCurrentPage(currentPage - 1);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const renderCurrentFeature = () => {
    const feature = features[currentPage];
    
    return (
      <Animated.View
        style={[
          styles.featureCard,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        <View style={[styles.featureIconContainer, { backgroundColor: feature.color + '20' }]}>
          <Text style={styles.featureIcon}>{feature.icon}</Text>
        </View>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </Animated.View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {features.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentPage ? THEME.colors.primary : THEME.colors.lightGray,
                transform: [{ scale: index === currentPage ? 1.2 : 1 }],
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      
      <View style={styles.background}>
        <View style={styles.container}>
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.appName}>Fino</Text>
            <Text style={styles.tagline}>Your Personal Finance Companion</Text>
            <Text style={styles.subtitle}>Track, Analyze, and Master Your Money</Text>
          </Animated.View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {renderCurrentFeature()}
          </View>

          {/* Bottom Section */}
          <Animated.View
            style={[
              styles.bottomSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {renderDots()}
            
            <View style={styles.buttonContainer}>
              <View style={styles.leftButtons}>
                {currentPage > 0 && (
                  <TouchableOpacity
                    style={styles.previousButton}
                    onPress={handlePrevious}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="arrow-back" size={20} color={THEME.colors.primary} />
                    <Text style={styles.previousButtonText}>Previous</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>
                  {currentPage === features.length - 1 ? 'Get Started' : 'Next'}
                </Text>
                <Ionicons
                  name={currentPage === features.length - 1 ? 'checkmark' : 'arrow-forward'}
                  size={20}
                  color={THEME.colors.white}
                  style={styles.nextButtonIcon}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: THEME.spacing.xl,
    marginBottom: THEME.spacing.xxl,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.sm,
  },
  tagline: {
    fontSize: THEME.fontSize.xl,
    color: THEME.colors.black,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.gray,
    textAlign: 'center',
  },
  featuresContainer: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.xl,
    marginBottom: THEME.spacing.lg,
    alignItems: 'center',
    ...THEME.shadows.md,
    minHeight: 200,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 350,
  },
  featureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.lg,
  },
  featureIcon: {
    fontSize: 36,
  },
  featureTitle: {
    fontSize: THEME.fontSize.xl,
    fontWeight: 'bold',
    color: THEME.colors.black,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSection: {
    paddingHorizontal: THEME.spacing.xl,
    paddingBottom: THEME.spacing.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: THEME.spacing.xl,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: THEME.spacing.md,
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    marginRight: THEME.spacing.md,
  },
  previousButtonText: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.primary,
    fontWeight: '600',
    marginLeft: THEME.spacing.sm,
  },
  skipButton: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
  },
  skipButtonText: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.gray,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: THEME.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.lg,
    marginLeft: THEME.spacing.xl,
    ...THEME.shadows.sm,
  },
  nextButtonText: {
    fontSize: THEME.fontSize.lg,
    color: THEME.colors.white,
    fontWeight: 'bold',
  },
  nextButtonIcon: {
    marginLeft: THEME.spacing.sm,
  },
});

export default GetStartedScreen;
