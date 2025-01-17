import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabProfilePageRoutingModule } from './tab-profile-routing.module';

import { TabProfilePage } from './tab-profile.page';
import { LoginModule } from '../shared/components/login/login.module';
import { SignupModule } from '../shared/components/signup/signup.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabProfilePageRoutingModule,
    LoginModule,
    SignupModule
  ],
  declarations: [TabProfilePage]
})
export class TabProfilePageModule { }
