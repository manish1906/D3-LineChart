import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
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

export class LineChartComponent implements AfterViewInit {
  @Input() lineData;
  @Input() svgWidth: number;
  @Input() svgHeight: number;
  @Input() id: string;
  // private svgWidth = 1745;
  // private svgHeight = 250;
  private padding = { top: 20, right: 50, bottom: 20, left: 70 };
  private tooltipStyle = { padding: 8, margintop: -20, width: 100, height: 20 };
  private svg;
  private xscale;
  private yscale;
  private x_axis;
  private y_axis;
  private valueline;
  private myColor;
  private circle;
  private tip;
  private last1;
  private tooltip;
  private monthData = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  constructor(private container: ElementRef) {
  }

  ngAfterViewInit(): void {
    // console.log(this.width)
    var id = this.id
    this.last1 = id.slice(-1);
    this.initSvg();
     this.dataManipulation(this.lineData);



  };
  private dataManipulation(data) {
    data.forEach((m, i) => {

      for (var j = 0; j < 12; j++) {
        const monthIndex = j + 1;
        const item = data[i].MonthYear.find(item => item.month === monthIndex);
        if (!item) {
          // data[i].MonthYear.push(item);
          data[i].MonthYear.splice(j, 0, { month: monthIndex, Awarded: 0 });
        } else {


        }
      }
    })
    console.log("linedata" + data)
    debugger
    this.initScale(data);
    this.drawAxis();
    this.drawLine(data);

    this.colorInfo(data);


    this.onResize();
    // debugger
  }
  private initSvg() {

    this.svg = d3.select("#" + this.id)
      .append("svg")
      //  .attr("id", "chart")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)
      .append("g")
      .attr("transform", "translate(0,0)");

    this.tooltip = d3.select("#" + this.id).append("div")
      .attr("id", "lineChartTooltip" + this.last1)
      .classed("lineChart-tooltip", true)
      .style("display", 'none')
      .style("width", this.tooltipStyle.width + "px")
      .style("height", this.tooltipStyle.height + "px")
      .style("padding", this.tooltipStyle.padding + "px")
      .style("margin-top", this.tooltipStyle.margintop + "px");

  };
  private initScale(myData: any) {
    // A color scale: one color for each group
    this.myColor = d3.scaleOrdinal(d3.schemeCategory10);
    this.xscale =
      d3.scalePoint()
        .domain(this.monthData.map((d: any) => {              // This is what is written on the Axis: from January to December
          return d
        }))
        .range([this.padding.left, this.svgWidth - this.padding.right]);

    this.yscale = d3.scaleLinear()
      .domain([0,
        d3.max(myData, function (c) {
          //console.log( d3.max(c.values, function(v) {return v.value})
          return d3.max(c.MonthYear, function (v) {
            return v.Awarded;
          });
        })
      ])
      .range([this.svgHeight - this.padding.bottom, this.padding.top]);      //reversed
  };

  private drawAxis() {
    // Define axes
    this.x_axis = d3.axisBottom()
      .scale(this.xscale)
      .tickSize((-this.svgHeight + this.padding.top + this.padding.bottom));

    this.y_axis = d3.axisLeft()
      .scale(this.yscale)
      .tickSize((-this.svgWidth + this.padding.left + this.padding.right));
    // Place the x axis on the chart
    this.svg.append("g")
      .attr("id", "x_axis")
      .style("font-size", "13")
      .classed("gridLine", true)
      .attr("transform", "translate(0," + (this.svgHeight - this.padding.bottom) + ")")
      .call(this.x_axis)

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
    this.valueline = d3.line()
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
      .attr("stroke",
        function (d, i) {

          return that.myColor(d.year)
        }
      )
      .datum(d => d.MonthYear)
      .attr("d", function (d) {
        return that.valueline(d);
      })
      .transition()
      .duration(1000);

    // Appends a circle for each datapoint
    this.svg.selectAll("myDots")
      .data(data)
      .enter()
      .append('g')
      .attr("id", "circleGroup" + this.last1)
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
        function (d, i) {
          for (var j = 0; j < data.length; j++) {
            var index = data[j].MonthYear.indexOf(i);
            if (index > -1) {
              that.handleMouseMove(event, data[j].year, i);
            }
          }
        }
      )
      .on("mouseover", function (event) {
        console.log(event.target.parentNode.id.slice(-1))
        d3.select('#lineChartTooltip' + event.target.parentNode.id.slice(-1)).style("display", null)
      })
      .on('mouseout', function (event) {
        d3.select('#lineChartTooltip' + event.target.parentNode.id.slice(-1)).style("display", "none");
        // that.tip.hide();
      });

    //border in svg
    this.svg.append("rect")
      .style("stroke-width", "2")
      .style("fill", "none")
      .style("stroke", "black")
      .attr("class", "lineborder")
      .attr("x", this.padding.left)
      .attr("y", this.padding.top)
      .attr("width", this.svgWidth - this.padding.right - this.padding.left)
      .attr("height", this.svgHeight - this.padding.bottom - this.padding.top);

  };
  private handleMouseMove(event, year, data) {
    //  console.log("x:"+event.pageX+"y:"+event.pageY)
    var that = this;
    var left = event.pageX + 15;
    var top = event.pageY - 15;
    // console.log(window.innerWidth+"left"+left)
    if (left > that.svgWidth - that.padding.right - this.padding.left || left > window.innerWidth - that.padding.right) {
      left = left - that.tooltipStyle.width - this.padding.right;
      top = top - 10;


    }
    d3.select('#lineChartTooltip' + event.target.parentNode.id.slice(-1))
      .style("left", left + "px")
      .style("top", top + "px")
      .text(year + " : " + data.Awarded)

  };
  private colorInfo(data) {
    var that = this;
    var height = data.length * 20
    var legend = d3.select("#" + this.id).append("svg")
      .attr("width", 100)
      .attr("height", height)
      .selectAll(".info")
      .data(data)
      .enter()
      .append('g');


    legend.append('rect')
      .attr('class', 'line')
      .attr('x', 10)
      .attr('y', function (d, i) {
        return (i * 20) + 5;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function (d, i) {
        return that.myColor(d.year);
      });

    legend.append('text')
      .attr('x', 25)
      .attr('y', function (d, i) {
        return (i * 20) + 15;
      })
      .text(function (d) {
        return d.year;
      });

  }
  private onResize(this) {
    var that = this;
    // console.log(window.innerWidth)
    // get the current width of the div where the chart appear, and attribute it to Svg
    var currentWidth = parseInt(d3.select("#" + that.id).style('width'))

    if (currentWidth < this.svgWidth) {
      // Update the X scale and Axis
      this.xscale.range([this.padding.left, currentWidth - this.padding.right]);
      this.y_axis.tickSize((-currentWidth + this.padding.right + this.padding.left))
      // Update the axis and text with the new scale
      this.svg.select('#x_axis')
        .call(this.x_axis);
      this.svg.select('#y_axis')
        .call(this.y_axis);

      this.svg.selectAll('.line')
        .attr("d", function (d) {
          return that.valueline(d);
        });

      // Add the last information needed for the circles: their X position
      this.svg.selectAll('.circle')
        .attr("cx", function (d) { return that.xscale(that.monthData[d.month - 1]) });
      this.svg.selectAll('.lineborder')
        .attr("width", currentWidth - this.padding.right - this.padding.left)
    };
    if (currentWidth < 900) {
      this.x_axis.tickValues(that.xscale.domain().filter(function (d, i) { return !(i % 2); }));
    }
    if (currentWidth > 900) {
      this.x_axis.tickValues(that.xscale.domain().filter(function (d, i) { return that.monthData.length }));
    }
  }

};
