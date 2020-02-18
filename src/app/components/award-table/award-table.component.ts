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
 awardCount: number;


//The sum of the total number of awards calculated among all rows.  This is calculated on the fly in function calculateAwardTotalRow below.
 // totalAwardsRow:number = 0;

 //The sum of the total number of awards calculated columnar.  This is calculated on the fly in function calculateAwardTotalCol below.
 // totalAwardsCol: number = 0;
  
  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.awardBreakDown = this.dataService.awardBreakDown;
    //this.totalAwards = this.dataService.getTotalAwards();
        

    console.log('Award brekdown is', this.awardBreakDown);
    this.unitsList  = this.dataService.unitsList;
   // this.unitsList.unshift('Type/Unit')
    this.awardTypes = this.dataService.awardTypesList;

    this.awardCount = this.dataService.getTotalMatrixAwardsCount();


}

/*private calculateAwardTotalRow(award:string) : number {

  let rowTotal = _.reduce(this.awardBreakDown ,function(result,val,key) {
    return result + val[award];
  },0); 

  this.totalAwardsRow+=rowTotal;

  return rowTotal;






  //return  _.reduce(this.awardBreakDown ,function(result,val,key) {
   // console.log('val is',val,'and key is',key, 'and award is', award);
 	//	return result + val[award];
//},0); 

 // return testReduce;

} */


/* private calculateAwardTotalCol(unit:string) : number {

  //let colTotal = _.reduce(this.awardBreakDown[unit],function(result,val) {
               
  //  return result + val;
//},0); 

console.log('award-table: unit ',unit,':totalAwardCol:',this.totalAwardsCol);

return _.reduce(this.awardBreakDown[unit],function(result,val) {
 
              return result + val;
    },0); 

 // return testReduce;

 //console.log('award-table:  unit:colTotal ',unit,":",colTotal,'totalAwardCol:',this.totalAwardsCol);

 //this.totalAwardsCol+=colTotal;

 //return colTotal;
  
  
} */



}
