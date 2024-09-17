import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBoardData } from '../../interfaces/board-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_URL = '../../assets/data.json';
  constructor(private http: HttpClient) {}

  getAllBoards(): Observable<IBoardData> {
    return this.http.get<IBoardData>(this.API_URL);
  }
}
