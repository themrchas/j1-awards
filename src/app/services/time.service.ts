import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }


  //Creates a time range in format eg 'Jul 2019' looking back a specific number of months
 // createTimeRange(currentTime:string, monthLookback?:number): Array<string> {
  createTimeRange(currentTime:moment.Moment, monthLookback?:number): Array<string> {
    let timeRange = [];

    //const baseTimeDate: string = moment(currentTime).toString();
 
    //Create specified number of months 
    for(let i = (monthLookback) ? monthLookback : 12; i>0; i--) 
   
      
     //   timeRange.push(moment(currentTime,"YYYY-MM-DD").subtract(i,'months').format('MMM YYYY'));
     timeRange.push(currentTime.subtract(i,'months').format('MMM YYYY'));

    return timeRange


  }

 //// subtractYearFromDate(baseDate: moment.Moment): string {
 //   return baseDate.subtract(1,'years').format("YYYY-MM-DD");
 // }
 subtractYearFromDate(baseDate: string): string {
    // return moment(baseDate).subtract(1,'years').format("YYYY-MM-DD:THH:mm:ss");
    return moment(baseDate).subtract(1,'years').toISOString();
  }

  //Return a string dtae in the format 'Jan 2019' / 'MMM YYYY'
  getDateFormatForChart(date:string): string {
      return moment(date).format("MMM YYYY");
  }


} //TimeService
