import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
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
  private lineData;
  private myColor;
  // private myData = [{
  //   "date": 'January',
  //   "value": 400,
  //   "value2": 300
  // },
  // {
  //   "date": 'February',
  //   "value": 300,
  //   "value2": 340
  // },
  // {
  //   "date": 'March',
  //   "value": 250,
  //   "value2": 150
  // },
  // {
  //   "date": 'April',
  //   "value": 450,
  //   "value2": 500
  // },
  // {
  //   "date": 'May',
  //   "value": 220,
  //   "value2": 250
  // },
  // {
  //   "date": 'June',
  //   "value": 210,
  //   "value2": 300
  // },
  // {
  //   "date": 'July',
  //   "value": 250,
  //   "value2": 199
  // },
  // {
  //   "date": 'August',
  //   "value": 100,
  //   "value2": 234
  // },
  // {
  //   "date": 'September',
  //   "value": 220,
  //   "value2": 456
  // },
  // {
  //   "date": 'October',
  //   "value": 360,
  //   "value2": 143
  // },
  // {
  //   "date": 'November',
  //   "value": 234,
  //   "value2": 335
  // },

  // {
  //   "date": 'December',
  //   "value": 290,
  //   "value2": 170
  // }];

  constructor() { }

  ngOnInit(): void {
  //  console.log("w"+this.w)
    debugger
    this.initSvg();
    this.initScale(this.lineData1);
    this.drawGridLines();
    this.drawAxis();
    this.drawLine();
    //2
    // this.initSvg();
    // this.initScale(this.lineData2);
    // debugger
    // this.drawGridLines();
    // this.drawAxis();
    // this.drawLine();


  }

  private initSvg() {
   // var that = this;
  // console.log("wi"+this.w)
    this.svg = d3.select("#lineChart")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    // console.log(Object.keys(this.myData[0]))
    // var allGroup = d3.map(this.myData, function(d){return(d.name)}).keys()
    //  var color = d3.scaleOrdinal(d3.schemeCategory10);

    // color.domain(Object.keys(this.myData[0]).filter(function(d){ return d!== "date" }));


  }
  private initScale(myData:any) {
    //var that = this;
    debugger
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
    this.xscale = d3.scalePoint()
      .domain(myData.map((d: any) => {               // This is what is written on the Axis: from January to December
        //console.log(d.date)
        return d.date
      }))
      .range([this.margin.left, this.width - this.margin.right]);         // This is where the axis is placed in px

    this.yscale = d3.scaleLinear()
      //.domain([0, 500])
      .domain([
        d3.min(this.lineData, function (c) {
          return d3.min(c.values, function (v) {
            console.log("v" + v)
            return v.value;
          });
        }),
        d3.max(this.lineData, function (c) {
          console.log("c" + c)
          //console.log( d3.max(c.values, function(v) {return v.value})
          return d3.max(c.values, function (v) {
            return v.value;
          });
        })
      ])
      .range([this.height - this.margin.bottom, this.margin.top]);      //reversed
    console.log("y" + this.yscale(500))
  };

  private drawGridLines() {
    // add the x gridlines
    this.svg.append("g")
      // .style("color", "#e4e4e4")
      .classed("gridLine", true)
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(d3.axisBottom(this.xscale)
        .tickSize((-this.height + 2 * this.margin.top))
        .tickFormat("")
      );

    // add the y gridlines
    this.svg.append("g")
      // .style("color", "#e4e4e4")
      .classed("gridLine", true)
      .attr("transform", "translate(" + (this.margin.left) + ",0)")
      .call(d3.axisLeft(this.yscale).ticks(5)
        .tickSize((-this.width + 2 * this.margin.right))
        .tickFormat("")
      );
  }
  private drawAxis() {
    // For x axis
    this.svg.append("g")
      .style("font-size", "13")
      .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")
      .call(d3.axisBottom(this.xscale))

    // For y axis
    this.svg.append("g")
      .style("font-size", "13")
      .attr("transform", "translate(" + (this.margin.left) + ",0)")
      .call(d3.axisLeft(this.yscale).ticks(5))

  };

  private drawLine() {
    var that = this;
    debugger
    //1. line generator
    var valueline = d3.line()
      .x(function (d, i) {
        debugger
        return that.xscale(d.date);
      })
      .y(function (d) {
        // console.log("y" + d.value)
        return that.yscale(d.value);
      });

    //1. Append the path, bind the data, and call the line generator
    this.svg.append("g").selectAll(".dot2").data(this.lineData).enter().append("path")
      //.data(this.lineData)
      .attr("stroke",  function(d){ return that.myColor(d.name) })
      .attr("stroke-width", "3")
      .attr("fill", "none")
      .attr("d", function (d) {
        console.log("val" + d.values)
        return valueline(d.values);
      })
      .transition()
      .duration(1000);

    // Appends a circle for each datapoint

    this.svg.selectAll("myDots")
      .data(this.lineData)
      .enter()
      .append('g')
      .style("fill",  function(d){ return that.myColor(d.name) })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(function (d) { return d.values })
      .enter()
      .append("circle")
      .attr("cx", function (d) { return that.xscale(d.date) })
      .attr("cy", function (d) { return that.yscale(d.value) })
      .attr("r", 5)

  };
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

}
