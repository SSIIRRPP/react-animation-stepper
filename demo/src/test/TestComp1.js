import "./test.scss";
import "./testAnimations.scss";

const TestComp1 = ({ style, animationRef, mockState }) => {
  return (
    <div ref={animationRef} style={style} className="TestComp__container">
      <p>1</p>
      {mockState}
    </div>
  );
};

export default TestComp1;
