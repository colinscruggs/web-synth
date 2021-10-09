import React, { useState } from "react";

import { Oscillator } from "../components/Oscillator";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/App.css";

export default () => {
  const [frequency, setFrequency] = useState(20);

  return (
    <div className="App">
    <header className="App-header">
      WebSynth
    </header>
      <Slider
          min={200}
          max={300}
          value={frequency}
          style={{ width: 200, margin: 10 }}
          onChange={setFrequency}
        />
      <Oscillator frequency={frequency} waveform={"sine"} />
  </div>
  );
};
