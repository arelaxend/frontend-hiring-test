import React from "react";

function LoadingScreen() {
  return (<div>loading...</div>);
}

const areEqual = () => {
  return true;
};

export default React.memo(LoadingScreen, areEqual);