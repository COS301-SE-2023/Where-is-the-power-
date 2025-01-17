import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegisterUser } from '../shared/models/register-user';
import { AuthService } from '../authentication/auth.service';
import { User } from '../shared/models/user';
import { LoginComponent } from '../shared/components/login/login.component';
import { SignupComponent } from '../shared/components/signup/signup.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tab-profile',
  templateUrl: './tab-profile.page.html',
  styleUrls: ['./tab-profile.page.scss'],
})
export class TabProfilePage implements OnInit {

  user: User | null = null;
  private userSubscription: Subscription = new Subscription();
  userInitialDataURL: string | null = null;

  isLoggedIn: boolean = false;
  constructor(private authService: AuthService,
    private modalController: ModalController) { }

  ngOnInit() {
    //this.isLoggedIn = this.authService.isLoggedin;
    this.userSubscription = this.authService.user.subscribe(
      (user) => {
        this.isLoggedIn = this.authService.isLoggedin;

        console.log(this.isLoggedIn);
        if (this.isLoggedIn) {
          // Update the user variable in your component whenever the BehaviorSubject's value changes.
          if (user) {
            this.user = user;
            if (user.firstName) {
              this.userInitialDataURL = this.getInitialDataURL(user.firstName.charAt(0));
              console.log(this.userInitialDataURL);
            }
          }
        }
      }
    );
  }

  async showSignupComponent() {
    const modal = await this.modalController.create({
      component: SignupComponent,
      // You can pass data to the login component using componentProps if needed
      // componentProps: { data: yourData },
    });
    return await modal.present();
  }

  async showLoginComponent() {
    const modal = await this.modalController.create({
      component: LoginComponent,
      // You can pass data to the login component using componentProps if needed
      // componentProps: { data: yourData },
    });
    return await modal.present();
  }

  async logout() {
    this.isLoggedIn = false;
    await this.authService.signOutUser();
    this.toggleTheme('light');
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  getInitialDataURL(initial: string): string | null {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Could not get 2D context.');
      return null;
    }

    context.fillStyle = '#ff9800'; // Customize the background color
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '24px Arial'; // Customize the font size and family
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#ffffff'; // Customize the text color
    context.fillText(initial, canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL();
  }

  toggleTheme(systemTheme: string) {
    document.body.setAttribute('witp-color-theme', systemTheme);
  }

  downloadUserManual(type: string) {
    // Determine the URL of the user manual based on the 'type'
    let userManualURL = '';

    if (type === 'mobile') {
      userManualURL = 'assets/pdf/user-manual-mobile.pdf';
    } else if (type === 'desktop') {
      userManualURL = 'assets/pdf/user-manual-desktop.pdf';
    }
    // Add more 'if' conditions for other user manual types if needed

    // Trigger the download
    const link = document.createElement('a');
    link.href = userManualURL;
    link.target = '_blank'; // Open the link in a new tab (optional)
    link.download = `user-manual-${type}.pdf`; // Specify the filename
    link.click();
  }
}
