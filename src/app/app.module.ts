import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Router } from './router.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './weather/component/header/header.component';
import {HttpClientModule} from '@angular/common/http';
import { ForecastComponent } from './weather/component/forecast/forecast.component';
import { TimelineComponent } from './weather/component/timeline/timeline.component';
import { TitleComponent } from './weather/component/title/title.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DetailComponent } from './weather/component/detail/detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";
import { WeatherComponent } from './weather/weather.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ForecastComponent,
    TimelineComponent,
    TitleComponent,
    DetailComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    Router,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
