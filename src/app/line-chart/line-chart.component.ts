import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  private width = 1745;
  private height = 250;
  private margin = { top: 20, right: 50, bottom: 20, left: 50 };
  private myData = [{
    "date": 'January',
    "value": 400
  },
  {
    "date": 'February',
    "value": 300
  },
  {
    "date": 'March',
    "value": 250
  },
  {
    "date": 'April',
    "value": 450
  },
  {
    "date": 'May',
    "value": 220
  },
  {
    "date": 'June',
    "value": 210
  },
  {
    "date": 'July',
    "value": 250
  },
  {
    "date": 'August',
    "value": 100
  },
  {
    "date": 'September',
    "value": 220
  },
  {
    "date": 'October',
    "value": 360
  },
  {
    "date": 'November',
    "value": 234
  },

  {
    "date": 'December',
    "value": 290
  }];
  constructor() { }

  ngOnInit(): void {
    this.initSvg();
  }

  private initSvg() {
    var svg = d3.select("#lineChart")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    var xscale = d3.scalePoint()
      .domain(this.myData.map((d: any) => {               // This is what is written on the Axis: from January to December
        // console.log(d.date)
        return d.date
      }))
      .range([this.margin.left, this.width - this.margin.right]);         // This is where the axis is placed in px

    var yscale = d3.scaleLinear()
      .domain([0, 500])
      .range([this.height - this.margin.bottom, this.margin.top]);      //reversed

    // For y axis
    svg.append("g")
      .attr("transform", "translate(" + (this.margin.left) + ",0)")
      .call(d3.axisLeft(yscale).ticks(6));

    // For x axis
    svg.append("g")
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(d3.axisBottom(xscale));

    // line generator
    var valueline = d3.line()
      .x(function (d, i) {
        return xscale(d.date);
      })
      .y(function (d) {
        // console.log("y" + d.value)
        return yscale(d.value);
      });

    // Append the path, bind the data, and call the line generator
    svg.append("g").append("path")
      .data([this.myData])
      .attr("stroke", "red")
      .attr("stroke-width", "3")
      .attr("fill", "none")
      .attr("d", valueline)
      .transition()
      .duration(1000);

    // Appends a circle for each datapoint
    svg.append("g").selectAll(".dot")
      .data(this.myData)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("fill", "red")
      .attr("cx", function (d, i) {
        return xscale(d.date);
      })
      .attr("cy", function (d) { return yscale(d.value) })
      .attr("r", 5);
  }
}
