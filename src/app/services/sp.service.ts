import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable , of, from } from 'rxjs';
import { environment } from './../../environments/environment';


import { Injectable, OnInit } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SpService implements OnInit {

  httpHeaders = new HttpHeaders().set('Accept','application/json; odata=verbose');
 // const restEndPoint: String = environment.listWeb.
 // restEndPoint:string = "http://localhost:8080/sites/dev/socafdev";
 //restEndPoint:string = "http://sp-dev-sharepoi/sites/dev/socafdev/_api/web/lists/getbytitle('AwardsMetrics')/items(1)";
 awardListRestEndPoint:string = "http://localhost:8080/sites/dev/socafdev/_api/web/lists/getbytitle('AwardsMetrics')/items";

 awardMatrixListRestEndPoint: string = "http://localhost:8080/sites/dev/socafdev/_api/web/lists/getbytitle('Awards Matrix Slide')/items";
 

  constructor(private httpClient: HttpClient) { }


  ngOnInit() {
   // this.httpHeaders = new HttpHeaders({accept:"application/json; odata=verbose"});
  // this.httpHeaders = new HttpHeaders().set('Accept','application/json; odata=verbose');
  }

  
  

  //private getData(restEndPoint:String, restHeaders:String):Observable<any> {
     getData():Observable<any> {
       console.log('sp.service.getData: Executing httpClient with endpoint',this.awardListRestEndPoint,'and header',this.httpHeaders);
    return this.httpClient.get(this.awardListRestEndPoint, {headers: this.httpHeaders})
      .pipe (
              tap(val => console.log('sp.service.getData tap: Http call returned', val))
           //  map(el =>  this._parseAwardJson(el) ),
        //   map(el => { return this._parseAwardJson(el)} ),
         //     tap(el => console.log('mapped data in getData is',el))
            )

    
  }

  getMatrixHeaders():Observable<any> {

    console.log('sp.service.getData: Executing httpClient with endpoint',this.awardMatrixListRestEndPoint,'and header',this.httpHeaders);
    return this.httpClient.get(this.awardMatrixListRestEndPoint, {headers: this.httpHeaders})
      .pipe (
              tap(val => console.log('sp.service.geMatrixLabels tap: Http call returned', val))
          
            )


  }

   

}
