import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { trigger, state, style, transition, animate } from '@angular/animations';

//import $ from 'jquery';




@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
 // export class ChartsComponent {

  @ViewChild("test", {static: true}) test: any;

 
  @Input() chartLabels: Array<string>;
  @Input() chartData: Object;
  @Input() legend: string;
  @Input() chartDescription: string;

  rightArrowIcon: string = "\uf35a";
  leftArrowIcon:string  = "\uf359";

  arrowIcon: string = this.rightArrowIcon;
 
  isCollapsed: boolean = true;
  
  lineChartType: string = "line"

  //The data that is actually displayed in the chart.  This is derived from the chartData object passed into the component.
  //The chartData object contains properties completeCount and completionDays
  //Static worked : chartDataToDisplay: Array<Object> = [ {data: [1,2] , label:"Award Average Days to Completion" } ];
  chartDataToDisplay: Array<Object> = [];
  

  options = {
    legend: { display:true, position:"bottom",
              labels: {boxWidth:0, fontSize:16}
         }
    

   } //options


  constructor() { }

  ngOnInit() {

    console.log("ngoninit: charts.components chartLabels:",this.chartLabels);
    console.log("ngoninit: charts.components chartData:",this.chartData);

  
 
  this.chartDataToDisplay = [{ data: this.chartData , label:this.legend, fill: false, borderColor: "#858481" }]
 
 } //ngOnInit


 //Allows the chart information to be turned on/off.
 toggle() : void {

     if (this.isCollapsed) {
          this.arrowIcon = this.leftArrowIcon;
          this.test.show();
     }
     else {
      this.test.hide();
      this.arrowIcon = this.rightArrowIcon;
     }
     
     this.isCollapsed = !this.isCollapsed;
    
 }


 ngAfterViewInit() {
  
  this.test.hide();
}


  
  
}
