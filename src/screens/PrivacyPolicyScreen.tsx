import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { RootStackParamList } from '../types';

type PrivacyPolicyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PrivacyPolicy'
>;

type PrivacyPolicyScreenProps = {
  navigation: PrivacyPolicyScreenNavigationProp;
};

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.lastUpdated}>Last Updated: November 8, 2025</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          Meme Generator is committed to protecting your privacy. We collect minimal information
          to provide and improve our service:
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Memes You Create:</Text> Stored locally on your device only.
          We do not upload or store your memes on our servers.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Usage Analytics:</Text> Anonymous usage data (which features
          you use, app performance) to improve the app. No personally identifiable information.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Device Information:</Text> Device type, OS version, and app
          version for crash reporting and compatibility.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the collected information to:
        </Text>
        <Text style={styles.bulletPoint}>• Provide and maintain the app's functionality</Text>
        <Text style={styles.bulletPoint}>• Improve user experience and fix bugs</Text>
        <Text style={styles.bulletPoint}>• Analyze app usage patterns</Text>
        <Text style={styles.bulletPoint}>• Display relevant advertisements (see Ad Policy below)</Text>

        <Text style={styles.sectionTitle}>3. Advertising</Text>
        <Text style={styles.paragraph}>
          This app displays advertisements provided by Google AdMob. AdMob may collect and use data
          to personalize ads. You can learn more about how Google uses data at:
        </Text>
        <Text style={styles.link}>https://policies.google.com/privacy</Text>
        <Text style={styles.paragraph}>
          AdMob may collect:
        </Text>
        <Text style={styles.bulletPoint}>• Device identifiers (Advertising ID)</Text>
        <Text style={styles.bulletPoint}>• IP address</Text>
        <Text style={styles.bulletPoint}>• Location data (approximate)</Text>
        <Text style={styles.bulletPoint}>• Ad interaction data</Text>

        <Text style={styles.sectionTitle}>4. Data Storage</Text>
        <Text style={styles.paragraph}>
          All memes you create are stored locally on your device using AsyncStorage. We do not
          have access to your memes, and they are not transmitted to our servers. If you uninstall
          the app, all locally stored memes will be deleted.
        </Text>

        <Text style={styles.sectionTitle}>5. Permissions</Text>
        <Text style={styles.paragraph}>
          The app requests the following permissions:
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Camera:</Text> To take photos for meme creation (optional)
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Photo Library:</Text> To select images for meme templates
          and save memes to your device
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Microphone:</Text> For voice-to-text feature (optional)
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Internet:</Text> To load meme templates and display ads
        </Text>

        <Text style={styles.sectionTitle}>6. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          We use the following third-party services:
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Google AdMob:</Text> For advertisements
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Expo:</Text> For app framework and services
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Imgflip API:</Text> For meme template library (images only)
        </Text>
        <Text style={styles.paragraph}>
          These services have their own privacy policies and may collect data as described in
          their respective policies.
        </Text>

        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          This app is not directed at children under 13. We do not knowingly collect personal
          information from children under 13. If you are a parent or guardian and believe your
          child has provided us with personal information, please contact us.
        </Text>

        <Text style={styles.sectionTitle}>8. Data Security</Text>
        <Text style={styles.paragraph}>
          We take reasonable measures to protect your information. However, no method of
          transmission over the Internet or electronic storage is 100% secure. Since all data is
          stored locally on your device, you are responsible for securing your device.
        </Text>

        <Text style={styles.sectionTitle}>9. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:
        </Text>
        <Text style={styles.bulletPoint}>
          • Delete all your data by clearing app data or uninstalling the app
        </Text>
        <Text style={styles.bulletPoint}>
          • Opt out of personalized ads through your device settings
        </Text>
        <Text style={styles.bulletPoint}>
          • Request information about data we collect (limited as described above)
        </Text>

        <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of any changes
          by posting the new Privacy Policy in the app and updating the "Last Updated" date.
        </Text>

        <Text style={styles.sectionTitle}>11. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about this Privacy Policy, please contact us at:
        </Text>
        <Text style={styles.link}>support@memegenerator.app</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Meme Generator, you agree to this Privacy Policy and our Terms of Service.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 8,
    marginLeft: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 12,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 40,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PrivacyPolicyScreen;
