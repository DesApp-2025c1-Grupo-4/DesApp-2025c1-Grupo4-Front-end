import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && map) {
      map.setView(center, 16);
    }
  }, [center, map]);

  return null;
};

const SearchBar = ({ onSelectLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const provider = new OpenStreetMapProvider();

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const searchResults = await provider.search({ query });
      setResults(searchResults.map(result => ({
        ...result,
        enhancedLabel: `${result.label}${result.raw?.address?.house_number ? ' ' + result.raw.address.house_number : ''}`
      })));
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleResultClick = useCallback(async (result) => {
    try {
      const detailResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${result.y}&lon=${result.x}&addressdetails=1&zoom=18`
      );
      const detailData = await detailResponse.json();
      
      const address = detailData.address || {};
      const enhancedAddress = {
        road: address.road || address.street || address.pedestrian || '',
        city: address.city || address.town || address.village || address.hamlet || '',
        state: address.state || address.county || address.region || '',
        country: address.country || '',
        postalCode: address.postcode || '',
        houseNumber: address.house_number || '',
        suburb: address.suburb || '',
        neighbourhood: address.neighbourhood || '',
      };

      onSelectLocation({
        lat: result.y,
        lng: result.x,
        label: detailData.display_name || result.label,
        address: enhancedAddress,
        raw: detailData
      });
      setResults([]);
      setQuery(enhancedAddress.road ? 
        `${enhancedAddress.road}${enhancedAddress.houseNumber ? ' ' + enhancedAddress.houseNumber : ''}` : 
        result.label);
    } catch (error) {
      console.error('Error al obtener detalles de la ubicación:', error);
      onSelectLocation({
        lat: result.y,
        lng: result.x,
        label: result.label,
        address: {
          road: '',
          houseNumber: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        raw: result.raw
      });
      setResults([]);
      setQuery(result.label);
    }
  }, [onSelectLocation]);

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: '80%',
      maxWidth: '500px',
      backgroundColor: 'white',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar dirección (ej: Av. Corrientes 1234, CABA)"
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          style={{
            padding: '8px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isSearching ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
      
      {results.length > 0 && (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          marginTop: '10px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {results.map((result, index) => (
            <li 
              key={index}
              onClick={() => handleResultClick(result)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                ':hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{result.enhancedLabel}</div>
              {result.raw?.address?.city && (
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  {result.raw.address.city}{result.raw.address.country ? ', ' + result.raw.address.country : ''}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MapPicker = ({ onSelect, initialPosition }) => {
  const defaultPosition = {
    lat: -34.6037,
    lng: -58.3816,
    label: 'Ubicación no seleccionada',
    address: {
      road: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      houseNumber: ''
    },
    raw: null
  };

  const [position, setPosition] = useState(initialPosition || defaultPosition);
  const mapRef = useRef(null);

  const handlePositionChange = useCallback(async (newPosition) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}&addressdetails=1&zoom=18`
      );
      const data = await response.json();
      
      const address = data.address || {};
      const enhancedPosition = {
        lat: newPosition.lat,
        lng: newPosition.lng,
        label: data.display_name || `Ubicación seleccionada (${newPosition.lat.toFixed(6)}, ${newPosition.lng.toFixed(6)})`,
        address: {
          road: address.road || address.street || address.pedestrian || '',
          city: address.city || address.town || address.village || address.hamlet || '',
          state: address.state || address.county || address.region || '',
          country: address.country || '',
          postalCode: address.postcode || '',
          houseNumber: address.house_number || '',
          suburb: address.suburb || '',
          neighbourhood: address.neighbourhood || '',
        },
        raw: data
      };
      
      setPosition(enhancedPosition);
      onSelect(enhancedPosition);
    } catch (error) {
      console.error('Error al obtener detalles de la ubicación:', error);
      const fallbackPosition = {
        ...newPosition,
        label: `Ubicación seleccionada (${newPosition.lat.toFixed(6)}, ${newPosition.lng.toFixed(6)})`,
        address: defaultPosition.address,
        raw: null
      };
      setPosition(fallbackPosition);
      onSelect(fallbackPosition);
    }
  }, [onSelect]);

  const handleMapClick = useCallback((e) => {
    handlePositionChange({
      lat: e.latlng.lat,
      lng: e.latlng.lng
    });
  }, [handlePositionChange]);
  const safeAddress = position?.address || defaultPosition.address;

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer 
        center={[position.lat, position.lng]} 
        zoom={position?.label !== defaultPosition.label ? 16 : 13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        whenCreated={(map) => {
          mapRef.current = map;
          map.on('click', handleMapClick);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SearchBar onSelectLocation={handlePositionChange} />
        <MapUpdater center={[position.lat, position.lng]} />
        <Marker position={[position.lat, position.lng]}>
          <Popup>
            <div>
              <strong>Ubicación seleccionada:</strong>
              <div>{position.label}</div>
              {safeAddress.road && (
                <div>
                  <strong>Calle:</strong> {safeAddress.road}
                  {safeAddress.houseNumber && ` ${safeAddress.houseNumber}`}
                </div>
              )}
              {safeAddress.city && (
                <div>
                  <strong>Ciudad:</strong> {safeAddress.city}
                </div>
              )}
              {safeAddress.state && (
                <div>
                  <strong>Provincia:</strong> {safeAddress.state}
                </div>
              )}
              {safeAddress.country && (
                <div>
                  <strong>País:</strong> {safeAddress.country}
                </div>
              )}
              {safeAddress.postalCode && (
                <div>
                  <strong>Código postal:</strong> {safeAddress.postalCode}
                </div>
              )}
              <div style={{ marginTop: '5px', fontSize: '0.8em' }}>
                Coordenadas: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPicker;