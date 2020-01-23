
import { tap, map } from 'rxjs/operators';
import { Observable , of, from } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { SpService } from "./sp.service";

import {Award} from './../model/award';

@Injectable({
  providedIn: 'root'
})

//A middleware class that bridges the SharePoint specific calls and components that require SharePoint data that has been organized in some logical fashion
export class DataService {

  constructor(private spService: SpService) { }



  getData(): Observable<any> {
    console.log('data.service: Executing getData');
    return this.spService.getData()
      .pipe(
        tap(val => console.log('dataService: tap: spService.getData call returned', val)),
          map(el =>  this._parseAwardJson(el) ),
       //  map(el => { return this._parseAwardJson(el) } ),
            tap(el => console.log('dataService.getData: mapped data in getData is',el))
      )


  }


  _getData(): Observable<any> {
    return from(['hello', 'world'])
      .pipe(tap(val => console.log('dataService: tap: Http call returned', val))
      );
  }

  private _parseAwardJson(awards: any) {
    let processed = awards.d.results.map(function (el) {
      //console.log('dataService._parseAwardJson: el is', el);
    
      return new Award(el);

    })
    //  console.log('_parseAwardJson:el is',awards);
    console.log('dataService: processed awards is', processed);

    
    return processed;

  }

  public getAwardBreakdown() : any  {

    return Award.getAwardBreakdown();
    //return 'blah';
  }


}
