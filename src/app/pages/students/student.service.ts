import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServiceBase } from "src/app/shared/base-classes";

@Injectable({
    providedIn: 'root'
})

class StudentService extends ServiceBase {
    public dtsStudents: any;
    private readonly defaultUrl = this.apiUrlDomain + 'api/students';
    private readonly getUsersUrl = this.defaultUrl + '/getAll';
    private readonly detailUrl = this.defaultUrl + '/getById{id}';
    private readonly createUrl = this.defaultUrl + '/create';
    private readonly updateUrl = this.defaultUrl + '/update';
    private readonly validateUrl = this.defaultUrl + '/validate';
    constructor(private http: HttpClient) {
        super();


        this.dtsStudents = [{
            id: 1,
            fullname: "Amir",
            guardianName: "Jan Muhammad",
            gender: "Male",
            email: "amir@getnada.com",
            dob: "1997-03-25 11:00AM",
            modifiedDate: "2021-05-29 08:00 AM",
            modifiedBy: "admin"
        },
        ]
    }

    public getAll(): Observable<any> {
        return this.http.get<any>(this.getUsersUrl);
    }

    public validate(param: any): Observable<any> {
        return this.http.post<any>(this.validateUrl, param);
    }
    public create(param: any): Observable<any> {
        return this.http.post<any>(this.createUrl, param);
    }

    public update(param: any): Observable<any> {
        return this.http.post<any>(this.updateUrl, param);
    }
    public getById(id: string): Observable<any> {
        const url = this.detailUrl.replace('{id}', id);
        return this.http.get<any>(url);
    }
}
export default StudentService