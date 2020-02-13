import { Component, OnInit, Input } from '@angular/core';
//import { DataService } from './../../services/data.service';
//import { DataService } from './../../services/data.service';

//import { ChartsModule} from 'ng2-charts';

//import { Award } from './../../model/award';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
 // export class ChartsComponent {

 
  @Input() chartLabels: Array<string>;
  @Input() chartData: Object;

  //works static chartLabels: Array<string> = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  
  lineChartType: string = "line"

  //The data that is actually displayed in the chart.  This is derived from the chartData object passed into the component.
  //The chartData object contains properties completeCount and completionDays
  //Static worked : chartDataToDisplay: Array<Object> = [ {data: [1,2] , label:"Award Average Days to Completion" } ];
  chartDataToDisplay: Array<Object> = [];
  

  options = {
    legend: { display:true, position:"bottom",
              labels: {boxWidth:0}
         }


   }


  constructor() { }

  ngOnInit() {

    console.log("ngoninit: charts.components chartLabels:",this.chartLabels);
    console.log("ngoninit: charts.components chartData:",this.chartData);

  

    

  /*  this.chartLabels.forEach(monthDate => {

      if (this.chartData[monthDate].completeCount == 0)
        this.chartDataToDisplay.push(0);
      else
        this.chartDataToDisplay.push(Math.ceil(this.chartData[monthDate].completionDays/this.chartData[monthDate].completeCount));
    })  */


  //works  this.chartDataToDisplay = [{ data: [1,2,3,4,5,6,7,8,9,10,11,12] , label:"Award Average Days to Completion" }]
  this.chartDataToDisplay = [{ data: this.chartData , label:"Award Average Days to Completion" }]
 
 }

  
  
}
