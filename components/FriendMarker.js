/**
 * Created by sharafat on 2/19/16.
 */

'use strict';
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Image
    } from 'react-native';

class FriendMarker extends Component {

    render() {
        return (
            <Image
                style={styles.marker}
                source={{uri: this.props.imageUrl}}/>
        );
    }
}

const styles = StyleSheet.create({
    marker: {
        width: 26,
        height: 26,
        backgroundColor: '#FF0000'
    }
});

module.exports = FriendMarker;
AppRegistry.registerComponent('FriendMarker', () => FriendMarker);
