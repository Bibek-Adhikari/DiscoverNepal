// Nepal Provinces and Districts Data
export interface District {
  id: string;
  name: string;
  headquarters: string;
  area: number;
  population: number;
}

export interface Province {
  id: string;
  name: string;
  capital: string;
  area: number;
  population: number;
  districts: District[];
}

export type DestinationCategory = 
  | 'Heritage Sites'
  | 'Trekking Routes'
  | 'Wildlife'
  | 'Spiritual Centers'
  | 'Adventure Sports'
  | 'Cultural Villages';

export interface Destination {
  id: string;
  name: string;
  provinceId: string;
  districtId: string;
  category: DestinationCategory;
  elevation?: string;
  bestMonths: string[];
  description: string;
  culturalSignificance: string;
  image: string;
  coordinates: { lat: number; lng: number };
  weatherCondition?: string;
  temperature?: number;
}

export const provinces: Province[] = [
  {
    id: 'koshi',
    name: 'Koshi',
    capital: 'Biratnagar',
    area: 25905,
    population: 4961412,
    districts: [
      { id: 'taplejung', name: 'Taplejung', headquarters: 'Fungling', area: 3646, population: 120590 },
      { id: 'terhathum', name: 'Terhathum', headquarters: 'Myanglung', area: 679, population: 88731 },
      { id: 'panchthar', name: 'Panchthar', headquarters: 'Phidim', area: 1241, population: 172400 },
      { id: 'sankhuwasabha', name: 'Sankhuwasabha', headquarters: 'Khandbari', area: 3480, population: 158041 },
      { id: 'solukhumbu', name: 'Solukhumbu', headquarters: 'Salleri', area: 3312, population: 104851 },
      { id: 'bhojpur', name: 'Bhojpur', headquarters: 'Bhojpur', area: 1507, population: 157923 },
      { id: 'khotang', name: 'Khotang', headquarters: 'Diktel', area: 1591, population: 175298 },
      { id: 'ilam', name: 'Ilam', headquarters: 'Ilam', area: 1703, population: 279534 },
      { id: 'udayapur', name: 'Udayapur', headquarters: 'Gaighat', area: 2063, population: 340721 },
      { id: 'okhaldhunga', name: 'Okhaldhunga', headquarters: 'Siddhicharan', area: 1074, population: 139552 },
      { id: 'jhapa', name: 'Jhapa', headquarters: 'Bhadrapur', area: 1606, population: 998054 },
      { id: 'dhankuta', name: 'Dhankuta', headquarters: 'Dhankuta', area: 892, population: 150599 },
      { id: 'morang', name: 'Morang', headquarters: 'Biratnagar', area: 1855, population: 1148156 },
      { id: 'sunsari', name: 'Sunsari', headquarters: 'Inaruwa', area: 1257, population: 926962 },
    ]
  },
  {
    id: 'madhesh',
    name: 'Madhesh',
    capital: 'Janakpur',
    area: 9661,
    population: 6114600,
    districts: [
      { id: 'parsa', name: 'Parsa', headquarters: 'Birjung', area: 1353, population: 654471 },
      { id: 'bara', name: 'Bara', headquarters: 'Kalaiya', area: 1190, population: 763137 },
      { id: 'rautahat', name: 'Rautahat', headquarters: 'Gaur', area: 1126, population: 813573 },
      { id: 'sarlahi', name: 'Sarlahi', headquarters: 'Malangwa', area: 1259, population: 862470 },
      { id: 'mahottari', name: 'Mahottari', headquarters: 'Jaleshwar', area: 1002, population: 706994 },
      { id: 'dhanusha', name: 'Dhanusha', headquarters: 'Janakpur', area: 1180, population: 867747 },
      { id: 'siraha', name: 'Siraha', headquarters: 'Siraha', area: 1188, population: 739953 },
      { id: 'saptari', name: 'Saptari', headquarters: 'Rajbiraj', area: 1363, population: 706255 },
    ]
  },
  {
    id: 'bagmati',
    name: 'Bagmati',
    capital: 'Hetauda',
    area: 20300,
    population: 6116866,
    districts: [
      { id: 'sindhuli', name: 'Sindhuli', headquarters: 'Kamalamai', area: 2491, population: 300026 },
      { id: 'ramechhap', name: 'Ramechhap', headquarters: 'Manthali', area: 1546, population: 170302 },
      { id: 'dolakha', name: 'Dolakha', headquarters: 'Bhimeshwar', area: 2191, population: 172767 },
      { id: 'bhaktapur', name: 'Bhaktapur', headquarters: 'Bhaktapur', area: 119, population: 432132 },
      { id: 'dhading', name: 'Dhading', headquarters: 'Nilkantha', area: 1926, population: 325710 },
      { id: 'kathmandu', name: 'Kathmandu', headquarters: 'Kathmandu', area: 395, population: 2041587 },
      { id: 'kavrepalanchok', name: 'Kavrepalanchok', headquarters: 'Dhulikhel', area: 1396, population: 364039 },
      { id: 'lalitpur', name: 'Lalitpur', headquarters: 'Lalitpur', area: 385, population: 551667 },
      { id: 'nuwakot', name: 'Nuwakot', headquarters: 'Bidur', area: 1121, population: 263391 },
      { id: 'rasuwa', name: 'Rasuwa', headquarters: 'Dhunche', area: 1544, population: 46689 },
      { id: 'sindhupalchok', name: 'Sindhupalchok', headquarters: 'Chautara', area: 2542, population: 262624 },
      { id: 'chitwan', name: 'Chitwan', headquarters: 'Bharatpur', area: 2218, population: 719859 },
      { id: 'makwanpur', name: 'Makwanpur', headquarters: 'Hetauda', area: 2426, population: 466073 },
    ]
  },
  {
    id: 'gandaki',
    name: 'Gandaki',
    capital: 'Pokhara',
    area: 21504,
    population: 2466427,
    districts: [
      { id: 'baglung', name: 'Baglung', headquarters: 'Baglung', area: 1784, population: 249211 },
      { id: 'gorkha', name: 'Gorkha', headquarters: 'Gorkha Bazar', area: 3610, population: 251027 },
      { id: 'kaski', name: 'Kaski', headquarters: 'Pokhara', area: 2017, population: 600051 },
      { id: 'lamjung', name: 'Lamjung', headquarters: 'Besisahar', area: 1692, population: 155852 },
      { id: 'manang', name: 'Manang', headquarters: 'Chame', area: 2246, population: 5658 },
      { id: 'mustang', name: 'Mustang', headquarters: 'Jomsom', area: 3573, population: 14452 },
      { id: 'myagdi', name: 'Myagdi', headquarters: 'Beni', area: 2297, population: 107033 },
      { id: 'nawalpur', name: 'Nawalpur', headquarters: 'Kawasoti', area: 1043, population: 378079 },
      { id: 'parbat', name: 'Parbat', headquarters: 'Kusma', area: 494, population: 130887 },
      { id: 'syangja', name: 'Syangja', headquarters: 'Putalibazar', area: 1164, population: 253024 },
      { id: 'tanahun', name: 'Tanahun', headquarters: 'Damauli', area: 1546, population: 321153 },
    ]
  },
  {
    id: 'lumbini',
    name: 'Lumbini',
    capital: 'Deukhuri',
    area: 22288,
    population: 5122078,
    districts: [
      { id: 'kapilvastu', name: 'Kapilvastu', headquarters: 'Taulihawa', area: 1738, population: 682961 },
      { id: 'parasi', name: 'Parasi', headquarters: 'Ramgram', area: 634, population: 386868 },
      { id: 'rupandehi', name: 'Rupandehi', headquarters: 'Siddharthanagar', area: 1360, population: 1121957 },
      { id: 'arghakhanchi', name: 'Arghakhanchi', headquarters: 'Sandhikharka', area: 1193, population: 177086 },
      { id: 'gulmi', name: 'Gulmi', headquarters: 'Tamghas', area: 1149, population: 246494 },
      { id: 'palpa', name: 'Palpa', headquarters: 'Tansen', area: 1373, population: 245027 },
      { id: 'dang', name: 'Dang', headquarters: 'Ghorahi', area: 2955, population: 674993 },
      { id: 'pyuthan', name: 'Pyuthan', headquarters: 'Pyuthan', area: 1309, population: 232019 },
      { id: 'rolpa', name: 'Rolpa', headquarters: 'Liwang', area: 1879, population: 234793 },
      { id: 'rukum-east', name: 'Rukum East', headquarters: 'Rukumkot', area: 1161, population: 56786 },
      { id: 'banke', name: 'Banke', headquarters: 'Nepalgunj', area: 2337, population: 603194 },
      { id: 'bardiya', name: 'Bardiya', headquarters: 'Gulariya', area: 2025, population: 459900 },
    ]
  },
  {
    id: 'karnali',
    name: 'Karnali',
    capital: 'Birendranagar',
    area: 27984,
    population: 1688412,
    districts: [
      { id: 'rukum-west', name: 'Rukum West', headquarters: 'Musikot', area: 1213, population: 166740 },
      { id: 'salyan', name: 'Salyan', headquarters: 'Salyan', area: 1462, population: 238515 },
      { id: 'dolpa', name: 'Dolpa', headquarters: 'Dunai', area: 7889, population: 42774 },
      { id: 'humla', name: 'Humla', headquarters: 'Simikot', area: 5655, population: 55394 },
      { id: 'jumla', name: 'Jumla', headquarters: 'Chandannath', area: 2531, population: 118349 },
      { id: 'kalikot', name: 'Kalikot', headquarters: 'Manma', area: 1741, population: 145292 },
      { id: 'mugu', name: 'Mugu', headquarters: 'Gamgadhi', area: 3535, population: 64549 },
      { id: 'surkhet', name: 'Surkhet', headquarters: 'Birendranagar', area: 2451, population: 415126 },
      { id: 'dailekh', name: 'Dailekh', headquarters: 'Narayan', area: 1502, population: 252313 },
      { id: 'jajarkot', name: 'Jajarkot', headquarters: 'Khalanga', area: 2230, population: 189360 },
    ]
  },
  {
    id: 'sudurpashchim',
    name: 'Sudurpashchim',
    capital: 'Dhangadhi',
    area: 19915,
    population: 2694783,
    districts: [
      { id: 'kailali', name: 'Kailali', headquarters: 'Dhangadhi', area: 3235, population: 904666 },
      { id: 'achham', name: 'Achham', headquarters: 'Mangalsen', area: 1680, population: 228852 },
      { id: 'doti', name: 'Doti', headquarters: 'Dipayal', area: 2025, population: 204831 },
      { id: 'bajhang', name: 'Bajhang', headquarters: 'Chainpur', area: 3422, population: 189085 },
      { id: 'bajura', name: 'Bajura', headquarters: 'Martadi', area: 2188, population: 138523 },
      { id: 'kanchanpur', name: 'Kanchanpur', headquarters: 'Bhimdatta', area: 1610, population: 513757 },
      { id: 'dadeldhura', name: 'Dadeldhura', headquarters: 'Amargadhi', area: 1538, population: 139602 },
      { id: 'baitadi', name: 'Baitadi', headquarters: 'Dasharathchand', area: 1519, population: 242157 },
      { id: 'darchula', name: 'Darchula', headquarters: 'Darchula', area: 2322, population: 133310 },
    ]
  },
];

// Top Destinations in Nepal
export const destinations: Destination[] = [
  {
    id: 'everest-base-camp',
    name: 'Everest Base Camp',
    provinceId: 'koshi',
    districtId: 'solukhumbu',
    category: 'Trekking Routes',
    elevation: '5,364 m',
    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    description: 'The ultimate trekking destination offering breathtaking views of the world\'s highest peak.',
    culturalSignificance: 'Sacred mountain in Sherpa culture, home to the highest monastery in the world.',
    image: '/everest-summit.jpg',
    coordinates: { lat: 28.0024, lng: 86.8525 },
    weatherCondition: 'Clear',
    temperature: -12,
  },
  {
    id: 'annapurna-circuit',
    name: 'Annapurna Circuit',
    provinceId: 'gandaki',
    districtId: 'manang',
    category: 'Trekking Routes',
    elevation: '5,416 m',
    bestMonths: ['March', 'April', 'October', 'November'],
    description: 'One of the most diverse treks, circling the Annapurna massif through varied landscapes.',
    culturalSignificance: 'Ancient trade route connecting Nepal with Tibet, rich in Buddhist heritage.',
    image: '/annapurna-trekker.jpg',
    coordinates: { lat: 28.7963, lng: 83.9440 },
    weatherCondition: 'Partly Cloudy',
    temperature: 5,
  },
  {
    id: 'kathmandu-valley',
    name: 'Kathmandu Valley',
    provinceId: 'bagmati',
    districtId: 'kathmandu',
    category: 'Heritage Sites',
    elevation: '1,400 m',
    bestMonths: ['September', 'October', 'November', 'March', 'April', 'May'],
    description: 'A living museum of temples, stupas, and carved wooden streets with 7 UNESCO sites.',
    culturalSignificance: 'Center of Newari civilization and spiritual hub for Hinduism and Buddhism.',
    image: '/kathmandu-stupa.jpg',
    coordinates: { lat: 27.7172, lng: 85.3240 },
    weatherCondition: 'Sunny',
    temperature: 22,
  },
  {
    id: 'pokhara',
    name: 'Pokhara',
    provinceId: 'gandaki',
    districtId: 'kaski',
    category: 'Adventure Sports',
    elevation: '822 m',
    bestMonths: ['September', 'October', 'November', 'March', 'April', 'May'],
    description: 'Adventure capital of Nepal with paragliding, boating, and stunning mountain views.',
    culturalSignificance: 'Gateway to Annapurna, sacred lakeside city with rich Gurung culture.',
    image: '/pokhara-lake.jpg',
    coordinates: { lat: 28.2096, lng: 83.9856 },
    weatherCondition: 'Clear',
    temperature: 25,
  },
  {
    id: 'chitwan-national-park',
    name: 'Chitwan National Park',
    provinceId: 'bagmati',
    districtId: 'chitwan',
    category: 'Wildlife',
    elevation: '415 m',
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    description: 'UNESCO World Heritage site home to Bengal tigers, one-horned rhinos, and elephants.',
    culturalSignificance: 'Traditional Tharu homeland with unique indigenous culture.',
    image: '/chitwan-elephant.jpg',
    coordinates: { lat: 27.5291, lng: 84.3542 },
    weatherCondition: 'Sunny',
    temperature: 28,
  },
  {
    id: 'lumbini',
    name: 'Lumbini',
    provinceId: 'lumbini',
    districtId: 'rupandehi',
    category: 'Spiritual Centers',
    elevation: '150 m',
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    description: 'Birthplace of Lord Buddha, a UNESCO World Heritage spiritual sanctuary.',
    culturalSignificance: 'Most sacred Buddhist pilgrimage site, birthplace of Siddhartha Gautama.',
    image: '/lumbini-garden.jpg',
    coordinates: { lat: 27.4500, lng: 83.2500 },
    weatherCondition: 'Clear',
    temperature: 30,
  },
  {
    id: 'langtang-valley',
    name: 'Langtang Valley',
    provinceId: 'bagmati',
    districtId: 'rasuwa',
    category: 'Trekking Routes',
    elevation: '3,870 m',
    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    description: 'Accessible trekking destination with glaciers, yak pastures, and Tamang villages.',
    culturalSignificance: 'Tamang heartland with Tibetan Buddhist monasteries and traditions.',
    image: '/langtang-valley.jpg',
    coordinates: { lat: 28.2343, lng: 85.5674 },
    weatherCondition: 'Partly Cloudy',
    temperature: 8,
  },
  {
    id: 'bhaktapur',
    name: 'Bhaktapur Durbar Square',
    provinceId: 'bagmati',
    districtId: 'bhaktapur',
    category: 'Heritage Sites',
    elevation: '1,401 m',
    bestMonths: ['September', 'October', 'November', 'March', 'April', 'May'],
    description: 'Best preserved medieval city with pottery squares and Newari architecture.',
    culturalSignificance: 'Former capital of Malla kingdom, center of Newari arts and crafts.',
    image: '/bhaktapur-temple.jpg',
    coordinates: { lat: 27.6722, lng: 85.4278 },
    weatherCondition: 'Sunny',
    temperature: 23,
  },
  {
    id: 'upper-mustang',
    name: 'Upper Mustang',
    provinceId: 'gandaki',
    districtId: 'mustang',
    category: 'Cultural Villages',
    elevation: '3,840 m',
    bestMonths: ['May', 'June', 'July', 'August', 'September', 'October'],
    description: 'Forbidden Kingdom with wind-carved canyons, cliff caves, and Tibetan culture.',
    culturalSignificance: 'Last bastion of traditional Tibetan culture, ancient Lo Kingdom.',
    image: '/mustang-canyon.jpg',
    coordinates: { lat: 29.1833, lng: 83.9500 },
    weatherCondition: 'Clear',
    temperature: 15,
  },
  {
    id: 'muktinath',
    name: 'Muktinath Temple',
    provinceId: 'gandaki',
    districtId: 'mustang',
    category: 'Spiritual Centers',
    elevation: '3,800 m',
    bestMonths: ['March', 'April', 'May', 'September', 'October', 'November'],
    description: 'Sacred pilgrimage site where flames burn beside icy springs.',
    culturalSignificance: 'Important site for both Hindus and Buddhists, place of salvation.',
    image: '/mustang-canyon.jpg',
    coordinates: { lat: 28.8167, lng: 83.8708 },
    weatherCondition: 'Clear',
    temperature: 10,
  },
  {
    id: 'janakpur',
    name: 'Janakpur',
    provinceId: 'madhesh',
    districtId: 'dhanusha',
    category: 'Heritage Sites',
    elevation: '74 m',
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    description: 'Ancient city believed to be the birthplace of Goddess Sita.',
    culturalSignificance: 'Important Hindu pilgrimage site, center of Maithili culture.',
    image: '/lumbini-garden.jpg',
    coordinates: { lat: 26.7271, lng: 85.9407 },
    weatherCondition: 'Sunny',
    temperature: 32,
  },
  {
    id: 'bardiya-national-park',
    name: 'Bardiya National Park',
    provinceId: 'lumbini',
    districtId: 'bardiya',
    category: 'Wildlife',
    elevation: '152 m',
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    description: 'Largest national park in Terai, home to wild elephants and Bengal tigers.',
    culturalSignificance: 'Traditional Tharu homeland with rich indigenous culture.',
    image: '/chitwan-elephant.jpg',
    coordinates: { lat: 28.3833, lng: 81.4167 },
    weatherCondition: 'Sunny',
    temperature: 29,
  },
  {
    id: 'gorkha-palace',
    name: 'Gorkha Palace',
    provinceId: 'gandaki',
    districtId: 'gorkha',
    category: 'Heritage Sites',
    elevation: '1,131 m',
    bestMonths: ['September', 'October', 'November', 'March', 'April', 'May'],
    description: 'Birthplace of King Prithvi Narayan Shah who unified Nepal.',
    culturalSignificance: 'Birthplace of modern Nepal, important historical monument.',
    image: '/kathmandu-stupa.jpg',
    coordinates: { lat: 28.0000, lng: 84.6333 },
    weatherCondition: 'Sunny',
    temperature: 24,
  },
  {
    id: 'rara-lake',
    name: 'Rara Lake',
    provinceId: 'karnali',
    districtId: 'mugu',
    category: 'Wildlife',
    elevation: '2,990 m',
    bestMonths: ['April', 'May', 'September', 'October'],
    description: 'Nepal\'s largest lake surrounded by Rara National Park.',
    culturalSignificance: 'Sacred lake in local folklore, pristine alpine ecosystem.',
    image: '/pokhara-lake.jpg',
    coordinates: { lat: 29.5500, lng: 82.0833 },
    weatherCondition: 'Clear',
    temperature: 12,
  },
  {
    id: 'tansen',
    name: 'Tansen',
    provinceId: 'lumbini',
    districtId: 'palpa',
    category: 'Cultural Villages',
    elevation: '1,350 m',
    bestMonths: ['September', 'October', 'November', 'March', 'April', 'May'],
    description: 'Historic hill station with traditional Newari architecture.',
    culturalSignificance: 'Former Magar kingdom, center of traditional Dhaka weaving.',
    image: '/bhaktapur-temple.jpg',
    coordinates: { lat: 27.8667, lng: 83.5500 },
    weatherCondition: 'Sunny',
    temperature: 22,
  },
  {
    id: 'bandipur',
    name: 'Bandipur',
    provinceId: 'gandaki',
    districtId: 'tanahun',
    category: 'Cultural Villages',
    elevation: '1,030 m',
    bestMonths: ['September', 'October', 'November', 'March', 'April', 'May'],
    description: 'Preserved hilltop town with 18th-century Newari architecture.',
    culturalSignificance: 'Former trading hub on Tibet trade route, living museum.',
    image: '/langtang-valley.jpg',
    coordinates: { lat: 27.9333, lng: 84.4167 },
    weatherCondition: 'Sunny',
    temperature: 23,
  },
];

// Category colors for UI
export const categoryColors: Record<DestinationCategory, string> = {
  'Heritage Sites': '#8B5CF6',
  'Trekking Routes': '#10B981',
  'Wildlife': '#F59E0B',
  'Spiritual Centers': '#EC4899',
  'Adventure Sports': '#3B82F6',
  'Cultural Villages': '#F97316',
};

// Impact metrics for dashboard
export interface ImpactMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  changeLabel: string;
}

export const impactMetrics: ImpactMetric[] = [
  { id: 'carbon-offset', label: 'Tourist Footprint Offset', value: 12540, unit: 'tons CO₂', change: 12.5, changeLabel: 'vs last year' },
  { id: 'community-revenue', label: 'Local Community Revenue', value: 8.2, unit: 'M NPR', change: 23.8, changeLabel: 'vs last year' },
  { id: 'heritage-investment', label: 'Heritage Preservation', value: 3.5, unit: 'M NPR', change: 18.2, changeLabel: 'vs last year' },
  { id: 'wildlife-protection', label: 'Wildlife Protection', value: 156, unit: 'sq km', change: 8.4, changeLabel: 'new areas' },
];

// Monthly visitor data for charts
export const monthlyVisitorData = [
  { month: 'Jan', visitors: 45000, carbonOffset: 890 },
  { month: 'Feb', visitors: 52000, carbonOffset: 1020 },
  { month: 'Mar', visitors: 78000, carbonOffset: 1540 },
  { month: 'Apr', visitors: 95000, carbonOffset: 1870 },
  { month: 'May', visitors: 88000, carbonOffset: 1730 },
  { month: 'Jun', visitors: 62000, carbonOffset: 1220 },
  { month: 'Jul', visitors: 48000, carbonOffset: 950 },
  { month: 'Aug', visitors: 55000, carbonOffset: 1080 },
  { month: 'Sep', visitors: 82000, carbonOffset: 1610 },
  { month: 'Oct', visitors: 110000, carbonOffset: 2160 },
  { month: 'Nov', visitors: 98000, carbonOffset: 1930 },
  { month: 'Dec', visitors: 58000, carbonOffset: 1140 },
];
