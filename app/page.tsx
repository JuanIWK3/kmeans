"use client";

import { Input } from "@/components/ui/Input";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { kmeans } from "ml-kmeans";
import Papa from "papaparse";
import { ChangeEvent, useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Home() {
  const [clusters, setClusters] = useState<number[][]>([]);
  const [clustersNumber, setClustersNumber] = useState<number>(4);
  const [data, setData] = useState<any>();

  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (!file) {
      alert("Please select a file");

      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result: any) => {
        let resultData: number[][] = result.data;
        let values = resultData
          .map((user) => {
            return Object.values(user).slice(1, 5);
          })
          .filter((user) => user.length === 4);

        setData(values);
      },
    });
  };

  useEffect(() => {
    if (!data) return;
    
    console.log(data);

    let ans = kmeans(data, clustersNumber, {});

    const info = ans
      .computeInformation(data)
      .map((cluster) => cluster.centroid);

    console.log(info);

    setClusters(info);
  }, [clustersNumber, data]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-col gap-4 text-center">
        <h1>Upload a file</h1>
        <Input type="file" onChange={changeFile} />
        <h1>Number of clusters</h1>
        <Input
          className="text-center"
          type="number"
          defaultValue={clustersNumber}
          onBlur={(e) => setClustersNumber(+e.target.value)}
        />
      </div>

      {clusters.map((cluster, id) => (
        <div key={id}>
          <h1>Cluster {id + 1}</h1>
          <Radar
            className="max-h-[600px]"
            data={{
              labels: ["Rock", "Samba", "Pop", "Rap"],
              datasets: [
                {
                  label: "# of Votes",
                  data: cluster,
                },
              ],
            }}
          />
        </div>
      ))}
    </main>
  );
}
