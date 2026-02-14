import React from 'react';

interface GoogleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
  mapType?: 'roadmap' | 'satellite';
}

const GoogleMap = ({ lat, lng, zoom = 12, className, mapType = 'satellite' }: GoogleMapProps) => {
  const typeParam = mapType === 'satellite' ? '&t=k' : '';
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}${typeParam}&output=embed`;

  return (
    <div className={className}>
      <iframe
        title="Google Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        src={embedUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default GoogleMap;
