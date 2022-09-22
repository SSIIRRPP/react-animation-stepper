import { Component, cloneElement, createRef } from "react";
import { defaultDuration, defaultStyle } from "./AnimationStepper";
import { EXECUTING, FINISHED, INIT } from "./status";
import wait from "./wait";

const makeStyles = (ms = defaultDuration, style) => {
  let newStyle = {
    ...defaultStyle,
  };
  if (style?.animation) {
    // prevents user from overriding all animation config
    // each config property is individually modifyable except animationDuration
    style.animationName = style.animation;
    delete style.animation;
  }
  if (style) {
    newStyle = {
      ...newStyle,
      ...style,
    };
  }
  return { ...newStyle, animationDuration: `${ms}ms` };
};

async function setStep(step, i) {
  // set animation step from Stepper to state, and changes status to INIT
  // so componentDidUpdate executes the animation;
  // Sets the resolver to resolve Stepper promise when state's status change to FINISHED;
  // returns promise to Stepper's createStep method
  return new Promise((res) => {
    this.setState({ status: INIT, ...step, i });
    this.resolver = res;
  });
}

function removeStep(i) {
  // resets original state after animation is executed, and deletes the animation resolver
  this.setState({
    step: undefined,
    config: undefined,
    status: null,
    i: undefined,
  });
  delete this.resolver;
}

class AnimationWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
    this.appliedClasses = [];
    this.animRef = createRef(null);
    this.setStep = setStep.bind(this);
    this.removeStep = removeStep.bind(this);
    this.props.setChildToElements(this);
  }

  async componentDidUpdate() {
    if (this.state.status === INIT) {
      await this.executeAnimation();
    } else if (this.state.status === FINISHED) {
      this.resolver && this.resolver();
    }
  }

  async executeAnimation() {
    const { step, config } = this.state;
    if (step && config) {
      this.addAnimation();
      // waits to animation to be reproduced
      await wait(step.duration, this.state.i);
      if (!!!config.keepConfig) {
        // if keepConfig is present and true on animation's config,
        // the animation config wont be removed on animation's completion.
        this.removeAnimation();
      }
      this.setState({ status: FINISHED });
    }
  }

  addAnimation() {
    // adds the animation's classes and styles
    this.setState({ status: EXECUTING });
    if (this.state.config?.removePrevAnimations) {
      // if config.removePrevAnimations and previous classes where
      // applied and kept in a previous animation, previous classes
      // will be removed before adding the new ones.
      this.removeClasses(this.appliedClasses);
    }
    this.addClasses(this.state.config?.classes);
    this.addStyles(this.state.config?.style);
  }

  async removeAnimation() {
    this.removeClasses(this.state.config?.classes);
    this.removeStyles();
  }

  addClasses(classes) {
    if (this.animRef.current && this.animRef.current.classList) {
      if (Array.isArray(classes)) {
        this.appliedClasses.push(...this.state.config.classes);
        this.animRef.current.classList.add(...classes);
      } else if (typeof classes === "string") {
        this.appliedClasses.push(this.state.config.classes);
        this.animRef.current.classList.add(classes);
      }
    }
  }

  removeClasses(classes) {
    if (this.animRef.current && this.animRef.current.classList) {
      if (Array.isArray(classes)) {
        this.appliedClasses = this.appliedClasses.filter(
          (c) => !this.state.config.classes.includes(c)
        );
        this.animRef.current.classList.remove(...classes);
      } else if (typeof classes === "string") {
        this.appliedClasses = this.appliedClasses.filter(
          (c) => c !== this.state.config.classes
        );
        this.animRef.current.classList.remove(classes);
      }
    }
  }

  addStyles(styles) {
    const newStyles = makeStyles(this.state.step?.duration, styles);
    // object to store original style's values to be restored on animation completion
    let changedStyles = {};
    Object.entries(newStyles).forEach((entry) => {
      changedStyles = {
        ...changedStyles,
        [entry[0]]: this.animRef.current.style[entry[0]],
      };
      this.animRef.current.style[entry[0]] = entry[1];
    });

    this.changedStyles = changedStyles;
  }

  removeStyles() {
    // restores style's previous stored values after animation completion
    Object.entries(this.changedStyles || {}).forEach((entry) => {
      this.animRef.current.style[entry[0]] = entry[1];
    });
    this.changedStyles = {};
  }

  updateOwnChildren(children) {
    // renders childrens content sent from Stepper
    this.children = children;
    this.forceUpdate();
  }

  render() {
    return this.children
      ? cloneElement(this.children, { animationRef: this.animRef })
      : null;
  }
}

export default AnimationWrapper;
