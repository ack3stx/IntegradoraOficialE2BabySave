import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResendE } from "../../models/resend-e";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class RecoveryService {
    
    private recoveryUrl = environment.apiUrl + '/forgot-password';
    constructor(private http: HttpClient) { }

    recovery(recoveryData: ResendE): Observable<any> {
        return this.http.post(this.recoveryUrl, recoveryData);
    }
}