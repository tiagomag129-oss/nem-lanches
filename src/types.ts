export interface ProfileData {
  name: string;
  tagline: string;
  description: string;
  logo_url: string;
  cta_text: string;
  cta_url: string;
  phone: string;
  instagram_url: string;
  address: string;
}

export interface CarouselSlide {
  id: string;
  image_url: string;
  title: string;
  category: string;
  description?: string;
  link_url?: string;
  alt_text?: string;
  active: boolean;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  image_url: string;
  category: string;
  description: string;
  price?: string;
  link_url?: string;
  active: boolean;
  position: number;
}

export type LinkIconType =
  | 'Utensils'
  | 'BookOpen'
  | 'MessageCircle'
  | 'Instagram'
  | 'MapPin'
  | 'Star'
  | 'Clock'
  | 'Phone'
  | 'ExternalLink'
  | 'ShoppingBag';

export interface BioLink {
  id: string;
  icon: LinkIconType;
  title: string;
  description: string;
  url: string;
  type: 'link' | 'hours_modal' | 'maps';
  active: boolean;
  position: number;
  customColor?: string;
  openInNewTab?: boolean;
}

export interface AppearanceSettings {
  primaryColor: string; // default #E63922
  secondaryColor: string; // default #F5B942
  backgroundColor: string; // default #111111
  cardColor: string; // default #242424
  textColor: string; // default #FFFFFF
  secondaryTextColor: string; // default #B8B8B8
  borderColor: string; // default rgba(255, 255, 255, 0.10)
  cardRadius: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  buttonStyle: 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
}

export interface BusinessSettings {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_url: string;
  whatsapp_message?: string;
  instagram_handle: string;
  instagram_url: string;
  maps_url: string;
  reviews_url: string;
  opening_hours: string;
  opening_hours_note?: string;
  price_range: string;
  price_range_note: string;
  seo_title: string;
  seo_description: string;
}

export interface AppData {
  profile: ProfileData;
  carousel_items: CarouselSlide[];
  products: Product[];
  bio_links: BioLink[];
  appearance: AppearanceSettings;
  business: BusinessSettings;
}
