import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import Backdrop from "./backdrop";

const Modal = (props) => {
  let classes =
    "fixed bg-white border border-solid border-gray-500 shadow p-4 box-border transition-all duration-300 ease-out rounded-lg";
  if (props.show) {
    classes =
      "w-90% max-h-80vh fixed z-50 bg-white border border-solid border-gray-500 shadow p-4 box-border transition-all duration-300 ease-out rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100";
  }
  return (
    <Fragment>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        className={classes + " hidden md:block"}
        style={{
          top: "10%",
          left: props.small ? "38%" :  props.medium ? "26%" : "15%",
          width: props.small ? "30%" : props.medium ? "50%" : "70%",
          transform: props.show ? "translate(0,0)" : "translate(-1000%,-1000%)",
          opacity: props.show ? "1" : "0",
        }}
      >
        <div
          className="absolute top-1 right-1 cursor-pointer"
          onClick={props.modalClosed}
        >
          <IoClose size={28} />
        </div>
        {props.children}
      </div>
      <div
        className={classes + " w-90% m-auto md:hidden"}
        style={{
          top: "30%",
          left: "5%",
          transform: props.show ? "translate(0,0)" : "translate(-1000%,-1000%)",
          opacity: props.show ? "1" : "0",
        }}
      >
        <div
          className="absolute top-1 right-1 cursor-pointer"
          onClick={props.modalClosed}
        >
          <IoClose size={28} />
        </div>
        {props.children}
      </div>
    </Fragment>
  );
};

export default Modal;
