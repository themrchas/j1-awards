import { Component, OnInit, Input } from '@angular/core';

import { DataService } from './../../services/data.service';


@Component({
  selector: 'app-award-table',
  templateUrl: './award-table.component.html',
  styleUrls: ['./award-table.component.scss']
})
export class AwardTableComponent implements OnInit {
 // @Input() awards: any;

 awardBreakDown: Object;
 unitsList : Array<string>;
 awardTypes: Array<string>
  
  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.awardBreakDown = this.dataService.getAwardBreakdown();

    console.log('Award brekdown is', this.awardBreakDown);
    this.unitsList  = this.dataService.unitsList;
    this.awardTypes = this.dataService.awardTypesList;


}

}
