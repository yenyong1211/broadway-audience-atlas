const colors = {
  red: "#9b1d2e",
  gold: "#d89b2b",
  green: "#567a4c",
  blue: "#4d7398",
  brown: "#845d34",
  violet: "#765a91",
  ink: "#17130f",
  muted: "#6e6258",
  line: "#d7c4a5",
  paper: "#fffaf0"
};

const tooltip = d3.select("#tooltip");

function showTooltip(event, html) {
  tooltip
    .style("opacity", 1)
    .html(html)
    .style("left", `${event.pageX + 14}px`)
    .style("top", `${event.pageY - 19}px`);
}

function hideTooltip() {
  tooltip.style("opacity", 0);
}

function pct(v) {
  return `${Number(v).toFixed(1)}%`;
}

function parseNumber(value) {
  if (value === undefined || value === null) return NaN;
  return +String(value).replace(/[$,%M,]/g, "").trim();
}

function initRevealAnimation() {
  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach(item => observer.observe(item));
}

const raceData = [
  { group: "White", value: 66.3, color: colors.red },
  { group: "Asian", value: 11.6, color: colors.gold },
  { group: "Hispanic / Latiné", value: 9.4, color: colors.brown },
  { group: "Black", value: 5.4, color: colors.green },
  { group: "Other", value: 4.3, color: colors.blue },
  { group: "Mixed Race", value: 3.0, color: colors.violet }
];

const ageData = [
  { group: "Under 18", broadway: 10.1, census: 21.7 },
  { group: "18-24", broadway: 13.1, census: 9.1 },
  { group: "25-34", broadway: 21.3, census: 13.5 },
  { group: "35-49", broadway: 22.1, census: 19.3 },
  { group: "50-64", broadway: 20.0, census: 18.7 },
  { group: "65+", broadway: 13.4, census: 17.7 }
];

const educationData = [
  { group: "Some HS or Less", broadway: 1.1, census: 10.2 },
  { group: "High School", broadway: 3.4, census: 25.9 },
  { group: "Some College", broadway: 7.3, census: 18.9 },
  { group: "College", broadway: 34.8, census: 21.8 },
  { group: "Advanced Degree", broadway: 48.5, census: 14.3 },
  { group: "Vocational", broadway: 4.9, census: 8.8 }
];

const attendanceData = [
  { group: "1 show", theatregoers: 38.1, visits: 7.3 },
  { group: "2-4 shows", theatregoers: 33.2, visits: 19.2 },
  { group: "5-9 shows", theatregoers: 14.6, visits: 19.7 },
  { group: "10-14 shows", theatregoers: 5.9, visits: 13.6 },
  { group: "15-24 shows", theatregoers: 3.8, visits: 14.7 },
  { group: "25+ shows", theatregoers: 4.4, visits: 25.4 }
];

const originGroups = [
  { key: "nyc", label: "NYC", value: 25.1, color: colors.red },
  { key: "suburbs", label: "NYC Suburbs", value: 12.6, color: colors.gold },
  { key: "otherUS", label: "Other U.S.", value: 42.1, color: colors.brown },
  { key: "international", label: "International", value: 20.3, color: colors.green }
];

const originByType = [
  { type: "Overall", nyc: 25.1, suburbs: 12.6, otherUS: 42.1, international: 20.3 },
  { type: "Musical", nyc: 23.5, suburbs: 12.2, otherUS: 42.1, international: 22.2 },
  { type: "Play", nyc: 32.8, suburbs: 14.2, otherUS: 42.2, international: 10.8 }
];

const mapSteps = {
  world: {
    title: "World",
    text: "International visitors account for one fifth of Broadway admissions. This view starts from the global scale.",
    activeKeys: ["world", "international"],
    insight: "International visitors account for 20.3% of Broadway admissions."
  },
  usa: {
    title: "United States",
    text: "The largest non-local audience group comes from elsewhere in the United States.",
    activeKeys: ["usa", "otherUS"],
    insight: "Other U.S. audiences account for 42.1% of Broadway admissions."
  },
  nyc: {
    title: "New York Area",
    text: "Local and suburban audiences remain important, especially for plays.",
    activeKeys: ["nyc", "suburbs"],
    insight: "NYC and NYC suburbs together account for 37.7% of Broadway admissions."
  }
};

let allShows = [];
let currentTypeFilter = "all";
let currentSearch = "";
let highlightedMode = "none";

function drawLegend(svg, items, x, y) {
  const legend = svg.append("g").attr("transform", `translate(${x}, ${y})`);

  const row = legend
    .selectAll("g")
    .data(items)
    .join("g")
    .attr("transform", (d, i) => `translate(${i * 190}, 0)`);

  row.append("circle").attr("r", 7).attr("fill", d => d.color);

  row.append("text")
    .attr("x", 14)
    .attr("y", 5)
    .attr("fill", colors.muted)
    .attr("font-size", 13)
    .attr("font-weight", 900)
    .text(d => d.label);
}

function drawRaceWaffleChart() {
  const el = d3.select("#race-waffle-chart");
  el.selectAll("*").remove();

  const width = 760;
  const height = 420;
  const svg = el.append("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const cells = [];
  raceData.forEach(d => {
    for (let i = 0; i < Math.round(d.value); i++) cells.push({ ...d });
  });

  while (cells.length < 100) {
    cells.push({ group: "Rounding", value: 0, color: "rgba(23,19,15,0.08)" });
  }

  const cellSize = 22;
  const gap = 4;
  const startX = 42;
  const startY = 40;

  svg.selectAll("rect.cell")
    .data(cells.slice(0, 100))
    .join("rect")
    .attr("x", (d, i) => startX + (i % 10) * (cellSize + gap))
    .attr("y", (d, i) => startY + Math.floor(i / 10) * (cellSize + gap))
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("rx", 5)
    .attr("fill", d => d.color)
    .attr("stroke", colors.paper)
    .attr("opacity", 0)
    .on("mousemove", (event, d) => {
      if (d.group !== "Rounding") {
        showTooltip(event, `<strong>${d.group}</strong><br>${pct(d.value)} of Broadway audience`);
      }
    })
    .on("mouseleave", hideTooltip)
    .transition()
    .duration(700)
    .delay((d, i) => i * 8)
    .attr("opacity", 1);

  const legend = svg.append("g").attr("transform", "translate(360, 54)");

  const rows = legend.selectAll("g")
    .data(raceData)
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * 38})`);

  rows.append("circle")
    .attr("r", 7)
    .attr("fill", d => d.color);

  rows.append("text")
    .attr("x", 18)
    .attr("y", 5)
    .attr("fill", colors.ink)
    .attr("font-size", 13)
    .attr("font-weight", 900)
    .text(d => `${d.group} ${pct(d.value)}`);

  svg.append("text")
    .attr("x", startX)
    .attr("y", 340)
    .attr("fill", colors.muted)
    .attr("font-size", 13)
    .attr("font-weight", 900)
    .text("Each square represents about 1% of the audience.");
}

function drawMirrorChart(containerId, data, options) {
  const el = d3.select(containerId);
  el.selectAll("*").remove();

  const width = 980;
  const height = 540;
  const margin = { top: 86, right: 60, bottom: 70, left: 60 };
  const middleGap = 54;
  const mid = width / 2;
  const maxValue = options.maxValue || d3.max(data, d => Math.max(d.broadway, d.census));

  const svg = el.append("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const y = d3.scaleBand()
    .domain(data.map(d => d.group))
    .range([margin.top, height - margin.bottom])
    .padding(0.32);

  const xLeft = d3.scaleLinear()
    .domain([0, maxValue])
    .range([mid - middleGap, margin.left]);

  const xRight = d3.scaleLinear()
    .domain([0, maxValue])
    .range([mid + middleGap, width - margin.right]);

  svg.append("rect")
    .attr("x", mid - middleGap)
    .attr("y", margin.top - 18)
    .attr("width", middleGap * 2)
    .attr("height", height - margin.top - margin.bottom + 36)
    .attr("fill", "rgba(255,250,240,0.92)")
    .attr("stroke", colors.line);

  svg.append("text")
    .attr("class", "mirror-title")
    .attr("x", 145)
    .attr("y", 44)
    .attr("text-anchor", "middle")
    .attr("fill", options.leftColor)
    .text(options.leftTitle);

  svg.append("text")
    .attr("class", "mirror-title")
    .attr("x", mid)
    .attr("y", 44)
    .attr("text-anchor", "middle")
    .text(options.centerTitle);

  svg.append("text")
    .attr("class", "mirror-title")
    .attr("x", width - 150)
    .attr("y", 44)
    .attr("text-anchor", "middle")
    .attr("fill", options.rightColor)
    .text(options.rightTitle);

  svg.selectAll("rect.left-bar")
    .data(data)
    .join("rect")
    .attr("x", xLeft(0))
    .attr("y", d => y(d.group))
    .attr("width", 0)
    .attr("height", y.bandwidth())
    .attr("fill", options.leftColor)
    .on("mousemove", (event, d) => {
      showTooltip(event, `<strong>${d.group}</strong><br>Broadway Audience: ${pct(d.broadway)}`);
    })
    .on("mouseleave", hideTooltip)
    .transition()
    .duration(900)
    .delay((d, i) => i * 70)
    .attr("x", d => xLeft(d.broadway))
    .attr("width", d => xLeft(0) - xLeft(d.broadway));

  svg.selectAll("rect.right-bar")
    .data(data)
    .join("rect")
    .attr("x", xRight(0))
    .attr("y", d => y(d.group))
    .attr("width", 0)
    .attr("height", y.bandwidth())
    .attr("fill", options.rightColor)
    .on("mousemove", (event, d) => {
      showTooltip(event, `<strong>${d.group}</strong><br>U.S. Population: ${pct(d.census)}`);
    })
    .on("mouseleave", hideTooltip)
    .transition()
    .duration(900)
    .delay((d, i) => i * 70)
    .attr("width", d => xRight(d.census) - xRight(0));

  svg.selectAll("text.group-label")
    .data(data)
    .join("text")
    .attr("class", "mirror-label")
    .attr("x", mid)
    .attr("y", d => y(d.group) + y.bandwidth() / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .text(d => d.group);

  svg.selectAll("text.left-value")
    .data(data)
    .join("text")
    .attr("x", d => xLeft(d.broadway) - 8)
    .attr("y", d => y(d.group) + y.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .attr("font-size", 10.5)
    .attr("font-weight", 900)
    .attr("fill", colors.ink)
    .text(d => pct(d.broadway));

  svg.selectAll("text.right-value")
    .data(data)
    .join("text")
    .attr("x", d => xRight(d.census) + 8)
    .attr("y", d => y(d.group) + y.bandwidth() / 2 + 4)
    .attr("font-size", 10.5)
    .attr("font-weight", 900)
    .attr("fill", colors.ink)
    .text(d => pct(d.census));

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xLeft).ticks(4).tickFormat(d => `${d}%`));

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xRight).ticks(4).tickFormat(d => `${d}%`));

  svg.append("text")
    .attr("x", mid)
    .attr("y", height - 18)
    .attr("text-anchor", "middle")
    .attr("font-size", 13)
    .attr("font-weight", 900)
    .attr("fill", colors.ink)
    .text("% of group");
}

function drawDumbbellChart(containerId, data) {
  const el = d3.select(containerId);
  el.selectAll("*").remove();

  const width = 980;
  const height = 540;
  const margin = { top: 54, right: 70, bottom: 72, left: 190 };

  const svg = el.append("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const x = d3.scaleLinear()
    .domain([0, 55])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleBand()
    .domain(data.map(d => d.group))
    .range([margin.top, height - margin.bottom])
    .padding(0.42);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}%`));

  svg.selectAll("line.dumbbell-line")
    .data(data)
    .join("line")
    .attr("x1", d => x(d.census))
    .attr("x2", d => x(d.census))
    .attr("y1", d => y(d.group) + y.bandwidth() / 2)
    .attr("y2", d => y(d.group) + y.bandwidth() / 2)
    .attr("stroke", colors.line)
    .attr("stroke-width", 3)
    .transition()
    .duration(900)
    .delay((d, i) => i * 80)
    .attr("x2", d => x(d.broadway));

  svg.selectAll("circle.census")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.census))
    .attr("cy", d => y(d.group) + y.bandwidth() / 2)
    .attr("r", 0)
    .attr("fill", colors.gold)
    .on("mousemove", (event, d) => {
      showTooltip(event, `<strong>${d.group}</strong><br>U.S. Population: ${pct(d.census)}`);
    })
    .on("mouseleave", hideTooltip)
    .transition()
    .duration(700)
    .delay((d, i) => i * 80)
    .attr("r", 7);

  svg.selectAll("circle.broadway")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.broadway))
    .attr("cy", d => y(d.group) + y.bandwidth() / 2)
    .attr("r", 0)
    .attr("fill", colors.red)
    .on("mousemove", (event, d) => {
      showTooltip(event, `<strong>${d.group}</strong><br>Broadway Audience: ${pct(d.broadway)}`);
    })
    .on("mouseleave", hideTooltip)
    .transition()
    .duration(700)
    .delay((d, i) => i * 80)
    .attr("r", 8);

  drawLegend(svg, [
    { label: "U.S. Population", color: colors.gold },
    { label: "Broadway Audience", color: colors.red }
  ], margin.left, height - 25);
}

function drawAttendanceSlope() {
  const el = d3.select("#attendance-chart");
  el.selectAll("*").remove();

  const width = 980;
  const height = 540;
  const margin = { top: 64, right: 170, bottom: 50, left: 170 };

  const svg = el.append("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const x = d3.scalePoint()
    .domain(["% of Theatregoers", "% of Theatre Visits"])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, 42])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`));

  svg.selectAll("text.slope-head")
    .data(x.domain())
    .join("text")
    .attr("x", d => x(d))
    .attr("y", 28)
    .attr("text-anchor", "middle")
    .attr("fill", colors.red)
    .attr("font-size", 14)
    .attr("font-weight", 900)
    .text(d => d);

  const group = svg.selectAll("g.slope")
    .data(attendanceData)
    .join("g")
    .attr("class", "slope")
    .on("mousemove", (event, d) => {
      showTooltip(event, `<strong>${d.group}</strong><br>Theatregoers: ${pct(d.theatregoers)}<br>Theatre Visits: ${pct(d.visits)}`);
    })
    .on("mouseleave", hideTooltip);

  group.append("line")
    .attr("x1", x("% of Theatregoers"))
    .attr("x2", x("% of Theatregoers"))
    .attr("y1", d => y(d.theatregoers))
    .attr("y2", d => y(d.theatregoers))
    .attr("stroke", colors.line)
    .attr("stroke-width", 2)
    .transition()
    .duration(900)
    .delay((d, i) => i * 80)
    .attr("x2", x("% of Theatre Visits"))
    .attr("y2", d => y(d.visits));

  group.append("circle")
    .attr("cx", x("% of Theatregoers"))
    .attr("cy", d => y(d.theatregoers))
    .attr("r", 0)
    .attr("fill", colors.red)
    .transition()
    .duration(700)
    .delay((d, i) => i * 80)
    .attr("r", 6);

  group.append("circle")
    .attr("cx", x("% of Theatre Visits"))
    .attr("cy", d => y(d.visits))
    .attr("r", 0)
    .attr("fill", colors.gold)
    .transition()
    .duration(700)
    .delay((d, i) => i * 80)
    .attr("r", 6);

  group.append("text")
    .attr("x", margin.left - 14)
    .attr("y", d => y(d.theatregoers) + 4)
    .attr("text-anchor", "end")
    .attr("fill", colors.muted)
    .attr("font-size", 12)
    .attr("font-weight", 900)
    .text(d => d.group);
}

function drawOriginMap(step = "world") {
  const el = d3.select("#origin-map");
  el.selectAll("*").remove();

  const width = 980;
  const height = 520;
  const svg = el.append("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const activeKeys = mapSteps[step].activeKeys;

  svg.append("text")
    .attr("x", 58)
    .attr("y", 52)
    .attr("fill", colors.muted)
    .attr("font-size", 14)
    .attr("font-weight", 900)
    .attr("letter-spacing", 3)
    .text("ZOOM MAP STORY");

  svg.append("path")
    .attr("d", "M188,370 C310,430 610,430 790,340")
    .attr("fill", "none")
    .attr("stroke", colors.line)
    .attr("stroke-width", 3)
    .attr("stroke-dasharray", "8 10");

  const shapes = [
    {
      key: "world",
      label: "World",
      sub: "International 20.3%",
      color: colors.green,
      d: "M110,165 C165,105 265,102 330,150 C390,195 380,285 310,320 C230,360 115,320 86,245 C74,215 80,185 110,165Z",
      tx: 230,
      ty: 230
    },
    {
      key: "usa",
      label: "United States",
      sub: "Other U.S. 42.1%",
      color: colors.brown,
      d: "M365,170 C450,105 610,120 675,200 C735,275 685,360 555,365 C420,370 325,290 365,170Z",
      tx: 525,
      ty: 245
    },
    {
      key: "suburbs",
      label: "NYC Suburbs",
      sub: "12.6%",
      color: colors.gold,
      d: "M720,210 C758,176 830,180 860,228 C890,278 854,330 790,330 C735,330 690,258 720,210Z",
      tx: 790,
      ty: 255
    },
    {
      key: "nyc",
      label: "NYC",
      sub: "25.1%",
      color: colors.red,
      d: "M855,210 C886,180 933,190 950,232 C968,278 938,322 888,318 C845,312 820,246 855,210Z",
      tx: 895,
      ty: 255
    }
  ];

  const groups = svg.selectAll(".map-group")
    .data(shapes)
    .join("g")
    .attr("opacity", 0);

  groups.append("path")
    .attr("class", d => `map-shape ${activeKeys.includes(d.key) ? "active" : "dimmed"}`)
    .attr("d", d => d.d)
    .attr("fill", d => d.color)
    .attr("stroke", colors.paper)
    .attr("stroke-width", 4)
    .on("mousemove", (event, d) => {
      showTooltip(event, `<strong>${d.label}</strong><br>${d.sub}`);
    })
    .on("mouseleave", hideTooltip)
    .on("click", (event, d) => {
      if (d.key === "world") updateMapStep("world");
      if (d.key === "usa") updateMapStep("usa");
      if (d.key === "nyc" || d.key === "suburbs") updateMapStep("nyc");
    });

  groups.append("text")
    .attr("class", "map-label")
    .attr("x", d => d.tx)
    .attr("y", d => d.ty)
    .attr("text-anchor", "middle")
    .text(d => d.label);

  groups.append("text")
    .attr("class", "map-sub-label")
    .attr("x", d => d.tx)
    .attr("y", d => d.ty + 23)
    .attr("text-anchor", "middle")
    .text(d => d.sub);

  groups.transition()
    .duration(800)
    .delay((d, i) => i * 100)
    .attr("opacity", 1);
}

function updateMapStep(step) {
  d3.selectAll(".step-btn").classed("active", function () {
    return d3.select(this).attr("data-map-step") === step;
  });

  d3.select("#map-step-title").text(mapSteps[step].title);
  d3.select("#map-step-text").text(mapSteps[step].text);
  d3.select("#origin-insight").text(mapSteps[step].insight);

  drawOriginMap(step);
}

function highlightOrigin(key) {
  const group = originGroups.find(d => d.key === key);
  if (!group) return;

  d3.select("#origin-insight").text(
    `${group.label} accounts for ${pct(group.value)} of Broadway admissions.`
  );
}

function drawOriginDonut() {
  const el = d3.select("#origin-donut-chart");
  el.selectAll("*").remove();

  const width = 560;
  const height = 320;
  const radius = 120;

  const svg = el.append("svg").attr("viewBox", `0 0 ${width} ${height}`);
  const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2 + 12})`);

  const pie = d3.pie().value(d => d.value).sort(null);
  const arc = d3.arc().innerRadius(radius * 0.50).outerRadius(radius);

  g.selectAll("path")
    .data(pie(originGroups))
    .join("path")
    .attr("fill", d => d.data.color)
    .attr("stroke", colors.paper)
    .attr("stroke-width", 4)
    .on("mousemove", (event, d) => {
      showTooltip(event, `<strong>${d.data.label}</strong><br>${pct(d.data.value)} of admissions`);
    })
    .on("mouseleave", hideTooltip)
    .on("click", (event, d) => highlightOrigin(d.data.key))
    .transition()
    .duration(900)
    .attrTween("d", function (d) {
      const i = d3.interpolate(d.startAngle, d.endAngle);
      return function (t) {
        d.endAngle = i(t);
        return arc(d);
      };
    });

  g.append("text")
    .attr("text-anchor", "middle")
    .attr("y", -5)
    .attr("fill", colors.red)
    .attr("font-size", 30)
    .attr("font-weight", 900)
    .text("60%+");

  g.append("text")
    .attr("text-anchor", "middle")
    .attr("y", 22)
    .attr("fill", colors.muted)
    .attr("font-size", 13)
    .attr("font-weight", 900)
    .text("outside NYC");
}

function drawOriginStackedBars() {
  const el = d3.select("#origin-stacked-chart");
  el.selectAll("*").remove();

  const width = 760;
  const height = 420;
  const margin = { top: 50, right: 40, bottom: 70, left: 90 };

  const keys = ["nyc", "suburbs", "otherUS", "international"];

  const color = d3.scaleOrdinal()
    .domain(keys)
    .range([colors.red, colors.gold, colors.brown, colors.green]);

  const svg = el.append("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const x = d3.scaleLinear()
    .domain([0, 100])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleBand()
    .domain(originByType.map(d => d.type))
    .range([margin.top, height - margin.bottom])
    .padding(0.28);

  const stacked = d3.stack().keys(keys)(originByType);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(4).tickFormat(d => `${d}%`));

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.selectAll("g.layer")
    .data(stacked)
    .join("g")
    .attr("class", "layer")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d.map(v => ({ ...v, key: d.key })))
    .join("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d.data.type))
    .attr("height", y.bandwidth())
    .attr("width", 0)
    .attr("rx", 6)
    .on("mousemove", (event, d) => {
      const label = originGroups.find(g => g.key === d.key).label;
      const value = d.data[d.key];
      showTooltip(event, `<strong>${d.data.type}</strong><br>${label}: ${pct(value)}`);
    })
    .on("mouseleave", hideTooltip)
    .on("click", (event, d) => highlightOrigin(d.key))
    .transition()
    .duration(850)
    .attr("width", d => x(d[1]) - x(d[0]));

  const legend = svg.append("g").attr("transform", `translate(${margin.left}, 20)`);

  const legendItems = legend.selectAll("g")
    .data(originGroups)
    .join("g")
    .attr("transform", (d, i) => `translate(${i * 145}, 0)`);

  legendItems.append("circle")
    .attr("r", 6)
    .attr("fill", d => d.color);

  legendItems.append("text")
    .attr("x", 12)
    .attr("y", 4)
    .attr("fill", colors.muted)
    .attr("font-size", 12)
    .attr("font-weight", 900)
    .text(d => d.label);
}

function normalizeShow(row) {
  return {
    show: row.show || row.Show || row.title || row.Title || row.name || row.Name,
    type: row.type || row.Type || row.category || row.Category || "Musical",
    gross: parseNumber(row.gross || row.Gross || row.totalGross || row["Total Gross"] || row["Gross"]),
    attendance: parseNumber(row.attendance || row.Attendance || row.totalAttendance || row["Total Attendance"]),
    capacity: parseNumber(row.capacity || row.Capacity || row["Capacity"]),
    avgTicket: parseNumber(row.avgTicket || row["Avg Ticket"] || row.averageTicket || row["Average Ticket"]),
    topTicket: parseNumber(row.topTicket || row["Top Ticket"] || row.top_ticket),
    performances: parseNumber(row.performances || row.Performances)
  };
}

function initFallbackShows() {
  return [
    { show: "WICKED", type: "Musical", gross: 126.549673, attendance: 0.805068, capacity: 100, avgTicket: 157, topTicket: 375, performances: 418 },
    { show: "HAMILTON", type: "Musical", gross: 128.950063, attendance: 0.624928, capacity: 98.28, avgTicket: 233, topTicket: 1500, performances: 416 },
    { show: "THE LION KING", type: "Musical", gross: 106.781983, attendance: 0.708928, capacity: 96.81, avgTicket: 155, topTicket: 477, performances: 418 },
    { show: "ALADDIN", type: "Musical", gross: 68.387147, attendance: 0.721886, capacity: 94.52, avgTicket: 100, topTicket: 350, performances: 418 },
    { show: "OTHELLO", type: "Play", gross: 46.707510, attendance: 0.124087, capacity: 99.93, avgTicket: 377, topTicket: 897, performances: 119 }
  ];
}

function getFilteredShows() {
  return allShows.filter(d => {
    const typeOk = currentTypeFilter === "all" || d.type === currentTypeFilter;
    const searchOk = d.show.toLowerCase().includes(currentSearch.toLowerCase());
    return typeOk && searchOk;
  });
}

function updateSelectedShow(d) {
  d3.select("#selected-show-name").text(d.show);

  d3.select("#selected-show-detail").html(`
    <strong>Type:</strong> ${d.type}<br>
    <strong>Gross:</strong> $${d.gross.toFixed(1)}M<br>
    <strong>Attendance:</strong> ${Math.round(d.attendance * 1000)}k<br>
    <strong>Capacity:</strong> ${d.capacity}%<br>
    <strong>Average Ticket:</strong> $${d.avgTicket}<br>
    <strong>Top Ticket:</strong> $${d.topTicket || "N/A"}<br>
    <strong>Performances:</strong> ${d.performances || "N/A"}
  `);
}

function drawShowBubbleChart() {
  const el = d3.select("#show-bubble-chart");
  el.selectAll("*").remove();

  const data = getFilteredShows();

  const width = 980;
  const height = 640;
  const margin = { top: 44, right: 58, bottom: 82, left: 90 };

  const svg = el.append("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(allShows, d => d.attendance) * 1.15])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(allShows, d => d.gross) * 1.18])
    .range([height - margin.bottom, margin.top]);

  const r = d3.scaleSqrt()
    .domain(d3.extent(allShows, d => d.avgTicket))
    .range([7, 32]);

  const color = d3.scaleOrdinal()
    .domain(["Musical", "Play"])
    .range([colors.red, colors.blue]);

  svg.append("text")
    .attr("class", "year-watermark")
    .attr("x", width / 2)
    .attr("y", height / 2 + 40)
    .attr("text-anchor", "middle")
    .text("2025");

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(6).tickSize(-(height - margin.top - margin.bottom)).tickFormat(""));

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6).tickSize(-(width - margin.left - margin.right)).tickFormat(""));

  svg.append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${Math.round(d * 1000)}k`));

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6).tickFormat(d => `$${d}M`));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 28)
    .attr("text-anchor", "middle")
    .attr("fill", colors.muted)
    .attr("font-size", 14)
    .attr("font-weight", 900)
    .text("Attendance in thousands");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("fill", colors.muted)
    .attr("font-size", 14)
    .attr("font-weight", 900)
    .text("Gross revenue in millions");

  const hoverGuide = svg.append("g")
    .attr("class", "hover-guide")
    .style("display", "none");

  const verticalGuide = hoverGuide.append("line").attr("class", "guide-line");
  const horizontalGuide = hoverGuide.append("line").attr("class", "guide-line");

  const xValueLabel = hoverGuide.append("text")
    .attr("class", "guide-value-label")
    .attr("text-anchor", "middle");

  const yValueLabel = hoverGuide.append("text")
    .attr("class", "guide-value-label")
    .attr("text-anchor", "end");

  const plot = svg.append("g").attr("class", "bubble-plot");

  const bubbles = plot.selectAll("circle")
    .data(data, d => d.show)
    .join("circle")
    .attr("class", "bubble")
    .attr("cx", d => x(d.attendance))
    .attr("cy", d => y(d.gross))
    .attr("r", 0)
    .attr("fill", d => color(d.type))
    .attr("opacity", 0.76)
    .attr("stroke", colors.ink)
    .attr("stroke-width", 1)
    .on("mousemove", function (event, d) {
      const cx = x(d.attendance);
      const cy = y(d.gross);

      hoverGuide.style("display", null);

      verticalGuide
        .attr("x1", cx)
        .attr("x2", cx)
        .attr("y1", cy)
        .attr("y2", height - margin.bottom);

      horizontalGuide
        .attr("x1", margin.left)
        .attr("x2", cx)
        .attr("y1", cy)
        .attr("y2", cy);

      xValueLabel
        .attr("x", cx)
        .attr("y", height - margin.bottom + 34)
        .text(`${Math.round(d.attendance * 1000)}k`);

      yValueLabel
        .attr("x", margin.left - 10)
        .attr("y", cy + 4)
        .text(`$${d.gross.toFixed(1)}M`);

      d3.selectAll(".bubble").classed("faded", true);
      d3.select(this).classed("faded", false);

      showTooltip(
        event,
        `<strong>${d.show}</strong><br>
        Gross: $${d.gross.toFixed(1)}M<br>
        Attendance: ${Math.round(d.attendance * 1000)}k<br>
        Avg Ticket: $${d.avgTicket}<br>
        Top Ticket: $${d.topTicket || "N/A"}<br>
        Capacity: ${d.capacity}%<br>
        Performances: ${d.performances || "N/A"}<br>
        Type: ${d.type}`
      );

      updateSelectedShow(d);
    })
    .on("mouseleave", function () {
      hoverGuide.style("display", "none");
      d3.selectAll(".bubble").classed("faded", false);
      hideTooltip();
      applyBubbleHighlight();
    })
    .on("click", function (event, d) {
      d3.selectAll(".bubble").classed("selected", false);
      d3.select(this).classed("selected", true);
      updateSelectedShow(d);
    });

  bubbles.transition()
    .duration(950)
    .delay((d, i) => i * 16)
    .attr("r", d => r(d.avgTicket));

  applyBubbleHighlight();
}

function applyBubbleHighlight() {
  d3.selectAll(".bubble")
    .classed("top-highlight", false)
    .classed("faded", false);

  if (highlightedMode === "none") return;

  if (highlightedMode === "topGross") {
    const top = [...allShows]
      .sort((a, b) => b.gross - a.gross)
      .slice(0, 5)
      .map(d => d.show);

    d3.selectAll(".bubble")
      .classed("faded", d => !top.includes(d.show))
      .classed("top-highlight", d => top.includes(d.show));

    d3.select("#selected-show-name").text("Top Gross Highlight");
    d3.select("#selected-show-detail").html(`
      Highlighting the top 5 shows by total gross revenue.
      Other bubbles are faded so the highest-grossing shows are easier to compare.
    `);
  }

  if (highlightedMode === "highCapacity") {
    d3.selectAll(".bubble")
      .classed("faded", d => d.capacity < 98)
      .classed("top-highlight", d => d.capacity >= 98);

    d3.select("#selected-show-name").text("High Capacity Highlight");
    d3.select("#selected-show-detail").html(`
      Highlighting shows with average capacity of 98% or higher.
      This helps reveal which shows were closest to selling out.
    `);
  }
}

d3.selectAll(".step-btn").on("click", function () {
  const step = d3.select(this).attr("data-map-step");
  updateMapStep(step);
});

d3.selectAll(".bubble-filter").on("click", function () {
  currentTypeFilter = d3.select(this).attr("data-type");

  d3.selectAll(".bubble-filter").classed("active", false);
  d3.select(this).classed("active", true);

  drawShowBubbleChart();
});

d3.select("#show-search").on("input", function () {
  currentSearch = this.value;
  drawShowBubbleChart();
});

d3.select("#highlight-top-gross").on("click", function () {
  highlightedMode = "topGross";
  applyBubbleHighlight();
});

d3.select("#highlight-high-capacity").on("click", function () {
  highlightedMode = "highCapacity";
  applyBubbleHighlight();
});

d3.select("#reset-bubbles").on("click", function () {
  highlightedMode = "none";
  currentSearch = "";
  currentTypeFilter = "all";

  d3.select("#show-search").property("value", "");
  d3.selectAll(".bubble-filter").classed("active", false);
  d3.select('.bubble-filter[data-type="all"]').classed("active", true);

  drawShowBubbleChart();
});

function drawAllCharts() {
  drawRaceWaffleChart();

  drawMirrorChart("#age-chart", ageData, {
    leftTitle: "Broadway Audience",
    rightTitle: "U.S. Population",
    centerTitle: "Age Group",
    leftColor: colors.brown,
    rightColor: "#b13c2b",
    maxValue: 25
  });

  drawDumbbellChart("#education-chart", educationData);
  drawAttendanceSlope();

  updateMapStep("world");
  drawOriginDonut();
  drawOriginStackedBars();

  drawShowBubbleChart();
}

initRevealAnimation();

d3.csv("data.csv")
  .then(rows => {
    allShows = rows
      .map(normalizeShow)
      .filter(d =>
        d.show &&
        !Number.isNaN(d.gross) &&
        !Number.isNaN(d.attendance) &&
        !Number.isNaN(d.capacity) &&
        !Number.isNaN(d.avgTicket)
      );

    if (allShows.length === 0) {
      allShows = initFallbackShows();
    }

    drawAllCharts();
  })
  .catch(() => {
    allShows = initFallbackShows();
    drawAllCharts();
  });
