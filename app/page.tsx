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
  // Array de arrays de 4 elementos
  const [clusters, setClusters] = useState<number[][]>([]);
  // Número de clusters
  const [clustersNumber, setClustersNumber] = useState<number>(2);
  // Dados do arquivo csv
  const [data, setData] = useState<any>();

  // Função que é chamada quando o usuário seleciona um arquivo
  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
    // Pega o arquivo selecionado
    const file = e.currentTarget.files?.[0];

    // Se não tiver arquivo, retorna
    if (!file) {
      alert("Please select a file");

      return;
    }

    // Faz o parse do arquivo csv em um array de arrays vulgo number[][]
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

        // Seta os dados
        setData(values);
      },
    });
  };

  // Quando o número de clusters ou os dados mudarem, recalcula os clusters
  useEffect(() => {
    // Se não tiver dados, retorna
    if (!data) return;

    // Calcula os clusters
    let ans = kmeans(data, clustersNumber, {});

    // Pega as informações dos clusters
    const info = ans
      .computeInformation(data)
      .map((cluster) => cluster.centroid);

    // Seta os clusters
    setClusters(info);
  }, [clustersNumber, data]);

  // Gera uma cor aleatória
  function generateRandomColor() {
    // Cor inicial aa para transparência
    let color = "#aa";

    for (let i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 16).toString(16);
    }

    return color;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {/* Header de opcoes */}
      <div className="flex flex-col gap-4 text-center sm:flex-row">
        {/* Input de arquivo */}
        <div className="flex flex-col gap-2">
          <h1 className="font-bold">Upload a file</h1>
          <Input type="file" onChange={changeFile} />
        </div>

        {/* Input de numero de clusters */}
        <div className="flex flex-col gap-2">
          <h1 className="font-bold">Number of clusters</h1>
          <Input
            min={1}
            className="text-center"
            type="number"
            defaultValue={clustersNumber}
            onBlur={(e) => setClustersNumber(+e.target.value)}
          />
        </div>
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
                  backgroundColor: generateRandomColor(),
                },
              ],
            }}
          />
        </div>
      ))}
    </main>
  );
}
