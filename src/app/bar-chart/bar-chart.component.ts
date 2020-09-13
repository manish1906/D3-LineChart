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
  private tooltipStyle = { padding: 10, margintop: 0, width: 170, height: 15 };
  private svg;

  private xscale;
  private yscale;
  private x_axis;
  private y_axis;
  //private barData;
  private stack;
  private tooltip;
  public last1;
  private key;
  public color = ["green", "red", "blue"];
  private monthData = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  constructor(private container: ElementRef) {

  }

  ngAfterViewInit(): void {
    var id = this.id;
    this.last1 = id.slice(-1);
    console.log(this.last1)
    this.initSvg();
    this.dataManipulation(this.barData);
    //  this.initScale(this.barData);
    // this.drawGridLines();
    this.drawAxis();
    this.drawBar();
    this.colorInfo();
    this.onResize();

  };
  private dataManipulation(data) {
    debugger
    var date = new Date();
    var month = date.getMonth() - 6;
    var lastMonth = month + 6;
    var m = this.monthData[month];
    let lastSixMonth = [];
    let finalData = [];
    let test = [];
    for (var i = month; i < lastMonth; i++) {
      lastSixMonth.push(this.monthData[month])
      month++;
    };

    //If not empty arrray
    if (data.length < 6) {
      var key = Object.keys(data[0]).filter(function (d) { return d !== "month" });
      lastSixMonth.forEach((m, i) => {
        const monthIndex = this.monthData.indexOf(m) + 1;
        const item = data.find(item => item.month === monthIndex);

        if (item) {

          finalData.push(item);
          //  test.push(item)
        } else {

          //push value 0 based on keys
          // var mainObj: any = {};
          // var myObj: any = {};
          // for (i = 0; i < key.length; i++) {
          //   mainObj[i] = key[i];
          //   Object.assign(myObj, mainObj);
          //   console.log(myObj,mainObj);
          //   debugger
          // }
          //test.push({month:monthIndex})

          //static logic
          if (key.length > 2)
            finalData.push({ month: monthIndex, MarketSaving: 0, SingleSource: 0, LowBidNotAccepted: 0 });
          else {
            finalData.push({ month: monthIndex, AwarderVolume: 0, MarketSaving: 0 })
          }
        }

      })
      this.initScale(finalData);
    }

    //if empty array then put the logic
    else {
      this.initScale(data);
    }
    //  console.log(test)


  }
  private initSvg() {
    this.svg = d3.select("#" + this.id)
      .append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)
      .append("g")
      .attr("transform", "translate(0,0)");;

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
debugger
    //var that = this;
    this.key = Object.keys(myData[0]).filter(function (d) { return d !== "month" });
    // console.log(group);
    this.stack = d3.stack().keys(this.key);
    this.barData = this.stack(myData);

    // console.log(this.barData);
    this.xscale =
      d3.scalePoint()
        .domain(                                                     // This is what is written on the Axis: from January to December
          myData.map((d, i) => {
            return this.monthData[d.month - 1];
          })
        )
        .range([this.padding.left, this.svgWidth - this.padding.right])
        .padding(0.2);

    // For y axis maximum value
    var max= d3.max(this.barData, function (c) {
      debugger
      return d3.max(c, function (v) {
        debugger
        return v[1];
      });
    });
    if(max==0){
      var max=1;
    }

    this.yscale = d3.scaleLinear()
      .domain([0,max
      ])
      .range([this.svgHeight - this.padding.bottom, this.padding.top]);      //reversed
    console.log("y" + d3.max(this.barData, function (c) {
      return d3.max(c, function (v) {
        return v[1];
      });
    }))
  };

  private drawAxis() {
    // Define axes
    this.x_axis = d3.axisBottom()
      .scale(this.xscale)
      .tickSize((-this.svgHeight + 2 * this.padding.top));

    this.y_axis = d3.axisLeft()
      .scale(this.yscale)
      .tickSize((-this.svgWidth + this.padding.right + this.padding.left));
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
        return that.xscale(that.monthData[d.data.month - 1]) - 17;///-15
      })
      .attr('y', function (d) { return that.yscale(d[1]) })
      .attr('height', function (d) {
        return that.yscale(d[0]) - that.yscale(d[1])
      }
      )
      .attr('width', "30")
      .on("mouseover", function (event) {
        // console.log(that.last1)
        d3.select("#tooltip" + event.target.parentNode.id.slice(-1)).style("display", null)
      })
      .on("mouseout", function (event) {
        // console.log(that.last1)
        d3.select("#tooltip" + event.target.parentNode.id.slice(-1)).style("display", "none");
      })
      .on("mousemove",
        function (evnt, d) {
          that.handleMouseMove(event, d)
        }
      );

    //for svg border
    this.svg.append("rect")
      .style("stroke-width", "2")
      .style("fill", "none")
      .style("stroke", "black")
      .attr("class", "svgborder")
      .attr("x", this.padding.left)
      .attr("y", this.padding.top)
      .attr("width", this.svgWidth - this.padding.right - this.padding.left)
      .attr("height", this.svgHeight - this.padding.bottom - this.padding.top);
  };
  private handleMouseMove(event, d) {
    // debugger
    // console.log("x:"+event.pageX+"y:"+event.pageY)
    var name = Object.keys(d.data).find(key => d.data[key] === d[1] - d[0]);

    var that = this;
    var left = event.pageX + 15;
    var top = event.pageY - 15;
    // console.log(window.innerWidth + "left" + left)

    if (left > that.svgWidth - this.padding.right - this.padding.left || left > window.innerWidth - that.padding.right) {
      left = left - that.tooltipStyle.width - this.padding.right;
      top = top - 10;
    }
    d3.select("#tooltip" + event.target.parentNode.id.slice(-1))
      .style("left", left + "px")
      .style("top", top + "px")
      .text(name + ":" + (d[1] - d[0]));
  }
  private colorInfo() {
    var that = this;

    var legend = d3.select("#" + this.id).append("svg")
      .attr("width", 170)
      .attr("height", this.svgHeight)
      .selectAll(".info1")
      .data(this.barData)
      .enter()
      .append('g')


    legend.append('rect')
      .attr('class', 'bar')
      .attr('x', 10)
      .attr('y', function (d, i) {
        return (i * 20) + 5;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function (d, i) {

        return that.color[i];
      });

    legend.append('text')
      .attr('x', 25)
      .attr('y', function (d, i) {
        return (i * 20) + 15;
      })
      .text(function (d) {
        return d.key;
      });



  }
  private onResize(this) {
    var that = this;
    // get the current width of the div where the chart appear, and attribute it to Svg
    var currentWidth = parseInt(d3.select("#" + this.id).style('width'))

    if (currentWidth < this.svgWidth) {
      this.xscale.range([this.padding.left, currentWidth - this.padding.right]);
      this.y_axis.tickSize((-currentWidth + this.padding.right + this.padding.left));

      this.svg.select('#x_axis')
        .call(this.x_axis);
      this.svg.select('#y_axis')
        .call(this.y_axis);
      this.svg.selectAll('.bar')
        .attr("x", function (d) { return that.xscale(that.monthData[d.data.month - 1]) - 15 });
      this.svg.selectAll('.svgborder')
        .attr("width", currentWidth - this.padding.right - this.padding.left);

    };
  }
}
