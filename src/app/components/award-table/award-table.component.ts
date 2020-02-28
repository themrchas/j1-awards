import { Component, OnInit, Input } from '@angular/core';

import { DataService } from './../../services/data.service';
import { TimeService } from './../../services/time.service';


import * as _ from 'lodash';

@Component({
  selector: 'app-award-table',
  templateUrl: './award-table.component.html',
  styleUrls: ['./award-table.component.scss']
})
export class AwardTableComponent implements OnInit {

  //The complete cartesian product of awards x units filled out with counts.
  awardBreakDown: Object;

  //Unit list to be displayed in the matrix
  unitsList: Array<string>;

  //Award types to be displayed in the matrix
  awardTypes: Array<string>

  //Total number of awards to be displayed in the matrix
  awardCount: number;

  matrixTitle: string;


  constructor(private dataService: DataService, private timeService: TimeService) { }

  ngOnInit() {

    //The complete cartesian product of awards x units filled out with counts.
    this.awardBreakDown = this.dataService.awardBreakDown;

    console.log('award-table.component: Award breakdown is', this.awardBreakDown);
    this.unitsList = this.dataService.unitsList;

    this.awardTypes = this.dataService.awardTypesList;

    this.awardCount = this.dataService.getTotalMatrixAwardsCount();

    this.matrixTitle = this.timeService.getCurrentPhysicalYear()+" Award Break Down"

    
  } //ngOnInit

} //AwardTableComponent
