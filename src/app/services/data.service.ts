
import { tap, map } from 'rxjs/operators';
import { Observable , forkJoin,  of, from } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { SpService } from "./sp.service";
import { ConfigProviderService } from './config-provider.service';

import { TimeService } from "./time.service";

import {Award} from './../model/award';

import * as _  from 'lodash';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

//A middleware class that bridges the SharePoint specific calls and components that require SharePoint data that has been organized in some logical fashion
export class DataService {

  private _awardTypesList: Array<string>;
  private _unitsList:  Array<string>;

  //List of all awards that have been read in and saved as Award object which have a complete date of the past 12 months.
  //This data is used for the matrix numbers as well as the data for awards in various stages of progress.
  //This data is also used for the completion date and boarding 12 month lookback graphs.
   private _awardsForMatrix: Array<Award>; 

   
  //The complete cartesian product of awards x units filled out with counts.  
  private _awardBreakDown: any;

  //Contains a breakdown of awards that are currently in some step of processing and are not counted in the matrix stats.
  //This info is categorized as 'New Submissions', 'J1QC', 'Ready for Boarding', etc.
  private _awardsInProcessing: Object = {};
  

  //Object consiting of 'Month Year' (MMM YYYY) as key and properties  { "Jan 2001": { completeCount:5, completionDays:4 } }
  //Property completeCount is the number of awards completed and completionDays is the sum of time it took all awards to complete
  private _completionTimesByMonth: Object ={};

  //Object consiting of 'Month Year' (MMM YYYY) as key and properties  { "Jan 2001": { completeCount:5, completionDays:4 } }
  //Property completeCount is the number of awards completed in which boarding is completed and completionDays is the sum of time it took for boarding process
  private _boardingCompletionTimesByMonth: Object ={};

  //Object consiting of 'Month Year' (MMM YYYY) as key and properties  { "Jan 2001": { completeCount:5, completionDays:4 } } 
  //Property completeCount is the number of awards completed and in which QC is completed and completionDays is the sum of time it took all awards to QC awards
  private _qcCompletionTimesByMonth: Object = {};
  
  //Array consiting of entries of "Jan 2001" - "MMM YYYY"
  private _monthGrid: Array<string>;


  //Categories for awards that are not complete and in some state of processing
  private _inProgressTypes = ["New Submissions", "J1QC", "Ready for Boarding","Board Members","CMD GRP","J1 Final Stages","Unknown","Total"]

 

  get awardTypesList() {
    return this._awardTypesList;
  }

  set awardTypesList(value:Array<string>) {
    this._awardTypesList = value;
  }

   get unitsList() {
    return this._unitsList;
  }

  set unitsList(value:Array<string>) {
    this._unitsList = value;
  }

  //The breakdown of awards for current year
  get awardBreakDown() {
    return this._awardBreakDown;
  }
  
  //The breakdown of awards for current year
  set awardBreakDown(value:any) {
    this._awardBreakDown = value;
  }

  get awardsForMatrix() {
    return this._awardsForMatrix;
  }

  get completionTimesByMonth() : Object {
    return this._completionTimesByMonth;
  }

  set completionTimesByMonth(value: Object) {
    this._completionTimesByMonth = value;
  }

  get boardingCompletionTimesByMonth() : Object {
    return this._boardingCompletionTimesByMonth;
  }

  set boardingCompletionTimesByMonth(value: Object) {
    this._boardingCompletionTimesByMonth = value;
  }

  get qcCompletionTimesByMonth() : Object {
    return this._qcCompletionTimesByMonth;
  }

  set qcCompletionTimesByMonth(value: Object) {
    this._qcCompletionTimesByMonth = value;
  }

  set monthGrid(value: Array<string>) {
    this._monthGrid = value;
  }

  get monthGrid() : Array<string> {
    return this._monthGrid;
  }

  get awardsInProcessing() : Object {
    return this._awardsInProcessing;
  }

  set awardsInProcessing(value:Object) {
   this._awardsInProcessing = value;
  }

  get inProgressTypes() {
    return this._inProgressTypes;
  }


 // constructor(private spService: SpService, private timeService: TimeService, private config, private configProviderService:ConfigProviderService) { }
 constructor(private spService: SpService, private timeService: TimeService, private configProviderService:ConfigProviderService) { }



 getInitialAwardData() : Observable<any> {

  const defaultInitialDate = moment();

  this.monthGrid = this.timeService.createTimeRange(defaultInitialDate);
  

 // let test = this.timeService.createTimeRange(defaultInitialDate);

 // console.log('array of times is ',test);


  return forkJoin([this.getData(this.timeService.subtractYearFromDate(defaultInitialDate.format('YYYY-MM-DD')),defaultInitialDate.toISOString()), this.getAwardMatrixHeaderInfo()])
  // return forkJoin([this.getData(defaultInitialDate,"2020-01-16T00:00:00Z"), this.getAwardMatrixHeaderInfo()])
 // return forkJoin([this.getData(defaultInitialDate), this.getAwardMatrixHeaderInfo()])
  }


/*
 Creates a logical matrix of award counts, most importantly assigning '0' to any unit/award combinations not 
  found in the data pull.
*/
 analyzeAwardData(): Observable<any> {

  let awardBreakDown: any = {};

    this.configProviderService.config.doLog && console.log('raw data list after initial processing is', this._awardsForMatrix);

    //Grab data identified as to be used in the matrix 
    this._awardsForMatrix.filter(award => award.useInMatrix ).
        forEach(function(processedAward) {
  

      let award: string = (processedAward.awardSubType !== null) ? processedAward.awardSubType : processedAward.awardType;

      //Set the submitting unit
      let unit: string = (processedAward.subOrganization !== null) ? processedAward.subOrganization : processedAward.organization;

      //Create entry if either award type or award type + unit does not exit
      if (!awardBreakDown[unit]) {
          awardBreakDown[unit] = {};
          awardBreakDown[unit][award] = 1;
      }
      else if (!awardBreakDown[unit][award])
          awardBreakDown[unit][award] = 1;
      else
          awardBreakDown[unit][award] =  awardBreakDown[unit][award] + 1;


   
    //  Award.totalAwards++;

  });

console.log('analyzeAwardData: awardBreakDown is',awardBreakDown)
console.log('3awardTypesList is',this.awardTypesList);

//let awardTypesList = this.awardTypesList;

//Any member of the cartesian product units x award types that is blank gets a 0
//this.unitsList.forEach(function(unit) {
  this.unitsList.forEach(unit => {

  awardBreakDown[unit] = awardBreakDown[unit] || {};


  this.awardTypesList.forEach(award =>  {
 // awardTypesList.forEach(function(award) {


    //  if (!Award.awardBreakDown[unit][award])
    awardBreakDown[unit][award] = awardBreakDown[unit][award] || 0;
  })

})


//Initial count of various in-progress award states  'New Submissions', 'J1QC', etc.
this.inProgressTypes.forEach(awardState => {
  this.awardsInProcessing[awardState] = 0;
   
})

//let awardsInProcessing = {};
 //Collate according to in processing type.  Non of these awards are used in the matrix calculations since they are still 'in progress'
this._awardsForMatrix.filter(award => !award.useInMatrix ).
      //  forEach(function(processedAward) {
        forEach(processedAward => {

          //Collate according to in-processing type
          //this.awardsInProcessing[processedAward.awardState] = (this.awardsInProcessing[processedAward.awardState]) ? this.awardsInProcessing[processedAward.awardState]++ : 1
          this.awardsInProcessing[processedAward.awardState]++;
         
        });

  //      this.awardsInProcessing = awardsInProcessing
  this.awardBreakDown = awardBreakDown;
  console.log('awardsInProcessing are',  this.awardsInProcessing);

  //Grab total number of in progress awards
  this.awardsInProcessing['Total'] = _.reduce(this.awardsInProcessing, function(result,val) {return result+val},0);

  //Break down completed awards over past 12 (default) months
  this.categorizeCompletedAwards();

  //Break down completed awards boarding stats over past 12 (defualt) months
  this.categorizeBoardingCompletedAwards();

  this.categorizeQCCompletedAwards();

  return Observable.create(observer => {
   // observer.next('analyzeAward just emitted an an bservable')
  // observer.next(Award.getAwardBreakdown())
  observer.next(awardBreakDown)
    
    })    
 
  }  //analyzeAwardData


  //Grabs data that will be used in the matrix
  getMatrixData(startDate: string): Observable<any> {
    console.log('data.service: Executing getData');
    return this.spService.getData(startDate)
      .pipe(
   //     tap(val => console.log('dataService: tap: spService.getData call returned', val)),
          map(el =>  this._parseAwardJson(el) )  //Can we return an empty value?????????????
       //  map(el => { return this._parseAwardJson(el) } ),
       //     tap(el => console.log('dataService.getData: mapped data in getData is',el))
      )
  }

  
 //Get award data from SharePoint list
  getData(startDate: string, endDate?:string): Observable<any> {
    console.log('data.service: Executing getData');
    return this.spService.getData(startDate,endDate)
      .pipe(
   //     tap(val => console.log('dataService: tap: spService.getData call returned', val)),
          map(el =>  this._parseAwardJson(el) )  //Can we return an empty value?????????????
       //  map(el => { return this._parseAwardJson(el) } ),
       //     tap(el => console.log('dataService.getData: mapped data in getData is',el))
      )


  }

  
  //Grab the matrix headers from SharePoint list
  private getAwardMatrixHeaderInfo():  Observable<any> {
    console.log('data.service: Executing getMatrixHeaders');
    return this.spService.getMatrixHeaders()
      .pipe(
        tap(val => console.log('dataService.getAwardMatrixHeaders: tap: spService.getData call returned', val)),
          map(el =>  this.parseHeaders(el) )
       //  map(el => { return this._parseAwardJson(el) } ),
        //    tap(el => console.log('dataService.getData: mapped data in getData is',el))
      )


  }




   
 //Return a new Award object from each award retreived from data pull
  private _parseAwardJson(awards: any) {
    let processed = awards.d.results.map(function (el) {
      //console.log('dataService._parseAwardJson: el is', el);
    
      return new Award(el);

    })
    //  console.log('_parseAwardJson:el is',awards);
    console.log('dataService: processed awards is', processed);

  //  if (!this.processedAwardsList)  
   //     this.processedAwardsList = [].push(processed);
  //  else
     // this.processedAwardsList.push(processed)

     
     this._awardsForMatrix = processed;


    return processed;

  }


  //From the raw matrix header data create array of unit names, array of award types, and JSON object that will contain unit X award type counts
  private parseHeaders(headers: any) {

    console.log('data.service parseHeaders is', headers);

    let rawUnitData: any;

    //List of actual awards Eg ['JSAM', 'DMSM', etc.]
    let awardTypesList: Array<string>;

    //List of units ['Unit 1', 'Unit 2']
    let unitsList: Array<string>;

    //Award breakdown stats { 'unit' { awardType1: 0, awardType2: 4}}
    let awardBreakDown: any;

    
    //Create lists consisting or ordered units and awards, respectively  
    awardTypesList = _.chain(headers.d.results).filter(['isUnit', false]).sortBy('[AwardOrder]')
      .map('AwardType').value();

    unitsList = _.chain(headers.d.results).filter(['isUnit', true]).sortBy('[UnitOrder]').map('Unit').value();


    console.log('award types are', awardTypesList, ' and units are', unitsList);

    //Create object with keys consiting of call unit values
    awardBreakDown = _.chain(headers.d.results).filter(['isUnit', true]).keyBy('Unit').mapValues(function () { return {} }).value();

    console.log('unitsObject is ...', awardBreakDown);



    //Add each award as property to each object keyed by unit
    _.each(awardBreakDown, function (obj) {
      // console.log('key is', el);
      _.each(awardTypesList, function (at) { /*headerStructure[el][at] = 0;*/

        obj[at] = 0;
      })
      //   console.log('awardType loop is',at);


    });


    this.awardTypesList = awardTypesList;
    this.unitsList = unitsList;
    this.awardBreakDown = awardBreakDown;

    return 'data.service parseHeaders is complete';


  } 

  
 //Return the count of awards used that have been identified to be used in matrix.
  public getTotalMatrixAwardsCount(): number {
    
      return this.awardsForMatrix.filter(award => award.useInMatrix).length;
  }

//Categorize any awards completed in the past 12 months.  12 months is the default based on data fetch.
private categorizeCompletedAwards() {


  this._awardsForMatrix.filter(award => award.useInChartComplete)
    .forEach(award => {

      let monthYear = this.timeService.getDateFormatForChart(award.completionDate);

      this.configProviderService.config.doLog && console.log('data.service.categorizeCompletedAwards - award analyzed is: ',award);

      //Add award to completion metrics
      if (!this.completionTimesByMonth[monthYear])
        this.completionTimesByMonth[monthYear] = { completeCount:1, completionDays:award.completionDays };
      else {
        
        let newCount =   this.completionTimesByMonth[monthYear]['completeCount'] +=1;
        let newCompletionDays = this.completionTimesByMonth[monthYear]['completionDays']+award.completionDays;
        this.completionTimesByMonth[monthYear] = { completeCount:newCount, completionDays:newCompletionDays };
     

      }

     // this.configProviderService.config.doLog && console.log('data.service.categorizeCompletedAwards: this.completionTimesByMonth is now', this.completionTimesByMonth.valueOf());



    }) //forEach

    //Fill in any 'Month Year' combinations that have no entry 
  this.monthGrid.forEach(monthYear => {
    if (!this.completionTimesByMonth[monthYear]) 
    this.completionTimesByMonth[monthYear] = { completeCount:0, completionDays:0 };
  });

  this.configProviderService.config.doLog && console.log('categorizeCompletedAwards: this.completionTimesByMonth final', this.completionTimesByMonth);


} //categorizeCompletedAwards

//Grab all of the awards that are complete within past year, have a valid boarding start and boarding complete date
private categorizeBoardingCompletedAwards() {

  
  this._awardsForMatrix.filter(award => award.useInBoardingTimeChart)
  .forEach(award => {

    this.configProviderService.config.doLog && console.log('data.service.categorizeBoardingCompletedAwards - award analyzed is: ',award, 'with boardingDays',award.boardingDays);

    let monthYear = this.timeService.getDateFormatForChart(award.boardingCompletionDate);

    //Add award to completion metrics
    if (!this.boardingCompletionTimesByMonth[monthYear])
      this.boardingCompletionTimesByMonth[monthYear] = { completeCount:1, completionDays:award.boardingDays };
    else {
      
      let newCount =   this.boardingCompletionTimesByMonth[monthYear]['completeCount'] +=1;
      let newBoardingDays = this.boardingCompletionTimesByMonth[monthYear]['completionDays']+award.boardingDays;
      this.boardingCompletionTimesByMonth[monthYear] = { completeCount:newCount, completionDays:newBoardingDays };
   

    }

    
  }) //forEach

 


  //Fill in any 'Month Year' combinations that have no entry 
  this.monthGrid.forEach(monthYear => {
    if (!this.boardingCompletionTimesByMonth[monthYear]) 
    this.boardingCompletionTimesByMonth[monthYear] = { completeCount:0, completionDays:0 };
  });


  this.configProviderService.config.doLog && console.log('data.service.categorizeBoardingCompletedAwards: this.boardingCompletionTimesByMonth final', this.boardingCompletionTimesByMonth);




} //categorizeBoardingCompletedAwards
  

  //Grab all of the awards that are complete within past year, have a valid QC start and boarding QC complete date 
private categorizeQCCompletedAwards() {

  console.log("data.service.categorizeQCCompleteAwards: this._awardsForMatrix:",this._awardsForMatrix ); 

  //Grab awards that are complete and have a valid QC start and QC complete timestamp
  this._awardsForMatrix.filter(award => award.useInQCTimeChart)
  .forEach(award => {

    let monthYear = this.timeService.getDateFormatForChart(award.qcCompletionDate);

    //Add award to completion metrics
    if (!this.qcCompletionTimesByMonth[monthYear])
      this.qcCompletionTimesByMonth[monthYear] = { completeCount:1, completionDays:award.qcDays };
    else {
      
      let newCount =   this.qcCompletionTimesByMonth[monthYear]['completeCount'] +=1;
      let newQCDays = this.qcCompletionTimesByMonth[monthYear]['completionDays']+award.qcDays;
      this.qcCompletionTimesByMonth[monthYear] = { completeCount:newCount, completionDays:newQCDays };
   

    }

   // console.log('categorizeBoardingCompletedAwards: this.boardingCompletionTimesByMonth', this.boardingCompletionTimesByMonth);



  })

  //Fill in any 'Month Year' combinations that have no entry 
  this.monthGrid.forEach(monthYear => {
    if (!this.qcCompletionTimesByMonth[monthYear]) 
    this.qcCompletionTimesByMonth[monthYear] = { completeCount:0, completionDays:0 };
  });


   this.configProviderService.config.doLog && console.log('categorizeQCCompletedAwards: this.qcCompletionTimesByMonth', this.qcCompletionTimesByMonth);


  


}
  


}
