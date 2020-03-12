import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ChartsModule} from 'ng2-charts';

import { AppComponent } from './app.component';

//Charts for various award process completion metrics.
import { ChartsComponent } from './components/charts/charts.component';

//Matrix of completed awards
import { AwardTableComponent } from './components/award-table/award-table.component';

//Service responsible for getting initial data for app
import { DataProviderService } from './../app/services/data-provider.service';

//The component responsible for in-progress statistics
import { InProgressComponent } from './components/in-progress/in-progress.component';

//Pipes used for calculating row and column totals
import { DisplayRowTotalPipe } from './pipes/display-row-total.pipe';
import { DisplayColTotalPipe } from './pipes/display-col-total.pipe';

//Service responsible for reading/setting environmental variables
import { EnvServiceProvider } from './services/env.service.provider';

//Needed to allow collapsing 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Used for modals
import { NgbModalModule } from  '@ng-bootstrap/ng-bootstrap';

export function dataProviderFactory(provider: DataProviderService) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    AwardTableComponent,
    InProgressComponent,
    DisplayRowTotalPipe,
    DisplayColTotalPipe
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    ChartsModule,
    BrowserAnimationsModule,
    NgbModalModule
   
  ],
  providers: [EnvServiceProvider,
    DataProviderService, 
    { provide: APP_INITIALIZER, useFactory: dataProviderFactory, deps: [DataProviderService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
