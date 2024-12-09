import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SubjectUtilService {
    private subject = new Subject<any>();

    sendMessage(message: any) {
        this.subject.next(message);
    }

    clearMessages() {
        this.subject.next(null);
    }

    getMessage() {
        return this.subject.asObservable();
    }
}