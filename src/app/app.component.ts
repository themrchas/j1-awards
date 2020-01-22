import { Component } from '@angular/core';
import { environment } from './../environments/environment';
//import { ChartsComponent } from './components/charts.component'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'j1-charts';

  listWeb:String = environment.listWeb;
}
