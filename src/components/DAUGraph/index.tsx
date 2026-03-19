import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import useDAUs from "./../../hooks/daus/useDAUs.ts";
import type { DAUResponseDataT } from "./../../../api/routes/dau/domains/models.ts";

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 360;
const MARGIN = { top: 16, right: 18, bottom: 110, left: 54 };

type Datum = {
  day: string;
  dau: number;
  scoreAdjustedDau: number;
};

export default function DAUGraph() {
  const { daus } = useDAUs();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const days = (daus as DAUResponseDataT).days ?? [];

  const parsed = useMemo<Datum[]>(() => {
    // D3 can work with strings for the x-domain, but we keep a stable array order.
    // Your backend currently returns days in descending order; for the chart we want
    // chronological order left-to-right.
    return [...days]
      .sort((a, b) => a.day.localeCompare(b.day))
      .map((d) => ({
        day: d.day,
        dau: d.dau,
        scoreAdjustedDau: d.scoreAdjustedDau,
      }));
  }, [days]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!svgRef.current) return;

    svg.selectAll("*").remove();

    if (parsed.length === 0) {
      svg
        .append("text")
        .attr("x", MARGIN.left)
        .attr("y", DEFAULT_HEIGHT / 2)
        .attr("fill", "#9ca3af")
        .style("font-size", "14px")
        .text("No DAU data available");
      return;
    }

    const innerWidth = DEFAULT_WIDTH - MARGIN.left - MARGIN.right;
    const innerHeight = DEFAULT_HEIGHT - MARGIN.top - MARGIN.bottom;

    const yMax = d3.max(parsed, (d: Datum) => d.dau) ?? 0;

    const x = d3
      .scaleBand()
      .domain(parsed.map((d) => d.day))
      .range([0, innerWidth])
      .padding(0.25);

    const y = d3
      .scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    // Gridlines
    const gridTicks = Math.min(5, Math.max(2, Math.floor(yMax / 1000)));
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(gridTicks)
          .tickSize(-innerWidth)
          .tickFormat(() => ""),
      )
      .call((selection: any) => {
        selection.selectAll(".domain").remove();
        selection
          .selectAll("line")
          .attr("stroke", "#374151")
          .attr("stroke-opacity", 0.25);
      });

    // Total users bars (bottom layer)
    g.selectAll("rect.total")
      .data(parsed)
      .enter()
      .append("rect")
      .attr("class", "total")
      .attr("x", (d: Datum) => x(d.day) ?? 0)
      .attr("width", x.bandwidth())
      .attr("y", (d: Datum) => y(d.dau))
      .attr("height", (d: Datum) => innerHeight - y(d.dau))
      .attr("rx", 6)
      .attr("fill", "#4f46e5")
      .attr("fill-opacity", 0.85);

    // Score adjusted bars (top layer, overlaps)
    g.selectAll("rect.adjusted")
      .data(parsed)
      .enter()
      .append("rect")
      .attr("class", "adjusted")
      .attr("x", (d: Datum) => x(d.day) ?? 0)
      .attr("width", x.bandwidth())
      .attr("y", (d: Datum) => y(d.scoreAdjustedDau))
      .attr("height", (d: Datum) => innerHeight - y(d.scoreAdjustedDau))
      .attr("rx", 6)
      .attr("fill", "#22c55e")
      .attr("fill-opacity", 0.85);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(parsed.map((d: Datum) => d.day))
          .tickSize(0),
      )
      .call((axisG: any) => {
        axisG.selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-0.6em")
          .attr("dy", "0.15em")
          .attr("transform", "rotate(-45)");
      });

    // Y axis
    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((v: number) => `${Number(v)}`),
      )
      .call((axisG: any) => {
        axisG.selectAll("path").attr("stroke", "#374151");
        axisG.selectAll("line").attr("stroke", "#374151").attr("stroke-opacity", 0.35);
        axisG.selectAll("text").attr("fill", "#9ca3af");
      });

    // Simple legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${12})`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 14)
      .attr("height", 14)
      .attr("rx", 4)
      .attr("fill", "#4f46e5");

    legend
      .append("text")
      .attr("x", 22)
      .attr("y", 11)
      .attr("fill", "#9ca3af")
      .style("font-size", "13px")
      .text("Users");

    legend
      .append("rect")
      .attr("x", 170)
      .attr("y", 0)
      .attr("width", 14)
      .attr("height", 14)
      .attr("rx", 4)
      .attr("fill", "#22c55e");

    legend
      .append("text")
      .attr("x", 192)
      .attr("y", 11)
      .attr("fill", "#9ca3af")
      .style("font-size", "13px")
      .text("Score adjusted users");
  }, [parsed]);

  return (
    <div id="dau-graph">
      <h3>Farcaster DAUs</h3>
      <svg ref={svgRef} width={DEFAULT_WIDTH} height={DEFAULT_HEIGHT} />
    </div>
  );
}
