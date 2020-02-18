import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ChartsModule} from 'ng2-charts';

import { AppComponent } from './app.component';

import { ChartsComponent } from './components/charts/charts.component';
import { AwardTableComponent } from './components/award-table/award-table.component';
import { DataProviderService } from './../app/services/data-provider.service';

import { InProgressComponent } from './components/in-progress/in-progress.component';

import { DisplayRowTotalPipe } from './pipes/display-row-total.pipe';
import { DisplayColTotalPipe } from './pipes/display-col-total.pipe';

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
    ChartsModule
  ],
  providers: [
    DataProviderService, 
    { provide: APP_INITIALIZER, useFactory: dataProviderFactory, deps: [DataProviderService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
