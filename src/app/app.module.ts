import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import {HttpClientModule} from '@angular/common/http';
import { ForecastComponent } from './component/forecast/forecast.component';
import { TimelineComponent } from './component/timeline/timeline.component';
import { TitleComponent } from './component/title/title.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DetailComponent } from './component/detail/detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ForecastComponent,
    TimelineComponent,
    TitleComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
