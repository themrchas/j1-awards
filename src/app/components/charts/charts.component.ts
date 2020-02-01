import { Component, OnInit } from '@angular/core';
//import { DataService } from './../../services/data.service';
import { DataService } from './../../services/data.service';

//import { Award } from './../../model/award';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  awardBreakdown: Object;
  unitsList : Array<string>;
  awardTypes: Array<string>
  //awards<Array<Award>> = null

  //testAwards: any = { name:"Beavis", occupation:"Slacker"};

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.awardBreakdown = this.dataService.awardBreakDown;
    this.unitsList  = this.dataService.unitsList;
    this.awardTypes = this.dataService.awardTypesList;

 
  }

  
  
}
