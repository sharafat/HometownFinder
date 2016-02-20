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

const FRIEND_DETAILS_COMPONENT_HEIGHT = 110;

class FriendDetails extends BaseComponent {

    constructor(props) {
        super(props);

        this._bind('render', 'destroy', 'onSendRequest', '_animate');

        this.state = {
            slidingAnimationValue: new Animated.ValueXY({x: 0, y: FRIEND_DETAILS_COMPONENT_HEIGHT}),
            currentlyDisplayedMarker: this.props.marker,
            sendRequestButtonLabel: 'Send Chill Request'
        };

        this._animate(0);
    }

    destroy(callback) {
        this._animate(FRIEND_DETAILS_COMPONENT_HEIGHT, () => {
            TimerMixin.componentWillUnmount.call(this);
            callback();
        });
    }

    _animate(yValue, callback) {
        Animated.spring(this.state.slidingAnimationValue, {
            tension: 0,
            friction: 4,
            toValue: {x: 0, y: yValue}
        }).start(() => {
            if (callback != null) {
                callback();
            }
        });
    }

    render() {
        return (
            <Animatable.View ref="friendDetails"
                             style={{transform: this.state.slidingAnimationValue.getTranslateTransform()}}>
                <View style={styles.friendDetails}>
                    <Image style={styles.friendPhoto}
                           source={{uri:  this.state.currentlyDisplayedMarker.imageUrl }}/>
                    <View>
                        <Text style={styles.friendName}>
                            {this.state.currentlyDisplayedMarker.name}
                        </Text>
                        <Text style={styles.friendHometown}>
                            {this.state.currentlyDisplayedMarker.hometown.name}
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
        );
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
}

const styles = StyleSheet.create({
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

module.exports = FriendDetails;
