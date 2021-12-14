import React from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Alert = ({ title }) => {
  let hideNotif = title === "";

  if (!hideNotif) {
    toast.info(<Display />);
  }

  function Display() {
    return (
      <div>
        <p>{title}</p>
      </div>
    );
  }

  return (
    <ToastContainer
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
    />
  );
};

Alert.defaultProps = {
  title: "This is title",
  body: "Some body",
};

Alert.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
};

export default Alert;
