import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/tasks';

  createTask(task: Partial<Task>, progettoId: number): Observable<Task> {
    task.assegnatoA = [];
    task.dataScadenza = new Date();
    return this.http.post<Task>(this.apiUrl +'/progetto/' + progettoId, task,{headers:{ 'X-Skip-Loader' : 'true'}});
  }

  updateTask(newProjectId: number, taskToMoveId: number, oldProjectId: number): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskToMoveId}`, {projectId: newProjectId, oldProjectId: oldProjectId},{headers:{ 'X-Skip-Loader' : 'true'}});
  }

  editTask(task: Task) {
    return this.http.put<Task>(`${this.apiUrl}`,task,{headers:{ 'X-Skip-Loader' : 'true'}});

  }

  deleteTask(taskId: number){
    return this.http.delete<Task>(this.apiUrl + '/' + taskId,{headers:{ 'X-Skip-Loader' : 'true'}});
  }
}
