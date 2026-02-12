export interface District {
  id: string
  name: string
  headquarters: string
  area: number
  population: number
}

export interface Province {
  id: string
  name: string
  capital: string
  area: number
  population: number
  districts?: District[]
}

export type DestinationCategory = 
  | 'Heritage Sites'
  | 'Trekking Routes'
  | 'Wildlife'
  | 'Spiritual Centers'
  | 'Adventure Sports'
  | 'Cultural Villages'

export interface Destination {
  id: string
  name: string
  provinceId: string
  districtId: string
  category: DestinationCategory
  elevation?: string
  bestMonths: string[]
  description: string
  culturalSignificance: string
  image: string
  coordinates: { lat: number; lng: number }
  weatherCondition?: string
  temperature?: number
}

export interface ImpactMetric {
  id: string
  label: string
  value: number
  unit: string
  change: number
  changeLabel: string
}

export interface NewsArticle {
  id?: string
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  imageUrl?: string
  category?: string
  destination_id?: string
}