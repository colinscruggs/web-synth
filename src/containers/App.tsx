import React, { useContext, useEffect, useState } from "react";
import { isParameter } from "typescript";

import { Oscillator } from "../components/Oscillator";
import context from "../hooks/context";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
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
  };

  const { audioContext } = useContext(context);
  let attackTime = 0.3;
  let sustainLevel = 0.5;
  let releaseTime = 0.2;
  
  const [playingSequence, setPlayingSequence] = useState(false);
  const [currentNotes, setCurrentNotes] = useState();
  const [currentSequence, setCurrentSequence] = useState(['C4', 'D4', 'E4']);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  // establish current playing notes as all false
  useEffect(() => {
    const notesObject = {} as any;
    for (const note in notes) {
      notesObject[note] = false;
    }
    setCurrentNotes(notesObject);
  }, [])

  // useEffect(() => {
  //   if (playingSequence) {
  //     noteLoop();
  //   }
  // }, [playingSequence])

  const playCurrentNote = (note: string) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    gain.gain.setValueAtTime(0, 0);
    gain.gain.linearRampToValueAtTime(sustainLevel, audioContext.currentTime + 0.5 * attackTime);
    gain.gain.setValueAtTime(sustainLevel, audioContext.currentTime + 0.5 - 0.5 * releaseTime);
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
    gain.connect(audioContext.destination);

    // @ts-ignore
    oscillator.frequency.value = notes[note];
    oscillator.type = 'sine' as OscillatorType;
    oscillator.start(0);
    oscillator.stop(audioContext.currentTime + 1);
    oscillator.connect(gain);

    nextNote();
  }

  const nextNote = () => {
    let currentIndex = currentNoteIndex;

    if (currentIndex === 2) {
      currentIndex = 0;
    } else {
      currentIndex = currentIndex++;
    }
    setCurrentNoteIndex(currentIndex);
  }

  const noteLoop = () => {
    setInterval(() => {
      currentSequence.forEach((note, index) => {
        setTimeout(() => {
          playCurrentNote(note);
        }, 500 * index)
    })
    }, currentSequence.length * 500)
  }

  const setPlaying = (val: boolean) => {
    setPlaying(val);
  }

  return (
    <div className="App">
    <header className="App-header">
      WebSynth
    </header>
    <button onClick={() => setPlaying(true)}>START</button>
    <button onClick={() => setPlaying(false)}>STOP</button>
  </div>
  );
};
