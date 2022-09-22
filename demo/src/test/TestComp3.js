const TestComp3 = ({ children, style, animationRef, mockState }) => {
  return (
    <div ref={animationRef} style={style} className="TestComp__container">
      <p>3</p>
      {mockState}
    </div>
  );
};

export default TestComp3;
