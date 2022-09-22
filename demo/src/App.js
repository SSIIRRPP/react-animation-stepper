import "./test/testAnimations.scss";
import "./App.css";
import React, { useMemo, useRef, useState } from "react";
import AnimationStepper from "react-animation-stepper";
import TestComp1 from "./test/TestComp1";
import TestComp2 from "./test/TestComp2";
import TestComp3 from "./test/TestComp3";

const makeMockDate = () => {
  let mock = `${Date.now()}`;
  return mock.slice(mock.length - 4, mock.length);
};

function App() {
  const stepperRef = useRef({});
  const [automatic, setAutomatic] = useState(false);
  const [mockState, setMockState] = useState(makeMockDate());
  const [mockState2, setMockState2] = useState(makeMockDate());
  const [update, setUpdate] = useState(null);
  const steps = useMemo(
    () => [
      {
        config: {
          style: {
            animation: "fade-out-up-anim",
          },
          keepConfig: true,
        },
        elements: ["first", "third"],
        duration: 2000,
      },
      {
        config: {
          first: {
            style: {
              animation: "fade-in-down-anim",
            },
            keepConfig: true,
          },
          second: {
            style: {
              animation: "fade-out-up-anim",
            },
            keepConfig: true,
          },
          third: {
            style: {
              animation: "fade-in-down-anim",
            },
            keepConfig: true,
          },
        },

        elements: ["first", "second", "third"],
        duration: 2000,
      },
      {
        config: {
          style: {
            animation: "fade-in-down-anim",
          },
          keepConfig: true,
          removePrevAnimations: true,
        },
        elements: ["second"],
        duration: 1000,
      },
      {
        config: {
          style: {
            animation: "fade-out-up-anim",
          },
          keepConfig: true,
          removePrevAnimations: true,
        },
        elements: ["first", "second", "third"],
        duration: 1000,
        mockState2,
      },
    ],
    [mockState2]
  );
  const components = useMemo(
    () => ({
      first: (
        <TestComp1
          mockState={mockState.slice(mockState.length - 4, mockState.length)}
          style={{ backgroundColor: "red" }}
        />
      ),
      second: (
        <TestComp2 mockState={mockState} style={{ backgroundColor: "green" }} />
      ),
      third: (
        <TestComp3 mockState={mockState} style={{ backgroundColor: "blue" }} />
      ),
    }),
    [mockState]
  );

  return (
    <div className="App">
      <div className="TestComp__topButtons">
        <div
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>Mode: {automatic ? "Automatic" : "Manual"}</p>
          <button
            onClick={() => {
              setAutomatic((s) => !s);
              setUpdate(Date.now());
            }}
          >
            {automatic ? "Make manual steps" : "Make automatic steps"}
          </button>
        </div>
        {!automatic ? (
          <div
            style={{
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button onClick={() => stepperRef.current.nextStep()}>
              AnimationStepper's nextStep method
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></div>
        )}
        <div
          style={{
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button onClick={() => setUpdate(Date.now())}>
            Reset animation steps
            <br />
            <small>(updating "update" prop)</small>
          </button>
        </div>
      </div>
      <div className="TestComp__bottomButtons">
        <div
          className="TestComp__bottom--button"
          style={{
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button onClick={() => setMockState(makeMockDate())}>
            Update components content
            <br />
            <small>(updating AnimationStepper's components prop)</small>
          </button>
        </div>
        <div
          className="TestComp__bottom--button"
          style={{
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button onClick={() => setMockState2(makeMockDate())}>
            Reset animation steps
            <br />
            <small>(updating AnimationStepper's steps prop)</small>
          </button>
        </div>
      </div>
      <div className="TestComp__wrapper">
        {automatic ? (
          <AnimationStepper
            steps={steps}
            components={components}
            update={update}
            reloadOnStepsPropChange
          />
        ) : (
          <AnimationStepper
            steps={steps}
            components={components}
            update={update}
            reloadOnStepsPropChange
            manualSteps
            stepperRef={stepperRef}
          />
        )}
      </div>
    </div>
  );
}

export default App;
