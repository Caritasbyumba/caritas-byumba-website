const Backdrop = (props) =>
  props.show ? (
    <div
      className="fixed inset-0 w-full h-full z-30 bg-gray-500 bg-opacity-75 transition-opacity"
      onClick={props.clicked}
    ></div>
  ) : null;

export default Backdrop;
