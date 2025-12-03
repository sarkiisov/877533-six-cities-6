import { useEffect, useRef } from 'react';
import { Icon, layerGroup, Marker } from 'leaflet';
import { useMap } from '../../hooks/useMap';
import { MapProps } from './Map.types';

import Pin from '/img/pin.svg';
import PinActive from '/img/pin-active.svg';

const defaultCustomIcon = new Icon({
  iconUrl: Pin,
  iconSize: [27, 39],
  iconAnchor: [27, 39],
});

const currentCustomIcon = new Icon({
  iconUrl: PinActive,
  iconSize: [27, 39],
  iconAnchor: [27, 39],
});

export const Map = ({ city, points, selectedPoint, ...props }: MapProps) => {
  const mapRef = useRef(null);

  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);

      points.forEach((point) => {
        const marker = new Marker({
          lat: point.latitude,
          lng: point.longitude,
        });

        marker
          .bindTooltip(point.title)
          .setIcon(
            selectedPoint !== undefined && point.id === selectedPoint
              ? currentCustomIcon
              : defaultCustomIcon
          )
          .addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, points, selectedPoint]);

  return <div ref={mapRef} {...props} />;
};
