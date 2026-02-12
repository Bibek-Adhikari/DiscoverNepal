import { supabase } from './supabase'
import { 
  provinces, 
  destinations, 
  impactMetrics, 
  monthlyVisitorData 
} from '../data/nepalData'

let isSeedingActive = false;

export async function seedSupabaseData() {
  if (isSeedingActive) {
    console.warn('Migration already in progress...');
    return { success: false, error: 'Migration already in progress' };
  }
  
  isSeedingActive = true;
  console.log('Starting migration to Supabase...')

  try {
    // 1. Migrate Provinces & Districts
    console.log('Migrating provinces and districts...')
    for (const province of provinces) {
      // Upsert province
      const { error: pError } = await supabase
        .from('provinces')
        .upsert({
          id: province.id,
          name: province.name,
          capital: province.capital,
          area: province.area,
          population: province.population
        }, { onConflict: 'id' })
      
      if (pError) throw new Error(`Province ${province.name} error: ${pError.message}`)

      // Upsert districts for this province
      if (province.districts && province.districts.length > 0) {
        const districtsToInsert = province.districts.map(d => ({
          id: d.id,
          name: d.name,
          headquarters: d.headquarters,
          area: d.area,
          population: d.population,
          province_id: province.id // Link to province
        }))

        const { error: dError } = await supabase
          .from('districts')
          .upsert(districtsToInsert, { onConflict: 'id' })
        
        if (dError) throw new Error(`Districts for ${province.name} error: ${dError.message}`)
      }
    }

    // 2. Migrate Destinations
    console.log('Migrating destinations...')
    const destinationsToInsert = destinations.map(d => ({
      id: d.id,
      name: d.name,
      province_id: d.provinceId,
      district_id: d.districtId,
      category: d.category,
      elevation: d.elevation,
      best_months: d.bestMonths,
      description: d.description,
      cultural_significance: d.culturalSignificance,
      // Note: currently using local asset paths. 
      // Replace with Supabase Storage public URLs if you move images there.
      image: d.image, 
      coordinates: d.coordinates,
      weather_condition: d.weatherCondition,
      temperature: d.temperature
    }))

    const { error: destError } = await supabase
      .from('destinations')
      .upsert(destinationsToInsert, { onConflict: 'id' })
    
    if (destError) throw destError

    // 3. Migrate Impact Metrics
    console.log('Migrating impact metrics...')
    const { error: metricError } = await supabase
      .from('impact_metrics')
      .upsert(impactMetrics.map(m => ({
        id: m.id,
        label: m.label,
        value: m.value,
        unit: m.unit,
        change: m.change,
        change_label: m.changeLabel // Map camelCase to snake_case
      })), { onConflict: 'id' })
    
    if (metricError) throw metricError

    // 4. Migrate Visitor Data
    console.log('Migrating monthly visitor data...')
    const { error: visitorError } = await supabase
      .from('monthly_visitor_data')
      .upsert(monthlyVisitorData.map((d, i) => ({
        id: i + 1, // Add simple ID for visitor data
        month: d.month,
        visitors: d.visitors,
        carbon_offset: d.carbonOffset
      })), { onConflict: 'id' })
    
    if (visitorError) throw visitorError

    console.log('✅ Migration successful! All static data is now in Supabase.')
    return { success: true }
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    return { success: false, error: error.message }
  } finally {
    isSeedingActive = false;
  }
}
