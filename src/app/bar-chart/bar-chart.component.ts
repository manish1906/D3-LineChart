import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from "d3-tip";
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  host: {
    '(window:resize)': 'onResize(this)'
  }
})
export class BarChartComponent implements AfterViewInit {
  @Input() barData;
  @Input() svgWidth: number;
  @Input() svgHeight: number;
  @Input() id: string;
  // private svgWidth = 656;
  // private svgHeight = 250;
  private padding = { top: 20, right: 50, bottom: 20, left: 80 };
  private tooltipStyle = { padding: 8, margintop: -20, width: 150, height: 15 };
  private svg;

  private xscale;
  private yscale;
  private x_axis;
  private y_axis;
  //private barData;
  private stack;
  private tooltip;
  private last1;
  public color = ["green", "red", "blue"];
  private monthData = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  constructor(private container: ElementRef) {

  }

  ngAfterViewInit(): void {
    var id = this.id
    this.last1 = id.slice(-1);
    console.log(this.last1)
    this.initSvg();
    this.dataManipulation(this.barData);
    this.initScale(this.barData);
    // this.drawGridLines();
    this.drawAxis();
    this.drawBar();
    this.onResize();

  };
  private dataManipulation(data) {

    var date = new Date();
    var month = date.getMonth() - 6;
    var lastMonth = month + 6;
    var m = this.monthData[month];
    let result = [];
    let test = [];
    for (var i = month; i < lastMonth; i++) {
      result.push(this.monthData[month])
      month++;
    }

   var key= Object.keys(data[0]).filter(function (d) { return d !== "month" });
    result.forEach((m, i) => {
      const monthIndex = this.monthData.indexOf(m) + 1;
      const item = data.find(item => item.month === monthIndex);
      if (item) {
        debugger
        test.push(item);
      } else {
        debugger
        test.push({ month: monthIndex, });
      }
      console.log(test)
    })
  }
  private initSvg() {

    this.svg = d3.selectAll("#" + this.id)
      .append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    this.tooltip = d3.select("#" + this.id).append("div")
      .attr("id", "tooltip" + this.last1)
      .attr("class", "barChart-tooltip")
      .style("display", 'none')
      .style("width", this.tooltipStyle.width + "px")
      .style("height", this.tooltipStyle.height + "px")
      .style("padding", this.tooltipStyle.padding + "px")
      .style("margin-top", this.tooltipStyle.margintop + "px");

  };
  private initScale(myData: any) {
    //var that = this;
    var group = Object.keys(myData[0]).filter(function (d) { return d !== "month" });
    console.log(group);
    this.stack = d3.stack().keys(group);
    this.barData = this.stack(myData);
    console.log(this.barData);
    this.xscale =
      d3.scalePoint()
        .domain(                                                     // This is what is written on the Axis: from January to December
          myData.map((d, i) => {
            return this.monthData[d.month - 1];
          })
        )
        .range([this.padding.left, this.svgWidth - this.padding.right])
        .padding(0.1);

    this.yscale = d3.scaleLinear()
      .domain([0,
        d3.max(this.barData, function (c) {
          return d3.max(c, function (v) {
            return v[1];
          });
        })
      ])
      .range([this.svgHeight - this.padding.bottom, this.padding.top]);      //reversed
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
      .attr("transform", "translate(0," + (this.svgHeight - this.padding.bottom) + ")")
      .call(d3.axisBottom(this.xscale)
        .tickSize((-this.svgHeight + 2 * this.padding.top))
        .tickFormat("")
      );

    // add the y gridlines
    this.svg.append("g")
      // .style("color", "#e4e4e4")
      .attr("id", "y_axis")
      .classed("gridLine", true)
      .attr("transform", "translate(" + (this.padding.left) + ",0)")
      .call(d3.axisLeft(this.yscale).ticks(5)
        .tickSize((-this.svgWidth + 2 * this.padding.right))
        .tickFormat("")
      );
  }
  private drawAxis() {
    // Define axes
    this.x_axis = d3.axisBottom()
      .scale(this.xscale)
      .tickSize((-this.svgHeight + 2 * this.padding.top));

    this.y_axis = d3.axisLeft()
      .scale(this.yscale)
      .tickSize((-this.svgWidth + 2 * this.padding.right));
    // Place the x axis on the chart
    this.svg.append("g")
      .attr("id", "x_axis")
      .style("font-size", "13")
      .classed("gridLine", true)
      .attr("transform", "translate(0," + (this.svgHeight - this.padding.bottom) + ")")
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
      .attr("id", "rectGroup" + this.last1)
      .selectAll("myBars")
      .data(function (d) {
        return d
      })
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("id", "rect" + this.id)
      .attr('x', function (d) {
        return that.xscale(that.monthData[d.data.month - 1]) - 15;///-15
      })
      .attr('y', function (d) { return that.yscale(d[1]) })
      .attr('height', function (d) {
        return that.yscale(d[0]) - that.yscale(d[1])
      }
      )
      .attr('width', "30")
      .on("mouseover", function (event) {
        console.log(that.last1)
        d3.select("#tooltip" + event.target.parentNode.id.slice(-1)).style("display", null)
      })
      .on("mouseout", function (event) {
        console.log(that.last1)
        d3.select("#tooltip" + event.target.parentNode.id.slice(-1)).style("display", "none");
      })
      .on("mousemove",
        function (evnt, d) {
          that.handleMouseMove(event, d)
        }
      );
  };
  private handleMouseMove(event, d) {
    // debugger
    // console.log("x:"+event.pageX+"y:"+event.pageY)
    var name = Object.keys(d.data).find(key => d.data[key] === d[1] - d[0]);

    var that = this;
    var left = event.pageX + 15;
    var top = event.pageY - 15;
    // console.log(window.innerWidth + "left" + left)

    if (left > that.svgWidth - this.padding.right || left > window.innerWidth - that.padding.right) {
      left = left - that.tooltipStyle.width;
      top = top - 10;
    }
    d3.select("#tooltip" + event.target.parentNode.id.slice(-1))
      .style("left", left + "px")
      .style("top", top + "px")
      .text(name + ":" + (d[1] - d[0]));
  }
  private onResize(this) {
    var that = this;

    // get the current width of the div where the chart appear, and attribute it to Svg
    var currentWidth = parseInt(d3.select("#" + this.id).style('width'))

    if (currentWidth < this.svgWidth) {
      this.xscale.range([this.padding.left, currentWidth - this.padding.right]);
      this.y_axis.tickSize((-currentWidth + 2 * this.padding.right));

      this.svg.select('#x_axis')
        .call(this.x_axis);
      this.svg.select('#y_axis')
        .call(this.y_axis);
      this.svg.selectAll('.bar')
        .attr("x", function (d) { return that.xscale(that.monthData[d.data.month - 1]) - 15 })
    };
  }
}
