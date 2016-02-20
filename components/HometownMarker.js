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
import FriendMarker from './FriendMarker';

var { Dimensions } = require('react-native');

class HometownMarker extends Component {

    constructor(props) {
        super(props);

        this.fetchHometownLocations = this.fetchHometownLocations.bind(this);
        this.render = this.render.bind(this);
        this.centerMapToUserLocation = this.centerMapToUserLocation.bind(this);
        this.onMapPress = this.onMapPress.bind(this);
        this.onMarkerPress = this.onMarkerPress.bind(this);
        this.onSendRequest = this.onSendRequest.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

        var user = this.props.user;

        this.state = {
            mapRegion: {
                latitude: 23.7793191,
                longitude: 90.3596064,
                latitudeDelta: 0,
                longitudeDelta: 5
            },
            slidingAnimationValue: new Animated.ValueXY({x: 0, y: 150}),
            friendDetailsIsDisplayed: false,
            uninitializedMarkers: user.friends,
            markers: [],
            currentlyDisplayedMarker: null,
            sendRequestButtonLabel: 'Send Chill Request'
        };

        if (user.hometown != null) {
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
                        <MapView.Marker
                            key={marker.key}
                            coordinate={{latitude: marker.hometown.location.latitude,
                                        longitude: marker.hometown.location.longitude}}
                            onPress={this.onMarkerPress.bind(this, marker.key)}>
                            <FriendMarker imageUrl={marker.imageUrl}/>
                        </MapView.Marker>
                    ))}
                </MapView>

                <Animatable.View ref="friendDetails"
                                 style={{transform: this.state.slidingAnimationValue.getTranslateTransform()}}>
                    <View style={styles.friendDetails}>
                        <Image style={styles.friendPhoto}
                               source={this.state.currentlyDisplayedMarker != null ?
                                    {uri:  this.state.currentlyDisplayedMarker.imageUrl }
                                    : require('image!empty_pixel')}/>
                        <View>
                            <Text style={styles.friendName}>
                                {this.state.currentlyDisplayedMarker != null ? this.state.currentlyDisplayedMarker.name : ''}
                            </Text>
                            <Text style={styles.friendHometown}>
                                {this.state.currentlyDisplayedMarker != null ? this.state.currentlyDisplayedMarker.hometown.name : ''}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={this.onSendRequest}>
                        <View style={styles.sendRequestButton}>
                            <Text style={styles.sendRequestText}
                                  ref="sendRequestText">
                                {this.state.sendRequestButtonLabel}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        );
    }

    onMarkerPress(markerKey) {
        this.setState({
            currentlyDisplayedMarker: this.state.markers[markerKey]
        });

        Animated.spring(this.state.slidingAnimationValue, {
            tension: 0,
            friction: 4,
            toValue: {x: 0, y: 0}
        }).start();

        this.state.friendDetailsIsDisplayed = true;
    }

    onMapPress() {
        if (this.state.friendDetailsIsDisplayed) {
            Animated.spring(this.state.slidingAnimationValue, {
                tension: 0,
                friction: 4,
                toValue: {x: 0, y: 150}
            }).start();

            this.state.friendDetailsIsDisplayed = false;
        }
    }

    onSendRequest() {
        const requestSentLabel = 'Request sent!';
        if (this.state.sendRequestButtonLabel == requestSentLabel) {
            return;
        }

        var sendRequestButtonLabel = this.state.sendRequestButtonLabel;

        TimerMixin.setTimeout.call(this, () => {
            this.setState({
                sendRequestButtonLabel: requestSentLabel
            });

            TimerMixin.setTimeout.call(this, () => {
                this.setState({
                    sendRequestButtonLabel: sendRequestButtonLabel
                });
            }, 2500);
        }, 1500);
    }

    componentWillUnmount() {
        TimerMixin.componentWillUnmount.call(this);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    marker: {
        width: 26,
        height: 26,
        borderRadius: 13
    },
    friendDetails: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 10
    },
    friendPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10
    },
    friendName: {
        fontSize: 20,
        color: '#000000'
    },
    friendHometown: {
        fontSize: 14,
        color: '#A8A8A8'
    },
    sendRequestButton: {
        height: 50,
        backgroundColor: '#53B1EC',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendRequestText: {
        fontSize: 17,
        color: '#FFFFFF'
    }
});

module.exports = HometownMarker;
AppRegistry.registerComponent('HometownMarker', () => HometownMarker);
