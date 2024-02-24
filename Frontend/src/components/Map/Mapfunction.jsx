import React, { useState, useRef, useEffect } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import clipboard from 'clipboard-polyfill';

const MapFunction = ({ lat, lng, ulocation }) => {
  const [distanceInfo, setDistanceInfo] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState('');
  const autocompleteRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shareLocation = () => {
    const mapLink = `https://www.google.com/maps?q=${parseFloat(storedLat)},${parseFloat(storedLng)}`;
    const shareText = `Check out this location: ${ulocation}\nView on Google Maps: ${mapLink}`;
    navigator.clipboard.writeText(shareText)
    alert('Location copied to clipboard! Now you can share it.');
  };

  const storedLat = lat;
  const storedLng = lng;

  const defaultOfficeLocation = { lat:parseFloat(storedLat), lng: parseFloat(storedLng)};

  const mapStyles = {
    height: windowWidth < 580 ? '200px' : '400px',
    width: '40%',
  };

  const defaultCenter = {
    lat: storedLat ? parseFloat(storedLat) : defaultOfficeLocation.lat,
    lng: storedLng ? parseFloat(storedLng) : defaultOfficeLocation.lng,
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    const location = place.geometry.location;

    setSelectedLocation({ lat: location.lat(), lng: location.lng() });
    updatePlaceName(location.lat(), location.lng());

    getDirections({ lat: location.lat(), lng: location.lng() }, defaultOfficeLocation);

    sendLocationToServer({ lat: location.lat(), lng: location.lng() });
  };

  const onMapClick = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    setSelectedLocation({ lat, lng });
    updatePlaceName(lat, lng);

    getDirections({ lat, lng }, defaultOfficeLocation);

    sendLocationToServer({ lat, lng });
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setSelectedLocation({ lat, lng });
        updatePlaceName(lat, lng);

        getDirections({ lat, lng }, defaultOfficeLocation);

        sendLocationToServer({ lat, lng });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const getDirections = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(destination.lat, destination.lng),
        travelMode: 'DRIVING',
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
        } else {
          console.error('Directions request failed:', result);
        }
      }
    );
  };

  const sendLocationToServer = (location) => {
    axios
      .post('/api/sendLocation', { location })
      .then((response) => {
        console.log('Location sent to server:', response.data);
      })
      .catch((error) => {
        console.error('Error sending location to server:', error);
      });
  };

  return (
    <Wrapper>
      <p>Please select the location</p>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_KEY}
        libraries={['places']}
        onLoad={() => {
          // Google Maps script loaded
          // You can add any additional logic here
        }}
      >
        <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
          <input type="text" placeholder="Search location" style={{ width: '100%', height: '40px' }} />
        </Autocomplete>
        <GoogleMap mapContainerStyle={mapStyles} zoom={10} center={selectedLocation || defaultCenter} onClick={onMapClick}>
          {selectedLocation && <Marker position={selectedLocation} />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
      <Button variant="contained" onClick={getCurrentLocation}>
        Get Current Location
      </Button>
      <p className="place">
        <span>Direction:</span> {selectedPlaceName} - to - {ulocation}
      </p>
      <Button variant="contained" color="primary" onClick={shareLocation}>
        Share Location
      </Button>
    </Wrapper>
  );
};

export default MapFunction;

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
  }
`;
