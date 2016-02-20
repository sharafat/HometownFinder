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

import BaseComponent from './BaseComponent';

class FriendMarker extends BaseComponent {

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
