/**
 * Sample React Native App
 * https://github.com/facebook/react-native
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
import FriendMarker from './components/FriendMarker';

var { Dimensions } = require('react-native');

class HometownFinder extends Component {

    constructor(props) {
        super(props);

        this.centerMapToUserLocation = this.centerMapToUserLocation.bind(this);
        this.onMapPress = this.onMapPress.bind(this);
        this.onMarkerPress = this.onMarkerPress.bind(this);
        this.onSendRequest = this.onSendRequest.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

        this.state = {
            mapRegion: {
                latitude: 23.7793191,
                longitude: 90.3596064,
                latitudeDelta: 0,
                longitudeDelta: 5
            },
            slidingAnimationValue: new Animated.ValueXY({x: 0, y: 150}),
            friendDetailsIsDisplayed: false,
            markers: [
                {
                    coordinate: {
                        latitude: 23.8302019,
                        longitude: 89.8343373
                    },
                    key: 0,
                    imageUrl: "https://graph.facebook.com/334223930063686/picture",
                    name: 'Sharu',
                    hometown: 'Manikganj'
                },
                {
                    coordinate: {
                        latitude: 23.5258359,
                        longitude: 90.3063203
                    },
                    key: 1,
                    imageUrl: "https://graph.facebook.com/334223930063686/picture",
                    name: 'Sadu',
                    hometown: 'Munshiganj'
                }
            ],
            currentlyDisplayedMarker: null,
            sendRequestButtonLabel: 'Send Chill Request'
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
            <View style={styles.container}>
                <MapView style={styles.container}
                         showsUserLocation={true}
                         region={this.state.mapRegion}
                         onPress={this.onMapPress}>
                    {this.state.markers.map(marker => (
                        <MapView.Marker
                            key={marker.key}
                            coordinate={marker.coordinate}
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
                                {this.state.currentlyDisplayedMarker != null ? this.state.currentlyDisplayedMarker.hometown : ''}
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

AppRegistry.registerComponent('HometownFinder', () => HometownFinder);
