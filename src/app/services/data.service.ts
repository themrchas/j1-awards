
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
  private _unitsList: Array<string>;

  //List of all awards that have been read in and saved as Award object which have a complete date of the past 12 months.
  //This data is used for the matrix numbers as well as the data for awards in various stages of progress.
  //This data is also used for the completion date and boarding 12 month lookback graphs.
  //Note that the function 'doUseInMatrix' will weed out any one-off completed awards in which the award type of organization wasn't completely filled out.
  private _awardsForMatrix: Array<Award>;

  //The complete cartesian product of awards x units filled out with counts.  
  private _awardBreakDown: any;

  //Contains a breakdown of awards that are currently in some step of processing and are not counted in the matrix stats.
  //This info is categorized as 'New Submissions', 'J1QC', 'Ready for Boarding', etc.
  private _awardsInProcessing: Object = {};

  //Object consiting of 'Month Year' (MMM YYYY) as key and properties  { "Jan 2001": { completeCount:5, completionDays:4 } }
  //Property completeCount is the number of awards completed and completionDays is the sum of time it took all awards to complete
  private _completionTimesByMonth: Object = {};

  //Object consiting of 'Month Year' (MMM YYYY) as key and properties  { "Jan 2001": { completeCount:5, completionDays:4 } }
  //Property completeCount is the number of awards completed in which boarding is completed and completionDays is the sum of time it took for boarding process
  private _boardingCompletionTimesByMonth: Object = {};

  //Object consiting of 'Month Year' (MMM YYYY) as key and properties  { "Jan 2001": { completeCount:5, completionDays:4 } } 
  //Property completeCount is the number of awards completed and in which QC is completed and completionDays is the sum of time it took all awards to QC awards
  private _qcCompletionTimesByMonth: Object = {};

  //Array consiting of entries of the type "Jan 2001" - "MMM YYYY"
  private _monthGrid: Array<string>;


  //Categories for awards that are not complete and in some state of processing
  private _inProgressTypes = ["New Submissions", "J1QC", "Ready for Boarding", "Board Members", "CMD GRP", "J1 Final Stages", "Mailed this Week", "Unknown", "Total"];

  private _inProgressDescriptions = {
    "New Submissions": "Awards Pending Review, Pending Review (Resubmit), Accept for Action, Accept for Action - Resubmit, ReQC (Anything in New and J1 Button",
    "J1QC": "Awards in J1 QC or SJS QC state",
    "Ready for Boarding": "Awards ready to be boarded",
    "Board Members" : "Awards currently in boarding process and assigned to a board member",
    "CMD GRP": "Awards in which boarding is complete and waiting for CG's signature",
    "J1 Final Stages": "Complted awards awaiting distribution",
    "Mailed this Week" : "Awards that have been mailed in the current week and have been archived",
    "Unknown": "Awards that do not fall into a category above",
    "Total" : "Total number of awards above"

  }; 

  get awardTypesList() {
    return this._awardTypesList;
  }

  set awardTypesList(value: Array<string>) {
    this._awardTypesList = value;
  }

  get unitsList() {
    return this._unitsList;
  }

  set unitsList(value: Array<string>) {
    this._unitsList = value;
  }

  //The breakdown of awards for current year
  get awardBreakDown() {
    return this._awardBreakDown;
  }

  //The breakdown of awards for current year
  set awardBreakDown(value: any) {
    this._awardBreakDown = value;
  }

  get awardsForMatrix() {
    return this._awardsForMatrix;
  }

  get completionTimesByMonth(): Object {
    return this._completionTimesByMonth;
  }

  set completionTimesByMonth(value: Object) {
    this._completionTimesByMonth = value;
  }

  get boardingCompletionTimesByMonth(): Object {
    return this._boardingCompletionTimesByMonth;
  }

  set boardingCompletionTimesByMonth(value: Object) {
    this._boardingCompletionTimesByMonth = value;
  }

  get qcCompletionTimesByMonth(): Object {
    return this._qcCompletionTimesByMonth;
  }

  set qcCompletionTimesByMonth(value: Object) {
    this._qcCompletionTimesByMonth = value;
  }

  set monthGrid(value: Array<string>) {
    this._monthGrid = value;
  }

  get monthGrid(): Array<string> {
    return this._monthGrid;
  }

  get awardsInProcessing(): Object {
    return this._awardsInProcessing;
  }

  set awardsInProcessing(value: Object) {
    this._awardsInProcessing = value;
  }

  get inProgressTypes() {
    return this._inProgressTypes;
  }

  get inProgressDescriptions() {
    return this._inProgressDescriptions;
  }


  constructor(private spService: SpService, private timeService: TimeService, private configProviderService: ConfigProviderService) { }


  //Get initial award data
  getInitialAwardData(): Observable<any> {

    const defaultInitialDate = moment();

    this.monthGrid = this.timeService.createTimeRange(defaultInitialDate);


    return forkJoin([this.getData(this.timeService.subtractYearFromDate(defaultInitialDate.format('YYYY-MM-DD')), defaultInitialDate.toISOString()), this.getAwardMatrixHeaderInfo()])
    // return forkJoin([this.getData(defaultInitialDate,"2020-01-16T00:00:00Z"), this.getAwardMatrixHeaderInfo()])
    // return forkJoin([this.getData(defaultInitialDate), this.getAwardMatrixHeaderInfo()])
  } //getInitialAwardData


  /*
  Creates a logical matrix of award counts, most importantly assigning '0' to any unit/award combinations not 
  found in the data pull.
  */
  analyzeAwardData(): Observable<any> {

    let awardBreakDown: any = {};

    //Any awards listed in the configProviderService 'miscAwards' property are awards that are to be collected into one metric
    let configProviderMiscAwards: string = (this.configProviderService.config.miscAwards).join('|');
    let miscAwardsRegEx = new RegExp(configProviderMiscAwards);

    this.configProviderService.config.doLog && console.log('raw data list after initial processing is', this._awardsForMatrix);

    this.configProviderService.config.doLog && console.log('data.service.analyzeAwardData ignoring Other awards', this.configProviderService.config.ignoreOtherAwards);



    //Grab data identified as to be used in the matrix 
    this._awardsForMatrix.filter(award => doUseInMatrix(award, this.configProviderService.config.ignoreOtherAwards)).
      forEach(processedAward => {

        let award: string = (processedAward.awardSubType != null) ? processedAward.awardSubType : processedAward.awardType;

        //If we have a misc award, classify it as such
        if (miscAwardsRegEx.test(award)) {
          this.configProviderService.config.doLog && console.log("data.service.analyzeAwardData award number", processedAward.awardNumber, "using Misc for award type:", award);
          award = "MISC";

        }


        //Set the submitting unit
        let unit: string = (processedAward.subOrganization != null) ? processedAward.subOrganization : processedAward.organization;

        this.configProviderService.config.doLog && console.log('data.service.analyzeAwardData processing award with award type', award, 'unit is', unit, 'and processedAward is', processedAward);

        //Create entry if either award type or award type + unit does not exit
        if (!awardBreakDown[unit]) {
          awardBreakDown[unit] = {};
          awardBreakDown[unit][award] = 1;
        }
        else if (!awardBreakDown[unit][award])
          awardBreakDown[unit][award] = 1;
        else
          awardBreakDown[unit][award] = awardBreakDown[unit][award] + 1;


      });

    this.configProviderService.config.doLog && console.log('data.service.analyzeAwardData: awardBreakDown is', awardBreakDown)
    this.configProviderService.config.doLog && console.log('data.service.analyzeAwardData: awardTypesList is', this.awardTypesList);


    //Any member of the cartesian product units x award types that is blank gets a 0
    //this.unitsList.forEach(function(unit) {
    this.unitsList.forEach(unit => {

      awardBreakDown[unit] = awardBreakDown[unit] || {};


      this.awardTypesList.forEach(award => {

        awardBreakDown[unit][award] = awardBreakDown[unit][award] || 0;
      })

    })


    //Initialize count of various in-progress award states  'New Submissions', 'J1QC', etc.
    this.inProgressTypes.forEach(awardState => {
      this.awardsInProcessing[awardState] = 0;

    })


    //Collate according to in-processing type.  Non of these awards are used in the matrix calculations since they are still 'in progress'.
    //As a general rule, any award not used in matrix is 'in-progress' minus any special cases flagged by 'doUseInMatrix'
    this._awardsForMatrix.filter(award => award.useInInprogress).
      forEach(processedAward => {

        //Collate according to in-processing type
        this.awardsInProcessing[processedAward.awardState]++;

      });


    this.awardBreakDown = awardBreakDown;
    this.configProviderService.config.doLog && console.log('awardsInProcessing are', this.awardsInProcessing);

    //Grab total number of in progress awards
    this.awardsInProcessing['Total'] = _.reduce(this.awardsInProcessing, function (result, val) { return result + val }, 0);

    //Break down completed awards over past 12 (default) months
    this.categorizeCompletedAwards();

    //Break down completed awards boarding stats over past 12 (defualt) months
    this.categorizeBoardingCompletedAwards();

    //Break down awards QC stats over past 12 (defualt) months
    this.categorizeQCCompletedAwards();

    return Observable.create(observer => {
      // observer.next('analyzeAward just emitted an an bservable')
      // observer.next(Award.getAwardBreakdown())
      observer.next(awardBreakDown)

    })


    //This function performs a secondary check on whether an award should be included in the 'Award Break Down' matrix.
    //It is put here so that we can get access to user supplied 'Other' award sub award types that are included in the 
    //config file and to be ignored.  This was not explicitly done in Award class definition in order to maintain a separation of concerns such that
    //the Award class does not have the ConfigProviderService injected to get access to 'Other' award subtypes to ignore.
    //
    //In addition, the 'useInMatrix' property of the Award class  will be set to false as required.  This allows this property to be 
    //used in other parts of the app.
    function doUseInMatrix(award: Award, ignoreOtherAwardTypes: Array<string>): boolean {

      let returnVal = award.useInMatrix;

      //Convert the 'Other' award subtypes to a regex acceptable string
      let toIgnore: string = ignoreOtherAwardTypes.join("|");

      let regexIgnore = new RegExp(toIgnore);

      let regexNonAlphaNumeric = /\W/;

      //Do not use award in matrix stats if organization is 'Other' and sub org is not defined
      if (award.organization == "Other" && award.subOrganization == null) {
        console.error("Award '" + award.awardNumber + "' has award organization 'Other' but no sub organization was chosen.  This award will be not be used in award matrix stats.");
        award.useInMatrix = false;
        returnVal = false;
      }
      //Do not use in matrix stats if award type is 'Other' and no award sub type is chosen
      //The match("") is put in to take care of any choice column that is empty but not null
      else if (award.awardType == "Other" && (!award.awardSubType || award.awardSubType.match(regexNonAlphaNumeric))) {
        console.error("Award '" + award.awardNumber + "' has award type 'Other' but no or empty award subtype. This award will be not be used in award matrix stats.");
        award.useInMatrix = false;
        returnVal = false;
      }
      //Do not use in matrix stats if award type is 'Other' and award sub type is found in config file property 'ignoreOtherAwardTypes'
      else if (award.awardType == "Other" && (regexIgnore.test(award.awardSubType))) {
        console.error("Award '" + award.awardNumber + "' has award type 'Other' and award subtype '" + award.awardSubType + "' which is designated as not to be used in config file. This award will be not be used in award matrix stats.");
        award.useInMatrix = false;
        returnVal = false;
      }


      return returnVal;

    } //doUseInMatrix

  }  //analyzeAwardData


  //Grabs data that will be used in the matrix
  getMatrixData(startDate: string): Observable<any> {
    console.log('data.service: Executing getData');
    return this.spService.getData(startDate)
      .pipe(
        //     tap(val => console.log('dataService: tap: spService.getData call returned', val)),
        map(el => this._parseAwardJson(el))  //Can we return an empty value?????????????
        //  map(el => { return this._parseAwardJson(el) } ),
        //     tap(el => console.log('dataService.getData: mapped data in getData is',el))
      )
  } //getMatrixData


  //Get award data from SharePoint list
  getData(startDate: string, endDate?: string): Observable<any> {
    console.log('data.service: Executing getData');
    return this.spService.getData(startDate, endDate)
      .pipe(
        //     tap(val => console.log('dataService: tap: spService.getData call returned', val)),
        map(el => this._parseAwardJson(el))  //Can we return an empty value?????????????
        //  map(el => { return this._parseAwardJson(el) } ),
        //     tap(el => console.log('dataService.getData: mapped data in getData is',el))
      )


  } //getData


  //Grab the matrix headers from SharePoint list
  private getAwardMatrixHeaderInfo(): Observable<any> {
    console.log('data.service: Executing getMatrixHeaders');
    return this.spService.getMatrixHeaders()
      .pipe(
        tap(val => this.configProviderService.config.doLog && console.log('dataService.getAwardMatrixHeaders: tap: spService.getData call returned', val)),
        map(el => this.parseHeaders(el))
        //  map(el => { return this._parseAwardJson(el) } ),
        //    tap(el => console.log('dataService.getData: mapped data in getData is',el))
      )


  } //getAwardMatrixHeaderInfo





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

  } //_parseAwardJson


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


  }  //parseHeaders


  //Return the count of awards used that have been identified to be used in matrix.
  public getTotalMatrixAwardsCount(): number {
    return this.awardsForMatrix.filter(award => award.useInMatrix).length;
  } //getTotalMatrixAwardsCount

  //Categorize any awards completed in the past 12 months.  12 months is the default based on data fetch.
  private categorizeCompletedAwards() {


    this._awardsForMatrix.filter(award => award.useInChartComplete)
      .forEach(award => {

        let monthYear = this.timeService.getDateFormatForChart(award.completionDate);

        this.configProviderService.config.doLog && console.log('data.service.categorizeCompletedAwards - award analyzed is: ', award);

        //Add award to completion metrics
        if (!this.completionTimesByMonth[monthYear])
          this.completionTimesByMonth[monthYear] = { completeCount: 1, completionDays: award.completionDays };
        else {

          let newCount = this.completionTimesByMonth[monthYear]['completeCount'] += 1;
          let newCompletionDays = this.completionTimesByMonth[monthYear]['completionDays'] + award.completionDays;
          this.completionTimesByMonth[monthYear] = { completeCount: newCount, completionDays: newCompletionDays };


        }


      }) //forEach

    //Fill in any 'Month Year' combinations that have no entry 
    this.monthGrid.forEach(monthYear => {
      if (!this.completionTimesByMonth[monthYear])
        this.completionTimesByMonth[monthYear] = { completeCount: 0, completionDays: 0 };
    });

    this.configProviderService.config.doLog && console.log('categorizeCompletedAwards: this.completionTimesByMonth final', this.completionTimesByMonth);


  } //categorizeCompletedAwards

  //Grab all of the awards that are complete within past year and have a valid boarding start and boarding complete date
  private categorizeBoardingCompletedAwards() {


    this._awardsForMatrix.filter(award => award.useInBoardingTimeChart)
      .forEach(award => {

        this.configProviderService.config.doLog && console.log('data.service.categorizeBoardingCompletedAwards - award analyzed is: ', award, 'with boardingDays', award.boardingDays);

        let monthYear = this.timeService.getDateFormatForChart(award.boardingCompletionDate);

        //Add award to completion metrics
        if (!this.boardingCompletionTimesByMonth[monthYear])
          this.boardingCompletionTimesByMonth[monthYear] = { completeCount: 1, completionDays: award.boardingDays };
        else {

          let newCount = this.boardingCompletionTimesByMonth[monthYear]['completeCount'] += 1;
          let newBoardingDays = this.boardingCompletionTimesByMonth[monthYear]['completionDays'] + award.boardingDays;

          this.boardingCompletionTimesByMonth[monthYear] = { completeCount: newCount, completionDays: newBoardingDays };


        }

      }) //forEach


    //Fill in any 'Month Year' combinations that have no entry 
    this.monthGrid.forEach(monthYear => {
      if (!this.boardingCompletionTimesByMonth[monthYear])
        this.boardingCompletionTimesByMonth[monthYear] = { completeCount: 0, completionDays: 0 };
    });


    this.configProviderService.config.doLog && console.log('data.service.categorizeBoardingCompletedAwards: this.boardingCompletionTimesByMonth final', this.boardingCompletionTimesByMonth);


  } //categorizeBoardingCompletedAwards


  //Grab all of the awards that are complete within past year, have a valid QC start and boarding QC complete date 
  private categorizeQCCompletedAwards() {

    this.configProviderService.config.doLog && console.log("data.service.categorizeQCCompleteAwards: this._awardsForMatrix:", this._awardsForMatrix);

    //Grab awards that are complete and have a valid QC start and QC complete timestamp
    this._awardsForMatrix.filter(award => award.useInQCTimeChart)
      .forEach(award => {

        let monthYear = this.timeService.getDateFormatForChart(award.qcCompletionDate);

        //Add award to completion metrics
        if (!this.qcCompletionTimesByMonth[monthYear])
          this.qcCompletionTimesByMonth[monthYear] = { completeCount: 1, completionDays: award.qcDays };
        else {

          let newCount = this.qcCompletionTimesByMonth[monthYear]['completeCount'] += 1;
          let newQCDays = this.qcCompletionTimesByMonth[monthYear]['completionDays'] + award.qcDays;
          this.qcCompletionTimesByMonth[monthYear] = { completeCount: newCount, completionDays: newQCDays };


        }

      })

    //Fill in any 'Month Year' combinations that have no entry 
    this.monthGrid.forEach(monthYear => {
      if (!this.qcCompletionTimesByMonth[monthYear])
        this.qcCompletionTimesByMonth[monthYear] = { completeCount: 0, completionDays: 0 };
    });


    this.configProviderService.config.doLog && console.log('categorizeQCCompletedAwards: this.qcCompletionTimesByMonth', this.qcCompletionTimesByMonth);


  } //categorizeQCCompletedAwards



}
