import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { storageKeys } from '../constants';

@Injectable()
export class StorageHelper {

    constructor(private cookieService: CookieService) {

    }
    public copyStorageToLocal() {
        for (let i = 0, len = sessionStorage.length; i < len; i++) {
            const key = sessionStorage.key(i);
            localStorage.setItem('temp-' + key, sessionStorage[key]);
        }
        localStorage.setItem(storageKeys.loadFromLocal, 'true');
    }

    public copyStorageToSession() {
        const tempKeys: Array<string> = [];
        for (let i = 0, len = localStorage.length; i < len; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('temp-')) {
                tempKeys.push(key);
                const sessionKey = key.substring(5);
                sessionStorage.setItem(sessionKey, localStorage[key]);
            }
        }
        tempKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        localStorage.removeItem(storageKeys.loadFromLocal);
    }

    public willLoadFromLocal(): boolean {
        return localStorage.getItem(storageKeys.loadFromLocal) === 'true';
    }


    public setCookie(key: string, value: string) {
        this.setCookieWithExpire(key, value, null);
    }

    public setNeverExpiredCookie(key: string, value: string) {
        this.setCookieWithExpire(key, value, 3650);
    }

    private setCookieWithExpire(key: string, value: string, expire?: number) {
        const domain = this.getRootDomain();
        this.cookieService.set(key, value, expire, '/', domain, false, 'Lax');
    }

    public deleteCookie(key: string) {
        const domain = this.getRootDomain();
        this.cookieService.delete(key, '/', domain);
    }

    public getCookie(key: string): string {
        return this.cookieService.get(key);
    }

    public checkCookie(key: string): boolean {
        if (key) {
            return this.cookieService.check(key);
        }
        return false;
    }

    public getRootDomain() {
        const domain = document.domain;
        const domainList = domain.split('.');
        const rootDomain = [];
        const domainLength = Math.min(2, domainList.length);
        for (let i = 0; i < domainLength; i++) {
            rootDomain.unshift(domainList.pop());
        }
        return rootDomain.join('.');
    }
}
