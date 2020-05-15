import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {PlaceService} from './service/place.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-body',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
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
export class WeatherComponent implements OnInit {

  detailsCollapsed = true;

  constructor(private route: ActivatedRoute, private placeService: PlaceService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.placeService.retrievePlaceFromURL(params.get('coords'));
    });
  }
}
