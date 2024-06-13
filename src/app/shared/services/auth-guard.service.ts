import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthService } from ".";
const defaultPath = '/';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const isLoggedIn = this.authService.loggedIn;
        const isAuthForm = [
            'login-form'
        ].includes(route.routeConfig.path);

        if (isLoggedIn && isAuthForm) {
            this.authService.lastAuthenticatedPath = defaultPath;
            this.router.navigate([defaultPath]);
            return false;
        }

        if (!isLoggedIn && !isAuthForm) {
            this.router.navigate(['/login-form']);
        }

        if (isLoggedIn) {
            this.authService.lastAuthenticatedPath = route.routeConfig.path;
        }

        return isLoggedIn || isAuthForm;
    }
}