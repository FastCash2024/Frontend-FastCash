import React from "react";
import { Chart } from "react-google-charts";

const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%", // Para ocupar todo el ancho disponible
    },
    dial: {
      color: "#000",
      border: "0.5px solid #fff",
      padding: "2px",
    },
    title: {
      fontSize: "1em",
      color: "#000",
    },
  };
  
  const Barometer = ({ id, value = 50, title = "" }) => {
    return (
      <div style={styles.container}>
        <div style={styles.dial}>
          <Chart
            height={200}
            chartType="Gauge"
            loader={<div></div>}
            data={[
              ["Label", "Value"],
              [title, Number(value)],
            ]}
            options={{
              redFrom: 0,
              redTo: 33,
              yellowFrom: 34,
              yellowTo: 66,
              greenFrom: 67,
              greenTo: 100,
              yellowColor: "#FFEE58",
              redColor: "#FF7043",
              greenColor: "#81C784",
              minorTicks: 5,
              min: 0,
              max: 100,
            }}
          />
        </div>
      </div>
    );
  };
  

export default Barometer;
