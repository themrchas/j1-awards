import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ChartsComponent } from './components/charts/charts.component';
import { AwardTableComponent } from './components/award-table/award-table.component'

@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    AwardTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
