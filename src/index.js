/* @flow */

import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';

function on(node: Node, eventName: string, callback: Function, capture?: boolean): void {
  if (node.addEventListener) {
    node.addEventListener(eventName, callback, capture);
  } 
  else if (node.attachEvent) { // IE8+ Support
    node.attachEvent(`on${eventName}`, () => {
      callback.call(node);
    });
  }
}

function off(node: Node, eventName: string, callback: Function, capture?: boolean): void {
  if (node.removeEventListener) {
    node.removeEventListener(eventName, callback, capture);
  } 
  else if (node.detachEvent) { // IE8+ Support
    node.detachEvent(`on${eventName}`, callback);
  }
}

type Props = {
  children?: React.Element,
  capture: boolean,
  node?: Node,
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
    children: PropTypes.node,
    node: PropTypes.instanceOf(Node)
  };

  static defaultProps = {
    capture: false
  };

  addListeners: () => void = () => {
    const {capture, node} = this.props;
    if (node) {
      forEachListener(this.props, (eventName, listener) => on(node, eventName, listener, capture));
    }
  };

  removeListeners: () => void = () => {
    const {capture, node} = this.props;
    if (node) {
      forEachListener(this.props, (eventName, listener) => off(node, eventName, listener, capture));
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
