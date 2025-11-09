export interface Font {
  id: string;
  name: string;
  family: string;
  category: 'Classic' | 'Bold' | 'Playful' | 'Elegant' | 'Modern' | 'Meme';
  preview: string;
  description?: string;
  isPopular?: boolean;
}

// Using system fonts available on iOS and Android
// These are 100% free and work on all devices without downloads
export const fonts: Font[] = [
  // Classic Fonts
  {
    id: 'default',
    name: 'Default (Impact)',
    family: 'System',
    category: 'Classic',
    preview: 'CLASSIC MEME TEXT',
  },
  {
    id: 'arial',
    name: 'Arial',
    family: 'Arial',
    category: 'Classic',
    preview: 'CLEAN & SIMPLE',
  },
  {
    id: 'helvetica',
    name: 'Helvetica',
    family: 'Helvetica',
    category: 'Classic',
    preview: 'MODERN CLASSIC',
  },
  {
    id: 'times',
    name: 'Times New Roman',
    family: 'Times New Roman',
    category: 'Classic',
    preview: 'TRADITIONAL STYLE',
  },
  {
    id: 'courier',
    name: 'Courier',
    family: 'Courier',
    category: 'Classic',
    preview: 'TYPEWRITER LOOK',
  },

  // Bold Fonts
  {
    id: 'impact',
    name: 'Impact',
    family: 'Impact',
    category: 'Bold',
    preview: 'SUPER BOLD TEXT',
  },
  {
    id: 'arial-black',
    name: 'Arial Black',
    family: 'Arial Black',
    category: 'Bold',
    preview: 'EXTRA THICK',
  },
  {
    id: 'verdana',
    name: 'Verdana Bold',
    family: 'Verdana-Bold',
    category: 'Bold',
    preview: 'STRONG & CLEAR',
  },

  // Playful Fonts
  {
    id: 'comic-sans',
    name: 'Comic Sans',
    family: 'Comic Sans MS',
    category: 'Playful',
    preview: 'FUN & CASUAL',
  },
  {
    id: 'marker-felt',
    name: 'Marker Felt',
    family: 'Marker Felt',
    category: 'Playful',
    preview: 'HANDWRITTEN',
  },
  {
    id: 'papyrus',
    name: 'Papyrus',
    family: 'Papyrus',
    category: 'Playful',
    preview: 'QUIRKY STYLE',
  },

  // Elegant Fonts
  {
    id: 'georgia',
    name: 'Georgia',
    family: 'Georgia',
    category: 'Elegant',
    preview: 'SOPHISTICATED',
  },
  {
    id: 'palatino',
    name: 'Palatino',
    family: 'Palatino',
    category: 'Elegant',
    preview: 'REFINED SERIF',
  },
  {
    id: 'didot',
    name: 'Didot',
    family: 'Didot',
    category: 'Elegant',
    preview: 'HIGH FASHION',
  },
  {
    id: 'baskerville',
    name: 'Baskerville',
    family: 'Baskerville',
    category: 'Elegant',
    preview: 'CLASSIC ELEGANCE',
  },

  // Modern Fonts
  {
    id: 'futura',
    name: 'Futura',
    family: 'Futura',
    category: 'Modern',
    preview: 'GEOMETRIC & COOL',
  },
  {
    id: 'avenir',
    name: 'Avenir',
    family: 'Avenir',
    category: 'Modern',
    preview: 'CONTEMPORARY',
  },
  {
    id: 'trebuchet',
    name: 'Trebuchet',
    family: 'Trebuchet MS',
    category: 'Modern',
    preview: 'TECH FRIENDLY',
  },
  {
    id: 'optima',
    name: 'Optima',
    family: 'Optima',
    category: 'Modern',
    preview: 'SLEEK DESIGN',
  },

  // Meme Fonts (Most Popular for Memes)
  {
    id: 'impact-meme',
    name: 'Impact (Meme Classic)',
    family: 'Impact',
    category: 'Meme',
    preview: 'TOP TEXT BOTTOM TEXT',
    description: 'The classic meme font',
    isPopular: true,
  },
  {
    id: 'anton',
    name: 'Anton',
    family: 'sans-serif-black',
    category: 'Meme',
    preview: 'BOLD STATEMENT',
    description: 'Bold condensed font',
    isPopular: true,
  },
  {
    id: 'oswald',
    name: 'Oswald',
    family: 'sans-serif-condensed',
    category: 'Meme',
    preview: 'CONDENSED POWER',
    description: 'Modern condensed font',
    isPopular: false,
  },
  {
    id: 'bebas',
    name: 'Bebas',
    family: 'sans-serif-light',
    category: 'Meme',
    preview: 'TALL & NARROW',
    description: 'Popular headline font',
    isPopular: true,
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: 'sans-serif-medium',
    category: 'Modern',
    preview: 'CLEAN MODERN',
    description: 'Versatile sans-serif',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    family: 'Roboto',
    category: 'Modern',
    preview: 'TECH FRIENDLY',
    description: 'Google\'s signature font',
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    family: 'sans-serif',
    category: 'Modern',
    preview: 'OPEN & FRIENDLY',
    description: 'Highly readable',
  },
  {
    id: 'raleway',
    name: 'Raleway',
    family: 'sans-serif-thin',
    category: 'Elegant',
    preview: 'SOPHISTICATED',
    description: 'Elegant thin font',
  },
  {
    id: 'rockwell',
    name: 'Rockwell',
    family: 'Rockwell',
    category: 'Bold',
    preview: 'SLAB SERIF POWER',
    description: 'Strong slab serif',
  },
  {
    id: 'american-typewriter',
    name: 'American Typewriter',
    family: 'American Typewriter',
    category: 'Playful',
    preview: 'VINTAGE CHARM',
    description: 'Retro typewriter style',
  },
  {
    id: 'noteworthy',
    name: 'Noteworthy',
    family: 'Noteworthy-Bold',
    category: 'Playful',
    preview: 'Handwritten Fun',
    description: 'Casual handwriting',
  },
  {
    id: 'chalkduster',
    name: 'Chalkduster',
    family: 'Chalkduster',
    category: 'Playful',
    preview: 'CHALK BOARD',
    description: 'Fun chalk style',
  },
  {
    id: 'snell-roundhand',
    name: 'Snell Roundhand',
    family: 'Snell Roundhand',
    category: 'Elegant',
    preview: 'Script Elegance',
    description: 'Formal script',
  },
  {
    id: 'copperplate',
    name: 'Copperplate',
    family: 'Copperplate',
    category: 'Elegant',
    preview: 'ENGRAVED STYLE',
    description: 'Classic engraved look',
  },
  {
    id: 'academy',
    name: 'Academy',
    family: 'Academy Engraved LET',
    category: 'Elegant',
    preview: 'FORMAL ENGRAVED',
    description: 'Decorative formal',
  },
];

export const FONT_CATEGORIES = ['Meme', 'Classic', 'Bold', 'Playful', 'Elegant', 'Modern'] as const;

export const getFontsByCategory = (category: string): Font[] => {
  return fonts.filter(font => font.category === category);
};

export const searchFonts = (query: string): Font[] => {
  const lowerQuery = query.toLowerCase();
  return fonts.filter(font =>
    font.name.toLowerCase().includes(lowerQuery) ||
    font.family.toLowerCase().includes(lowerQuery) ||
    font.preview.toLowerCase().includes(lowerQuery)
  );
};

export const getFontById = (id: string): Font | undefined => {
  return fonts.find(font => font.id === id);
};

export const getFontFamily = (fontId: string | undefined): string | undefined => {
  if (!fontId || fontId === 'default') return undefined;
  const font = getFontById(fontId);
  return font?.family;
};

export const getPopularFonts = (): Font[] => {
  return fonts.filter(font => font.isPopular);
};
