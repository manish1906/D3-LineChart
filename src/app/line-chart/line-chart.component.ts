import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  private data = [10, 15, 20, 25, 30];
  private width = 1745;
  private height = 250;

  constructor() { }

  ngOnInit(): void {
    this.initSvg();
  }
  private initSvg() {
    var svg = d3.select("#lineChart")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    var xscale = d3.scaleLinear()
      .domain([0, d3.max(this.data)])
      .range([0, this.width - 100]);
    // var xscale = d3.scaleBand()
    //               .rangeRound([0, this.width- this.margin.right])
    //               .padding(0.05);
    var yscale = d3.scaleLinear()
      .domain([0, d3.max(this.data)])
      .range([this.height - 30, 0]);

    //  var x_axis = d3.axisBottom()
    //                     .scale(xscale);

    //  var y_axis = d3.axisLeft()
    //                     .scale(yscale);

    svg.append("g")
      .attr("transform", "translate(50, 10)")
      // .call(y_axis)
      .call(d3.axisLeft(yscale));

    var xAxisTranslate = this.height - 20;

    svg.append("g")
      .attr("transform", "translate(50, " + xAxisTranslate + ")")
      // .call(x_axis)
      .call(d3.axisBottom(xscale))

  }
}
