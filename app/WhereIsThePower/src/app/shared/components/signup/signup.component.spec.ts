// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SignupComponent } from './signup.component';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../../authentication/auth.service';

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockAuthService {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('SignupComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        SignupComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        FormBuilder,
        ToastController,
        { provide: AuthService, useClass: MockAuthService },
        ModalController,
        LoadingController
      ]
    }).overrideComponent(SignupComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  xit('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  xit('should run #ngOnInit()', async () => {

    component.ngOnInit();

  });

  xit('should run #dismissModal()', async () => {
    component.modalController = component.modalController || {};
    spyOn(component.modalController, 'dismiss');
    component.dismissModal();
    // expect(component.modalController.dismiss).toHaveBeenCalled();
  });

  xit('should run #signup()', async () => {
    component.signupForm = component.signupForm || {};
    component.signupForm.valid = 'valid';
    component.signupForm.value = {
      firstName: {},
      lastName: {},
      email: {},
      password: {}
    };
    component.newUser = component.newUser || {};
    component.newUser.firstName = 'firstName';
    component.newUser.lastName = 'lastName';
    component.newUser.email = 'email';
    component.newUser.password = 'password';
    component.authService = component.authService || {};
    spyOn(component.authService, 'signupUser').and.returnValue(observableOf({
      token: {}
    }));
    spyOn(component.authService, 'loginUser').and.returnValue(observableOf({
      token: {}
    }));
    spyOn(component.authService, 'saveUserData');
    component.authService.user = {
      next: function() {}
    };
    spyOn(component, 'presentLoading');
    spyOn(component, 'dismissModal');
    spyOn(component, 'sucessToast');
    spyOn(component, 'failToast');
    component.signup();
    // expect(component.authService.signupUser).toHaveBeenCalled();
    // expect(component.authService.loginUser).toHaveBeenCalled();
    // expect(component.authService.saveUserData).toHaveBeenCalled();
    // expect(component.presentLoading).toHaveBeenCalled();
    // expect(component.dismissModal).toHaveBeenCalled();
    // expect(component.sucessToast).toHaveBeenCalled();
    // expect(component.failToast).toHaveBeenCalled();
  });

  xit('should run #failToast()', async () => {
    component.toastController = component.toastController || {};
    spyOn(component.toastController, 'create');
    await component.failToast({});
    // expect(component.toastController.create).toHaveBeenCalled();
  });

  xit('should run #sucessToast()', async () => {
    component.toastController = component.toastController || {};
    spyOn(component.toastController, 'create');
    await component.sucessToast({});
    // expect(component.toastController.create).toHaveBeenCalled();
  });

  xit('should run #presentLoading()', async () => {
    component.loadingController = component.loadingController || {};
    spyOn(component.loadingController, 'create');
    await component.presentLoading();
    // expect(component.loadingController.create).toHaveBeenCalled();
  });

});