import { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { MapPin } from 'lucide-react';

const LocationComponent = () => {
  const { authUser } = useAuthStore();
  const [address, setAddress] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(authUser.location.isEnabled || false);
  const [location, setLocation] = useState({
    name: authUser.location.name || '',
    isEnabled: authUser.location.isEnabled || false,
    latitude: null,
    longitude: null,
  });

  const { loading, updateProfile } = useUserStore();

  const handleToggleChange = async () => {
    if (!locationEnabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
            longitude,
          }));

          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const result = response.data;
            const state = result.address.state;
            const city = result.address.city || result.address.town || result.address.county;
            const newAddress = city ? `${city}, ${state}` : state;
            setAddress(newAddress);

            await updateProfile({ location: { name: newAddress, isEnabled: true } });
            setLocationEnabled(true);
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      setLocationEnabled(false);
      setLocation((prevLocation) => ({
        ...prevLocation,
        latitude: null,
        longitude: null,
      }));
      setAddress('');
      await updateProfile({ location: { name: '', isEnabled: false } });
    }
  };

  return (
    <div className="">
      <label className="flex items-center cursor-pointer">
        <div className={`relative ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <input
            type="checkbox"
            checked={locationEnabled}
            onChange={handleToggleChange}
            disabled={loading}
            className="sr-only"
          />
          <div className="block bg-gray-600 w-9 h-5 rounded-full"></div>
          <div
            className={`dot absolute left-1 top-[0.160rem]  w-3.5 h-3.5 rounded-full transition ${
              locationEnabled ? 'transform translate-x-full bg-pink-600' : 'bg-white'
            }`}
          ></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">{locationEnabled === false ? "Enable Your Location" : "Disable Your Location"}</div>
      </label>
      <p className={`${locationEnabled === false ? "ml-14" : 'ml-10'}`}>
        {locationEnabled ? (
          <span className="flex items-center ml-3">
            <MapPin className='mr-2' size={16} />
            {address || authUser.location.name}
          </span>
        ) : (
          "Location is disabled"
        )}
      </p>
    </div>
  );
};

export default LocationComponent;
