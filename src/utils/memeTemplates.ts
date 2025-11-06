import { MemeTemplate } from '../types';

// Using imgflip API URLs for popular meme templates
// These are publicly available meme template images
export const memeTemplates: MemeTemplate[] = [
  {
    id: '181913649',
    name: 'Drake Hotline Bling',
    url: 'https://i.imgflip.com/30b1gx.jpg',
    category: 'Trending',
    width: 1200,
    height: 1200,
  },
  {
    id: '112126428',
    name: 'Distracted Boyfriend',
    url: 'https://i.imgflip.com/1ur9b0.jpg',
    category: 'Trending',
    width: 1200,
    height: 800,
  },
  {
    id: '87743020',
    name: 'Two Buttons',
    url: 'https://i.imgflip.com/1g8my4.jpg',
    category: 'Classic',
    width: 600,
    height: 908,
  },
  {
    id: '129242436',
    name: 'Change My Mind',
    url: 'https://i.imgflip.com/24y43o.jpg',
    category: 'Classic',
    width: 482,
    height: 361,
  },
  {
    id: '217743513',
    name: 'UNO Draw 25 Cards',
    url: 'https://i.imgflip.com/3lmzyx.jpg',
    category: 'Trending',
    width: 500,
    height: 494,
  },
  {
    id: '131087935',
    name: 'Running Away Balloon',
    url: 'https://i.imgflip.com/261o3j.jpg',
    category: 'Reaction',
    width: 761,
    height: 1024,
  },
  {
    id: '188390779',
    name: 'Woman Yelling at Cat',
    url: 'https://i.imgflip.com/345v97.jpg',
    category: 'Trending',
    width: 680,
    height: 438,
  },
  {
    id: '100777631',
    name: 'Is This a Pigeon',
    url: 'https://i.imgflip.com/1ihzfe.jpg',
    category: 'Classic',
    width: 1587,
    height: 1425,
  },
  {
    id: '155067746',
    name: 'Surprised Pikachu',
    url: 'https://i.imgflip.com/2ka1vv.jpg',
    category: 'Reaction',
    width: 1893,
    height: 1893,
  },
  {
    id: '93895088',
    name: 'Expanding Brain',
    url: 'https://i.imgflip.com/1jwhww.jpg',
    category: 'Classic',
    width: 857,
    height: 1202,
  },
  {
    id: '84341851',
    name: 'Evil Kermit',
    url: 'https://i.imgflip.com/1e7ql7.jpg',
    category: 'Classic',
    width: 700,
    height: 581,
  },
  {
    id: '135256802',
    name: 'Epic Handshake',
    url: 'https://i.imgflip.com/28j0te.jpg',
    category: 'Office',
    width: 900,
    height: 600,
  },
  {
    id: '61579',
    name: 'One Does Not Simply',
    url: 'https://i.imgflip.com/1bij.jpg',
    category: 'Classic',
    width: 568,
    height: 335,
  },
  {
    id: '61520',
    name: 'Success Kid',
    url: 'https://i.imgflip.com/1bhk.jpg',
    category: 'Classic',
    width: 500,
    height: 500,
  },
  {
    id: '101470',
    name: 'Ancient Aliens',
    url: 'https://i.imgflip.com/26am.jpg',
    category: 'Classic',
    width: 500,
    height: 437,
  },
  {
    id: '405658',
    name: 'Grumpy Cat',
    url: 'https://i.imgflip.com/8p0a.jpg',
    category: 'Animals',
    width: 500,
    height: 617,
  },
  {
    id: '8072285',
    name: 'Doge',
    url: 'https://i.imgflip.com/4t0m5.jpg',
    category: 'Animals',
    width: 620,
    height: 620,
  },
  {
    id: '438680',
    name: 'Batman Slapping Robin',
    url: 'https://i.imgflip.com/9ehk.jpg',
    category: 'Classic',
    width: 400,
    height: 387,
  },
  {
    id: '97984',
    name: 'Disaster Girl',
    url: 'https://i.imgflip.com/23ls.jpg',
    category: 'Classic',
    width: 500,
    height: 375,
  },
  {
    id: '27813981',
    name: 'Hide the Pain Harold',
    url: 'https://i.imgflip.com/gk5el.jpg',
    category: 'Reaction',
    width: 480,
    height: 601,
  },
  {
    id: '124822590',
    name: 'Left Exit 12 Off Ramp',
    url: 'https://i.imgflip.com/22bdh6.jpg',
    category: 'Classic',
    width: 804,
    height: 767,
  },
  {
    id: '91538330',
    name: 'X, X Everywhere',
    url: 'https://i.imgflip.com/1ihzfe.jpg',
    category: 'Classic',
    width: 2118,
    height: 1440,
  },
];

export const getTemplatesByCategory = (category: string): MemeTemplate[] => {
  if (category === 'All') {
    return memeTemplates;
  }
  return memeTemplates.filter((template) => template.category === category);
};

export const searchTemplates = (query: string): MemeTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return memeTemplates.filter((template) =>
    template.name.toLowerCase().includes(lowercaseQuery)
  );
};

export const getCategories = (): string[] => {
  const categories = ['All', ...new Set(memeTemplates.map((t) => t.category))];
  return categories;
};
