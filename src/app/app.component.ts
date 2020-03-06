import { Component, OnInit } from '@angular/core';
import { environment } from './../environments/environment';
//import { ChartsComponent } from './components/charts.component'
import {DataService} from './services/data.service';

//import {ConfigProviderService} from  './services/config-provider.service';


import { ChartsComponent } from './components/charts/charts.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  
  chartData : Object;
  chartLabels;

  //Raw data for completed awards. 
  rawCompleteChartData: Object;
  rawBoardingChartData: Object;
  rawQCChartData: Object;


  //Processed data used to render award completed days chart
  awardCompleteChartData: Array<number> =[];

  //Processed data used to render boarding days chart for completed awards
  awardBoardingChartData: Array<number> =[];


  //Processed data used to render QC days chart for completed awards
  awardQCChartData: Array<number> = [];
 
 //Chart legends
  chartLegends = {complete:"Award Average Days To Completion", boarding:"Award Boarding Days To Completion", qc:"Award QC Days To Completion"};


  //Chart descriptions
  chartDescriptions = {complete:"Average time in days of all awards having a valid accepted and completed timestamp in which the completed date is within the past year.",
                       boarding:"Average time in days of all complete awards having a valid boarding start and end date in which the completed date is within the past year",
                       qc:"Average time in days of all complete awards having a valid QC start and end date in which the completed date is within the past year"}


  constructor(private dataService: DataService) { }

  ngOnInit() {

   // console.log('app.component doLog from configProviderService is',this.configProviderService.doLog );

    //Grab data to be used from the data service
    this.chartLabels = this.dataService.monthGrid;
    this.rawCompleteChartData = this.dataService.completionTimesByMonth;
    this.rawBoardingChartData = this.dataService.boardingCompletionTimesByMonth; 
    this.rawQCChartData = this.dataService.qcCompletionTimesByMonth;

    


    console.log("app.component ngOnInit:", this.chartLabels);

    //For each time lable (MMM YYYY) calculate the average time taken for each category being charted
    this.chartLabels.forEach(monthDate => {

      //Boarding completion time data
      if (this.rawBoardingChartData[monthDate].completeCount == 0)
        this.awardBoardingChartData.push(0);
      else
        this.awardBoardingChartData.push(Math.ceil(this.rawBoardingChartData[monthDate].completionDays / this.rawBoardingChartData[monthDate].completeCount));


      //Completion data for entire award process
      if (this.rawCompleteChartData[monthDate].completeCount == 0)
        this.awardCompleteChartData.push(0);
      else
        this.awardCompleteChartData.push(Math.ceil(this.rawCompleteChartData[monthDate].completionDays / this.rawCompleteChartData[monthDate].completeCount));


      //Completion data for QC
      if (this.rawQCChartData[monthDate].completeCount == 0)
        this.awardQCChartData.push(0);
      else
        this.awardQCChartData.push(Math.ceil(this.rawQCChartData[monthDate].completionDays / this.rawQCChartData[monthDate].completeCount));


    });


  } //ngOnInit

  
} //AppComponent
