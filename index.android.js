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
        this.onMapPress = this.onMapPress.bind(this);

        this.state = {
            markers: []
        };
    }

    render() {
        return (
            <MapView style={styles.container}
                     showsUserLocation={true}
                     onPress={this.onMapPress}>
                {this.state.markers.map(marker => (
                    <MapView.Marker
                        key={marker.key}
                        coordinate={marker.coordinate}>
                        <FriendMarker imageUrl={marker.imageUrl}/>
                    </MapView.Marker>
                ))}
            </MapView>
        );
    }

    onMapPress(e) {
        this.setState({
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
        });
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
