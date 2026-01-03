import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface InquiryRequest {
  artworkId: number;
  artworkTitle: string;
  artworkDimensions?: string;
  name: string;
  email: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  submitContact(request: ContactRequest): Observable<string> {
    return this.http.post(`${environment.apiUrl}/contact`, request, { responseType: 'text' });
  }

  submitInquiry(request: InquiryRequest): Observable<string> {
    return this.http.post(`${environment.apiUrl}/inquiry`, request, { responseType: 'text' });
  }
}
