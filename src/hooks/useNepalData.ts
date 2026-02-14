import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Province, Destination } from '../types'

// Fetch all provinces with districts
export function useProvinces() {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async (): Promise<Province[]> => {
      const { data, error } = await supabase
        .from('provinces')
        .select(`
          *,
          districts (*)
        `)
        .order('name')
      
      if (error) throw error
      
      // Transform to match your interface
      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        capital: p.capital,
        area: p.area,
        population: p.population,
        districts: p.districts?.map((d: any) => ({
          id: d.id,
          name: d.name,
          headquarters: d.headquarters,
          area: d.area,
          population: d.population
        }))
      }))
    }
  })
}

// Fetch all destinations
export function useDestinations(category?: string) {
  return useQuery({
    queryKey: ['destinations', category],
    queryFn: async (): Promise<Destination[]> => {
      let query = supabase
        .from('destinations')
        .select('*')
      
      if (category) {
        query = query.eq('category', category)
      }
      
      const { data, error } = await query.order('name')
      if (error) throw error
      
      // Transform snake_case to camelCase
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        provinceId: d.province_id,
        districtId: d.district_id,
        category: d.category,
        elevation: d.elevation,
        bestMonths: d.best_months,
        description: d.description,
        culturalSignificance: d.cultural_significance,
        image: d.image,
        coordinates: d.coordinates,
        weatherCondition: d.weather_condition,
        temperature: d.temperature,
        createdAt: d.created_at
      }))
    }
  })
}

// Fetch single destination
export function useDestination(id: string) {
  return useQuery({
    queryKey: ['destination', id],
    queryFn: async (): Promise<Destination> => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      return {
        id: data.id,
        name: data.name,
        provinceId: data.province_id,
        districtId: data.district_id,
        category: data.category,
        elevation: data.elevation,
        bestMonths: data.best_months,
        description: data.description,
        culturalSignificance: data.cultural_significance,
        image: data.image,
        coordinates: data.coordinates,
        weatherCondition: data.weather_condition,
        temperature: data.temperature,
        createdAt: data.created_at
      }
    },
    enabled: !!id
  })
}

// Fetch recently added destinations
export function useRecentDestinations(limit: number = 4) {
  return useQuery({
    queryKey: ['recent-destinations', limit],
    queryFn: async (): Promise<Destination[]> => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching recent destinations:', error)
        throw error
      }

      if (data && data.length > 0) {
        console.log('Recent fetch success:', data.length, 'items');
        return data.map((d: any) => transformDestination(d))
      }

      console.warn('Sorted query returned no data, falling back to unordered fetch.')
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('destinations')
        .select('*')
        .limit(limit)
      
      if (fallbackError) throw fallbackError
      console.log('Fallback fetch success:', fallbackData?.length, 'items');
      return fallbackData.map((d: any) => transformDestination(d))
    }
  })
}

// Helper to transform snake_case to camelCase
function transformDestination(d: any): Destination {
  return {
    id: d.id,
    name: d.name,
    provinceId: d.province_id,
    districtId: d.district_id,
    category: d.category,
    elevation: d.elevation,
    bestMonths: d.best_months,
    description: d.description,
    culturalSignificance: d.cultural_significance,
    image: d.image,
    coordinates: d.coordinates,
    weatherCondition: d.weather_condition,
    temperature: d.temperature,
    createdAt: d.created_at
  }
}

// Fetch impact metrics
export function useImpactMetrics() {
  return useQuery({
    queryKey: ['impact-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_metrics')
        .select('*')
        .order('id')
      
      if (error) throw error
      return data.map((m: any) => ({
        id: m.id,
        label: m.label,
        value: m.value,
        unit: m.unit,
        change: m.change,
        changeLabel: m.change_label
      }))
    }
  })
}

// Fetch monthly visitor data
export function useMonthlyVisitorData() {
  return useQuery({
    queryKey: ['monthly-visitor-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_visitor_data')
        .select('*')
        .order('id')
      
      if (error) throw error
      return data.map((d: any) => ({
        month: d.month,
        visitors: d.visitors,
        carbonOffset: d.carbon_offset
      }))
    }
  })
}

// Fetch news articles from Supabase
export function useNews(destinationId?: string) {
  return useQuery({
    queryKey: ['news', destinationId],
    queryFn: async () => {
      let query = supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false })
      
      if (destinationId && destinationId !== 'all') {
        query = query.eq('destination_id', destinationId)
      }
      
      const { data, error } = await query
      if (error) throw error
      
      return data.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        url: a.url,
        publishedAt: a.published_at,
        source: a.source,
        imageUrl: a.image_url,
        category: a.category,
        destination_id: a.destination_id
      }))
    }
  })
}

// Mutations for adding data
export async function addDestination(destination: any) {
  console.log('Inserting into destinations:', destination)
  const { data, error } = await supabase
    .from('destinations')
    .insert([destination])
    .select()
  
  if (error) {
    console.error('Supabase error inserting destination:', error)
    throw error
  }
  console.log('Successfully inserted destination:', data)
  return data
}

/**
 * Uploads an image to Supabase Storage and returns the public URL.
 * @param file The file to upload.
 * @param bucket The bucket name ('destinations' or 'articles').
 */
export async function uploadImage(file: File, bucket: 'destinations' | 'articles') {
  console.log(`Starting upload to bucket "${bucket}":`, file.name)
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
  const filePath = fileName

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (uploadError) {
    console.error(`Storage error uploading to "${bucket}":`, uploadError)
    throw uploadError
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  console.log(`Successfully uploaded to "${bucket}". Public URL:`, publicUrl)
  return publicUrl
}

export async function addNewsArticle(article: any) {
  console.log('Inserting into news_articles:', article)
  const { data, error } = await supabase
    .from('news_articles')
    .insert([article])
    .select()
  
  if (error) {
    console.error('Supabase error inserting article:', error)
    throw error
  }
  console.log('Successfully inserted article:', data)
  return data
}