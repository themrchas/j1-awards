import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable , of, from } from 'rxjs';
import { environment } from './../../environments/environment';


import { Injectable, OnInit } from '@angular/core';

//mport { ConfigProviderService} from './config-provider.service';


@Injectable({
  providedIn: 'root'
})
export class SpService implements OnInit {

  httpHeaders = new HttpHeaders().set('Accept','application/json; odata=verbose');
 // const restEndPoint: String = environment.listWeb.
 // restEndPoint:string = "http://localhost:8080/sites/dev/socafdev";
 //restEndPoint:string = "http://sp-dev-sharepoi/sites/dev/socafdev/_api/web/lists/getbytitle('AwardsMetrics')/items(1)";


 //awardListRestEndPointBase:string = "http://localhost:8080/sites/dev/socafdev/_api/web/lists/getbytitle('Award Metrics')/items";
 //awardListRestEndPointBase:string = "http://localhost:8080/sites/dev/socafdev/_api/web/lists/getbytitle('AwardsMetrics')/items";
 awardListRestEndPointBase:string = environment.listWeb+"/_api/web/lists/getbytitle('AwardsMetrics')/items";

 //awardMatrixListRestEndPoint: string = "http://localhost:8080/sites/dev/socafdev/_api/web/lists/getbytitle('Awards Matrix Slide')/items";
 awardMatrixListRestEndPoint: string = environment.listWeb+"/_api/web/lists/getbytitle('Awards Matrix Slide')/items";
 

  constructor(private httpClient: HttpClient) { }


  ngOnInit() {
   // this.httpHeaders = new HttpHeaders({accept:"application/json; odata=verbose"});
  // this.httpHeaders = new HttpHeaders().set('Accept','application/json; odata=verbose');
  }


  //Data that will appear in the matrix as well as the categorization that lies to the 'left' of the matrix
  //We are looking for any awards that have completed in the past 12 months - 'DateComplete ge startDate'
  //as well as data in various stages of the awards business process that are currently active
  getData(startDate: string,endDate?: string):Observable<any> {

    console.log('sp.service: startDate', startDate, 'end date', endDate);
    console.log('sp.service: environment.filter', environment.filter, "and configPath is", environment.configPath);

    let filter: string // "?$filter=DateComplete ge datetime'"+startDate+"'";

    //Filter strings to get data that will show up to the 'left' of the matrix -> awards currently being processed
    let awardStatusesOfInterest  = [];
   // awardStatusesOfInterest.push("startswith(AwardStatus,'Pending Review') or startswith(AwardStatus,'Accept for')");
    //awardStatusesOfInterest.push("or (AwardStatus eq 'J1 QC Review') or (AwardStatus eq 'SJS QC Review') or (AwardStatus eq 'Ready for Boarding') or startswith(AwardStatus,'Board Member ')");
   //awardStatusesOfInterest.push("or (AwardStatus eq 'Pending CG Signature' ) or (AwardStatus eq 'Boarding Complete') or (AwardStatus eq 'With HRC') or (AwardStatus eq 'With SOCOM')");
    
   environment.filter.forEach(clause => awardStatusesOfInterest.push(clause))




  // filter = "?$filter=("+awardStatusesOfInterest.join(" ")+"or (DateComplete ge datetime'"+startDate+"'))";
  filter = "?$filter=("+awardStatusesOfInterest.join(" ")+"or ( (DateComplete ge datetime'"+startDate+"') and (DateComplete le datetime'"+endDate+"')))";
    
    


    const restEndPoint=this.awardListRestEndPointBase+filter;

    console.log('sp.service:restEndPoint - endpoint to query is',restEndPoint);

  

     console.log('sp.service.getMatrixData: Executing httpClient with endpoint',this.awardListRestEndPointBase,'and header',this.httpHeaders);
  return this.httpClient.get(restEndPoint, {headers: this.httpHeaders})
  //  .pipe (
     //       tap(val => console.log('sp.service.getData tap: Http call returned', val))
         //  map(el =>  this._parseAwardJson(el) ),
      //   map(el => { return this._parseAwardJson(el)} ),
       //     tap(el => console.log('mapped data in getData is',el))
        //  )

  
}

  
 

  getMatrixHeaders():Observable<any> {

    console.log('sp.service.getData: Executing httpClient with endpoint',this.awardMatrixListRestEndPoint,'and header',this.httpHeaders);
    return this.httpClient.get(this.awardMatrixListRestEndPoint, {headers: this.httpHeaders})
      .pipe (
              tap(val => console.log('sp.service.geMatrixLabels tap: Http call returned', val))
          
            )


  }

  getConfig():Observable<any> {

   // let filePath = environment.listWeb+configFile;
    //let filePath = environment.listWeb+"AwardsApp/"+configFile;
    //let filePath = "./"+configFile;

    console.log('sp.service.getConfig: Getting file '+environment.configPath);

    //return this.httpClient.get(filePath, {headers: this.httpHeaders})
    return this.httpClient.get(environment.configPath)
     .pipe (
              tap(val => console.log('sp.service.getConfig tap: Http call returned', val))
          
            ) 


  }

   

}
