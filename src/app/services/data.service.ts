
import { tap, map } from 'rxjs/operators';
import { Observable , forkJoin,  of, from } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { SpService } from "./sp.service";

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

  //List of all awards that have been read in and saved as Award object
  private processedAwardsList: Array<Award>; //= new Array<Award>() ;

  //The complete cartesian product of awards x units filled out.  
  private _awardBreakDown: any;

  

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

  get awardBreakDown() {
    return this._awardBreakDown;
  }
  
  set awardBreakDown(value:any) {
    this._awardBreakDown = value;
  }
  


  constructor(private spService: SpService) { }



 getInitialAwardData() : Observable<any> {

  const currentYear = moment().year();
  const defaultInitialDate = currentYear+"-01-13T00:00:00Z";

  // return forkJoin([this.getData(defaultInitialDate,"2020-01-16T00:00:00Z"), this.getAwardMatrixHeaderInfo()])
  return forkJoin([this.getData(defaultInitialDate), this.getAwardMatrixHeaderInfo()])
  }


 analyzeAwardData(): Observable<any> {

  

  let awardBreakDown: any = {};

    //console.log('*******data.service.analyzeAwardData can access awards object',this.awardBreakDown);
    console.log('raw data list after initial processing is', this.processedAwardsList);

    this.processedAwardsList.forEach(function(processedAward) {

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

let awardTypesList = this.awardTypesList;

//Any member of the cartesian product units x award types that is blank gets a 0
this.unitsList.forEach(function(unit) {

  awardBreakDown[unit] = awardBreakDown[unit] || {};



  awardTypesList.forEach(function(award) {

    //  if (!Award.awardBreakDown[unit][award])
    awardBreakDown[unit][award] = awardBreakDown[unit][award] || 0;
  })

})

this.awardBreakDown = awardBreakDown;

  return Observable.create(observer => {
   // observer.next('analyzeAward just emitted an an bservable')
  // observer.next(Award.getAwardBreakdown())
  observer.next(awardBreakDown)
    
    }) //.pipe(val => return '*****yes - money')
     
 
      


  }  //analyzeAwardData


  

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

  
  //Grab the matrix headers
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
     this.processedAwardsList = processed;


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

    //Grab all units and create object keyed by unit
    // rawUnitData = _.chain(headers.d.results).filter(['isUnit',true]).keyBy('Unit').value();
    //console.log('rawUnitData is',rawUnitData);


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

  //Return the processed award breakdown constructed as each award was being analyzed in the Award class
  /*public getAwardBreakdown() : any  {

    
    Award.fillAwardBreakDown(this.unitsList,this.awardTypesList);

    return Award.getAwardBreakdown();
    
  } */

  public getTotalAwards(): number {
  //  return Award.getTotalAwards();
  return 1;
  }

  

  
  


}
