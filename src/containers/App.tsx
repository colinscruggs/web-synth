import React, { useState } from "react";

import { Oscillator } from "../components/Oscillator";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/App.css";

export const App = () => {

  const notes = {
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88,
    'C5': 523.25
  }

  return (
    <div className="App">
    <header className="App-header">
      WebSynth
    </header>
    <div className="keyboard">
      {Object.entries(notes).map(note => {
        const noteName = note[0];
        const freq = note[1];
        return (
          <Oscillator frequency={freq} note={noteName} waveform={"sine"} />
        )
      })}
    </div>
  </div>
  );
};
