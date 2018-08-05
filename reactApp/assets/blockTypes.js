const React = require('react');
import { DefaultDraftBlockRenderMap } from 'draft-js';
import { Map } from 'immutable';

const myBlockTypes = DefaultDraftBlockRenderMap.merge(
  new Map({
    center: {
      wrapper: <div className="center-align" />
    },
    right: {
      wrapper: <div className="right-align" />
    },
    left: {
      wrapper: <div className="left-align" />
    },
    times: {
      wrapper: <div className="times-font" />
    },
    kavivanar: {
      wrapper: <div className="kavivanar-font" />
    },
    crimsontext: {
      wrapper: <div className="crimsontext-font" />
    },
    bungeeinline: {
      wrapper: <div className="bungeeinline-font" />
    },
    redFont: {
      wrapper: <div className="red-font" />
    },
    orangeFont: {
      wrapper: <div className="orange-font" />
    },
    yellowFont: {
      wrapper: <div className="yellow-font" />
    },
    greenFont: {
      wrapper: <div className="green-font" />
    },
    blueFont: {
      wrapper: <div className="blue-font" />
    },
    purpleFont: {
      wrapper: <div className="purple-font" />
    },
    blackFont: {
      wrapper: <div className="black-font" />
    },
    orangeBackground: {
      wrapper: <div className="orange-background" />
    },
    yellowBackground: {
      wrapper: <div className="yellow-background" />
    },
    greenBackground: {
      wrapper: <div className="green-background" />
    },
    purpleBackground: {
      wrapper: <div className="purple-background" />
    },
    whiteBackground: {
      wrapper: <div className="white-background" />
    },
    size12: {
      wrapper: <div className="size12" />
    },
    size24: {
      wrapper: <div className="size24" />
    },
    size36: {
      wrapper: <div className="size36" />
    },
    size48: {
      wrapper: <div className="size48" />
    },
    size60: {
      wrapper: <div className="size60" />
    },
    size72: {
      wrapper: <div className="size72" />
    },
    size84: {
      wrapper: <div className="size84" />
    },
    size96: {
      wrapper: <div className="size96" />
    },
    size108: {
      wrapper: <div className="size108" />
    }
  })
);

export default myBlockTypes;
