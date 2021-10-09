import { createContext, useContext } from "react";

const context = createContext({
  audioContext: new AudioContext()
});

console.log("Create AudioContext instance");

export default () => useContext(context);
