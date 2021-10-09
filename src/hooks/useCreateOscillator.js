import { useState, useEffect } from "react";

import useAudioContext from "./useAudioContext";

export default ({ frequency = 200, type = "sine" } = {}) => {
  const { audioContext } = useAudioContext();

  const [oscillator, setOscillator] = useState(undefined);

  useEffect(() => {
    console.log("componentDidMount");

    const oscillator = audioContext.createOscillator();

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    oscillator.start();
    oscillator.connect(audioContext.destination);

    setOscillator(oscillator);

    return () => {
      console.log("componentWillUnmount");

      oscillator.stop();
      oscillator.disconnect();
    };
  }, []); // [] is to only trigger on componentDidMount and componentWillUnmount

  return oscillator;
};
