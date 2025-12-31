/**
 * Terms of Service Screen
 * Displays the app's Terms of Service
 */

import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { colors } from '../constants/colors';

const TermsOfServiceScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last Updated: December 30, 2025</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By downloading, installing, or using the Meme Generator mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          Meme Generator is a mobile application that allows users to create, edit, and share memes using:
        </Text>
        <Text style={styles.bulletPoint}>• Pre-loaded meme templates</Text>
        <Text style={styles.bulletPoint}>• Custom photo uploads</Text>
        <Text style={styles.bulletPoint}>• Text overlay tools</Text>
        <Text style={styles.bulletPoint}>• Image editing features</Text>
        <Text style={styles.bulletPoint}>• Voice-to-text functionality</Text>
        <Text style={styles.bulletPoint}>• Text recognition (OCR)</Text>
        <Text style={styles.bulletPoint}>• Offline functionality</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. User Accounts and Usage</Text>
        <Text style={styles.paragraph}>
          The App does not require user registration or account creation. All memes and data are stored locally on your device.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Content Ownership and Rights</Text>
        <Text style={styles.sectionTitle2}>4.1 Your Content</Text>
        <Text style={styles.paragraph}>
          You retain all ownership rights to the memes you create using the App. We do not claim any ownership over your created content.
        </Text>

        <Text style={styles.sectionTitle2}>4.2 App Content</Text>
        <Text style={styles.paragraph}>
          The meme templates, app design, and software are owned by us or our licensors and are protected by copyright and other intellectual property laws.
        </Text>

        <Text style={styles.sectionTitle2}>4.3 User Responsibility</Text>
        <Text style={styles.paragraph}>
          You are solely responsible for ensuring that:
        </Text>
        <Text style={styles.bulletPoint}>• You have the right to use any images you upload</Text>
        <Text style={styles.bulletPoint}>• Your content does not infringe on third-party rights</Text>
        <Text style={styles.bulletPoint}>• Your content complies with all applicable laws</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Prohibited Uses</Text>
        <Text style={styles.paragraph}>You agree NOT to use the App to create or share content that:</Text>
        <Text style={styles.bulletPoint}>• Is illegal, harmful, or threatening</Text>
        <Text style={styles.bulletPoint}>• Infringes on intellectual property rights</Text>
        <Text style={styles.bulletPoint}>• Contains hate speech, harassment, or discrimination</Text>
        <Text style={styles.bulletPoint}>• Is sexually explicit or pornographic</Text>
        <Text style={styles.bulletPoint}>• Violates any third-party rights</Text>
        <Text style={styles.bulletPoint}>• Contains malware or harmful code</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Premium Features</Text>
        <Text style={styles.paragraph}>
          The App offers a freemium model with the following terms:
        </Text>
        <Text style={styles.bulletPoint}>• Free users can create up to 5 memes</Text>
        <Text style={styles.bulletPoint}>• Premium unlock removes this limitation</Text>
        <Text style={styles.bulletPoint}>• Premium purchases are one-time, non-recurring payments</Text>
        <Text style={styles.bulletPoint}>• Refunds follow the App Store/Play Store refund policies</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Advertising</Text>
        <Text style={styles.paragraph}>
          The App displays advertisements provided by Google AdMob. By using the App, you acknowledge that:
        </Text>
        <Text style={styles.bulletPoint}>• Ads may be displayed during app usage</Text>
        <Text style={styles.bulletPoint}>• Ad content is controlled by third-party advertisers</Text>
        <Text style={styles.bulletPoint}>• We are not responsible for third-party ad content</Text>
        <Text style={styles.bulletPoint}>• You may interact with ads at your own risk</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Privacy and Data Collection</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. Please review our Privacy Policy for information on how we collect, use, and protect your data. Key points:
        </Text>
        <Text style={styles.bulletPoint}>• All memes are stored locally on your device</Text>
        <Text style={styles.bulletPoint}>• We do not upload or store your memes on our servers</Text>
        <Text style={styles.bulletPoint}>• Limited analytics data may be collected for app improvement</Text>
        <Text style={styles.bulletPoint}>• Camera and photo permissions are only used for meme creation</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          The App and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>10. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          The App may integrate with third-party services including:
        </Text>
        <Text style={styles.bulletPoint}>• Google AdMob (advertising)</Text>
        <Text style={styles.bulletPoint}>• Device camera and photo library</Text>
        <Text style={styles.bulletPoint}>• Device microphone (for voice features)</Text>
        <Text style={styles.paragraph}>
          Use of these third-party services is subject to their respective terms and policies.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>11. Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
        </Text>
        <Text style={styles.bulletPoint}>• Warranties of merchantability</Text>
        <Text style={styles.bulletPoint}>• Fitness for a particular purpose</Text>
        <Text style={styles.bulletPoint}>• Non-infringement</Text>
        <Text style={styles.bulletPoint}>• Uninterrupted or error-free operation</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>12. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
        </Text>
        <Text style={styles.bulletPoint}>• Your use of or inability to use the App</Text>
        <Text style={styles.bulletPoint}>• Any unauthorized access to your device</Text>
        <Text style={styles.bulletPoint}>• Any bugs, viruses, or harmful code</Text>
        <Text style={styles.bulletPoint}>• Content created or shared using the App</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>13. Indemnification</Text>
        <Text style={styles.paragraph}>
          You agree to indemnify, defend, and hold harmless the App developers and operators from any claims, liabilities, damages, losses, and expenses arising from:
        </Text>
        <Text style={styles.bulletPoint}>• Your use of the App</Text>
        <Text style={styles.bulletPoint}>• Content you create or share</Text>
        <Text style={styles.bulletPoint}>• Violation of these Terms</Text>
        <Text style={styles.bulletPoint}>• Infringement of any third-party rights</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>14. App Store Terms</Text>
        <Text style={styles.paragraph}>
          If you downloaded the App from the Apple App Store or Google Play Store, you acknowledge and agree that:
        </Text>
        <Text style={styles.bulletPoint}>• These Terms are between you and us, not with Apple or Google</Text>
        <Text style={styles.bulletPoint}>• Apple and Google are not responsible for the App or its content</Text>
        <Text style={styles.bulletPoint}>• The app store provider's terms also apply to your use</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>15. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting within the App. Your continued use of the App after changes constitutes acceptance of the modified Terms.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>16. Termination</Text>
        <Text style={styles.paragraph}>
          We may terminate or suspend your access to the App immediately, without prior notice or liability, for any reason, including if you breach these Terms. You may stop using the App at any time by uninstalling it from your device.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>17. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>18. Severability</Text>
        <Text style={styles.paragraph}>
          If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>19. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms of Service, please contact us through the App Store or Play Store listing.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>20. Entire Agreement</Text>
        <Text style={styles.paragraph}>
          These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the use of the App and supersede all prior agreements and understandings.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By using Meme Generator, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionTitle2: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginLeft: 16,
    marginBottom: 4,
  },
  footer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default TermsOfServiceScreen;
