import { Component, OnInit } from '@angular/core';
import { environment } from './../environments/environment';
//import { ChartsComponent } from './components/charts.component'
import {DataService} from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'j1-charts';

 
  chartData : Object;
  chartLabels;

  //Raw data for completed awards.  This will be processed.
  rawCompleteChartData: Object;
  rawBoardingChartData: Object;


  //Processed and sent to chart 
  awardCompleteChartData: Array<number> =[];

  awardBoardingChartData: Array<number> =[];
 

  listWeb:String = environment.listWeb;


  constructor(private dataService: DataService) { }

  ngOnInit() {

    
    this.chartLabels = this.dataService.monthGrid;
    this.rawCompleteChartData = this.dataService.completionTimesByMonth;
    this.rawBoardingChartData = this.dataService.boardingCompletionTimesByMonth; 


    console.log("app.component ngOnInit:", this.chartLabels);

      this.chartLabels.forEach(monthDate => {

        //Board data
        if (this.rawBoardingChartData[monthDate].completeCount == 0)
          this.awardBoardingChartData.push(0);
        else
          this.awardBoardingChartData.push(Math.ceil(this.rawBoardingChartData[monthDate].completionDays/this.rawBoardingChartData[monthDate].completeCount));


        //Completion data
      if (this.rawCompleteChartData[monthDate].completeCount == 0)
        this.awardCompleteChartData.push(0);
      else
        this.awardCompleteChartData.push(Math.ceil(this.rawCompleteChartData[monthDate].completionDays/this.rawCompleteChartData[monthDate].completeCount));
    });

    console.log("app.component ngoninit awardCompleteChartData", this.awardCompleteChartData);


      
   


    


  // this.chartLabels =  ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].reverse();
  

  // this.awardCompleteChartData = this.dataService.completionTimesByMonth;
   // this.awardBoardingChartData = this.dataService.boardingCompletionTimesByMonth;

   //works static this.chartData = [1,2,3,4,5,6,7,8,9,10,11,12].reverse();


  }

}
