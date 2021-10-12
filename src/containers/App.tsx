import React, { useEffect, useState, useRef } from "react";
import Block from '../components/Block'
import * as Tone from 'tone';
import Select from 'react-select'
// @ts-ignore
import scale from 'music-scale';

import "../styles/App.css";

interface Note {
  note: string,
  active: boolean,
  column?: number
}

export const App = () => {
  // CONSTANTS
  const SEQ_LENGTH = 8;
  const keys = [
    { value: 'C3', label: 'C' },
    { value: 'D3', label: 'D' },
    { value: 'E3', label: 'E' },
    { value: 'F3', label: 'F' },
    { value: 'G3', label: 'G' },
    { value: 'A3', label: 'A' },
    { value: 'B3', label: 'B' }
  ]
  const modes = [
    { value: 'major', label: 'Major'},
    { value: 'minor', label: 'Minor'}
  ]

  // STATE
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState<Note[][]>([]);
  const [currentScale, setCurrentScale] = useState<string[]>(scale('1 2 3 4 5 6 7 8', 'C3'));
  const [currentKey, setCurrentKey] = useState('C3');
  const [currentMode, setCurrentMode] = useState('major');

  const setNoteActive = ((noteNumber: number, note: string) => {
    const newSequence = [...sequence];
    // modify the given note within the correct noteNumber
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
    updateSequence(newSequence);
  })

  // INIT: start audio context and set initial sequence grid state
  useEffect(() => {
    async function startTone() {
      await Tone.start();
    }
    startTone();
    updateScale(currentKey, currentMode);
  }, []);

  useEffect(() => {
    console.log(currentScale);
    updateNoteGrid();
  }, [currentScale])

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

  const updateNoteGrid = () => {
    const noteColumns = [];
    for (let i = 0; i < SEQ_LENGTH; i++) {
      noteColumns.push(
        [...currentScale.map((note, index) => {
          const isActive = sequence.length ? sequence[i][index]?.active : false
          return {
            note: note,
            active: isActive,
            column: i
          }
        })]
      )
    }
    setSequence(noteColumns);
    updateSequence(noteColumns);
  }

  const updateScale = (key: string, mode: string) => {
    switch (mode) {
      case 'major': {
        setCurrentScale(scale('1 2 3 4 5 6 7', key))
        break;
      } case 'minor': {
        setCurrentScale(scale('1 2 3b 4 5 6b 7b', key));
        break;
      }
    }
  }

  const updateSequence = (newSequence: Note[][]) => {
    Sequence.current.set({
      // @ts-ignore
      events: newSequence.map(noteColumn => {
        const activeNote = noteColumn.find(noteObj => noteObj.active);
        return activeNote?.note ?? null;
      })
    });
  }

  return (
    <div className="App">
    <header className="App-header">
      Sequencer
    </header>
    <br />
    <div className="note-control-container">
      <div className="current-key">
        <span>Current Key: </span>
        <Select
          options={keys} 
          defaultValue={keys[0]}
          onChange={e => {
            if (e) {
              setCurrentKey(e.value);
              updateScale(e.value, currentMode);
            }
          }}
        />
      </div>
      <div className="current-mode">
        <span>Current Mode: </span>
        <Select
          options={modes} 
          defaultValue={modes[0]}
          onChange={e => {
            if (e) {
              setCurrentMode(e.value);
              updateScale(currentKey, e.value);
            }
          }}
        />
      </div>
    </div>
    <div className="sequencer-container">
      {
        sequence.map((noteArray: Note[], noteIndex: number) => {
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
