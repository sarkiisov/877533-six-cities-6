import { renderHook } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';

interface MockMapInstance {
  setView: Mock;
  addLayer: Mock;
  remove: Mock;
}

vi.mock('leaflet', () => {
  const mockMapInstance = {
    setView: vi.fn(),
    addLayer: vi.fn(),
    remove: vi.fn(),
  };

  const MockMap = vi.fn(() => mockMapInstance);
  const MockTileLayer = vi.fn(() => ({}));

  return {
    Map: MockMap,
    TileLayer: MockTileLayer,
  };
});

import { Map, TileLayer } from 'leaflet';
import { useMap } from './useMap';

describe('useMap hook', () => {
  const mockCity = {
    name: 'Amsterdam',
    location: {
      latitude: 52.370216,
      longitude: 4.895168,
      zoom: 10,
    },
  };

  const createMockMapElement = () => {
    const element = document.createElement('div');
    element.style.width = '100%';
    element.style.height = '500px';
    return element;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (Map as unknown as Mock).mockClear();
    (TileLayer as unknown as Mock).mockClear();

    const mapInstance = (Map as unknown as Mock).mock.results[0]?.value as
      | MockMapInstance
      | undefined;
    if (mapInstance) {
      mapInstance.setView.mockClear();
      mapInstance.addLayer.mockClear();
    }
  });

  test('should create map instance on first render when ref has element', () => {
    const mapElement = createMockMapElement();
    const ref = { current: mapElement };

    const { result } = renderHook(() => useMap(ref, mockCity));

    expect(Map).toHaveBeenCalledTimes(1);
    expect(Map).toHaveBeenCalledWith(mapElement, {
      center: {
        lat: mockCity.location.latitude,
        lng: mockCity.location.longitude,
      },
      zoom: mockCity.location.zoom,
    });

    expect(TileLayer).toHaveBeenCalledTimes(1);
    expect(result.current).toBeDefined();
  });

  test('should handle city with negative coordinates', () => {
    const mapElement = createMockMapElement();
    const ref = { current: mapElement };

    const cityWithNegativeCoords = {
      name: 'Test City',
      location: {
        latitude: -52.370216,
        longitude: -4.895168,
        zoom: 10,
      },
    };

    const { result } = renderHook(() => useMap(ref, cityWithNegativeCoords));

    expect(Map).toHaveBeenCalledTimes(1);
    expect(Map).toHaveBeenCalledWith(mapElement, {
      center: {
        lat: cityWithNegativeCoords.location.latitude,
        lng: cityWithNegativeCoords.location.longitude,
      },
      zoom: cityWithNegativeCoords.location.zoom,
    });

    expect(result.current).toBeDefined();
  });

  test('should handle city with zero zoom', () => {
    const mapElement = createMockMapElement();
    const ref = { current: mapElement };

    const cityWithZeroZoom = {
      name: 'Test City',
      location: {
        latitude: 52.370216,
        longitude: 4.895168,
        zoom: 0,
      },
    };

    const { result } = renderHook(() => useMap(ref, cityWithZeroZoom));

    expect(Map).toHaveBeenCalledTimes(1);
    expect(Map).toHaveBeenCalledWith(mapElement, {
      center: {
        lat: cityWithZeroZoom.location.latitude,
        lng: cityWithZeroZoom.location.longitude,
      },
      zoom: cityWithZeroZoom.location.zoom,
    });

    expect(result.current).toBeDefined();
  });

  test('should not recreate map when same ref is passed', () => {
    const mapElement = createMockMapElement();
    const ref = { current: mapElement };

    const { rerender } = renderHook(({ city }) => useMap(ref, city), {
      initialProps: { city: mockCity },
    });

    const newCity = {
      name: 'Paris',
      location: {
        latitude: 48.856613,
        longitude: 2.352222,
        zoom: 12,
      },
    };

    rerender({ city: newCity });
    rerender({ city: mockCity });
    rerender({ city: newCity });

    expect(Map).toHaveBeenCalledTimes(1);
  });
});
