import { Injectable } from '@angular/core';

import { DataService } from './data.service';
import { ConfigProviderService } from './config-provider.service';

import { concat } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  awards: Array<any>;
  unitBreakDown: any;

 

  constructor(private dataService:DataService, private configProviderService:ConfigProviderService) { }

  load() {
    
    return new Promise((resolve, reject) => {

      this.configProviderService.getConfiguration()
          .subscribe(config => {

           // let obj = JSON.parse(config);
           // console.log('data-provider-service: obj is',obj);
           console.log('data-provider-service: config.env is',config.env);

            console.log('data-provider-service: config.txt is', config)
            this.dataService.getInitialAwardData()
       
            .pipe(
               tap(val => console.log('tapped data is',val) ),
              concatMap(data => this.dataService.analyzeAwardData() ))
               .subscribe(final => { 
                     console.log('******conacat map provided',final);
                     resolve(true) 
               });

          })



    /*   Attempt to combine  .pipe(
                tap(val => console.log('config.txt data is',val) ),
                concatMap(file => this.dataService.getInitialAwardData())
                .pipe(
                       tap(val => console.log('tapped data is',val) ),
                       concatMap(data => this.dataService.analyzeAwardData() ))
             )
        
        .subscribe(final => { 
          console.log('******conacat map provided',final);
          resolve(true) 
    }); */


      
/* Works w/o config.txt
      this.dataService.getInitialAwardData()
       
       .pipe(
          tap(val => console.log('tapped data is',val) ),
         concatMap(data => this.dataService.analyzeAwardData() ))
          .subscribe(final => { 
                console.log('******conacat map provided',final);
                resolve(true) 
          });
      */  

    }) 
    






      
    /*  this.dataService.getInitialAwardData()
       
       .pipe(
          tap(val => console.log('tapped data is',val) ),
         concatMap(data => this.dataService.analyzeAwardData() ))
          .subscribe(final => { 
                console.log('******conacat map provided',final);
                resolve(true) 
          });
        

    }) */
    
 






} 




}
