const TestComp2 = ({ children, style, animationRef, mockState }) => {
  return (
    <div ref={animationRef} style={style} className="TestComp__container">
      <p>2</p>
      {mockState}
    </div>
  );
};

export default TestComp2;
