import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WeatherComponent} from './weather/weather.component';


const routes: Routes = [
  {path: ':coords', component: WeatherComponent, },
  {path: '', component: WeatherComponent},
  // {path: '', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class Router {
}
