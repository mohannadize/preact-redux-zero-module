'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

import * as preact from './preact.js';

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function createStore$1(initialState, middleware) {
    if (initialState === void 0) { initialState = {}; }
    if (middleware === void 0) { middleware = null; }
    var state = initialState || {};
    var listeners = [];
    function dispatchListeners() {
        listeners.forEach(function (f) { return f(state); });
    }
    return {
        middleware: middleware,
        setState: function (update) {
            state = __assign({}, state, (typeof update === "function" ? update(state) : update));
            dispatchListeners();
        },
        subscribe: function (f) {
            listeners.push(f);
            return function () {
                listeners.splice(listeners.indexOf(f), 1);
            };
        },
        getState: function () {
            return state;
        },
        reset: function () {
            state = initialState;
            dispatchListeners();
        }
    };
}

export default createStore$1;

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function shallowEqual(a, b) {
  for (var i in a)
      if (a[i] !== b[i])
          return false;
  for (var i in b)
      if (!(i in a))
          return false;
  return true;
}

function set(store, ret) {
  if (ret != null) {
      if (ret.then)
          return ret.then(store.setState);
      store.setState(ret);
  }
}

function bindAction(action, store) {
  return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      if (typeof store.middleware === "function") {
          return store.middleware(store, action, args);
      }
      return set(store, action.apply(void 0, [store.getState()].concat(args)));
  };
}

function bindActions(actions, store, ownProps) {
  actions = typeof actions === "function" ? actions(store, ownProps) : actions;
  var bound = {};
  for (var name_1 in actions) {
      var action = actions[name_1];
      bound[name_1] = bindAction(action, store);
  }
  return bound;
}

export var Connect = /** @class */ (function (_super) {
  __extends(Connect, _super);
  function Connect(props, context) {
      var _this = _super.call(this, props, context) || this;
      _this.update = function () {
          var mapped = _this.getProps(_this.props, _this.context);
          if (!shallowEqual(mapped, _this.state)) {
              _this.setState(mapped);
          }
      };
      _this.state = _this.getProps(props, context);
      _this.actions = _this.getActions();
      return _this;
  }
  Connect.prototype.componentWillMount = function () {
      this.unsubscribe = this.context.store.subscribe(this.update);
  };
  Connect.prototype.componentWillUnmount = function () {
      this.unsubscribe(this.update);
  };
  Connect.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
      var mapped = this.getProps(nextProps, nextContext);
      if (!shallowEqual(mapped, this.state)) {
          this.setState(mapped);
      }
  };
  Connect.prototype.getProps = function (props, context) {
      var mapToProps = props.mapToProps;
      var state = (context.store && context.store.getState()) || {};
      return mapToProps ? mapToProps(state, props) : state;
  };
  Connect.prototype.getActions = function () {
      var actions = this.props.actions;
      return bindActions(actions, this.context.store, this.props);
  };
  Connect.prototype.render = function (_a, state, _b) {
      var children = _a.children;
      var store = _b.store;
      var child = (children && children[0]) || children;
      return child(__assign({ store: store }, state, this.actions));
  };
  return Connect;
}(preact.Component));
// [ HACK ] to avoid Typechecks
// since there is a small conflict between preact and react typings
// in the future this might become unecessary by updating typings
var ConnectUntyped = Connect;
export function connect(mapToProps, actions) {
  if (actions === void 0) { actions = {}; }
  return function (Child) {
      return /** @class */ (function (_super) {
          __extends(ConnectWrapper, _super);
          function ConnectWrapper() {
              return _super !== null && _super.apply(this, arguments) || this;
          }
          ConnectWrapper.prototype.render = function () {
              var props = this.props;
              return (preact.h(ConnectUntyped, __assign({}, props, { mapToProps: mapToProps, actions: actions }), function (mappedProps) { return preact.h(Child, __assign({}, mappedProps, props)); }));
          };
          return ConnectWrapper;
      }(preact.Component));
  };
}

export var Provider = /** @class */ (function (_super) {
  __extends(Provider, _super);
  function Provider() {
      return _super !== null && _super.apply(this, arguments) || this;
  }
  Provider.prototype.getChildContext = function () {
      return { store: this.props.store };
  };
  Provider.prototype.render = function () {
      return ((this.props.children && this.props.children[0]) ||
          this.props.children);
  };
  return Provider;
}(preact.Component));
