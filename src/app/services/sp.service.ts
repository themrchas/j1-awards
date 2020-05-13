import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable , of, from } from 'rxjs';

import { Injectable } from '@angular/core';

import { EnvService } from './../services/env.service';

import { ConfigProviderService} from './config-provider.service';


@Injectable({
  providedIn: 'root'
})
export class SpService {

  httpHeaders = new HttpHeaders().set('Accept','application/json; odata=verbose');
 
  //Endpoint used to grab filtered awards. Filter will be applied to this endpoint to create final query
  awardListRestEndPointBase:string;

  //Endpoint used to grab matrix column/row labels as well as position to appear relative to other labels
  awardMatrixListRestEndPoint: string;
 
  constructor(private httpClient: HttpClient, private configProvider:ConfigProviderService, private env:EnvService) { }


getData(startDate: string, endDate: string, fiscalYearStartDate: string, fiscalYearEndDate: string):Observable<any> {

    

  this.awardListRestEndPointBase = this.env.listWeb+"/_api/web/lists/getbytitle('"+this.configProvider.config.awardList+"')/items";
     

  this.configProvider.config.doLog && console.log('sp.service: startDate', startDate, 'end date', endDate);
  this.configProvider.config.doLog && console.log('sp.service:configProvider.config.filter', this.configProvider.config.filter, "and configPath is", this.env.configPath);
  

  //Filter to be used to grab award data of interest.
  let filter: string;

  //Filter strings to get data that will show up to the 'left' of the matrix -> awards currently being processed
  let awardStatusesOfInterest  = [];
 // awardStatusesOfInterest.push("startswith(AwardStatus,'Pending Review') or startswith(AwardStatus,'Accept for')");
  //awardStatusesOfInterest.push("or (AwardStatus eq 'J1 QC Review') or (AwardStatus eq 'SJS QC Review') or (AwardStatus eq 'Ready for Boarding') or startswith(AwardStatus,'Board Member ')");
 //awardStatusesOfInterest.push("or (AwardStatus eq 'Pending CG Signature' ) or (AwardStatus eq 'Boarding Complete') or (AwardStatus eq 'With HRC') or (AwardStatus eq 'With SOCOM')");
 
 //Prepare filter criteria for 'in progress' awards based on config file entry
  this.configProvider.config.filter.forEach(clause => awardStatusesOfInterest.push(clause));

  //Create filter used in query. This consists of 'inprogress items' plus completed awards between start and end dates. 
  filter = "?$top=1000&$filter=("+awardStatusesOfInterest.join(" ") +
            " or ( (DateComplete ge datetime'"+startDate+"') and (DateComplete le datetime'"+endDate+"'))" +
            " or ( (DateComplete ge datetime'"+fiscalYearStartDate+"') and (DateComplete le datetime'"+fiscalYearEndDate+"'))" +
            ")";
  
  //The endpoint used to pull award data.  Note that this includes a filter.
  const restEndPoint=this.awardListRestEndPointBase+filter;

  this.configProvider.config.doLog && console.log('sp.service:restEndPoint - endpoint to query is',restEndPoint);

  return this.httpClient.get(restEndPoint, {headers: this.httpHeaders})
  .pipe (
         tap(val => console.log('sp.service.getData tap: Http call returned', val))
       //  map(el =>  this._parseAwardJson(el) ),
    //   map(el => { return this._parseAwardJson(el)} ),
     //     tap(el => console.log('mapped data in getData is',el))
       )


}

  
 
  //Return contents of list used to create column and row labels in completed awards matrix.
  getMatrixHeaders():Observable<any> {

    this.awardMatrixListRestEndPoint = this.env.listWeb+"/_api/web/lists/getbytitle('"+this.configProvider.config.awardMatrixHeadersList+"')/items";

    this.configProvider.config.doLog && console.log('sp.service.getData: Executing httpClient with endpoint',this.awardMatrixListRestEndPoint,'and header',this.httpHeaders);
    
    return this.httpClient.get(this.awardMatrixListRestEndPoint, {headers: this.httpHeaders})
      .pipe (
              tap(val => this.configProvider.config.doLog && console.log('sp.service.geMatrixLabels tap: Http call returned', val))
          
            )

  } //getMatrixHeaders

 
   

}
