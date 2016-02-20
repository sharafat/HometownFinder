/**
 * Created by sharafat on 2/20/16.
 */

'use strict';
import React, { Component } from 'react-native';

const FACEBOOK_DOMAIN = 'https://graph.facebook.com/';
const FACEBOOK_API_VERSION = 'v2.5';
let token;

class FacebookApiService extends Component {

    static setUserToken(userToken) {
        token = userToken;
    }

    static photoUrl(id) {
        return FACEBOOK_DOMAIN + id + '/picture';
    }

    static apiUrl(id, params) {
        if (token == null) {
            throw "User Token is not set. Please call FacebookApiService.setUserToken() to set token first.";
        }

        return FACEBOOK_DOMAIN + FACEBOOK_API_VERSION + '/' + id
            + '?' + (params != null ? params : '') + ((params != null ? '&' : '') + 'access_token=' + token);
    }
}

module.exports = FacebookApiService;
