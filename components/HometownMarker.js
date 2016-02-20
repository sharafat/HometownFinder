/**
 * Created by sharafat on 2/20/16.
 */
'use strict';
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Animated,
    Easing,
    View,
    Text,
    Image,
    TouchableOpacity
    } from 'react-native';

import MapView from 'react-native-maps';
import Animatable from 'react-native-animatable';
import TimerMixin from 'react-timer-mixin';

import BaseComponent from './BaseComponent';
import FriendMarker from './FriendMarker';
import FriendDetails from './FriendDetails';


class HometownMarker extends BaseComponent {

    constructor(props) {
        super(props);

        this._bind('render', 'fetchHometownLocations', 'centerMapToUserLocation', 'onMapPress', 'onMarkerPress');

        var user = this.props.user;

        this.state = {
            mapRegion: {
                latitude: 23.7793191,
                longitude: 90.3596064,
                latitudeDelta: 0,
                longitudeDelta: 5
            },
            uninitializedMarkers: user.friends,
            markers: [],
            currentlyDisplayedMarker: null
        };

        if (user.hometown != null) {
            // Include logged in user's hometown in marker list
            this.state.uninitializedMarkers.push({
                id: user.id,
                name: user.name,
                key: this.state.uninitializedMarkers.length,
                imageUrl: 'https://graph.facebook.com/' + user.id + '/picture',
                hometown: user.hometown
            });
        }

        this.fetchHometownLocations();
        this.centerMapToUserLocation();
    }

    fetchHometownLocations() {
        var hometownMarkerInstance = this;

        for (var i = 0; i < this.state.uninitializedMarkers.length; i++) {
            var marker = this.state.uninitializedMarkers[i];

            fetch('https://graph.facebook.com/v2.5/' + marker.hometown.id + '?fields=location&access_token=' + this.props.user.token)
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                    for (var j = 0; j < hometownMarkerInstance.state.uninitializedMarkers.length; j++) {
                        var marker = hometownMarkerInstance.state.uninitializedMarkers[j];
                        if (marker.hometown.id == data.id) {
                            marker.hometown.location = data.location;

                            var markers = hometownMarkerInstance.state.markers;
                            markers.push(marker);

                            hometownMarkerInstance.setState({
                                markers: markers
                            });

                            break;
                        }
                    }
                });
        }
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
            <View style={styles.container}>
                <MapView style={styles.container}
                         showsUserLocation={true}
                         region={this.state.mapRegion}
                         onPress={this.onMapPress}>
                    {this.state.markers.map(marker => (
                        <MapView.Marker key={marker.key}
                                        coordinate={{latitude: marker.hometown.location.latitude,
                                        longitude: marker.hometown.location.longitude}}
                                        onPress={this.onMarkerPress.bind(this, marker.key)}>
                            <FriendMarker imageUrl={marker.imageUrl}/>
                        </MapView.Marker>
                    ))}
                </MapView>

                {this.state.currentlyDisplayedMarker != null ?
                    <FriendDetails ref="friendDetails" marker={this.state.currentlyDisplayedMarker}/>
                    : null}
            </View>
        );
    }

    onMarkerPress(markerKey) {
        var selectedMarker = this.state.markers[markerKey];

        if (this.state.currentlyDisplayedMarker != null) {
            this.refs.friendDetails.update(selectedMarker);
        }

        this.setState({
            currentlyDisplayedMarker: selectedMarker
        });
    }

    onMapPress() {
        if (this.state.currentlyDisplayedMarker != null) {
            this.refs.friendDetails.destroy(() => {
                this.setState({
                    currentlyDisplayedMarker: null
                });
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

module.exports = HometownMarker;
