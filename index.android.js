'use strict';
import React, {
    AppRegistry,
    Component,
    Navigator
    } from 'react-native';

import BaseComponent from './components/BaseComponent';
import FacebookLogin from './components/FacebookLogin';
import HometownMarker from './components/HometownMarker';


class HometownFinder extends BaseComponent {

    render() {
        return (
            <Navigator
                initialRoute={{id: 'fbLogin'}}
                renderScene={this._navigatorRenderScene}/>
        );
    }

    _navigatorRenderScene(route, navigator) {
        switch (route.id) {
            case 'fbLogin':
                return (<FacebookLogin navigator={navigator} title="first"/>);
            case 'hometownMarker':
                return (<HometownMarker user={route.user} title="second"/>);
        }
    }
}

AppRegistry.registerComponent('HometownFinder', () => HometownFinder);
