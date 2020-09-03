// Scatterplot construction
var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper, append SVG group to hold the chart, shift latter by left and top margin

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group

var scatterPlot = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from csv

d3.csv("data.csv").then(function(healthGraph) {

    // Parse Data/Cast as numbers

    healthGraph.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // Create scale functions

    var xLinearScale = d3.scaleLinear()
        .domain([(d3.min(healthGraph, d => d.poverty) * 0.9), d3.max(healthGraph, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([(d3.min(healthGraph, d => d.healthcare) * 0.8), d3.max(healthGraph, d => d.healthcare)])
        .range([height, 0]);

    // Create axis functions

    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Append Axes to chart

    scatterPlot.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    scatterPlot.append("g")
        .call(yAxis);

    // Create axes labels

    scatterPlot.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("% Lacks Healthcare");

    scatterPlot.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("% in Poverty");

    // Create Circles

    var circlesGroup = scatterPlot.selectAll("circle").data(healthGraph).enter()
    circlesGroup.append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        //   .attr("stroke-width", "1")
        //   .attr("stroke", "black")
        //   .attr("fill", "lightblue")
        //   .attr("opacity", "1");

    // var circlesGroup = scatterPlot.selectAll("circle").data(healthGraph).enter();
    circlesGroup.append("text")
        .text(function(d) {
            return d.abbr;
        })
        .attr("dx", d => xLinearScale(d.poverty))
        .attr("dy", d => yLinearScale(d.healthcare) + 10 / 2.5)
        .attr("font-size", "9")
        .attr("class", "stateText")
        .on("mouseover", function(data, index) {
            toolTip.show(data, this);
            d3.select(this).style("stroke", "#323232")
                // .style("stroke-width", "10")
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data, this)
            d3.select(this).style("stroke", "#323232")
        });
    scatterPlot.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    scatterPlot.append("g")
        .call(yAxis);

    // var circleLabels = scatterPlot.selectAll(null).data(healthGraph).enter().append("text");

    // circleLabels
    //     .attr("x", function(d) {
    //         return xLinearScale(d.poverty);
    //     })
    //     .attr("y", function(d) {
    //         return yLinearScale(d.healthcare);
    //     })
    //     .text(function(d) {
    //         return d.abbr;
    //     })
    //     .attr("class", "stateText");


    // Initialize tool tip

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([40, 10])
        .html(function(d) {
            return (`<strong>${d.state}</strong><br>% in Poverty: ${d.poverty}<br>% Lacks Healthcare: ${d.healthcare}`);
        });
    // Create tooltip in the chart

    scatterPlot.call(toolTip);

    // Create event listeners to display and hide the tooltip

    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        })

    return circlesGroup;

}).catch(function(error) {
    console.log(error);
});