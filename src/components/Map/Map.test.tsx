import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Map as MapComponent } from './Map';

vi.mock('../../hooks/useMap', () => ({
  useMap: vi.fn(),
}));

import { useMap } from '../../hooks/useMap';
import { makeFakeCity } from '../../utils/mocks';

const addTo = vi.fn();
const removeLayer = vi.fn();

const mockLayerGroupInstance = {
  addTo,
};

const mockMarkerInstance = {
  bindTooltip: vi.fn().mockReturnThis(),
  setIcon: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
};

vi.mock('leaflet', () => ({
  Icon: vi.fn(),
  Marker: vi.fn(() => mockMarkerInstance),
  layerGroup: vi.fn(() => mockLayerGroupInstance),
}));

describe('<Map />', () => {
  const mockCity = makeFakeCity();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    addTo.mockClear();
    removeLayer.mockClear();
    mockMarkerInstance.bindTooltip.mockClear();
    mockMarkerInstance.setIcon.mockClear();
    mockMarkerInstance.addTo.mockClear();
  });

  test('renders markers for each point', () => {
    const mockMap = { removeLayer };
    (useMap as Mock).mockReturnValue(mockMap);

    const points = [
      { id: String(1), latitude: 52.37, longitude: 4.89, title: 'Point 1' },
      { id: String(2), latitude: 52.38, longitude: 4.88, title: 'Point 2' },
    ];

    render(<MapComponent city={mockCity} points={points} />);

    expect(mockMarkerInstance.bindTooltip).toHaveBeenCalledTimes(2);
    expect(mockMarkerInstance.addTo).toHaveBeenCalledTimes(2);

    expect(addTo).toHaveBeenCalledWith(mockMap);
  });

  test('uses active icon for selectedPoint', () => {
    const mockMap = { removeLayer };
    (useMap as Mock).mockReturnValue(mockMap);

    const points = [
      { id: String(10), latitude: 1, longitude: 2, title: 'A' },
      { id: String(20), latitude: 3, longitude: 4, title: 'B' },
    ];

    render(
      <MapComponent
        city={mockCity}
        points={points}
        selectedPoint={String(20)}
      />
    );

    expect(mockMarkerInstance.setIcon).toHaveBeenNthCalledWith(
      1,
      expect.any(Object)
    );

    expect(mockMarkerInstance.setIcon).toHaveBeenNthCalledWith(
      2,
      expect.any(Object)
    );
  });

  test('cleans up marker layer on unmount', () => {
    const mockMap = { removeLayer };
    (useMap as Mock).mockReturnValue(mockMap);

    const { unmount } = render(<MapComponent city={mockCity} points={[]} />);

    unmount();
    expect(removeLayer).toHaveBeenCalledTimes(1);
  });

  test('does not render markers if map is null', () => {
    (useMap as Mock).mockReturnValue(null);

    const points = [{ id: String(1), latitude: 1, longitude: 2, title: 'X' }];

    render(<MapComponent city={mockCity} points={points} />);

    expect(mockMarkerInstance.bindTooltip).not.toHaveBeenCalled();
    expect(mockMarkerInstance.addTo).not.toHaveBeenCalled();
  });

  test('updates marker icons when selectedPoint changes', () => {
    const mockMap = { removeLayer };
    (useMap as Mock).mockReturnValue(mockMap);

    const points = [
      { id: String(1), latitude: 10, longitude: 20, title: 'One' },
    ];

    const { rerender } = render(
      <MapComponent city={mockCity} points={points} selectedPoint={undefined} />
    );

    expect(mockMarkerInstance.setIcon).toHaveBeenCalledTimes(1);

    rerender(
      <MapComponent city={mockCity} points={points} selectedPoint={String(1)} />
    );

    expect(mockMarkerInstance.setIcon).toHaveBeenCalledTimes(2);
  });
});
