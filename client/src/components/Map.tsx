import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import type { Action } from "@shared/schema";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  actions: Action[];
}

interface CityLocation {
  city: string;
  lat: number;
  lng: number;
  actionsCount: number;
}

// Coordenadas exactas para las ciudades brasileñas del proyecto
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "Serra": { lat: -20.1289, lng: -40.3078 }, // Serra, Espírito Santo
  "Corumba": { lat: -19.0078, lng: -57.6544 }, // Corumbá, Mato Grosso do Sul
  "Caxias do sul": { lat: -29.1678, lng: -51.1794 }, // Caxias do Sul, Rio Grande do Sul
  "Rio de Janeiro": { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro, RJ
  // Adicionar más ciudades cuando se agreguen al sheet
  "São Paulo": { lat: -23.5505, lng: -46.6333 },
  "Belo Horizonte": { lat: -19.9167, lng: -43.9345 },
  "Salvador": { lat: -12.9714, lng: -38.5014 },
  "Fortaleza": { lat: -3.7319, lng: -38.5267 },
  "Recife": { lat: -8.0476, lng: -34.8770 },
  "Curitiba": { lat: -25.4284, lng: -49.2733 },
  "Porto Alegre": { lat: -30.0346, lng: -51.2177 }
};

export default function Map({ actions }: MapProps) {
  const [cityLocations, setCityLocations] = useState<CityLocation[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Agrupar acciones por ciudad
    const cityGroups = actions.reduce((acc, action) => {
      if (!acc[action.city]) {
        acc[action.city] = 0;
      }
      acc[action.city]++;
      return acc;
    }, {} as Record<string, number>);

    // Crear ubicaciones con coordenadas
    const locations: CityLocation[] = Object.entries(cityGroups)
      .map(([city, count]) => {
        const coords = cityCoordinates[city];
        if (!coords) return null;
        return {
          city,
          lat: coords.lat,
          lng: coords.lng,
          actionsCount: count
        };
      })
      .filter((location): location is CityLocation => location !== null);

    setCityLocations(locations);
  }, [actions]);

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    );
  }

  if (cityLocations.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No hay ciudades con coordenadas disponibles</p>
      </div>
    );
  }

  // Centro del mapa basado en Brasil
  const center: [number, number] = [-14.2350, -51.9253];

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 relative z-10" data-testid="climate-actions-map">
      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cityLocations.map((location) => (
          <Marker
            key={location.city}
            position={[location.lat, location.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="text-center p-2">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {location.city}
                </h3>
                <p className="text-sm text-gray-600">
                  {location.actionsCount} {location.actionsCount === 1 ? 'acción' : 'acciones'} climáticas
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}