import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from "d3-tip";
import { group } from 'console';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  host: {
    '(window:resize)': 'drawChart(this)'
  }
})
export class BarChartComponent implements OnInit {
  @Input() barData1;

  private width = 656;
  private height = 250;
  private padding = { top: 20, right: 50, bottom: 20, left: 80 };
  private svg;
  private xscale;
  private yscale;
  private x_axis;
  private y_axis;
  private barData;
  private myColor;
  private circle;
  private tip;
  private stack;
  private tooltip;
private color=["green", "blue", "red"];
  private monthData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  constructor(private container: ElementRef) {

  }

  ngOnInit(): void {
    //  console.log("w"+this.w)
    //this.drawChart();
    // console.log(window.innerWidth)
    this.initSvg();
    this.initScale(this.barData1);
    // this.drawGridLines();
    this.drawAxis();
    this.toolTip();
     this.drawBar();
     this.drawChart();

  };
  private initSvg() {

    this.svg = d3.select("#barChart")
      .append("svg")
      //  .attr("id", "chart")
      .attr("width", this.width)
      .attr("height", this.height)


  };
  private initScale(myData: any) {
    //var that = this;
    // debugger
    var group = Object.keys(myData[0]).filter(function (d) { return d !== "month" });
    console.log(group)
    // this.barData = d3.stack()(group).map(function (name) {
    //   debugger
    //   return myData.map(function (d) {
    //     debugger
    //       return {
    //         month: d.month,
    //         value: +d[name]
    //       };
    //     })

    // });
    this.stack=d3.stack().keys(group);
    this.barData=this.stack(myData);
    console.log(this.barData)
    // A color scale: one color for each group
    // this.myColor = d3.scaleOrdinal()
    //   .domain(group)
    //   .range(["green", "blue", "red"]);
    this.xscale =
      d3.scalePoint()
        .domain(
          myData.map((d: any) => {               // This is what is written on the Axis: from January to December
            //console.log(d.month)
            return d.month
          })
        )
        // d3.scaleTime()
        // .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
        .range([this.padding.left, this.width - this.padding.right])
        .padding(0.1);

    this.yscale = d3.scaleLinear()
      .domain([0
        ,
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
      .call(this.x_axis.tickSizeOuter(0))

      ;
    // .ticks(d3.timeMonths).tickFormat(d3.timeFormat("%B"))
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
    // debugger

    // debugger
    this.svg.selectAll(".bar").data(this.barData).enter().append("g")
      .style("fill", function (d,i) {
       // debugger
        return that.color[i]
       })
      .selectAll("myBars")
      .data(function (d) {
        // debugger
        return d
      })
      .enter()
      .append("rect")
      //.data(this.barData)
      .attr("class", "bar")
      .attr('x', function (d) {
        // debugger
        // console.log("x" + that.xscale(d.month))
        return that.xscale(d.data.month)-15;
      })
      .attr('y', function (d) { return that.yscale(d[1]) })
      .attr('height', (d) =>
      //that.height - this.padding.bottom - that.yscale(s.value)
      that.yscale(d[0]) - that.yscale(d[1])
      )
      .attr('width', "30")
      .on("mouseover", function() { that.tooltip.style("display", null); })
      .on("mouseout", function() { that.tooltip.style("display", "none"); })
      .on("mousemove",  function(d,i) {
       // debugger
        var xPosition = d3.pointer(that)[0] - 15;
       debugger
        // var yPosition = d3.mouse(this)[1] - 25;
       // that.tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        that.tooltip.select("text").text(d.y);
      }
      )
      .on('mouseout', function (d) {
        // debugger
        //  d3.select(".d3-tip").style("display", "none");
    //  tip.hide();
      });

    //Tooltip
    // var tip = d3Tip()
    // // var tip = d3.select("#barChart").append("div")
    //   .attr('class', 'bar-tip')
    //  .offset([-10, 0])
    //   .html(function (d) {
    //      debugger
    //     return "<span style='background-color: white;' ><strong>Value:</strong> <span style='color:red'>" + (d[1]-d[0])+ "</span></span>";
    //   })
    //   .style("background-color", "white")
    //   .style("border", "1px solid rgb(255,221,221)")

    // this.svg.call(tip);

  };
  private toolTip(){

    this.tooltip = this.svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  this.tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  this.tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");


  }
  private drawChart(this) {
    var that = this;
    // get the current width of the div where the chart appear, and attribute it to Svg
    var currentWidth = parseInt(d3.select('#barChart').style('width'))
    if (currentWidth < this.width) {

      this.xscale.range([this.padding.left, currentWidth - this.padding.right]);

      this.svg.select('#x_axis')
        .call(this.x_axis);
      this.svg.selectAll('.bar')
        .attr("x", function (d) { return that.xscale(d.month) - 15 })

    }

  }



}
