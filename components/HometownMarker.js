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

import FacebookApiService from './FacebookApiService';
import BaseComponent from './BaseComponent';
import FriendMarker from './FriendMarker';
import FriendDetails from './FriendDetails';
import SideMenu from './SideMenu';


class HometownMarker extends BaseComponent {

    constructor(props) {
        super(props);

        this._bind('render', '_fetchHometownLocations', '_centerMapToUserLocation', '_onMapPress', '_onMarkerPress',
                   '_onMenuButtonPress', '_onFriendSelected', '_closeMenu', '_openMenu');

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
            currentlyDisplayedMarker: null,
            displayMenu: false
        };

        if (user.hometown != null) {
            // Include logged in user's hometown in marker list
            this.state.uninitializedMarkers.push({
                id: user.id,
                name: user.name,
                key: this.state.uninitializedMarkers.length,
                imageUrl: FacebookApiService.photoUrl(user.id),
                hometown: user.hometown
            });
        }

        this._fetchHometownLocations();
        this._centerMapToUserLocation();
    }

    _fetchHometownLocations() {
        var hometownMarkerInstance = this;

        for (var i = 0; i < this.state.uninitializedMarkers.length; i++) {
            var marker = this.state.uninitializedMarkers[i];

            fetch(FacebookApiService.apiUrl(marker.hometown.id, 'fields=location'))
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

    _centerMapToUserLocation() {
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
                <View style={styles.header}>
                    <Text style={styles.headerText}>Hometown Finder</Text>
                    <TouchableOpacity onPress={this._onMenuButtonPress}>
                        <Image style={styles.menuIcon}
                               source={require('../assets/images/ic_menu.png')}/>
                    </TouchableOpacity>
                </View>

                {this.state.displayMenu ?
                    <SideMenu ref="menu" friends={this.props.user.friends} callback={this._onFriendSelected}/>
                    : null}

                <MapView style={styles.container}
                         showsUserLocation={true}
                         region={this.state.mapRegion}
                         onPress={this._onMapPress}>
                    {this.state.markers.map(marker => (
                        <MapView.Marker key={marker.key}
                                        coordinate={{latitude: marker.hometown.location.latitude,
                                        longitude: marker.hometown.location.longitude}}
                                        onPress={this._onMarkerPress.bind(this, marker.key)}>
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

    _onMarkerPress(markerKey) {
        var selectedMarker = this.state.markers[markerKey];

        if (this.state.currentlyDisplayedMarker != null) {
            this.refs.friendDetails.update(selectedMarker);
        }

        this.setState({
            currentlyDisplayedMarker: selectedMarker
        });
    }

    _onMapPress() {
        if (this.state.currentlyDisplayedMarker != null) {
            this.refs.friendDetails.destroy(() => {
                this.setState({
                    currentlyDisplayedMarker: null
                });
            });
        }
    }

    _onMenuButtonPress() {
        if (this.state.displayMenu) {
            this._closeMenu();
        } else {
            this._openMenu();
        }
    }

    _onFriendSelected(friend) {
        this._closeMenu();

        this.setState({
            mapRegion: {
                latitude: friend.hometown.location.latitude,
                longitude: friend.hometown.location.longitude,
                latitudeDelta: 1,
                longitudeDelta: 1
            }
        });
    }

    _closeMenu() {
        this.refs.menu.destroy(() => {
            this.setState({displayMenu: false});
        });
    }

    _openMenu() {
        this.setState({displayMenu: true});
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 10
    },
    headerText: {
        flex: 1,
        fontSize: 18,
        color: '#000000',
        textAlign: 'center'
    },
    menuIcon: {}
});

module.exports = HometownMarker;
