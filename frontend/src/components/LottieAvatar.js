import React from "react";
import Lottie from "lottie-react";
import talkingAnimation from "../assets/talking-avatar.json";

const LottieAvatar = () => {
  return (
    <div className="w-40 md:w-60">
      <Lottie animationData={talkingAnimation} loop={true} />
    </div>
  );
};

export default LottieAvatar;
