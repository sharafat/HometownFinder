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

class FriendDetails extends Component {

    render() {
        return (
            <View style={styles.component}>
                <Text style={styles.friendName}>
                    Hello World
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    component: {
        flex: 1
    },
    friendName: {
        fontSize: 16
    }
});

module.exports = FriendDetails;
