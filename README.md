### See a demo [here](https://codepen.io/jSirp8/pen/YzLxZeZ)

#

## Installation:

```ssh
npm i react-animation-stepper
```

and

```jsx
import AnimationStepper from "react-animation-stepper";
```

## Usage:

### First step

##### First, you should define an object containing your components to animate, like this:

#

```jsx
// Structure:

`<identifier>`: `<component>`

const components = useMemo(
  () => ({
    first: <MyFirstComponent />,
    second: <MySecondComponent />,
  }),
  []
);
```

##### This object's keys will act as an identifier for the component, to be referenced later at the steps definition.

#

### Second step

##### Then, you have to define the steps you want the stepper to follow:

#

```jsx
const steps = useMemo(
  () => [
    // first step
    {
      config: {
        style: {
          animationName: "some-animation-defined-in-css-file",
          // extra style properties to apply to your component
          opacity: 0,
        },
        classes: ["some-css-class-defined-in-css-file"],
        keepConfig: true,
      },
      elements: ["first"],
      duration: 500,
    },
    // second step
    {
      config: {
        style: {
          animationName: "some-other-animation",
        },
        classes: ["some-other-css-class"],
        keepConfig: true,
      },
      elements: ["second"],
      duration: 500,
    },
  ],
  []
);
```

##### You should wrap this into a useMemo hook if you want to use [reloadOnStepsPropChange](#user-content-animation-stepper-props), otherwise the animation will reset on every re-render.

#

### Third Step

##### In your child component, set the animationRef ref recieved via props to the html element you want to animate:

#

```jsx
const MyFirstComponent = ({ animationRef }) => {
  return (
    <div ref={animationRef}>
      {
        // your components content
      }
    </div>
  );
};
```

## Example:

#### Automatic step functionality

#

##### In this mode, AnimationStepper will reproduce each step in order until completion.

#

```jsx
<AnimationStepper steps={steps} components={components} />
```

#### Manual step functionality

#

##### In this mode, you should manually trigger every step one by one. You can't trigger nextStep until the last step has been completed.

#

```jsx
const stepperRef = useRef(null); // define ref to store AnimationStepper's methods

// you advance through steps manually with
// AnimationStepper's nextStep method
stepperRef.current.nextStep();

<AnimationStepper
  steps={steps}
  components={components}
  manualSteps
  stepperRef={stepperRef}
/>;
```

## Step's config

##### Each step requires a config object. This object defines which styles and classes will be applied to your component.

```jsx
config: {
  // animation configuration.
}
```

##### You can find more information about its properties at [Step config's props](#user-content-steps-config-props) section.

##### <div id="multi-config"> You can also pass an Object with multiple configurations if you need to define diferent configurations for the components. Use the component's identifier as the key for each config value, like this</div>:

#

```jsx
{
  config: {
    first: {
        // animation configuration.
      },
    second: {
        // animation configuration.
    }
},
// If you use this functionality, you still need to specify
// which elements will act in the current step:
elements: ["first", "second"]
}
```

## <div id="animation-stepper-props">AnimationStepper's Props:</div>

| Props                   | Type  | Required | Description                                                                                                                                                                                                                                                                                                 | Default     |
| ----------------------- | ----- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| steps                   | Array | ??????       | Steps array to execute.                                                                                                                                                                                                                                                                                     | `undefined` |
| components              | Array | ??????       | Components object to animate.                                                                                                                                                                                                                                                                               | `undefined` |
| reloadOnStepsPropChange | Bool  | ??????       | Determines if steps should restart on steps prop change.                                                                                                                                                                                                                                                    | `false`     |
| update                  | Any   | ??????       | Update prop to restart steps on its change.                                                                                                                                                                                                                                                                 | `undefined` |
| stepperRef              | Ref   | ??????       | ref to use along with manualSteps prop. Sets nextStep method to this ref to use in father's component.                                                                                                                                                                                                      | `undefined` |
| manualSteps             | Bool  | ??????       | Determines if animations should be reproduced automatically. If false, a stepperRef should be provided to acces the nextStep's method from component's father. This prop's change won't trigger a re-render, so you should avoid changing from one mode to another (unless you force a re-render yourself). | `false`     |
| automaticPlay           | Bool  | ??????       | Determines if the animation should start on automatic mode                                                                                                                                                                                                                                                  | `true`      |
| onEnd                   | Func  | ??????       | Callback to be executed on automatic steps play completion                                                                                                                                                                                                                                                  | `undefined` |

## <div id="step-props">Step's props:</div>

| Props     | Type          | Required | Description                                                                                                          | Default      |
| --------- | ------------- | -------- | -------------------------------------------------------------------------------------------------------------------- | ------------ |
| elements  | Array<String> | ??????       | Array specifying which elements do act in the step.                                                                  | `undefined`  |
| config    | Object        | ??????       | Configuration to be applied to the animated components. See [Step config's props](#user-content-steps-config-props). | `undefined`  |
| duration  | Integer       | ??????       | Duration of the step in miliseconds.                                                                                 | **1000**     |
| preDelay  | Integer       | ??????       | Delay expressed in miliseconds, applied before the step is reproduced.                                               | `undefined ` |
| postDelay | Integer       | ??????       | Delay expressed in miliseconds, applied after the step is reproduced.                                                | `undefined ` |

## <div id="steps-config-props">Step config's props:</div>

| Props                | Type                      | Required | Description                                                                                                                                                                                                                           | Default     |
| -------------------- | ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| classes              | Array<String> `or` String | ??????       | classNames to be applied at animation. Can be an string, or an Array of Strings.                                                                                                                                                      | `undefined` |
| styles               | Object                    | ??????       | Styles object to be applied at animation step. All styles are accepted except `animation` and `animationDuration`. `animation` will be replaced with `animationName`. `animationDuration` is provided through step's `duration` prop. | `undefined` |
| delay                | Integer                   | ??????       | Delay applied before executing the animation. Util with a [multiple config](#user-content-multi-config), to delay the animation between components that act in the same step.                                                         | `undefined` |
| keepConfig           | Bool                      | ??????       | Determines if applied classes and styles should be kept on animation's completion.                                                                                                                                                    | `false`     |
| removePrevAnimations | Bool                      | ??????       | Removes previous classes and styles kept in the previous animation, before applying the new ones.                                                                                                                                     | `false`     |
