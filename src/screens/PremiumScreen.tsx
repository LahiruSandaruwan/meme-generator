import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { premiumManager } from '../utils/premiumManager';
import { CustomButton } from '../components/CustomButton';

type PremiumScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Premium'>;
type PremiumScreenRouteProp = RouteProp<RootStackParamList, 'Premium'>;

type PremiumScreenProps = {
  navigation: PremiumScreenNavigationProp;
  route: PremiumScreenRouteProp;
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  iconColor?: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
  iconColor = colors.primary,
}) => (
  <View style={styles.featureItem}>
    <View style={[styles.featureIcon, { backgroundColor: `${iconColor}15` }]}>
      <Ionicons name={icon as any} size={28} color={iconColor} />
    </View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const PremiumScreen: React.FC<PremiumScreenProps> = ({ navigation }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    const status = await premiumManager.getPremiumStatus();
    setIsPremium(status.isPremium);
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would trigger in-app purchase flow
      // For now, we'll show a message
      Alert.alert(
        'In-App Purchase',
        'In-app purchases will be enabled when you publish to the app store. For now, premium features are available for testing.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Enable Premium (Test)',
            onPress: async () => {
              await premiumManager.setPremium(true);
              setIsPremium(true);
              Alert.alert(
                'Premium Activated!',
                'You now have access to all premium features!',
                [
                  {
                    text: 'Start Creating',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            },
          },
        ]
      );
    } catch (error) {
      if (__DEV__) { console.error('Purchase error:', error); }
      Alert.alert('Error', 'Failed to process purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      // In a real app, this would restore purchases from App Store/Play Store
      const status = await premiumManager.getPremiumStatus();
      if (status.isPremium) {
        Alert.alert('Success', 'Your premium subscription has been restored!');
        setIsPremium(true);
      } else {
        Alert.alert(
          'No Purchases Found',
          'We could not find any previous purchases associated with your account.'
        );
      }
    } catch (error) {
      if (__DEV__) { console.error('Restore error:', error); }
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  if (isPremium) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.success, '#2ecc71']}
          style={styles.premiumHeader}
        >
          <Ionicons name="checkmark-circle" size={80} color={colors.white} />
          <Text style={styles.premiumTitle}>You're Premium!</Text>
          <Text style={styles.premiumSubtitle}>
            Enjoy unlimited meme creation with all premium features
          </Text>
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Your Premium Benefits</Text>

            <FeatureItem
              icon="infinite"
              title="Unlimited Memes"
              description="Create as many memes as you want without any limits"
              iconColor={colors.success}
            />

            <FeatureItem
              icon="color-wand"
              title="No Watermarks"
              description="All your memes are watermark-free automatically"
              iconColor={colors.primary}
            />

            <FeatureItem
              icon="ban"
              title="Ad-Free Experience"
              description="Enjoy creating memes without any interruptions"
              iconColor={colors.error}
            />

            <FeatureItem
              icon="sparkles"
              title="Exclusive Features"
              description="Access to voice-to-text, advanced effects, and more"
              iconColor={colors.warning}
            />

            <FeatureItem
              icon="flash"
              title="Priority Support"
              description="Get faster responses to your questions and issues"
              iconColor={colors.secondary}
            />

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back to App</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color={colors.white} />
        </TouchableOpacity>

        <Ionicons name="diamond" size={60} color={colors.white} />
        <Text style={styles.headerTitle}>Upgrade to Premium</Text>
        <Text style={styles.headerSubtitle}>
          Unlock unlimited creativity with premium features
        </Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Pricing Card */}
          <View style={styles.pricingCard}>
            <Text style={styles.priceLabel}>One-Time Purchase</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceAmount}>$4.99</Text>
              <Text style={styles.priceDescription}>Forever</Text>
            </View>
            <Text style={styles.priceSublabel}>Lifetime access to all premium features</Text>
          </View>

          {/* Features */}
          <Text style={styles.sectionTitle}>What You'll Get</Text>

          <FeatureItem
            icon="infinite"
            title="Unlimited Memes"
            description="Create unlimited memes without the 10 meme limit"
            iconColor={colors.success}
          />

          <FeatureItem
            icon="color-wand"
            title="No Watermarks"
            description="Remove watermarks from all your memes automatically"
            iconColor={colors.primary}
          />

          <FeatureItem
            icon="ban"
            title="Ad-Free Experience"
            description="No more ads interrupting your creative flow"
            iconColor={colors.error}
          />

          <FeatureItem
            icon="mic"
            title="Voice-to-Text"
            description="Use your voice to add text to memes hands-free"
            iconColor={colors.warning}
          />

          <FeatureItem
            icon="sparkles"
            title="Advanced Text Effects"
            description="Add shadows, gradients, 3D effects, and more"
            iconColor={colors.secondary}
          />

          <FeatureItem
            icon="trending-up"
            title="Trending Templates"
            description="Get access to the latest trending meme templates first"
            iconColor="#e74c3c"
          />

          <FeatureItem
            icon="flash"
            title="Priority Support"
            description="Get help faster with priority customer support"
            iconColor="#9b59b6"
          />

          <FeatureItem
            icon="cloud-upload"
            title="Future Updates"
            description="Get all future premium features at no extra cost"
            iconColor="#3498db"
          />

          {/* Purchase Button */}
          <CustomButton
            title={isLoading ? 'Processing...' : 'Upgrade to Premium - $4.99'}
            onPress={handlePurchase}
            loading={isLoading}
            icon={<Ionicons name="diamond" size={20} color={colors.white} style={{ marginRight: 8 }} />}
            style={styles.purchaseButton}
          />

          {/* Restore Button */}
          <TouchableOpacity
            onPress={handleRestore}
            disabled={isRestoring}
            style={styles.restoreButton}
          >
            {isRestoring ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Ionicons name="refresh" size={20} color={colors.primary} />
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.terms}>
            Payment will be charged to your app store account. By purchasing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
  },
  premiumHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginTop: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  premiumTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    marginTop: 16,
    textAlign: 'center',
  },
  premiumSubtitle: {
    fontSize: 18,
    color: colors.white,
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.95,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    padding: 24,
  },
  pricingCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.primary,
  },
  priceDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  priceSublabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  purchaseButton: {
    marginTop: 32,
    marginBottom: 16,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  terms: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

export default PremiumScreen;
