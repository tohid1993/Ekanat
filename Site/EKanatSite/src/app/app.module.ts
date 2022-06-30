import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
    
  ],
  providers: [
    {
      provide:"BASE_URL",
      useValue:environment.apiRoot
    },
    {
      provide:"EE_URL",
      useValue:environment.eeRoot
    },
    {
      provide:"environment",
      useValue:environment
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
