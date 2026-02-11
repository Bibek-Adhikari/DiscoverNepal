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
        temperature: d.temperature
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
        temperature: data.temperature
      }
    },
    enabled: !!id
  })
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