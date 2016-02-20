/**
 * Created by sharafat on 2/20/16.
 */
'use strict';
import React, {
    AppRegistry,
    Component
    } from 'react-native';

class BaseComponent extends React.Component {

    _bind(...methods) {
        methods.forEach( (method) => this[method] = this[method].bind(this) );
    }
}

module.exports = BaseComponent;
AppRegistry.registerComponent('BaseComponent', () => BaseComponent);
