/**
 * Reddit Trending Memes API (100% FREE)
 * Uses Reddit's public JSON API - No authentication required
 * No API key needed, no rate limits for reasonable use
 */

export interface RedditMeme {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  upvotes: number;
  comments: number;
  subreddit: string;
  permalink: string;
  createdAt: number;
  thumbnail?: string;
  isVideo: boolean;
}

export interface RedditPost {
  data: {
    id: string;
    title: string;
    author: string;
    ups: number;
    num_comments: number;
    subreddit: string;
    permalink: string;
    created_utc: number;
    url: string;
    thumbnail: string;
    post_hint?: string;
    is_video: boolean;
    preview?: {
      images: Array<{
        source: {
          url: string;
          width: number;
          height: number;
        };
      }>;
    };
  };
}

const SUBREDDITS = [
  'memes',
  'dankmemes',
  'wholesomememes',
  'AdviceAnimals',
  'memeeconomy',
  'funny',
  'me_irl',
];

/**
 * Fetch trending memes from a subreddit
 * @param subreddit - Subreddit name (default: 'memes')
 * @param sort - Sort type: 'hot', 'top', 'new' (default: 'hot')
 * @param limit - Number of posts to fetch (max: 100, default: 25)
 */
export const fetchRedditMemes = async (
  subreddit: string = 'memes',
  sort: 'hot' | 'top' | 'new' = 'hot',
  limit: number = 25
): Promise<RedditMeme[]> => {
  try {
    // Reddit's public JSON API - no authentication needed
    const url = `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MemeGenerator/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !data.data.children) {
      return [];
    }

    // Filter and transform posts to only include image posts
    const memes: RedditMeme[] = data.data.children
      .map((child: { data: RedditPost['data'] }) => child.data)
      .filter((post: RedditPost['data']) => {
        // Only include image posts (not videos, text, or links)
        const isImage =
          (post.post_hint === 'image') ||
          (post.url && (
            post.url.endsWith('.jpg') ||
            post.url.endsWith('.jpeg') ||
            post.url.endsWith('.png') ||
            post.url.endsWith('.gif') ||
            post.url.includes('i.redd.it') ||
            post.url.includes('i.imgur.com')
          ));

        return isImage && !post.is_video;
      })
      .map((post: RedditPost['data']) => {
        // Decode HTML entities in URL
        let imageUrl = post.url;
        if (post.preview && post.preview.images && post.preview.images[0]) {
          imageUrl = post.preview.images[0].source.url.replace(/&amp;/g, '&');
        }

        return {
          id: post.id,
          title: post.title,
          imageUrl: imageUrl.replace(/&amp;/g, '&'),
          author: post.author,
          upvotes: post.ups,
          comments: post.num_comments,
          subreddit: post.subreddit,
          permalink: `https://www.reddit.com${post.permalink}`,
          createdAt: post.created_utc * 1000, // Convert to milliseconds
          thumbnail: post.thumbnail !== 'self' ? post.thumbnail : undefined,
          isVideo: post.is_video,
        };
      });

    return memes;
  } catch (error) {
    if (__DEV__) {
      console.error('Error fetching Reddit memes:', error);
    }
    return [];
  }
};

/**
 * Fetch trending memes from multiple subreddits
 * @param limit - Number of memes per subreddit
 */
export const fetchTrendingFromAll = async (limit: number = 10): Promise<RedditMeme[]> => {
  try {
    const promises = SUBREDDITS.map(sub =>
      fetchRedditMemes(sub, 'hot', limit)
    );

    const results = await Promise.all(promises);

    // Flatten and sort by upvotes
    const allMemes = results.flat();
    allMemes.sort((a, b) => b.upvotes - a.upvotes);

    // Return top memes (remove duplicates)
    const seen = new Set<string>();
    return allMemes.filter(meme => {
      if (seen.has(meme.imageUrl)) {
        return false;
      }
      seen.add(meme.imageUrl);
      return true;
    }).slice(0, 50);
  } catch (error) {
    if (__DEV__) {
      console.error('Error fetching trending memes:', error);
    }
    return [];
  }
};

/**
 * Get list of available subreddits
 */
export const getSubreddits = (): string[] => {
  return SUBREDDITS;
};

/**
 * Search Reddit for memes
 * @param query - Search query
 * @param subreddit - Subreddit to search (default: 'memes')
 * @param limit - Number of results (default: 25)
 */
export const searchRedditMemes = async (
  query: string,
  subreddit: string = 'memes',
  limit: number = 25
): Promise<RedditMeme[]> => {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MemeGenerator/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !data.data.children) {
      return [];
    }

    // Similar filtering as fetchRedditMemes
    const memes: RedditMeme[] = data.data.children
      .map((child: { data: RedditPost['data'] }) => child.data)
      .filter((post: RedditPost['data']) => {
        const isImage =
          (post.post_hint === 'image') ||
          (post.url && (
            post.url.endsWith('.jpg') ||
            post.url.endsWith('.jpeg') ||
            post.url.endsWith('.png') ||
            post.url.endsWith('.gif') ||
            post.url.includes('i.redd.it') ||
            post.url.includes('i.imgur.com')
          ));

        return isImage && !post.is_video;
      })
      .map((post: RedditPost['data']) => ({
        id: post.id,
        title: post.title,
        imageUrl: post.url.replace(/&amp;/g, '&'),
        author: post.author,
        upvotes: post.ups,
        comments: post.num_comments,
        subreddit: post.subreddit,
        permalink: `https://www.reddit.com${post.permalink}`,
        createdAt: post.created_utc * 1000,
        thumbnail: post.thumbnail !== 'self' ? post.thumbnail : undefined,
        isVideo: post.is_video,
      }));

    return memes;
  } catch (error) {
    if (__DEV__) {
      console.error('Error searching Reddit memes:', error);
    }
    return [];
  }
};
