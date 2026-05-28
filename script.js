const colors = {
  red: "#9b1d2e",
  gold: "#d89b2b",
  green: "#567a4c",
  blue: "#4d7398",
  brown: "#845d34",
  violet: "#765a91",
  capacity: "#2f8f6f",
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
    .style("top", `${event.pageY - 18}px`);
}

function hideTooltip() {
  tooltip.style("opacity", 0);
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

const mapSteps = {
  world: {
    title: "World",
    text: "International visitors are part of Broadway’s audience economy. This view starts from the global scale.",
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
    Type: ${d.type}<br>
    Gross: $${d.gross.toFixed(1)}M<br>
    Attendance: ${Math.round(d.attendance * 1000)}k<br>
    Capacity: ${d.capacity.toFixed(1)}%${d.capacity >= 98 ? " ★ High Capacity" : ""}<br>
    Average Ticket: $${d.avgTicket}<br>
    Top Ticket: $${d.topTicket || "N/A"}<br>
    Performances: ${d.performances || "N/A"}
  `);
}

function drawShowBubbleChart() {
  const el = d3.select("#show-bubble-chart");
  el.selectAll("*").remove();

  const data = getFilteredShows();

  const width = 1120;
  const height = 720;
  const margin = { top: 54, right: 40, bottom: 92, left: 100 };

  const svg = el.append("svg").attr("viewBox", `0 0 ${width} ${height}`);

  const x = d3.scaleLinear()
    .domain([0, 0.85])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, 140])
    .range([height - margin.bottom, margin.top]);

  const r = d3.scaleSqrt()
    .domain(d3.extent(allShows, d => d.avgTicket))
    .range([7, 30]);

  const color = d3.scaleOrdinal()
    .domain(["Musical", "Play"])
    .range([colors.red, colors.blue]);

  svg.append("text")
    .attr("class", "year-watermark")
    .attr("x", width / 2)
    .attr("y", height / 2 + 45)
    .attr("text-anchor", "middle")
    .text("2025");

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3.axisBottom(x)
        .tickValues([...d3.range(0, 0.81, 0.1), 0.85])
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat("")
    );

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${margin.left},0)`)
    .call(
      d3.axisLeft(y)
        .tickValues(d3.range(0, 141, 10))
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat("")
    );

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3.axisBottom(x)
        .tickValues(d3.range(0, 1.0, 0.1))
        .tickFormat(d => `${Math.round(d * 1000)}k`)
    );

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(
      d3.axisLeft(y)
        .tickValues(d3.range(0, 141, 10))
        .tickFormat(d => `$${d}M`)
    );

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 34)
    .attr("text-anchor", "middle")
    .attr("fill", colors.muted)
    .attr("font-size", 14)
    .attr("font-weight", 900)
    .text("Attendance in thousands");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 34)
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
        Capacity: <strong>${d.capacity.toFixed(1)}%</strong> ${d.capacity >= 98 ? "★ High Capacity" : ""}<br>
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
    .classed("capacity-highlight", false)
    .classed("faded", false);

  d3.selectAll(".capacity-label").remove();

  const capacitySummary = d3.select("#capacity-summary");

  if (highlightedMode === "none") {
    capacitySummary.text("High capacity means a show was close to selling out.");
    return;
  }

  if (highlightedMode === "topGross") {
    const top = [...allShows]
      .sort((a, b) => b.gross - a.gross)
      .slice(0, 5)
      .map(d => d.show);

    d3.selectAll(".bubble")
      .classed("faded", d => !top.includes(d.show))
      .classed("top-highlight", d => top.includes(d.show));

    capacitySummary.text("Top Gross highlights the 5 highest-grossing shows.");

    d3.select("#selected-show-name").text("Top Gross Highlight");
    d3.select("#selected-show-detail").html(`
      Highlighting the top 5 shows by total gross revenue.
      Other bubbles are faded so the highest-grossing productions are easier to compare.
    `);
  }

  if (highlightedMode === "highCapacity") {
    const threshold = 98;

    const highCapacityShows = allShows.filter(d => d.capacity >= threshold);
    const visibleHighCapacityShows = getFilteredShows().filter(d => d.capacity >= threshold);

    d3.selectAll(".bubble")
      .classed("faded", d => d.capacity < threshold)
      .classed("capacity-highlight", d => d.capacity >= threshold);

    d3.select(".bubble-plot")
      .selectAll("text.capacity-label")
      .data(visibleHighCapacityShows, d => d.show)
      .join("text")
      .attr("class", "capacity-label")
      .attr("x", d => {
        const bubble = d3.selectAll(".bubble").filter(b => b.show === d.show).node();
        return bubble ? +bubble.getAttribute("cx") + 12 : 0;
      })
      .attr("y", d => {
        const bubble = d3.selectAll(".bubble").filter(b => b.show === d.show).node();
        return bubble ? +bubble.getAttribute("cy") - 12 : 0;
      })
      .attr("opacity", 0)
      .text(d => `${d.capacity.toFixed(1)}%`)
      .transition()
      .duration(500)
      .attr("opacity", 1);

    capacitySummary.html(`
      <strong>${highCapacityShows.length} shows</strong> have Capacity ≥ ${threshold}%.<br>
      This means these shows were close to selling out or used seats very efficiently.
    `);

    d3.select("#selected-show-name").text("High Capacity Highlight");
    d3.select("#selected-show-detail").html(`
      Green outline marks shows with <strong>Capacity ≥ ${threshold}%</strong>.<br>
      The green labels show each show's capacity percentage.<br>
      High capacity is important because it suggests strong seat demand and high seat utilisation.
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

  d3.select("#selected-show-name").text("Hover or click a bubble");
  d3.select("#selected-show-detail").text("Show details will appear here.");
});

function drawAllCharts() {
  updateMapStep("world");
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
