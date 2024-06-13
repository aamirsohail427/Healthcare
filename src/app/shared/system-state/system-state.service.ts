import { Injectable } from '@angular/core';

@Injectable()
export class SystemStateService {
    private _isSessionExpired = false;
    set isSessionExpired(isSessionExpired: boolean) {
        this._isSessionExpired = isSessionExpired;
        sessionStorage.setItem('isSessionExpired', String(isSessionExpired));
    }

    get isSessionExpired() {
        const isSessionExpired = sessionStorage.getItem('isSessionExpired');
        if (isSessionExpired === 'true') {
            return true;
        } else {
            return false;
        }
    }

    set currentTimeZoneId(timeZoneId: string) {
        sessionStorage.setItem('timeZoneId', timeZoneId);
    }
    get currentTimeZoneId(): string {
        return sessionStorage.getItem('timeZoneId');
    }
}
