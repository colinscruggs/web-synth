import React, { useEffect, useContext, useState } from "react";
import context from "../hooks/context";

export const Oscillator = (props: any) => {
  const {
    frequency,
    note,
    waveform,
    isPlaying,
    attackTime,
    sustainLevel,
    releaseTime
  } = props;

  const [oscillator, setOscillator] = useState<OscillatorNode|undefined>(undefined);
  const [gain, setGain] = useState<GainNode|undefined>(undefined);

  const { audioContext } = useContext(context);

  // useEffect(() => {
  //   const oscillator = audioContext.createOscillator();
  //   const gain = audioContext.createGain();

  //   oscillator.frequency.value = frequency;
  //   oscillator.type = waveform as OscillatorType;
  //   oscillator.start();
  //   oscillator.stop(audioContext.currentTime + 1);
  //   oscillator.connect(gain);
  //   setOscillator(oscillator);

  //   // gain.gain.value = 0;
  //   gain.gain.setValueAtTime(0, 0);
  //   gain.gain.linearRampToValueAtTime(sustainLevel, audioContext.currentTime + 1 * attackTime);
  //   gain.gain.setValueAtTime(sustainLevel, audioContext.currentTime + 1 - 1 * releaseTime);
  //   gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
  //   gain.connect(audioContext.destination);
  //   setGain(gain);

  //   return () => {
  //     oscillator.stop();
  //     oscillator.disconnect();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (gain) {
      gain.gain.value = isPlaying ? 1 : 0;
    }
  }, [isPlaying])

  return (
    null
  );
};