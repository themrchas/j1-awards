import { Component, OnInit, Input } from '@angular/core';

import { DataService } from './../../services/data.service';

import * as _ from 'lodash';

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

 private totalAwards:number;
  
  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.awardBreakDown = this.dataService.getAwardBreakdown();
    this.totalAwards = this.dataService.getTotalAwards();
        

    console.log('Award brekdown is', this.awardBreakDown);
    this.unitsList  = this.dataService.unitsList;
   // this.unitsList.unshift('Type/Unit')
    this.awardTypes = this.dataService.awardTypesList;


}

private calculateAwardTotalRow(award:string) : number {

  return  _.reduce(this.awardBreakDown ,function(result,val,key) {
   // console.log('val is',val,'and key is',key, 'and award is', award);
 		return result + val[award];
},0); 

 // return testReduce;

}


private calculateAwardTotalCol(unit:string) : number {

 return _.reduce(this.awardBreakDown[unit],function(result,val) {
               
              return result + val;
    },0); 

 // return testReduce;
  
  
}



}
