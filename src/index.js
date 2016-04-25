/* @flow */

import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';

function on(target: Object, eventName: string, callback: Function, capture?: boolean): void {
  if (target.addEventListener) {
    target.addEventListener(eventName, callback, capture);
  } 
  else if (target.attachEvent) { // IE8+ Support
    target.attachEvent(`on${eventName}`, () => {
      callback.call(target);
    });
  }
}

function off(target: Object, eventName: string, callback: Function, capture?: boolean): void {
  if (target.removeEventListener) {
    target.removeEventListener(eventName, callback, capture);
  } 
  else if (target.detachEvent) { // IE8+ Support
    target.detachEvent(`on${eventName}`, callback);
  }
}

type Props = {
  children?: React.Element,
  capture: boolean,
  target?: EventTarget,
  [event: string]: Function
};

type DefaultProps = {
  capture: boolean
};

function forEachListener(props: Props, iteratee: (eventName: string, listener: Function) => any): void {
  for (const name in props) {
    if (name.substring(0, 2) === 'on' && props[name] instanceof Function) {
      const eventName = name.substring(2).toLowerCase();
      iteratee(eventName, props[name]);
    }
  }
}

export default class EventListener extends Component<DefaultProps,Props,void> {
  static propTypes = {
    capture: PropTypes.bool,
    target: PropTypes.object
  };

  static defaultProps = {
    capture: false
  };

  addListeners: () => void = () => {
    const {capture, target} = this.props;
    if (target) {
      forEachListener(this.props, (eventName, listener) => on(target, eventName, listener, capture));
    }
  };

  removeListeners: () => void = () => {
    const {capture, target} = this.props;
    if (target) {
      forEachListener(this.props, (eventName, listener) => off(target, eventName, listener, capture));
    }
  };

  componentDidMount() {
    this.addListeners();
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    return shallowCompare(this, nextProps);
  }

  componentWillUpdate() {
    this.removeListeners();
  }

  componentDidUpdate() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  render(): ?React.Element {
    return null;
  }
}
