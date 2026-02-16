

interface GoogleMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  mapType?: 'roadmap' | 'satellite';
  embedSrc?: string;
  title?: string;
}

const GoogleMap = ({ 
  lat, 
  lng, 
  zoom = 12, 
  className, 
  mapType = 'roadmap',
  embedSrc,
  title = "Google Map"
}: GoogleMapProps) => {
  const typeParam = mapType === 'satellite' ? '&t=k' : '';
  
  // Construct the default embed URL if lat/lng are provided
  const defaultEmbedUrl = (lat !== undefined && lng !== undefined)
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}${typeParam}&output=embed`
    : '';

  // Use the provided embedSrc or fallback to the constructed URL
  const finalSrc = embedSrc || defaultEmbedUrl;

  if (!finalSrc) {
    return (
      <div className={`${className} bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center`}>
        <span className="text-xs text-neutral-400">Map unavailable</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <iframe
        title={title}
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          filter: 'grayscale(10%) contrast(83%)',
          borderRadius: 'inherit'
        }}
        src={finalSrc}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default GoogleMap;
