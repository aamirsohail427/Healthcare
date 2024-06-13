import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DxButtonModule } from 'devextreme-angular';
import { DxFormComponent, DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { AuthenticationHelper, authStatus, SystemUtility } from '../..';
import { AuthService } from '../../services';
import { UserProfileService } from '../../system-state';
import { InitSystemService } from '../../utils/init-system.service';
import { LoginDto } from './login.dto';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @ViewChild('loginForm', { static: false }) loginForm: DxFormComponent;
  public isDataProcessing = false;
  public loginInfo: LoginDto = new LoginDto();
  public isSignInForm = true;
  public isResetPasswordForm = false;

  constructor(private service: AuthService,
    public userProfileService: UserProfileService,
    public systemService: InitSystemService) { }

  public onSignInBtnClick() {
    if (this.validateFormData()) {
      this.isDataProcessing = true;
      SystemUtility.toggleLoadingPanel(true);
      this.loadSystem(this.loginInfo);
    }
  }
  public loadSystem(param: any) {
    this.service.login(param).subscribe(result => {
      if (result.status === authStatus.failed) {
        this.service.isLoggedIn = false;
        this.isDataProcessing = false;
        SystemUtility.toggleLoadingPanel(false);
        return;
      }
      if (result.status === authStatus.success) {
        this.service.isLoggedIn = true;
        this.isDataProcessing = false;
        this.userProfileService.isRememberMe = param.rememberMe;
        this.systemService.storeUserData(result.data);
        AuthenticationHelper.setToken(result.data.authToken);
        SystemUtility.toggleLoadingPanel(false);
        return;
      }
     
    })
  }
  private validateFormData(): boolean {
    const result: any = this.loginForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }
  public onResetPasswordBtnClick() {

  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxButtonModule,
    DxLoadIndicatorModule
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent]
})
export class LoginFormModule { }
