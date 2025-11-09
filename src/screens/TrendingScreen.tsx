import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import {
  RedditMeme,
  fetchRedditMemes,
  fetchTrendingFromAll,
  getSubreddits,
} from '../utils/redditApi';
import { saveImageToGallery } from '../utils/imageUtils';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

type TrendingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TrendingScreenProps {
  navigation: TrendingScreenNavigationProp;
}

export const TrendingScreen: React.FC<TrendingScreenProps> = ({ navigation }) => {
  const [memes, setMemes] = useState<RedditMeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>('all');
  const subreddits = ['all', ...getSubreddits()];

  useEffect(() => {
    loadMemes();
  }, [selectedSubreddit]);

  const loadMemes = async () => {
    try {
      setLoading(true);
      let data: RedditMeme[];

      if (selectedSubreddit === 'all') {
        data = await fetchTrendingFromAll(10);
      } else {
        data = await fetchRedditMemes(selectedSubreddit, 'hot', 25);
      }

      setMemes(data);
    } catch (error) {
      if (__DEV__) {
        console.error('Error loading memes:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMemes();
    setRefreshing(false);
  };

  const handleUseAsTemplate = (meme: RedditMeme) => {
    navigation.navigate('Editor', {
      templateUri: meme.imageUrl,
      templateName: meme.title,
    });
  };

  const handleDownload = async (meme: RedditMeme) => {
    try {
      await saveImageToGallery(meme.imageUrl);
      // Show success feedback
    } catch (error) {
      if (__DEV__) {
        console.error('Error downloading meme:', error);
      }
    }
  };

  const renderMeme = ({ item }: { item: RedditMeme }) => (
    <TouchableOpacity
      style={styles.memeCard}
      onPress={() => handleUseAsTemplate(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.memeImage}
        resizeMode="cover"
      />

      {/* Upvotes Badge */}
      <View style={styles.upvotesBadge}>
        <Ionicons name="arrow-up" size={14} color={colors.white} />
        <Text style={styles.upvotesText}>
          {item.upvotes >= 1000
            ? `${(item.upvotes / 1000).toFixed(1)}k`
            : item.upvotes}
        </Text>
      </View>

      {/* Info Overlay */}
      <View style={styles.infoOverlay}>
        <Text style={styles.memeTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>r/{item.subreddit}</Text>
          <View style={styles.commentsBadge}>
            <Ionicons name="chatbubble-outline" size={12} color={colors.white} />
            <Text style={styles.commentsText}>{item.comments}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUseAsTemplate(item)}
        >
          <Ionicons name="create-outline" size={20} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDownload(item)}
        >
          <Ionicons name="download-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSubredditTab = (subreddit: string) => (
    <TouchableOpacity
      key={subreddit}
      style={[
        styles.subredditTab,
        selectedSubreddit === subreddit && styles.subredditTabActive,
      ]}
      onPress={() => setSelectedSubreddit(subreddit)}
    >
      <Text
        style={[
          styles.subredditText,
          selectedSubreddit === subreddit && styles.subredditTextActive,
        ]}
      >
        {subreddit === 'all' ? '🔥 All' : `r/${subreddit}`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trending from Reddit</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Subreddit Tabs */}
        <FlatList
          horizontal
          data={subreddits}
          renderItem={({ item }) => renderSubredditTab(item)}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        />
      </View>

      {/* Memes Grid */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading trending memes...</Text>
        </View>
      ) : memes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="sad-outline" size={64} color={colors.textLight} />
          <Text style={styles.emptyText}>No memes found</Text>
          <Text style={styles.emptySubtext}>Try refreshing or check your connection</Text>
        </View>
      ) : (
        <FlatList
          data={memes}
          renderItem={renderMeme}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.memesGrid}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={16} color={colors.primary} />
        <Text style={styles.infoText}>
          Tap any meme to use as template • Free from Reddit
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  subredditTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
  },
  subredditTabActive: {
    backgroundColor: colors.primary,
  },
  subredditText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  subredditTextActive: {
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  memesGrid: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  memeCard: {
    width: ITEM_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memeImage: {
    width: '100%',
    height: ITEM_WIDTH,
    backgroundColor: colors.border,
  },
  upvotesBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 69, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  upvotesText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  infoOverlay: {
    padding: 12,
  },
  memeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: colors.textLight,
  },
  commentsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentsText: {
    fontSize: 12,
    color: colors.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});
