export const ButtonWithIcon = function (props) {
  let classes =
    'px-6 py-1 flex items-center transition ease-in duration-200 hover:text-red focus:outline-none';

  if (props.outline === 'true' && props.color === 'red') {
    classes =
      ' flex items-center  px-6 py-1 transition ease-in duration-200 text-center text-red hover:bg-red hover:text-white border-2 border-red focus:outline-none';
  } else if (props.outline === 'false' && props.color === 'red') {
    classes =
      ' flex items-center  px-6 py-1 transition ease-in duration-200 text-center hover:text-red bg-red hover:bg-white text-white hover:text-red border-2 border-red hover:border-red focus:outline-none';
  } else if (props.outline === 'true' && props.color === 'blue') {
    classes =
      ' flex items-center  px-6 py-1 transition ease-in duration-200 text-center text-blue hover:bg-blue hover:text-white border-2 border-blue focus:outline-none';
  } else if (props.outline === 'false' && props.color === 'blue') {
    classes =
      'flex items-center   px-6 py-1 transition ease-in duration-200 text-center hover:text-red bg-blue hover:bg-white text-white hover:text-blue border-2 border-blue hover:border-blue focus:outline-none';
  }

  if (props.outline === 'true' && props.color === 'white') {
    classes =
      ' flex items-center  px-6 py-1 transition ease-in duration-200 text-center text-white hover:bg-white hover:text-red border-2 border-white focus:outline-none';
  } else if (props.outline === 'false' && props.color === 'white') {
    classes =
      ' flex items-center  px-6 py-1 transition ease-in duration-200 text-center hover:text-white bg-white hover:bg-transparent text-red hover:text-white border-2 border-white hover:border-white focus:outline-none';
  }
  if (props.isSmall === true) {
    classes += ' text-xs';
  }

  if (props.isActive === true) {
  }
  return (
    <button
      type="button"
      className={`${props.additional} ${classes} ${
        props.isSquare ? 'rounded' : 'rounded-full'
      }`}
      onClick={props.onClick}
    >
      {props.name}
      &nbsp;
      {props.src ? (
        <img src={props.src} alt={props.name} loading="lazy" />
      ) : (
        props.children
      )}
    </button>
  );
};

export const Button = function (props) {
  let classes = '';
  if (props.outline === 'true' && props.color === 'red') {
    classes =
      props.additional +
      ' cursor-pointer   px-6 py-1 transition ease-in duration-200 text-center text-red hover:bg-red hover:text-white border-2 border-red focus:outline-none';
  } else if (props.outline === 'false' && props.color === 'red') {
    classes =
      props.additional +
      ' cursor-pointer  px-6 py-1 transition ease-in duration-200 text-center hover:text-red bg-red hover:bg-white text-white hover:text-red border-2 border-red hover:border-red focus:outline-none';
  } else if (props.outline === 'true' && props.color === 'blue') {
    classes =
      props.additional +
      ' cursor-pointer  px-6 py-1 transition ease-in duration-200 text-center text-blue hover:bg-blue hover:text-white border-2 border-blue focus:outline-none';
  } else if (props.outline === 'false' && props.color === 'blue') {
    classes =
      props.additional +
      ' cursor-pointer  px-6 py-1 transition ease-in duration-200 text-center hover:text-red bg-blue hover:bg-white text-white hover:text-blue border-2 border-blue hover:border-blue focus:outline-none';
  }

  if (props.outline === 'true' && props.color === 'white') {
    classes =
      props.additional +
      ' cursor-pointer  px-6 py-1 transition ease-in duration-200 text-center text-white hover:bg-white hover:text-red border-2 border-white focus:outline-none';
  } else if (props.outline === 'false' && props.color === 'white') {
    classes =
      props.additional +
      ' cursor-pointer px-6 py-1 transition ease-in duration-200 text-center hover:text-white bg-white hover:bg-transparent text-red hover:text-white border-2 border-white hover:border-white focus:outline-none';
  }

  if (props.isSmall === true) {
    classes += ' text-xs';
  }

  if (props.isActive === true) {
  }
  if (props.type === 'submitbtn') {
    return (
      <button
        className={`${classes} ${props.isSquare ? 'rounded' : 'rounded-full'}`}
        onClick={props.clicked}
        disabled={props.disabled}
        type="submit"
      >
        {props.name}
      </button>
    );
  } else {
    return (
      <button
        className={`${classes} ${props.isSquare ? 'rounded' : 'rounded-full'}`}
        onClick={props.clicked}
        disabled={props.disabled}
      >
        {props.name}
      </button>
    );
  }
};

export const TextButton = (props) => {
  return (
    <button
      className={`${props.additional} text-${props.color}`}
      onClick={props.onClick}
    >
      {props.name}
    </button>
  );
};
