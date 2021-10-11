import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import Slider from 'react-input-slider';
import useDebounce from './use-debounce'

import * as Tone from 'tone'

// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
import "../styles/App.css";

export const App = () => {
  // start audio context
  useEffect(() => {
    async function startTone() {
      await Tone.start();
    }
    startTone();
  }, []);

  // CONSTANTS
  const SEQ_LENGTH = 8;
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

  // STATE
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState(['C4', 'D4', 'E4', 'C4', 'F4', 'E4', 'D4', 'G4']);
  // declare tone synthesizer
  const [oscillatorType, setOscillatorType] = useState({
    type: "sine"
  });
  const [envelope, setEnvelope] = useState({
    attack: 0.3,
    decay: 0.2,
    sustain: 0.2,
    release: 1.5,
  })
  const [attack, setAttack] = useState(0.3);
  const debouncedAttack = useDebounce(attack, 500);

  // SYNTH AND SEQUENCE
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

  const Sequence = useRef(new Tone.Sequence((time, note) => {
    synth.current.triggerAttackRelease(note, 0.5, time);
    // subdivisions are given as subarrays
  }, sequence));

  
  useEffect(() => {
    // debounce(updateSynth, 100)
    updateSynth();
  }, [debouncedAttack])


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

  const updateSynth = () => {
    console.log(attack);
    console.log(debouncedAttack);
    synth.current.set({
      envelope: {
        attack: attack,
        decay: 0.2,
        sustain: 0.2,
        release: 1.5,
      }
    });
    console.log(synth.current);
  }

  return (
    <div className="App">
    <header className="App-header">
      WebSynth
    </header>
    <br />
    <div className="sequencer-container">
      {
        sequence.map((sequenceNote, i) => {
          const options = Object.entries(notes).map((note, i) => {
            return (
              <option
                value={note[0]}
                selected={note[0] === sequenceNote}
              >{note[0]}</option>
            )
          });
          return (
            <select 
              key={sequenceNote + i}
              id={i + ''}
              onChange={(e) => {
                const val = e.target.value;
                const index = +e.target.id;
                const newSequence = [...sequence];
                newSequence.splice(index, 1, val);
                setSequence(newSequence);
                Sequence.current.set({
                  // @ts-ignore
                  events: newSequence
                })
              }}
            >
              { options }
            </select>
          )
        })
      }
    </div>
    <button onClick={() => toggleLoop()}>{ isPlaying ? 'Stop': 'Start'}</button>
    <br />
    <div className="envelope-container">
      <h3>Envelope</h3>
      <div>
        <span>Attack</span>
        <Slider
          axis='x'
          xmin={0}
          xmax={100}
          x={attack * 100}
          onChange={({ x }) => {
            console.log(x / 100);
            setAttack(x / 100);
            // setAttack(x / 100);
          }}
          // value={this.state.value}
          // onChange={this.onSliderChange}
        />
      </div>
    </div>
  </div>
  );
};
