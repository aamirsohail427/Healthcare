import { Injectable } from "@angular/core";
import { ServiceBase } from "src/app/shared/base-classes";
import { Messages } from "src/app/shared/utils";

@Injectable({
    providedIn: 'root'
})
class MessagesService extends ServiceBase {
    constructor() {
        super();
        this.messages = [
            {
                code: 'U01', message: Messages.duplicationMsg.replace(new RegExp('{name}', 'gm'), 'user Id')
            },
            {
                code: 'U03', message: 'Delete is not allowed. The user is the last unarchived user who has the built-in Admin assigned.'
            }, {
                code: 'U04', message: Messages.deleteConfirmationMsg
            }];
    }

}
export default MessagesService