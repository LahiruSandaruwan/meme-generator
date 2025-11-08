import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { colors } from '../constants/colors';
import { APP_CONFIG } from '../constants/config';
import { clearAllData } from '../utils/storage';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  iconColor?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  iconColor = colors.primary,
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.settingLeft}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <Ionicons name={icon as any} size={24} color={iconColor} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {showArrow && (
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    )}
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const handleRateApp = () => {
    Alert.alert(
      'Rate Our App',
      'Would you like to rate Meme Generator on the app store?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Rate Now',
          onPress: () => {
            // In production, replace with actual app store URL
            Alert.alert('Thank you!', 'This would open the app store in production.');
          },
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      const message = `Check out Meme Generator! Create hilarious memes in seconds! 🎨😂\n\n[App Store Link]`;

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // In a real app, you'd share the actual app link
        Alert.alert(
          'Share App',
          'Share Meme Generator with your friends!',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      if (__DEV__) { console.error('Error sharing app:', error); }
    }
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Your privacy is important to us. We only store memes locally on your device. Ad data is handled by Google AdMob according to their privacy policy.',
      [
        { text: 'OK' },
        {
          text: 'Learn More',
          onPress: () => {
            Linking.openURL('https://policies.google.com/privacy');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will delete all your saved memes and reset the app. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              if (__DEV__) { console.error('Error clearing data:', error); }
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Need help? Send us an email!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Email',
          onPress: () => {
            Linking.openURL('mailto:support@memegenapp.com?subject=Meme Generator Support');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Meme Generator',
      `Version: ${APP_CONFIG.version}\n\nMeme Generator is the easiest way to create and share hilarious memes. Choose from 20+ popular templates or use your own photos!\n\nMade with ❤️ for meme lovers everywhere.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.card}>
            <SettingItem
              icon="star"
              title="Rate Our App"
              subtitle="Love Meme Generator? Rate us!"
              onPress={handleRateApp}
              iconColor={colors.warning}
            />
            <SettingItem
              icon="share-social"
              title="Share App"
              subtitle="Tell your friends about us"
              onPress={handleShareApp}
              iconColor={colors.secondary}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <SettingItem
              icon="help-circle"
              title="Contact Support"
              subtitle="Get help with the app"
              onPress={handleContactSupport}
              iconColor={colors.primary}
            />
            <SettingItem
              icon="shield-checkmark"
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={handlePrivacyPolicy}
              iconColor={colors.success}
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <SettingItem
              icon="trash"
              title="Clear Cache"
              subtitle="Delete all saved memes"
              onPress={handleClearCache}
              iconColor={colors.error}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <SettingItem
              icon="information-circle"
              title="About"
              subtitle={`Version ${APP_CONFIG.version}`}
              onPress={handleAbout}
              iconColor={colors.text}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for meme lovers
          </Text>
          <Text style={styles.footerSubtext}>
            © 2024 Meme Generator
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: colors.textLight,
  },
});

export default SettingsScreen;
