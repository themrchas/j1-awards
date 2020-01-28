import { Injectable } from '@angular/core';

import { DataService } from './data.service';

import { concat } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  awards: Array<any>;
  unitBreakDown: any;

 

  constructor(private dataService:DataService) { }

  load() {
    
    return new Promise((resolve, reject) => {

      //concat(this.dataService.getInitialAwardData(), this.dataService.analyzeAwardData()).subscribe(data => console.log('data is',data));
      this.dataService.getInitialAwardData()
        //  .pipe(concatMap(data => this.dataService.analyzeAwardData()))
       // .pipe(concatMap(data => this.dataService.analyzeAwardData() ))
       .pipe(
          tap(val => console.log('tapped data is',val) ),
         concatMap(data => this.dataService.analyzeAwardData() ))
          .subscribe(final => { 
                console.log('******conacate map provided',final);
                resolve(true) 
          });
        

    })
    
 /*
            this.dataService.getInitialAwardData().subscribe(results => {
              console.log('data-provider forkjoin returned', results);
              this.awards = results[0];
              this.unitBreakDown =  results[1]
              resolve(true);
             })
    })  */






} 




}
