import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isInsideGeofence, setIsInsideGeofence] = useState(false);

  const geofenceRegion = { // Define your geofence region here
    latitude: 37.78825, // Replace with your desired latitude
    longitude: -122.4324, // Replace with your desired longitude
    latitudeDelta: 0.005, // Adjust based on your geofence size
    longitudeDelta: 0.005, // Adjust based on your geofence size
  };

  useEffect(() => {
    const getLocationAsync = async () => {
      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);
        checkGeofence(coords); // Check geofence on location update
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

/*************  ✨ Codeium Command ⭐  *************/
/******  41ef1f1a-bd8e-4dab-a96e-adb29c985029  *******/
  const checkGeofence = async (coords) => {
    const isWithin = isPointInRegion(coords, geofenceRegion);
    setIsInsideGeofence(isWithin);
    // Trigger your desired actions here based on isWithin (entering or exiting)
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