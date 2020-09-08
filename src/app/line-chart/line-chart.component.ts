import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from "d3-tip";
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  host: {
    '(window:resize)': 'onResize(this)'
  }
})

export class LineChartComponent implements OnInit {
  @Input() lineData;
  // @Input() w:number;
  private width = 1745;
  private height = 250;
  private padding = { top: 20, right: 50, bottom: 20, left: 70 };
  private svg;
  private xscale;
  private yscale;
  private x_axis;
  private y_axis;

  private myColor;
  private circle;
  private tip;
  private monthData = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  constructor(private container: ElementRef) {
  }

  ngOnInit(): void {

    this.initSvg();
    this.initScale(this.lineData);
    //  this.drawGridLines();
    this.drawAxis();
    this.drawLine(this.lineData);
    this.onResize();

  };
  private initSvg() {

    this.svg = d3.select("#lineChart")
      .append("svg")
      //  .attr("id", "chart")
      .attr("width", this.width)
      .attr("height", this.height);

  };
  private initScale(myData: any) {

    // A color scale: one color for each group
    this.myColor = d3.scaleOrdinal(d3.schemeCategory10);

    this.xscale =
      d3.scalePoint()
        .domain(this.monthData.map((d: any) => {              // This is what is written on the Axis: from January to December
          return d
        }))
        .range([this.padding.left, this.width - this.padding.right]);

    this.yscale = d3.scaleLinear()
      .domain([0,
        d3.max(myData, function (c) {
          //console.log( d3.max(c.values, function(v) {return v.value})
          return d3.max(c.MonthYear, function (v) {
            return v.Awarded;
          });
        })
      ])
      .range([this.height - this.padding.bottom, this.padding.top]);      //reversed
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
      .scale(this.yscale).tickSize((-this.width + 2 * this.padding.right));
    // Place the x axis on the chart
    this.svg.append("g")
      .attr("id", "x_axis")
      .style("font-size", "13")
      .classed("gridLine", true)
      .attr("transform", "translate(0," + (this.height - this.padding.bottom) + ")")
      .call(this.x_axis.ticks(6))

    // Place the y axis on the chart
    this.svg.append("g")
      .attr("id", "y_axis")
      .style("font-size", "13")
      .classed("gridLine", true)
      .attr("transform", "translate(" + (this.padding.left) + ",0)")
      .call(this.y_axis.ticks(5))

  };

  private drawLine(data) {
    var that = this;
    // debugger
    //1. line generator
    var valueline = d3.line()
      .x(function (d, i) {
        return that.xscale(that.monthData[d.month - 1]);
      })
      .y(function (d) {

        return that.yscale(d.Awarded);
      });
    //1. Append the path, bind the data, and call the line generator
    this.svg.selectAll(".dot2")
      .data(data).enter().append("g")
      .append("path")
      .attr("class", "line")
      .attr("stroke-width", "3")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return that.myColor(d.year)
      })
      .datum(d => d.MonthYear)
      .attr("d", function (d) {
        return valueline(d);
      })
      .transition()
      .duration(1000)
      ;

    // Appends a circle for each datapoint
    this.svg.selectAll("myDots")
      .data(data)
      .enter()
      .append('g')
      .style("fill", function (d) {
        return that.myColor(d.year)
      })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(function (d) {
        return d.MonthYear
      })
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", function (d) {
        return that.xscale(that.monthData[d.month - 1])
      })
      .attr("cy", function (d) { return that.yscale(d.Awarded) })
      .attr("r", 5)
      .on("mousemove",
        function (d, i, index) {
          tip.show(i, this);
        }
      )
      .on('mouseout', function (d) {
        //  d3.select(".d3-tip").style("display", "none");
        tip.hide();
      });

    //Tooltip
    var tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (d) {
        //  debugger
        return "<span style='background-color: white;' ><strong>Month:</strong> <span style='color:red'>" + that.monthData[d.month - 1] + "</span><strong>Value:</strong> <span style='color:red'>" + d.Awarded + "</span></span>";
      })
      .style("background-color", "white")
      .style("border", "1px solid rgb(255,221,221)");
    this.svg.call(tip);
  }
  private onResize(this) {
    var that = this;
    // get the current width of the div where the chart appear, and attribute it to Svg
    var currentWidth = parseInt(d3.select('#lineChart').style('width'))
    if (currentWidth < this.width) {
      // Update the X scale and Axis
      this.xscale.range([this.padding.left, currentWidth - this.padding.right]);
      // Update the axis and text with the new scale
      this.svg.select('#x_axis')
        .call(this.x_axis);

      var valueline = d3.line()
        .x(function (d, i) {
          return that.xscale(that.monthData[d.month - 1]);
        })
        .y(function (d) {
          return that.yscale(d.Awarded);
        });

      this.svg.selectAll('.line')
        .attr("d", function (d) {
          return valueline(d);
        });

      this.x_axis.ticks(Math.max(currentWidth / 75, 2));
    }
    // // Add the last information needed for the circles: their X position
    this.svg.selectAll('.circle')
      .attr("cx", function (d) { return that.xscale(that.monthData[d.month - 1]) })
  };


}
