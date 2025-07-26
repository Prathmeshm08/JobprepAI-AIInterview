import React from 'react';
import background from '../assets/background.jpg';

const BackgroundImage = () => {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-[-2]"
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-[-1]" /> {/* overlay */}
    </>
  );
};

export default BackgroundImage;
