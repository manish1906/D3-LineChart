import { Component ,OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'line-chart';
  public myData = [{
    "date": 'January',
    "value1": 400,
    "value2": 300
  },
  {
    "date": 'February',
    "value1": 300,
    "value2": 340
  },
  {
    "date": 'March',
    "value1": 250,
    "value2": 150
  },
  {
    "date": 'April',
    "value1": 450,
    "value2": 500
  },
  {
    "date": 'May',
    "value1": 220,
    "value2": 250
  },
  {
    "date": 'June',
    "value1": 210,
    "value2": 300
  },
  {
    "date": 'July',
    "value1": 250,
    "value2": 199
  },
  {
    "date": 'August',
    "value1": 100,
    "value2": 234
  },
  {
    "date": 'September',
    "value1": 220,
    "value2": 456
  },
  {
    "date": 'October',
    "value1": 360,
    "value2": 143
  },
  {
    "date": 'November',
    "value1": 234,
    "value2": 335
  },

  {
    "date": 'December',
    "value1": 290,
    "value2": 170
  }];

}
