import React from "react";
import { BarLoader } from "react-spinners";

/**
 * The small loading bar on the top side of the results piece, and above the map
 */
const Loader = (props: { loading: boolean }) => (
  <BarLoader loading={props.loading} width={"100%"} color={"#87CEEB"} height={4} />
);

export default Loader;
