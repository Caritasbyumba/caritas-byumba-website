import { NavLink } from 'react-router-dom';

export const CustomLink = function (props) {
  const checkActive = (match, location) => {
    if (match) {
      const { pathname } = location;
      const { url } = match;
      return pathname === url || props.indicator === url;
    } else {
      if (props.indicator) return true;
    }
  };
  return (
    <NavLink
      to={props.page}
      isActive={checkActive}
      activeClassName="font-bold text-red"
      className="text-center text-red  hover:font-bold px-3 py-2"
    >
      {props.name}
    </NavLink>
  );
};
