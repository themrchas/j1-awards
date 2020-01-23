import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-award-table',
  templateUrl: './award-table.component.html',
  styleUrls: ['./award-table.component.scss']
})
export class AwardTableComponent implements OnInit {
  @Input() awards: any;
  
  constructor() { }

  ngOnInit() {
  }

}
