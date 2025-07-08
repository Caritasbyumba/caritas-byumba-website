import React from 'react';

const Wrapper = (props) => {
  return (
    <div
      className="relative w-full h-full hover:border-2 border-blue cursor-pointer"
      onClick={() => {
        props.history.push(`/dashboard/item/${props.item}`);
      }}
    >
      <div className="absolute inset-0 bg-transparent z-20"></div>
      {props.children}
    </div>
  );
};

export default Wrapper;
