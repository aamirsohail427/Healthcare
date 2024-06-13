import 'rxjs/add/operator/finally';
import { Injectable } from '@angular/core';
import { SystemUtility } from '.';
import { ServiceBase, UserProfileService } from '..';

@Injectable()
export class InitSystemService extends ServiceBase {

    constructor(
        private userProfileService: UserProfileService) {
        super();
    }


    public storeUserData(user: any) {
        this.storeUserProfile(user);
    }

    private storeUserProfile(user: any) {
        this.userProfileService.rememberMeToken = user.rememberMeToken;
        this.userProfileService.userName = SystemUtility.displayFullName(user);
        this.userProfileService.roleId = user.roleId;
        this.userProfileService.loginId = user.loginId;
       this.userProfileService.image = './app/shared/assets/images/userPhoto.png';
        this.userProfileService.id = user.id;
    }
}
