import s from "../Widgets.module.css";
import BarChart from "./Chart";
import { useState, useEffect } from "react";

const UserData = [];

export default function Widgets() {
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [{ label: "", data: UserData.map((data) => data.userGain) }],
  });
  useEffect(() => {}, []);
  return (
    <div className={`${s.wrapper} ${s.graf}`}>
      <BarChart chartData={userData} />
    </div>
  );
}
