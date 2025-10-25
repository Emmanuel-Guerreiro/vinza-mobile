// import React from "react";
// import { Alert, Dimensions, Linking, StyleSheet, View } from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// const { width, height } = Dimensions.get("window");

// const locations = [
//   { id: 1, name: "Obelisco", lat: -34.6037, lng: -58.3816 },
//   { id: 2, name: "La Boca", lat: -34.6345, lng: -58.3632 },
//   { id: 3, name: "Palermo", lat: -34.5886, lng: -58.4303 },
// ];

// export default function MapExample() {
//   const openInGoogleMaps = (lat: number, lng: number, name?: string) => {
//     const label = encodeURIComponent(name || "Ubicación");
//     const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${label}`;
//     Linking.openURL(url).catch(() => {
//       Alert.alert("Error", "No se pudo abrir Google Maps");
//     });
//   };

//   const initialRegion = {
//     latitude: locations[0].lat,
//     longitude: locations[0].lng,
//     latitudeDelta: 0.1,
//     longitudeDelta: 0.1,
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={initialRegion}
//       >
//         {locations.map((loc) => (
//           <Marker
//             key={loc.id}
//             coordinate={{ latitude: loc.lat, longitude: loc.lng }}
//             title={loc.name}
//             onPress={() => openInGoogleMaps(loc.lat, loc.lng, loc.name)}
//           />
//         ))}
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width,
//     height,
//   },
// });
