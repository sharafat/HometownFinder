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

import Animatable from 'react-native-animatable';
import TimerMixin from 'react-timer-mixin';

import BaseComponent from './BaseComponent';

const SCREEN_WIDTH = 650;   // Dimensions.get('window').width somehow isn't working,  so hardcoding this value.


class SideMenu extends BaseComponent {

    constructor(props) {
        super(props);

        this._bind('render', 'destroy', '_animate', '_onFriendSelected');

        this.state = {
            slidingAnimationValue: new Animated.ValueXY({x: SCREEN_WIDTH, y: 0})
        };

        this._animate(0);
    }

    destroy(callback) {
        this._animate(SCREEN_WIDTH, () => {
            TimerMixin.componentWillUnmount.call(this);
            callback();
        });
    }

    _animate(xValue, callback) {
        Animated.spring(this.state.slidingAnimationValue, {
            tension: 0,
            friction: 5,
            toValue: {x: xValue, y: 0}
        }).start(() => {
            if (callback != null) {
                callback();
            }
        });
    }

    render() {
        return (
            <Animatable.View style={[styles.container, {transform: this.state.slidingAnimationValue.getTranslateTransform()}]}>
                <View style={styles.separator}/>

                {this.props.friends.map(friend => (
                    <TouchableOpacity key={friend.key}
                        onPress={this._onFriendSelected.bind(this, friend.key)}>
                        <View>
                            <View style={styles.row}>
                                <Image style={styles.friendPhoto}
                                       source={{uri:  friend.imageUrl }}/>
                                <Text style={styles.friendName}>
                                    {friend.name}
                                </Text>
                            </View>
                            <View style={styles.separator}/>
                        </View>
                    </TouchableOpacity>
                ))}

            </Animatable.View>
        );
    }

    _onFriendSelected(friendIndex) {
        this.props.callback(this.props.friends[friendIndex]);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        padding: 5
    },
    friendPhoto: {
        width: 26,
        height: 26,
        borderRadius: 13,
        marginRight: 10
    },
    friendName: {
        fontSize: 16,
        color: '#000000'
    },
    separator: {
        height: 1,
        backgroundColor: '#EFEFEF'
    }
});

module.exports = SideMenu;
