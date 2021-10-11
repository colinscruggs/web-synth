import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
// @ts-nocheck

import * as Tone from 'tone'

// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
import "../styles/App.css";

const Block = (props: any) => {
  const { note, column, active, setActive } = props;
  console.log(setActive);
  return (
    <div 
      className={`${(active ? 'note-block-active ' : ' ')}` + 'note-block'}
      onClick={() => {setActive(column, note)}}
    >
      {note}
    </div>
  )
}

export const App = () => {
  // CONSTANTS
  const SEQ_LENGTH = 8;
  const notes = {
    'C4': false,
    'C#4': false,
    'D4': false,
    'D#4': false,
    'E4': false,
    'F4': false,
    'F#4': false,
    'G4': false,
    'G#4': false,
    'A4': false,
    'A#4': false,
    'B4': false,
    'C5': false,
  }

  // STATE
  const [isPlaying, setIsPlaying] = useState(false);
  // const [sequence, setSequence] = useState(['C4', 'D4', 'E4', 'C4', 'F4', 'E4', 'D4', 'G4']);
  const [sequence, setSequence] = useState<any>([]);

  const setNoteActive = ((noteNumber: number, note: string) => {
    const newSequence = [...sequence];
    console.log(newSequence)
    // array of note objects
    //@ts-ignore
    const modifiedNote = newSequence[noteNumber].map(noteObject => {
      if (noteObject.active) {
        return {...noteObject, active: false}
      } else if (noteObject.note === note) {
        return {...noteObject, active: true}
      } else {
        return noteObject;
      }
    });

    newSequence.splice(noteNumber, 1, modifiedNote);
    setSequence(newSequence);
  });

  // start audio context and create grid
  useEffect(() => {
    async function startTone() {
      await Tone.start();
    }
    startTone();
    const noteColumns = [];
    for (let i = 0; i < SEQ_LENGTH; i++) {
      noteColumns.push(
        [...Object.entries(notes).map(note => {
          return {
            note: note[0],
            active: false,
            column: i
          }
        })]
      )
    }
    setSequence(noteColumns)
  }, []);

  // SYNTH AND SEQUENCE
  const synth = useRef(new Tone.Synth({
    oscillator: {
      // @ts-ignore
      type: "triangle"
    },
    envelope: {
      attackCurve: "linear",
      attack: 0.05,
      decay: 0.5,
      sustain: 1.0,
      release: 1
    },
    portamento: 0.05
  }).toDestination());

  const Sequence = useRef(new Tone.Sequence((time, note) => {
    synth.current.triggerAttackRelease(note, 0.1, time);
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

  console.log(sequence);

  return (
    <div className="App">
    <header className="App-header">
      WebSynth
    </header>
    <br />
    <div className="sequencer-container">
      {
        sequence.map((noteArray: [{note: string, active: boolean, column: number}], noteIndex: number) => {
          const noteColumnBlocks = noteArray.map(note => {
            return (
              <Block
                note={note.note}
                active={note.active}
                column={note.column}
                setActive={setNoteActive}
              />
            )
          })
          return (
            <div className='sequencer-column'>
            { noteColumnBlocks }
          </div>
          )
        })
      }
    </div>

    <button onClick={() => toggleLoop()}>{ isPlaying ? 'Stop': 'Start'}</button>
  </div>
  );
};
