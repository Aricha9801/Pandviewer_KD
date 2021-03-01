import React from "react";
const Badge:React.FC<{color?:string}> = (props) => {
  return <div className="badge" style={{backgroundColor: props.color}}>{props.children}</div>
};

export default Badge;
