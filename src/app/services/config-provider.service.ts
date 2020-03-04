import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { EnvService} from './env.service';


import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//Read config file that contains items to be used in app
export class ConfigProviderService {

  private _config;
 
 constructor(private httpClient: HttpClient, private env:EnvService) { }

 //Get configuration file.  Note that top avoid circular dependency, this service does not use the sp.service routines to make http calls.
  getConfiguration(): Observable<any> {
      
      console.log('config-provider.service.getConfiguration: Getting file '+this.env.configPath);

    
    return this.httpClient.get(this.env.configPath)
     .pipe (
              tap(val => { console.log('config-provider.service.getConfiguration tap: Http call returned', val);
                            this._config = val;
                 })
          
            ) 

  }


  get config() {
    return this._config;
  }

  



  


}
