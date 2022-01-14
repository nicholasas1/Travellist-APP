import React from "react";
import { registerRootComponent, Logs } from "expo";
import { activateKeepAwake } from "expo-keep-awake";

if (__DEV__) {
  const isRemoteDebuggingEnabled = typeof atob !== "undefined";
  if (isRemoteDebuggingEnabled) {
    Logs.disableExpoCliLogging();
  } else {
    Logs.enableExpoCliLogging();
  }
  activateKeepAwake();
  const App = require("./App").default;
  console.disableYellowBox = true;
  registerRootComponent(App);
} else {
  const App = require("./App").default;
  registerRootComponent(App);
}
