import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
// @ts-nocheck

import * as Tone from 'tone'

// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
import "../styles/App.css";

export const App = () => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState(['C4', 'D4', 'E4']);
  // declare tone synthesizer
  const [oscillator, setOscillator] = useState({
    type: "sine"
  });
  const [envelope, setEnvelope] = useState({
    attack: 0.3,
    decay: 0.2,
    sustain: 0.2,
    release: 1.5,
  })

  const synth = useRef(new Tone.Synth({
    oscillator: {
      // @ts-ignore
      type: "sine"
    },
    envelope: {
      attackCurve: "exponential",
      attack: 0.3,
      decay: 0.2,
      sustain: 0.2,
      release: 1.5,
    },
    portamento: 0.05
  }).toDestination());

  useEffect(() => {
    async function startTone() {
      await Tone.start();
    }
    startTone();
  }, [])

  const Sequence = useRef(new Tone.Sequence((time, note) => {
    synth.current.triggerAttackRelease(note, 0.5, time);
    // subdivisions are given as subarrays
  }, sequence));


  const toggleLoop = async () => {
    if (isPlaying) {
      Tone.Transport.stop();
      Sequence.current.stop();
      setIsPlaying(false);
    } else {

      Sequence.current.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  }

  return (
    <div className="App">
    <header className="App-header">
      WebSynth
    </header>
    <br />
    <button onClick={() => toggleLoop()}>{ isPlaying ? 'Stop': 'Start'}</button>
  </div>
  );
};
