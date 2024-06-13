

export class ServiceBase {
    public apiUrlDomain: string;
    public messages: any[] = [];
    public actionCodes: any = {
        view: 'View',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        archive: 'Archive',
        publish: 'Publish'
    };

    constructor() {
        this.apiUrlDomain = 'https://localhost:44301/';
    }

    getMessageByCode(code: string): string {
        return this.messages.find(p => p.code === code).message;
    }
}
