const getAnimationClassPopup = (animation) =>
  `animate__animated ${animation.type} animate__delay-${animation.delay}s animate__${animation.speed}`;

export default getAnimationClassPopup;
