"use client";

import { kmeans } from "ml-kmeans";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import Papa from "papaparse";
import { ChangeEvent, useState } from "react";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export interface Music {
  id_usuario: number | null;
  horas_ouvidas_rock?: number;
  horas_ouvidas_samba?: number;
  horas_ouvidas_pop?: number;
  horas_ouvidas_rap?: number;
}

export default function Home() {
  const [clusters, setClusters] = useState<number[][]>([]);

  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (!file) {
      alert("Please select a file");

      return;
    }

    Papa.parse(file, {
      //Papa.parse('arquivo_inexistente.csv', { // Simular erro
      //download: true,  // Simular erro
      header: true, // Define se a primeira linha do CSV é um cabeçalho
      dynamicTyping: true, // Converte automaticamente números e datas
      complete: (result: any) => {
        let resultData: number[][] = result.data;
        let values = resultData
          .map((user) => {
            return Object.values(user).slice(1, 5);
          })
          .filter((user) => user.length === 4);

        console.log(values);

        let ans = kmeans(values, 8, {});

        const info = ans
          .computeInformation(values)
          .map((cluster) => cluster.centroid);

        console.log(info);

        setClusters(info);
      },
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <input className="w-full" type="file" onChange={changeFile} />

      {clusters.map((cluster, id) => (
        <div key={id}>
          <h1>Cluster {id + 1}</h1>
          <Radar
            className="max-h-[400px]"
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
