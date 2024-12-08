import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isInsideGeofence, setIsInsideGeofence] = useState(false);

  const geofenceRegion = { 
    latitude: 37.78825, 
    longitude: -122.4324, 
    latitudeDelta: 0.005, 
    longitudeDelta: 0.005, 
  };

  useEffect(() => {
    const getLocationAsync = async () => {
      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);
        checkGeofence(coords); 
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    getLocationAsync();

    const watchPositionId = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000, // Update every 5 seconds
      },
      (location) => checkGeofence(location.coords)
    );

    return () => Location.removeWatchPositionAsync(watchPositionId); // Cleanup on unmount
  }, []);


  const checkGeofence = async (coords) => {
    const isWithin = isPointInRegion(coords, geofenceRegion);
    setIsInsideGeofence(isWithin);
    
  };

  const isPointInRegion = (point, region) => {
    return (
      point.latitude >= region.latitude - region.latitudeDelta / 2 &&
      point.latitude <= region.latitude + region.latitudeDelta / 2 &&
      point.longitude >= region.longitude - region.longitudeDelta / 2 &&
      point.longitude <= region.longitude + region.longitudeDelta / 2
    );
  };

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} showsUserLocation={true} mapType="hybrid">
        {errorMessage && <Text>Error: {errorMessage}</Text>}
        {location && (
          <Marker coordinate={location} title="Your Location" />
        )}
        {!location && !errorMessage && <Text>Loading location...</Text>}
      </MapView>

      <Text>
        {isInsideGeofence ? 'Inside Geofence' : 'Outside Geofence'}
      </Text>

      <TouchableOpacity style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'white', padding: 10 }} onPress={requestPermissions}>
        <Text>Request Permissions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});