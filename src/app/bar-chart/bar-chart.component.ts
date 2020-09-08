import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from "d3-tip";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  host: {
    '(window:resize)': 'onResize(this)'
  }
})
export class BarChartComponent implements OnInit {
  @Input() barData;

  private width = 656;
  private height = 250;
  private padding = { top: 20, right: 50, bottom: 20, left: 80 };
  private svg;
  private xscale;
  private yscale;
  private x_axis;
  private y_axis;
  //private barData;

  private stack;
  private tooltip;
  private color = ["green", "red", "blue"];
  private monthData = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  constructor(private container: ElementRef) {

  }

  ngOnInit(): void {

    this.initSvg();
    this.initScale(this.barData);
    // this.drawGridLines();
    this.drawAxis();
    this.drawBar();
    this.onResize();

  };
  private initSvg() {

    this.svg = d3.select("#barChart")
      .append("svg")
      //  .attr("id", "chart")
      .attr("width", this.width)
      .attr("height", this.height);

    this.tooltip = d3.select("#barChart").append("div")
      .classed('chart-tooltip', true)
      .style('display', 'none');

  };
  private initScale(myData: any) {
    //var that = this;
    // debugger
    var group = Object.keys(myData[0]).filter(function (d) { return d !== "month" });
    console.log(group);
    this.stack = d3.stack().keys(group);
    this.barData = this.stack(myData);
    console.log(this.barData)
    this.xscale =
      d3.scalePoint()
        .domain(                                                     // This is what is written on the Axis: from January to December
          myData.map((d, i) => {

            return this.monthData[d.month - 1];
          })
        )
        .range([this.padding.left, this.width - this.padding.right])
        .padding(0.1);

    this.yscale = d3.scaleLinear()
      .domain([0,
        d3.max(this.barData, function (c) {
          return d3.max(c, function (v) {
            return v[1];
          });
        })
      ])
      .range([this.height - this.padding.bottom, this.padding.top]);      //reversed
    console.log("y" + d3.max(this.barData, function (c) {
      return d3.max(c, function (v) {
        return v[1];
      });
    }))
  };

  private drawGridLines() {

    // add the x gridlines
    this.svg.append("g")
      // .style("color", "#e4e4e4")
      .attr("id", "x_axis")
      .classed("gridLine", true)
      .attr("transform", "translate(0," + (this.height - this.padding.bottom) + ")")
      .call(d3.axisBottom(this.xscale)
        .tickSize((-this.height + 2 * this.padding.top))
        .tickFormat("")
      );

    // add the y gridlines
    this.svg.append("g")
      // .style("color", "#e4e4e4")
      .attr("id", "y_axis")
      .classed("gridLine", true)
      .attr("transform", "translate(" + (this.padding.left) + ",0)")
      .call(d3.axisLeft(this.yscale).ticks(5)
        .tickSize((-this.width + 2 * this.padding.right))
        .tickFormat("")
      );
  }
  private drawAxis() {
    // Define axes
    this.x_axis = d3.axisBottom()
      .scale(this.xscale)
      .tickSize((-this.height + 2 * this.padding.top));

    this.y_axis = d3.axisLeft()
      .scale(this.yscale)
      .tickSize((-this.width + 2 * this.padding.right));
    // Place the x axis on the chart
    this.svg.append("g")
      .attr("id", "x_axis")
      .style("font-size", "13")
      .classed("gridLine", true)
      .attr("transform", "translate(0," + (this.height - this.padding.bottom) + ")")
      .call(this.x_axis.tickSizeOuter(0));

    // Place the y axis on the chart
    this.svg.append("g")
      .attr("id", "y_axis")
      .style("font-size", "13")
      .classed("gridLine", true)
      .attr("transform", "translate(" + (this.padding.left) + ",0)")
      .call(this.y_axis.ticks(5).tickSizeOuter(0))

  };

  private drawBar() {
    var that = this;

    this.svg.selectAll(".bar").data(this.barData).enter().append("g")
      .style("fill", function (d, i) {
        return that.color[i]
      })
      .selectAll("myBars")
      .data(function (d) {
        return d
      })
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr('x', function (d) {
        return that.xscale(that.monthData[d.data.month-1]) - 15;
      })
      .attr('y', function (d) { return that.yscale(d[1]) })
      .attr('height', function (d) {
        return that.yscale(d[0]) - that.yscale(d[1])
      }
      )
      .attr('width', "30")
      .on("mouseover", function () {
        d3.select('.chart-tooltip').style("display", null)
      })
      .on("mouseout", function () {
        d3.select('.chart-tooltip').style("display", "none");
      })
      .on("mousemove", function (evnt, d) {
        var name = Object.keys(d.data).find(key => d.data[key] === d[1] - d[0]);
        d3.select('.chart-tooltip')
          .style("left", evnt.pageX + 15 + "px")
          .style("top", evnt.pageY - 15 + "px")
          .text(name + ":" + (d[1] - d[0]))
      }
      );
  };
  private onResize(this) {
    var that = this;
    // get the current width of the div where the chart appear, and attribute it to Svg
    var currentWidth = parseInt(d3.select('#barChart').style('width'))
    if (currentWidth < this.width) {
      this.xscale.range([this.padding.left, currentWidth - this.padding.right]);
      this.svg.select('#x_axis')
        .call(this.x_axis);
      this.svg.selectAll('.bar')
        .attr("x", function (d) { return that.xscale(that.monthData[d.data.month-1]) - 15 })
    };
  }
}
