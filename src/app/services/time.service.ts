import { Injectable } from '@angular/core';

import {FiscalYear} from './../model/fiscalYear';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  //Current fiscal year information
  private _fiscalYear: FiscalYear = {fiscalYearStartDate:"", fiscalYearEndDate:""};


  set fiscalYear(value: FiscalYear) {
    this._fiscalYear.fiscalYearStartDate = value.fiscalYearStartDate;
    this._fiscalYear.fiscalYearEndDate = value.fiscalYearEndDate;
  }



  get fiscalYear(): FiscalYear {
    return this._fiscalYear;
  }

 


  //Creates a time range in format eg 'Jul 2019' looking back a specific number of months
  createTimeRange(currentTime:moment.Moment, monthLookback?:number): Array<string> {
    let timeRange = [];

   // const baseTimeDate: string = moment(currentTime).toString();
   const baseTimeDate: string = currentTime.format("MMM YYYY");

   
 
    //Create specified number of months 
    for(let i = (monthLookback) ? monthLookback : 11; i>0; i--) 
   
      
       timeRange.push(moment(currentTime,"YYYY-MM-DD").subtract(i,'months').format('MMM YYYY'));
    // timeRange.push(currentTime.subtract(i,'months').format('MMM YYYY'));

    timeRange.push(baseTimeDate);
    return timeRange

  }


  //Calculate and return moment dates corresponding to current fiscal year dates.  Oct 1, 20XX - Sep 30, 20XX
  getCurrentFiscalYearDates() : FiscalYear {

    var current_fiscal_year_start;
    var current_fiscal_year_end

    if (moment().quarter() == 4) {
       current_fiscal_year_start = moment().month('October').startOf('month');
       current_fiscal_year_end = moment().add(1,'year').month('September').endOf('month');                  
      
    } else {
      current_fiscal_year_start = moment().subtract(1,'year').month('October').startOf('month');
      current_fiscal_year_end = moment().month('September').endOf('month');                   
      
    };

    this.fiscalYear = { fiscalYearStartDate: current_fiscal_year_start.toISOString(), fiscalYearEndDate: current_fiscal_year_end.toISOString() };

    return { fiscalYearStartDate: current_fiscal_year_start.toISOString(), fiscalYearEndDate: current_fiscal_year_end.toISOString() };
  } //getCurrentFiscalYear



 
 subtractYearFromDate(baseDate: string): string {
    // return moment(baseDate).subtract(1,'years').format("YYYY-MM-DD:THH:mm:ss");
    return moment(baseDate).subtract(1,'years').toISOString();
  }

  //Return a string date in the format 'Jan 2019' / 'MMM YYYY'
  getDateFormatForChart(date:string): string {
      return moment(date).format("MMM YYYY");
  }

  //Returns the current fiscal year as YY
  getCurrentPhysicalYear(): string {
    return moment().format("YYYY");
  }

  
  /* Returns true/false if the date is within a previous range from previous Monday to previous Sunday (inclusive).
   * Example:  Today is 5/11/2020.  Function returns true if this date falls  between 5/4/2020 and 5/10/2020.
   */
  dateIsInPreviousWeekInterval(date:string): boolean {

    const endSunday: moment.Moment = moment().day(0);
    const startMonday: moment.Moment = moment().day(-6);
    return moment(date).isBetween(startMonday,endSunday,'day','[]');


  }

 // Returns true/false if the date falls within the previous year,
  dateIsInTrailingYearInterval(date:string): boolean {

    return moment.duration(moment().diff(moment(date))).as('years') <= 1;
  }

} //TimeService
