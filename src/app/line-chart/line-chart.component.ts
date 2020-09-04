import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  host: {
    '(window:resize)': 'drawChart(this)'
  }
})

export class LineChartComponent implements OnInit {
  @Input() lineData1;
  @Input() lineData2;
  // @Input() w:number;
  private width = 1745;
  private height = 250;
  private margin = { top: 20, right: 50, bottom: 20, left: 50 };
  private svg;
  private xscale;
  private yscale;
  private x_axis;
  private y_axis;
  private lineData;
  private myColor;
  private circle;


  constructor(private container: ElementRef) {

  }

  ngOnInit(): void {
    //  console.log("w"+this.w)
    //this.drawChart();
    console.log(window.innerWidth)
    this.initSvg();
    this.initScale(this.lineData1);
    //  this.drawGridLines();
    this.drawAxis();
    this.drawLine();
    this.drawChart();

  };
  private initSvg() {
    // var that = this;
    // console.log("wi"+wi)

    this.svg = d3.select("#lineChart")
      .append("svg")
      //  .attr("id", "chart")
      .attr("width", this.width)
      .attr("height", this.height)
    // .attr('preserveAspectRatio','xMinYMin meet')
    //.attr("viewBox", "0 0 1745 250")
    // .classed("svg-content", true);
    // console.log(Object.keys(this.myData[0]))
    // var allGroup = d3.map(this.myData, function(d){return(d.name)}).keys()
    //  var color = d3.scaleOrdinal(d3.schemeCategory10);

    // color.domain(Object.keys(this.myData[0]).filter(function(d){ return d!== "date" }));
    //window.addEventListener('resize',);

  };
  private initScale(myData: any) {
    //var that = this;
    // debugger
    var gr = Object.keys(myData[0]).filter(function (d) { return d !== "date" });
    this.lineData = gr.map(function (name) {

      return {
        name: name,
        values: myData.map(function (d) {
          return {
            date: d.date,
            value: +d[name]
          };
        })
      };
    });
    // A color scale: one color for each group
    this.myColor = d3.scaleOrdinal()
      .domain(gr)
      .range(d3.schemeSet2);
    this.xscale =
      d3.scalePoint()
        .domain(myData.map((d: any) => {               // This is what is written on the Axis: from January to December
          //console.log(d.date)
          return d.date
        }))
        // d3.scaleTime()
        // .domain([new Date(2013, 0, 1), new Date(2013, 11, 31)])
        .range([this.margin.left, this.width - this.margin.right]);

    this.yscale = d3.scaleLinear()
      //.domain([0, 500])
      .domain([0
        // d3.min(this.lineData, function (c) {
        //   return d3.min(c.values, function (v) {
        //     console.log("v" + v)
        //     return v.value;
        //   });
        // })
        ,
        d3.max(this.lineData, function (c) {
          console.log("c" + c)
          //console.log( d3.max(c.values, function(v) {return v.value})
          return d3.max(c.values, function (v) {
            return v.value;
          });
        })
      ])
      .range([this.height - this.margin.bottom, this.margin.top]);      //reversed
    console.log("y" + this.xscale(50))
  };

  private drawGridLines() {
    // add the x gridlines
    this.svg.append("g")
      // .style("color", "#e4e4e4")
      .attr("id", "x_axis")
      .classed("gridLine", true)
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(d3.axisBottom(this.xscale)
        .tickSize((-this.height + 2 * this.margin.top))
        .tickFormat("")
      );

    // add the y gridlines
    this.svg.append("g")
      // .style("color", "#e4e4e4")
      .attr("id", "y_axis")
      .classed("gridLine", true)
      .attr("transform", "translate(" + (this.margin.left) + ",0)")
      .call(d3.axisLeft(this.yscale).ticks(5)
        .tickSize((-this.width + 2 * this.margin.right))
        .tickFormat("")
      );
  }
  private drawAxis() {
    // Define axes
    this.x_axis = d3.axisBottom()
      .scale(this.xscale)

      .tickSize((-this.height + 2 * this.margin.top));

    this.y_axis = d3.axisLeft()
      .scale(this.yscale).tickSize((-this.width + 2 * this.margin.right));
    // Place the x axis on the chart
    this.svg.append("g")
      .attr("id", "x_axis")
      .style("font-size", "13")
      .classed("gridLine", true)
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(this.x_axis)

    // Place the y axis on the chart
    this.svg.append("g")
      .attr("id", "y_axis")
      .style("font-size", "13")
      .classed("gridLine", true)
      .attr("transform", "translate(" + (this.margin.left) + ",0)")
      .call(this.y_axis.ticks(5))

  };

  private drawLine() {
    var that = this;
    // debugger
    //1. line generator
    var valueline = d3.line()
      .x(function (d, i) {

        return that.xscale(d.date);
      })
      .y(function (d) {
        // console.log("y" + d.value)
        return that.yscale(d.value);
      });

    //1. Append the path, bind the data, and call the line generator
    // var path=
    this.svg.selectAll(".dot2").data(this.lineData).enter().append("g")
      .append("path")
      //.data(this.lineData)
      .attr("class", "line")
      .attr("stroke-width", "3")
      .attr("fill", "none")
      .attr("d", function (d) {
        //  console.log("val" + d.values)
        return valueline(d.values);
      })
      .attr("stroke", function (d) { return that.myColor(d.name) })
      .transition()
      .duration(1000);

    // Appends a circle for each datapoint

    this.svg.selectAll("myDots")
      .data(this.lineData)
      .enter()
      .append('g')
      .style("fill", function (d) { return that.myColor(d.name) })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(function (d) { return d.values })
      .enter()
      .append("circle")
      .attr("class", "circle")

      .attr("cx", function (d) { return that.xscale(d.date) })
      .attr("cy", function (d) { return that.yscale(d.value) })
      .attr("r", 5);

    this.circle = this.svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    this.circle.append("circle")
      .attr("r", 5);

    this.circle.append("rect")
      .attr("class", "tooltip")
      .attr("width", 100)
      .attr("height", 50)
      .attr("x", 10)
      .attr("y", -22)
      .attr("rx", 4)
      .attr("ry", 4);

    this.circle.append("text")
      .attr("class", "tooltip-date")
      .attr("x", 18)
      .attr("y", -2);

    this.circle.append("text")
      .attr("x", 18)
      .attr("y", 18)
      .text("Likes:");

    this.circle.append("text")
      .attr("class", "tooltip-likes")
      .attr("x", 60)
      .attr("y", 18);

    this.circle.append("rect")
      // .data(this.lineData)
      .attr("class", "overlay")
      .attr("width", this.width)
      .attr("height", this.height)
      .on("mouseover", function () { this.circle.style("display", null); })
      .on("mouseout", function () { this.circle.style("display", "none"); })
      .on("mousemove", this.mousemove(this.lineData))




  };
  private mousemove(data) {
    debugger
    // var x0 = this.xscale.invert(d3.mouse(this)[0]),
    // i = bisectDate(data, x0, 1),
    // d0 = data[i - 1],
    // d1 = data[i],
    // d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    // this.circle.attr("transform", "translate(" + this.xscale(d.date) + "," + this.yscale(d.value) + ")");
    // this.circle.select(".tooltip-date").text(d.date);
    // this.circle.select(".tooltip-likes").text((d.value);
  }
  private drawLine2(myData) {
    var that = this;
    //    debugger
    //1. line generator
    var valueline = d3.line()
      .x(function (d, i) {

        return that.xscale(d.date);
      })
      .y(function (d) {
        // console.log("y" + d.value)
        return that.yscale(d.value2);
      });

    //1. Append the path, bind the data, and call the line generator
    this.svg.append("g").append("path")
      .data([myData])
      .attr("stroke", "blue")
      .attr("stroke-width", "3")
      .attr("fill", "none")
      .attr("d", valueline)
      .transition()
      .duration(1000);

    // Appends a circle for each datapoint
    this.svg.append("g").selectAll(".dot")
      .data(myData)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("fill", "blue")
      .attr("cx", function (d, i) {
        return that.xscale(d.date);
      })
      .attr("cy", function (d) { return that.yscale(d.value2) })
      .attr("r", 5);
  };
  private drawChart(this) {
    var that = this;
    // get the current width of the div where the chart appear, and attribute it to Svg
    var currentWidth = parseInt(d3.select('#lineChart').style('width'))
    if (currentWidth < this.width) {
      // Update the X scale and Axis
      this.xscale.range([this.margin.left, currentWidth - this.margin.right]);
      // Update the axis and text with the new scale
      this.svg.select('#x_axis')
        .call(this.x_axis);
      // this.svg.select('#y_axis')
      // .call(this.y_axis);

      var valueline = d3.line()
        .x(function (d, i) {
          return that.xscale(d.date);
        })
        .y(function (d) {
          // console.log("y" + d.value)
          return that.yscale(d.value);
        });

      this.svg.selectAll('.line')
        .attr("d", function (d) {
          //  console.log("val" + d.values)
          return valueline(d.values);
        });
      console.log("ticks" + Math.max(currentWidth / 75, 2));
      this.x_axis.ticks(Math.max(currentWidth / 75, 2));
    }
    // // Add the last information needed for the circles: their X position
    this.svg.selectAll('.circle')
      // this.circle
      .attr("cx", function (d) { return that.xscale(d.date) })
  };


}
