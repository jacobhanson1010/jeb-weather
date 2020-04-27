import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('smoothCollapse', [
      state('initial', style({
        height:'0',
        overflow:'hidden',
        opacity:'0'
      })),
      state('final', style({
        overflow:'hidden',
        opacity:'1'
      })),
      transition('initial=>final', animate('250ms')),
      transition('final=>initial', animate('250ms'))
    ]),
  ]
})
export class AppComponent {
  title = 'jeb-weather';

  detailsCollapsed = true;

  constructor() {}
}
