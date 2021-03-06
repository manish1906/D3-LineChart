import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'line-chart';
  // svgWidth:number;
  yearOverYearData: any = [];
  procurementPracticesData: any = [];
  costSaving: any = [];

  lineChartWidth: number;
  lineChartHeight: number;
  barChartWidth: number;
  barChartHeight: number;
  lineChartId: string;
  barChartId1: string;
  barChartId2: string;
  public apiData = [
    {
      "Id": 1,
      "YearOverYear": [
        {
          "year": 2001,
          "MonthYear": [
            {
              "month": 2,
              "Awarded": 2729
            },
            {
              "month": 3,
              "Awarded": 49614
            },
            {
              "month": 4,
              "Awarded": 154246
            },
            {
              "month": 5,
              "Awarded": 145395
            },
            {
              "month": 6,
              "Awarded": 3375070
            },
            {
              "month": 7,
              "Awarded": 1887899
            },
            {
              "month": 8,
              "Awarded": 4198250
            },
            {
              "month": 9,
              "Awarded": 3500361
            },
            {
              "month": 10,
              "Awarded": 2650750
            },
            {
              "month": 11,
              "Awarded": 4430917
            },
            {
              "month": 12,
              "Awarded": 866356
            }
          ]
        },
        {
          "year": 2002,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 996913
            },
            {
              "month": 2,
              "Awarded": 1330913
            },
            {
              "month": 3,
              "Awarded": 1419423
            },
            {
              "month": 4,
              "Awarded": 10162163
            },
            {
              "month": 5,
              "Awarded": 5383197
            },
            {
              "month": 6,
              "Awarded": 7697560
            },
            {
              "month": 7,
              "Awarded": 3619061
            },
            {
              "month": 8,
              "Awarded": 2423462
            },
            {
              "month": 9,
              "Awarded": 5002966
            },
            {
              "month": 10,
              "Awarded": 12068141
            },
            {
              "month": 11,
              "Awarded": 4452625
            },
            {
              "month": 12,
              "Awarded": 5947431
            }
          ]
        },
        {
          "year": 2003,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 9794544
            },
            {
              "month": 2,
              "Awarded": 6191936
            },
            {
              "month": 3,
              "Awarded": 4696552
            },
            {
              "month": 4,
              "Awarded": 4883421
            },
            {
              "month": 5,
              "Awarded": 1237920
            },
            {
              "month": 6,
              "Awarded": 3221403
            },
            {
              "month": 7,
              "Awarded": 2072317
            },
            {
              "month": 8,
              "Awarded": 1304953
            },
            {
              "month": 9,
              "Awarded": 6029143
            },
            {
              "month": 10,
              "Awarded": 1950647
            },
            {
              "month": 11,
              "Awarded": 2550381
            },
            {
              "month": 12,
              "Awarded": 4270590
            }
          ]
        },
        {
          "year": 2004,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 2620676
            },
            {
              "month": 2,
              "Awarded": 2572384
            },
            {
              "month": 3,
              "Awarded": 3900052
            },
            {
              "month": 4,
              "Awarded": 5342761
            },
            {
              "month": 5,
              "Awarded": 2079986
            },
            {
              "month": 6,
              "Awarded": 3085071
            },
            {
              "month": 7,
              "Awarded": 6585053
            },
            {
              "month": 8,
              "Awarded": 1282260
            },
            {
              "month": 9,
              "Awarded": 4275968
            },
            {
              "month": 10,
              "Awarded": 2266115
            },
            {
              "month": 11,
              "Awarded": 3534669
            },
            {
              "month": 12,
              "Awarded": 589528
            }
          ]
        },
        {
          "year": 2005,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 5028787
            },
            {
              "month": 2,
              "Awarded": 1960182
            },
            {
              "month": 3,
              "Awarded": 2415898
            },
            {
              "month": 4,
              "Awarded": 1896791
            },
            {
              "month": 5,
              "Awarded": 3153260
            },
            {
              "month": 6,
              "Awarded": 2695754
            },
            {
              "month": 7,
              "Awarded": 2674122
            },
            {
              "month": 8,
              "Awarded": 4177504
            },
            {
              "month": 9,
              "Awarded": 232634
            },
            {
              "month": 10,
              "Awarded": 3127226
            },
            {
              "month": 11,
              "Awarded": 321012
            },
            {
              "month": 12,
              "Awarded": 1421060
            }
          ]
        },
        {
          "year": 2006,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 2536018
            },
            {
              "month": 2,
              "Awarded": 2295891
            },
            {
              "month": 3,
              "Awarded": 3606973
            },
            {
              "month": 4,
              "Awarded": 2461659
            },
            {
              "month": 5,
              "Awarded": 2133369
            },
            {
              "month": 6,
              "Awarded": 3568985
            },
            {
              "month": 7,
              "Awarded": 4326996
            },
            {
              "month": 8,
              "Awarded": 3663598
            },
            {
              "month": 9,
              "Awarded": 4553005
            },
            {
              "month": 10,
              "Awarded": 1055801
            },
            {
              "month": 11,
              "Awarded": 4145864
            },
            {
              "month": 12,
              "Awarded": 2229323
            }
          ]
        },
        {
          "year": 2007,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 2801738
            },
            {
              "month": 2,
              "Awarded": 2432652
            },
            {
              "month": 3,
              "Awarded": 3541776
            },
            {
              "month": 4,
              "Awarded": 1553440
            },
            {
              "month": 5,
              "Awarded": 3123618
            },
            {
              "month": 6,
              "Awarded": 3928379
            },
            {
              "month": 7,
              "Awarded": 1591151
            },
            {
              "month": 8,
              "Awarded": 1252307
            },
            {
              "month": 9,
              "Awarded": 3098607
            },
            {
              "month": 10,
              "Awarded": 5097398
            },
            {
              "month": 11,
              "Awarded": 3121158
            },
            {
              "month": 12,
              "Awarded": 1791324
            }
          ]
        },
        {
          "year": 2008,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 1973532
            },
            {
              "month": 2,
              "Awarded": 2040280
            },
            {
              "month": 3,
              "Awarded": 974853
            },
            {
              "month": 4,
              "Awarded": 708338
            },
            {
              "month": 5,
              "Awarded": 3852399
            },
            {
              "month": 6,
              "Awarded": 3538705
            },
            {
              "month": 7,
              "Awarded": 2905739
            },
            {
              "month": 8,
              "Awarded": 5352672
            },
            {
              "month": 9,
              "Awarded": 3673416
            },
            {
              "month": 10,
              "Awarded": 2113384
            },
            {
              "month": 11,
              "Awarded": 2593612
            },
            {
              "month": 12,
              "Awarded": 3232539
            }
          ]
        },
        {
          "year": 2010,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 4305893
            },
            {
              "month": 2,
              "Awarded": 3099544
            },
            {
              "month": 3,
              "Awarded": 4031287
            },
            {
              "month": 4,
              "Awarded": 3995118
            },
            {
              "month": 5,
              "Awarded": 5092180
            },
            {
              "month": 6,
              "Awarded": 4555151
            },
            {
              "month": 7,
              "Awarded": 5299283
            },
            {
              "month": 8,
              "Awarded": 5201370
            },
            {
              "month": 9,
              "Awarded": 3855752
            },
            {
              "month": 10,
              "Awarded": 5371608
            },
            {
              "month": 11,
              "Awarded": 4195278
            },
            {
              "month": 12,
              "Awarded": 2202327
            }
          ]
        },
        {
          "year": 2012,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 4665296
            },
            {
              "month": 2,
              "Awarded": 5746549
            },
            {
              "month": 3,
              "Awarded": 5494151
            },
            {
              "month": 4,
              "Awarded": 3543459
            },
            {
              "month": 5,
              "Awarded": 9514551
            },
            {
              "month": 6,
              "Awarded": 4454488
            },
            {
              "month": 7,
              "Awarded": 1805431
            },
            {
              "month": 8,
              "Awarded": 5221409
            },
            {
              "month": 9,
              "Awarded": 6995809
            },
            {
              "month": 10,
              "Awarded": 4351877
            },
            {
              "month": 11,
              "Awarded": 979262
            },
            {
              "month": 12,
              "Awarded": 931879
            }
          ]
        },
        {
          "year": 2013,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 1707576
            },
            {
              "month": 2,
              "Awarded": 1576884
            },
            {
              "month": 3,
              "Awarded": 5119993
            },
            {
              "month": 4,
              "Awarded": 129395
            },
            {
              "month": 5,
              "Awarded": 7739737
            },
            {
              "month": 6,
              "Awarded": 2759467
            },
            {
              "month": 7,
              "Awarded": 181330
            },
            {
              "month": 8,
              "Awarded": 15700
            },
            {
              "month": 9,
              "Awarded": 179656
            },
            {
              "month": 10,
              "Awarded": 86550
            },
            {
              "month": 11,
              "Awarded": 210740
            },
            {
              "month": 12,
              "Awarded": 28065
            }
          ]
        },
        {
          "year": 2014,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 228050
            },
            {
              "month": 2,
              "Awarded": 90655
            },
            {
              "month": 3,
              "Awarded": 526097
            },
            {
              "month": 4,
              "Awarded": 2818857
            },
            {
              "month": 5,
              "Awarded": 144095
            },
            {
              "month": 6,
              "Awarded": 1289875
            },
            {
              "month": 7,
              "Awarded": 1491160
            },
            {
              "month": 8,
              "Awarded": 1475180
            },
            {
              "month": 9,
              "Awarded": 1475180
            },
            {
              "month": 10,
              "Awarded": 1489860
            },
            {
              "month": 11,
              "Awarded": 1064455
            },
            {
              "month": 12,
              "Awarded": 1064455
            }
          ]
        },
        {
          "year": 2015,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 842960
            },
            {
              "month": 2,
              "Awarded": 892960
            },
            {
              "month": 3,
              "Awarded": 1133752
            },
            {
              "month": 4,
              "Awarded": 842960
            },
            {
              "month": 5,
              "Awarded": 828350
            },
            {
              "month": 6,
              "Awarded": 857456
            },
            {
              "month": 7,
              "Awarded": 686455
            },
            {
              "month": 8,
              "Awarded": 643937
            },
            {
              "month": 9,
              "Awarded": 646078
            },
            {
              "month": 10,
              "Awarded": 502414
            },
            {
              "month": 11,
              "Awarded": 718715
            },
            {
              "month": 12,
              "Awarded": 323039
            }
          ]
        },
        {
          "year": 2017,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 5410
            },
            {
              "month": 2,
              "Awarded": 276390
            },
            {
              "month": 3,
              "Awarded": 727829
            },
            {
              "month": 4,
              "Awarded": 299599
            },
            {
              "month": 5,
              "Awarded": 322809
            },
            {
              "month": 6,
              "Awarded": 276390
            },
            {
              "month": 8,
              "Awarded": 571479
            },
            {
              "month": 9,
              "Awarded": 62629
            },
            {
              "month": 10,
              "Awarded": 7689942
            },
            {
              "month": 11,
              "Awarded": 626344
            },
            {
              "month": 12,
              "Awarded": 20457222
            }
          ]
        },
        {
          "year": 2019,
          "MonthYear": [
            {
              "month": 1,
              "Awarded": 68151
            },
            {
              "month": 2,
              "Awarded": 1637204
            },
            {
              "month": 3,
              "Awarded": 2149063
            },
            {
              "month": 4,
              "Awarded": 2348262
            },
            {
              "month": 5,
              "Awarded": 2026101
            },
            {
              "month": 6,
              "Awarded": 913621
            },
            {
              "month": 7,
              "Awarded": 451284
            },
            {
              "month": 8,
              "Awarded": 1132075
            },
            {
              "month": 9,
              "Awarded": 760037
            }
          ]
        }
      ],
      "ProcurementPractices": [
        {
          "month":3,
          "MarketSaving":46532876,
          "SingleSource":1268487,
          "LowBidNotAccepted":1369455
          },
          {
          "month":4,
          "MarketSaving":42615189,
          "SingleSource":159898,
          "LowBidNotAccepted":3389174
          },
          {
          "month":5,
          "MarketSaving":50329178,
          "SingleSource":178053,
          "LowBidNotAccepted":2030525
          },
          {
          "month":8,
          "MarketSaving":40668684,
          "SingleSource":40543,
          "LowBidNotAccepted":1948857
          }

      ],
      "CostSaving": [
        {
          "month": 3,
          "AwarderVolume": 49194024,
          "MarketSaving": 39194024
        },
        {
          "month": 4,
          "AwarderVolume": 46164260,
          "MarketSaving": 26164260
        },
        {
          "month": 5,
          "AwarderVolume": 52537756,
          "MarketSaving": 32537756
        },
        {
          "month": 8,
          "AwarderVolume": 42654247,
          "MarketSaving": 12654247
        }
      ]
    }
  ];
  private monthData = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


  ngOnInit() {
    var group = Object.keys(this.apiData[0]).filter(function (d) { return d !== "Id" });
    debugger
    var date = new Date();
    var month = date.getMonth() - 6;
    var lastMonth = month + 6;
    let lastSixMonth = [];
    //get last 6 months
    for (var i = month; i < lastMonth; i++) {
      lastSixMonth.push(this.monthData[month])
      month++;
    };
    this.yearOverYearData = this.apiData[0].YearOverYear;
    if (this.apiData[0].ProcurementPractices.length > 0) {
      this.procurementPracticesData = this.apiData[0].ProcurementPractices;
    }
    else {
      lastSixMonth.forEach((m, i) => {
        const monthIndex = this.monthData.indexOf(m) + 1;
        this.procurementPracticesData.push({ month: monthIndex, MarketSaving: 0, SingleSource: 0, LowBidNotAccepted: 0 });
      })
      this.procurementPracticesData= this.procurementPracticesData;
    }
    if (  this.apiData[0].CostSaving.length > 0) {
      this.costSaving = this.apiData[0].CostSaving;
    }
    else {
      lastSixMonth.forEach((m, i) => {
        const monthIndex = this.monthData.indexOf(m) + 1;
        this.costSaving.push({ month: monthIndex, AwarderVolume: 0, MarketSaving: 0 });
      })
      this.costSaving =  this.costSaving ;
    }

    this.lineChartWidth = 1745;
    this.lineChartHeight = 250;
    this.barChartWidth = 656;
    this.barChartHeight = 250;
    this.lineChartId = "lineChart1"
    this.barChartId1 = "barChart1";
    this.barChartId2 = "barChart2";
  }
}
