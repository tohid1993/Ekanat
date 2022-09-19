import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from "@auth0/angular-jwt";
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { AuthService } from './shared/services/auth.service';
import { DateTimeService } from './shared/services/dateTime.service';
import { FileService } from './shared/services/file.service';
import { GeneralService } from './shared/services/general.service';
import { LocationService } from './shared/services/location.service';
import { UserService } from './shared/services/user.service';
import { SharedModule } from './shared/shared.module';

export function tokenGetter() {
  return localStorage.getItem("user_token");
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgxSpinnerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // allowedDomains: ["example.com"],
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
  ],

  providers: [
    UserService,
    FileService,
    GeneralService,
    AuthGuard,
    AuthService,
    DateTimeService,
    LocationService,
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
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
