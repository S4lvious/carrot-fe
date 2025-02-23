import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Progetto } from '../models/progetto.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/progetti';

  getAllProjects(): Observable<Progetto[]> {
    return this.http.get<Progetto[]>(this.apiUrl);
  }

  delete(projectId: number): Observable<Progetto[]> {
    return this.http.delete<Progetto[]>(this.apiUrl + '/' + projectId,{headers:{ 'X-Skip-Loader' : 'true'}});
  }

  createProject(project: Partial<Progetto>): Observable<Progetto> {
    project.partecipanti = [];
    return this.http.post<Progetto>(this.apiUrl, project, {headers: {'X-Skip-Loader': 'true'}});
  }

  editProject(project: Progetto): Observable<Progetto> {
    return this.http.put<Progetto>(this.apiUrl, project, {headers: {'X-Skip-Loader': 'true'}})
  }
}
