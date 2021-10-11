import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
// @ts-nocheck

import * as Tone from 'tone'

// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";
import "../styles/App.css";

const Block = (props: any) => {
  const { note, column, active, setActive } = props;
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
    'C3': false,
    'C#3': false,
    'D3': false,
    'D#3': false,
    'E3': false,
    'F3': false,
    'F#3': false,
    'G3': false,
    'G#3': false,
    'A3': false,
    'A#3': false,
    'B3': false,
    'C4': false,
  }

  // STATE
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState<any>([]);

  const setNoteActive = ((noteNumber: number, note: string) => {
    const newSequence = [...sequence];
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
    Sequence.current.set({
      // @ts-ignore
      events: newSequence.map(noteColumn => {
        // @ts-ignore
        const activeNote = noteColumn.find(noteObj => noteObj.active);
        return activeNote?.note ?? null;
      })
    });
  })

  // start audio context and set initial sequence grid state
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
    synth.current.triggerAttackRelease(note ? note : '', 0.1, time);
    // subdivisions are given as subarrays
  }, []));


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
      Sequencer
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
