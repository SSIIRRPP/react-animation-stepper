import deepEqual from "deep-equal";
import { Component, createElement } from "react";
import AnimationWrapper from "./AnimationWrapper";
import wait from "./wait";
/* const deepEqual = require("deep-equal"); */

// PROPS:

// steps: animations array to execute

//   STEP STRUCTURE
//    {
//    elements: [""] : array of the element's key on components prop that acts in the step,
//    duration: 1000 : duration of the step in ms,
//    config: {
//        id: null : ID of the component to apply config to;
//                   this allows passing an array of configs as config to apply
//                   different animations to each component on each step
//        classes: [""] || "" : classNames to be applied at animation,
//        styles: {} : Styles object to be applied at animation step,
//                     all styles are accepted except "animation" and "animationDuration"
//        keepConfig: false : determines if applied classes and styles should be removed on animation's completion
//      } || [...configs]
//   }

// components: components object to animate.
//    key: string to identify the component,
//    value: the rendered component to be animated

// reloadOnStepsPropChange (bool): determines if steps should restart on steps prop change

// update: update prop to restart steps on its change

// stepperRef: ref to use with manualAnimationStep prop
//    sets nextStep method to this ref to use in father component

// manualSteps (bool): determines if animations should be reproduced automatically
//    if false, a stepperRef should be provided to acces the nextStep's method from component's father

class AnimationStepper extends Component {
  constructor(props) {
    super(props);
    this.elements = {};
    this.steps = [];
    this.state = {
      step: null,
    };
    // children class components are mounted in father's constructor.
    this.children = this.generateChildren(this.props.components);
  }

  setChildToElements = (id) => (childRef) => {
    // sets children class component in this object when child mount,
    // so we can access its methods.
    this.elements = {
      ...this.elements,
      [id]: childRef,
    };
  };

  generateChildren(comps) {
    // instantiates children without its own children to prevent
    // remounting childs in props.components update
    return Object.entries(comps).map((entry, i) =>
      createElement(AnimationWrapper, {
        setChildToElements: this.setChildToElements(entry[0]),
        id: entry[0],
        key: `AnimationWrapper-${Date.now()}-${i}`,
      })
    );
  }

  loadChildrensOwnChildren() {
    // Executes updateOwnChildren method on each children
    // to update their own children imperatively.
    // Not using re-render to avoid wrapper unmount, and to allow wrapper
    // to update its children seamlessly during an animation.
    Object.entries(this.elements).forEach((elm) => {
      elm[1].updateOwnChildren(this.props.components[elm[0]]);
    });
  }

  setNextStepMethodToStepperRef() {
    // sets nextStep method to stepperRef
    // so it can be executed from a father component
    if (this.props.stepperRef) {
      this.props.stepperRef.current = this.nextStep.bind(this);
    } else {
      throw new Error("No stepper ref provided along manualAnimationStep");
    }
  }

  async componentDidMount() {
    this.loadChildrensOwnChildren();
    this.setSteps();
    if (this.props.manualSteps) {
      this.setNextStepMethodToStepperRef();
    } else {
      await this.startTransitions();
    }
  }

  setSteps() {
    // set animations to an array so animations in component
    // and animations in props are independent.
    // Animations are stored as a function ready to be executed (this.createStep).
    this.steps = this.props.steps.map(
      (step, i) => () => this.createStep(step, i)
    );
  }

  async startTransitions() {
    // automatically executes all steps in order
    for (let step of this.steps) {
      await step();
    }
  }

  async nextStep() {
    // manually executes first transition, and removes it from animations array,
    // so next animation is executed at next call
    if (this.steps.length > 0) {
      await this.steps[0]();
      this.steps = this.steps.slice(1, this.steps.length);
    }
  }

  async createStep(step, i) {
    // promise returned to generate steps.
    // represents a single step.
    const { preDelay, postDelay, config, elements = [] } = step;
    // awaits step preDelay
    if (preDelay && typeof preDelay === "number") {
      await wait(preDelay, i);
    }
    await Promise.all(
      // creates a promise for every single element that transitions,
      elements.map((id) => {
        let _config = config;
        if (Array.isArray(config)) {
          _config = config.find((c) => c.id === id);
        }
        // sends the animation to each element
        return this.elements[id].setStep({ step, config: _config }, i);
      })
    ).finally(() => {
      elements.forEach((id) => {
        // removes animation from each child when resolved
        this.elements[id]?.removeStep(i);
      });
    });
    // awaits step postDelay
    if (postDelay && typeof postDelay === "number") {
      await wait(postDelay, i);
    } else {
      await wait(50, i);
    }
  }

  async restartStepper() {
    this.children = this.generateChildren(this.props.components);
    this.forceUpdate();
    await wait(100);
    this.loadChildrensOwnChildren();
    this.setSteps();
    if (this.props.manualSteps) {
      this.setNextStepMethodToStepperRef();
    } else {
      await this.startTransitions();
    }
  }

  componentDidUpdate(prevProps) {
    if (!deepEqual(prevProps.components, this.props.components)) {
      this.loadChildrensOwnChildren();
    }
    if (
      (this.props.reloadOnStepsPropChange &&
        !deepEqual(prevProps.steps, this.props.steps)) ||
      !deepEqual(prevProps.update, this.props.update)
    ) {
      this.restartStepper();
    }
  }

  render() {
    return this.children;
  }
}

export default AnimationStepper;
