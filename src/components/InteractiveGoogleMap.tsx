import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { categoryColors, type Destination } from '@/data/nepalData';
import { useTheme } from 'next-themes';

// Fallback declaration if types are not picked up
declare global {
  const google: any;
}

// Custom dark mode map style to match the app's aesthetic
const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

interface InteractiveGoogleMapProps {
  destinations: Destination[];
  onDestinationClick: (destination: Destination) => void;
  className?: string;
}

export default function InteractiveGoogleMap({ 
  destinations, 
  onDestinationClick,
  className 
}: InteractiveGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // Use any to avoid namespace issues
  const markersRef = useRef<any[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", 
      version: "weekly",
      libraries: ["places"]
    });

    (loader as any).load().then(async () => {
      if (!mapRef.current) return;

      const { Map } = await google.maps.importLibrary("maps");

      // Initialize Map
      const map = new Map(mapRef.current, {
        center: { lat: 28.3949, lng: 84.1240 }, // Center of Nepal
        zoom: 7,
        mapId: "DEMO_MAP_ID",
        disableDefaultUI: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: true,
        styles: MAP_STYLES
      });

      mapInstanceRef.current = map;
      
      // Initial render of markers
      updateMarkers(map);
    }).catch((e: any) => {
      console.error("Error loading Google Maps", e);
    });

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, []);

  // Update markers when destinations change
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers(mapInstanceRef.current);
    }
  }, [destinations]);

  // Handle Theme Change (Optional: update map styles dynamicall if needed)
  useEffect(() => {
    if(!mapInstanceRef.current) return;
    // We could switch between light/dark styles here if we defined two sets
  }, [theme]);


  const updateMarkers = (map: any) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (!destinations.length) return;

    // Create new bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();

    destinations.forEach(dest => {
      if (!dest.coordinates?.lat || !dest.coordinates?.lng) return;

      const position = { lat: dest.coordinates.lat, lng: dest.coordinates.lng };
      
      // Create a marker
      // Note: For a true "premium" feel, we might want to use AdvancedMarkerElement if mapId is configured, 
      // but standard Marker is safer without a guaranteed valid Map ID.
      // We can use SVG icons for the markers.
      
      const categoryColor = categoryColors[dest.category] || '#FF5A3C';
      
      const svgMarker = {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: categoryColor,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
        rotation: 0,
        scale: 1.5,
        anchor: new google.maps.Point(12, 24),
      };

      const marker = new google.maps.Marker({
        position,
        map,
        title: dest.name,
        icon: svgMarker,
        animation: google.maps.Animation.DROP,
      });

      marker.addListener("click", () => {
        onDestinationClick(dest);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    // Fit bounds if we have destinations
    if (destinations.length > 0) {
      map.fitBounds(bounds);
      
      // Adjust zoom if it gets too close (e.g. single marker)
      const listener = google.maps.event.addListener(map, "idle", () => { 
        if (map.getZoom()! > 10) map.setZoom(10); 
        google.maps.event.removeListener(listener); 
      });
    } else {
        // Reset to default view if no destinations
        map.setCenter({ lat: 28.3949, lng: 84.1240 });
        map.setZoom(7);
    }
  };

  return (
    <div className={className}>
         <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />
         {/* Overlay to ensure the grayscale filter works seamlessly if applied to parent */}
         <div className="absolute inset-0 pointer-events-none mix-blend-overlay shadow-inner rounded-[inherit]" />
    </div>
  );
}
