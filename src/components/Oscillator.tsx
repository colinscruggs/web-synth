import React, { useEffect, useContext, useState } from "react";
import context from "../hooks/context";

export const Oscillator = (props: any) => {
  const {
    frequency,
    note,
    waveform
  } = props;

  const [oscillator, setOscillator] = useState<OscillatorNode|undefined>(undefined);
  const [gain, setGain] = useState<GainNode|undefined>(undefined);

  const { audioContext } = useContext(context);

  useEffect(() => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = waveform as OscillatorType;
    oscillator.start();
    oscillator.connect(gain);
    setOscillator(oscillator);

    gain.gain.value = 0;
    gain.connect(audioContext.destination);
    setGain(gain);

    return () => {
      oscillator.stop();
      oscillator.disconnect();
    };
  }, []);

  useEffect(
    () => {
        if (oscillator) {
          oscillator.frequency.value = frequency;
        }
    },
    [frequency],
  ); // only trigger this effect when frequency changes
  
  const startNote = () => {
    if (gain) {
      gain.gain.value = 1;
    }
  }

  const endNote = () => {
    if (gain) {
      gain.gain.value = 0;
    }
  }

  return (
    <button
      onMouseDown={() => startNote()}
      onMouseUp={() => endNote()}
    >{note}</button>
  );
};