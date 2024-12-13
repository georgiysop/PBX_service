// Filename - Form.js
import Widget_1 from "./result_1/Widget_1";
import Widget_2 from "./result_2/Widget_2";
import Widget_3 from "./result_3/Widget_3";
import Widget_4 from "./result_4/Widget_4";
// import Widget_5 from "./result_5/Widget_5";
// import Widget_6 from "./result_6/Widget_6";

import s from "./Widgets.css";

export default function Widgets() {
  return (
    <div className="wrapper">
      <Widget_1 />
      <Widget_2 />
      <Widget_4 />
      <Widget_3 />

      {/* <Widget_5 /> */}
      {/* <Widget_6 /> */}
    </div>
  );
}
