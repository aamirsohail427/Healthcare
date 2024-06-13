export class LoginDto {
    public username = '';
    public password = '';
    public isRememberMe: boolean

}

export class LoginResult {
    constructor(
        public succeeded: boolean,
        public errorMsg: string = ''
    ) { }
}
