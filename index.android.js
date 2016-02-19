'use strict';
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View
    } from 'react-native';
import FBLogin from 'react-native-facebook-login';

class HometownFinder extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to HometownFinder!
                </Text>

                <FBLogin permissions={['email', 'user_friends', 'user_hometown']}
                         onLogin={this.onFacebookLogin}
                         onLogout={function(e){console.log(e);}}
                         onError={function(e){console.log(e);alert('Error!');}}
                         onPermissionsMissing={function(e){console.log(e);alert('Error!')}}
                    />
            </View>
        );
    }

    onFacebookLogin(data) {
        console.log(data);

        var user = {
            id: data.profile.id,
            name: data.profile.name,
            hometown: null,
            friends: [],
            token: data.token
        };

        fetch('https://graph.facebook.com/v2.5/me?fields=hometown%2Cfriends%7Bname%2Chometown%7D&access_token=' + user.token)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                if (data.hasOwnProperty('hometown')) {
                    user.hometown = {
                        id: data.hometown.id,
                        name: data.hometown.name
                    };
                }

                if (data.hasOwnProperty('friends')) {
                    for (var i = 0; i < data.friends.data; i++) {
                        var friend = data.friends.data[i];
                        if (friend.hasOwnProperty('hometown')) {
                            user.friends.push({
                                id: friend.id,
                                name: friend.name,
                                hometown: {
                                    id: friend.hometown.id,
                                    name: friend.hometown.name
                                }
                            });
                        }
                    }
                }


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
    welcome: {
        fontSize: 18,
        marginBottom: 30
    }
});

AppRegistry.registerComponent('HometownFinder', () => HometownFinder);
