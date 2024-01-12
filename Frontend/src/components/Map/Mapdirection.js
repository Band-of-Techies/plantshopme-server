// GLocation.js
import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import styled from 'styled-components';

const GLocation = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState('');
  const [directions, setDirections] = useState(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const storedLat = localStorage.getItem('latitude');
  const storedLng = localStorage.getItem('longitude');


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mapStyles = {
    height: windowWidth < 580 ? '200px' : '400px',
    width: windowWidth < 580 ? '100%' : '100%',
  };

  const defaultCenter = {
    lat: 220485.,
    lng: 55.2708,
  };

  const onMapClick = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    setSelectedLocation({ lat, lng });
    onLocationSelect({ lat, lng });
    updatePlaceName(lat, lng);
    clearDirections();
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    const location = place.geometry.location;

    setSelectedLocation({ lat: location.lat(), lng: location.lng() });
    onLocationSelect({ lat: location.lat(), lng: location.lng() });
    updatePlaceName(location.lat(), location.lng());
    clearDirections();
  };

  const clearDirections = () => {
    setDirections(null);
  };

  const updatePlaceName = (lat, lng) => {
    const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`;
    fetch(geocodingApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          const placeName = data.results[0].formatted_address;
          setSelectedPlaceName(placeName);
        } else {
          console.error('Error getting place name:', data.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching geocoding data:', error);
      });
  };

  // ... (previous code)

const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
  
        setSelectedLocation({ lat, lng });
        onLocationSelect && onLocationSelect({ lat, lng });
  
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(lat, lng);
  
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK') {
            const placeName = results[0].formatted_address;
            setSelectedPlaceName(placeName);
  
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
              {
                origin: { lat, lng },
                destination: selectedLocation,
                travelMode: 'DRIVING',
              },
              (response, status) => {
                if (status === 'OK') {
                  setDirections(response);
                } else {
                  console.error('Directions request failed:', response);
                  // Handle the error, e.g., display a message to the user
                }
              }
            );
          } else {
            console.error('Error getting place name from geolocation:', status);
          }
        });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  
  // ... (remaining code)
  

  const directionsCallback = (response) => {
    if (response !== null && response.status === 'OK') {
      setDirections(response);
    } else {
      console.error('Directions request failed:', response);
    }
  };

  return (
    <Wrapper>
      <p>Please select the location where you want to receive the product:</p>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_KEY} libraries={['places']}>
        <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
          <input type="text" placeholder="Search location" style={{ width: '100%', height: '40px' }} />
        </Autocomplete>
        <GoogleMap
          ref={mapRef}
          mapContainerStyle={mapStyles}
          zoom={10}
          center={selectedLocation || defaultCenter}
          onClick={onMapClick}
        >
          {selectedLocation && <Marker position={selectedLocation} />}
          {directions && <DirectionsRenderer directions={directions} />}
          {selectedLocation && (
            <DirectionsService
              options={{
                destination: selectedLocation,
                origin: defaultCenter,
                travelMode: 'DRIVING',
              }}
              callback={directionsCallback}
            />
          )}
        </GoogleMap>
      </LoadScript>
      <button onClick={getCurrentLocation}>Get Current Location</button>
      <p className="place">
        <span>Selected place:</span> {selectedPlaceName}
      </p>
    </Wrapper>
  );
};

export default GLocation;

const Wrapper = styled.div`
  margin-top: 1rem;
  p {
    padding: 0;
    margin: 0;
  }
  input {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  span {
    font-weight: 600;
  }
  .place {
    background: var(--grey-10);
    padding: 0.5rem;
    margin-top: 0.5rem;
  }
  button {
    margin-top: 0.5rem;
    background: var(--green-300);
    color: #fff;
    font-weight: 600;
    text-align: center;
    padding: 0.5rem 1.25rem;
    border-radius: 5px;
  }
`;
