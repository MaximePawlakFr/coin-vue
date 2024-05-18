import * as Plotly from "plotly.js-dist";

export const drawPlot = (
  div,
  data,
  dates,
  dateColumn,
  stationColumns,
  title,
) => {
  const dataKeys = Object.keys(data);
  const plotlyData = dataKeys
    .map((column) => {
      if (column !== dateColumn && !stationColumns.includes(column)) {
        return {
          name: column,
          x: dates,
          y: data[column],
          mode: "lines",
        };
      }
    })
    .filter((item) => item);

  Plotly.newPlot(
    div,
    plotlyData,
    {
      title: title,
      xaxis: {
        autorange: true,
        rangeselector: {
          buttons: [
            {
              count: 1,
              label: "1m",
              step: "month",
              stepmode: "backward",
            },
            {
              count: 6,
              label: "6m",
              step: "month",
              stepmode: "backward",
            },
            {
              count: 12,
              label: "1y",
              step: "month",
              stepmode: "backward",
            },
            { step: "all" },
          ],
        },
        rangeslider: { range: [dates[0], dates[dates.length - 1]] },
        type: "date",
      },
      showLegend: true,
      legend: {
        x: 1,
        xanchor: "right",
        y: 1,
      },
      scrollZoom: true,
    },
    {
      displaylogo: false,
    },
  );
};
