import React from 'react';

const Spinner = (props) => {
  return (
    <div className="z-50 flex justify-center items-center">
      <div
        className={`animate-spin  ${props.small ? 'h-5 w-5 ' : 'h-32 w-32 '}  ${
          props.color
        }`}
      >
        <img
          className="w-full h-full object-cover object-center text-gray-100"
          src="/images/CARITAS_LOGO.png"
          loading='lazy'
          alt=""
        />
      </div>
    </div>
  );
};

export default Spinner;
