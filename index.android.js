/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View
    } from 'react-native';
import MapView from 'react-native-maps';
import FriendMarker from './components/FriendMarker';

class HometownFinder extends Component {

    constructor(props) {
        super(props);

        this.centerMapToUserLocation = this.centerMapToUserLocation.bind(this);

        this.state = {
            mapRegion: {
                latitude: 23.7793191,
                longitude: 90.3596064,
                latitudeDelta: 0,
                longitudeDelta: 5
            },
            markers: [
                {
                    coordinate: {
                        latitude: 23.8302019,
                        longitude: 89.8343373
                    },
                    key: 0,
                    imageUrl: "https://graph.facebook.com/334223930063686/picture"
                },
                {
                    coordinate: {
                        latitude: 23.5258359,
                        longitude: 90.3063203
                    },
                    key: 1,
                    imageUrl: "https://graph.facebook.com/334223930063686/picture"
                }
            ]
        };

        this.centerMapToUserLocation();
    }

    centerMapToUserLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    mapRegion: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: this.state.mapRegion.latitudeDelta,
                        longitudeDelta: this.state.mapRegion.longitudeDelta
                    }
                });
            }
        );
    }

    render() {
        return (
            <MapView style={styles.container}
                     showsUserLocation={true}
                     region={this.state.mapRegion}>
                {this.state.markers.map(marker => (
                    <MapView.Marker
                        key={marker.key}
                        coordinate={marker.coordinate}
                        onPress={this.onMarkerPress.bind(this, marker.key)}>
                        <FriendMarker imageUrl={marker.imageUrl}/>
                    </MapView.Marker>
                ))}
            </MapView>
        );
    }

    onMarkerPress(markerKey) {
        console.log(markerKey);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    marker: {
        width: 26,
        height: 26,
        borderRadius: 13
    }
});

AppRegistry.registerComponent('HometownFinder', () => HometownFinder);
