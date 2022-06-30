import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MainWeatherComponent } from './main-weather/main-weather.component';
import { ForecastWeatherComponent } from './forecast-weather/forecast-weather.component';
import { AnalyzeWeatherComponent } from './analyze-weather/analyze-weather.component';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';

const routes: Routes = [
  { path: '', component: MainWeatherComponent},
  { path: '**', component: MainWeatherComponent}
];


@NgModule({
  declarations: [
    MainWeatherComponent,
    CurrentWeatherComponent,
    ForecastWeatherComponent,
    AnalyzeWeatherComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class WeatherModule { }
