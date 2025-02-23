import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/progetto.service';
import { TaskService } from '../../services/task.service';
import { Progetto } from '../../models/progetto.model';
import { StatoTask, Task } from '../../models/task.model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Badge } from 'primeng/badge'
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    CardModule,
    PanelModule,
    ToastModule,
    Menu,
    Select,
    DatePicker,
    Badge,
    ChipModule,
    TooltipModule
    ],
  providers: [MessageService],
  templateUrl: './progetti.component.html',
  styleUrls: ['./progetti.component.scss']
})
export class ProjectBoardComponent implements OnInit {

  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  @ViewChild('menu') menu!: Menu;
  // **NUOVE AGGIUNTE**: ViewChild per il menu dei task
  @ViewChild('taskMenu') taskMenu!: Menu;

  projects: Progetto[] = [];
  newProjectName: string = '';
  newTaskName: string = '';
  newTaskDescription: string = '';
  selectedProject: Progetto | null = null;
  displayAddTaskDialog = false;
  draggedTask: Task | null = null;
  draggedProject: Progetto | null = null;
  isAddingNewProject: boolean = false;

  projectDropListIds: string[] = [];
  displayEditProjectDialog = false;

  ngOnInit() {
    this.loadProjects();
  }

  getBadgeSeverity(stato: StatoTask): 'success' | 'info' | 'warn' | 'secondary' {
    switch (stato) {
      case StatoTask.COMPLETATO:
        return 'success'; // Verde
      case StatoTask.IN_PROGRESS:
        return 'info'; // Blu
      case StatoTask.TODO:
        return 'warn'; // Giallo
      default:
        return 'secondary'; // Grigio
    }
  }
    
  menuItems: MenuItem[] = [];

  taskStatusOptions = [StatoTask.COMPLETATO, StatoTask.IN_PROGRESS, StatoTask.TODO]

  onProjectMenuClick(event: MouseEvent, project: Progetto) {
    this.selectedProject = project;
    this.menuItems = [
      {
        label: 'Elimina Progetto',
        icon: 'pi pi-trash',
        command: () => this.deleteProject(project)
      },
      {
        label: 'Modifica Progetto',
        icon: 'pi pi-pencil',
        command: () => this.editProject(project)
      }
    ];
    // Mostra il menu usando il riferimento ViewChild
    this.menu.show(event);
  }
          
  deleteProject(project: Progetto){
    this.projectService.delete(project.id!).subscribe(() => {
      this.projects
      this.loadProjects();
    });
  }

  // Gestione aggiunta task inline (già esistente)
  addingTaskProjectId: number | null = null;
  
  startAddTask(project: Progetto) {
    this.addingTaskProjectId = project.id!;
    this.newTaskName = '';
    this.newTaskDescription = '';
  }
  
  addTask(progettoId: number) {
    if (!this.newTaskName.trim()) return;
    const newTaskData = { titolo: this.newTaskName, descrizione: this.newTaskDescription };
  
    // Trova il progetto in cui aggiungere il task
    const project = this.projects.find(proj => proj.id === progettoId);
    if (!project) return;
  
    // Crea un task ottimistico con un id temporaneo
    const tempId = Math.floor(Math.random() * 1000000);
    const optimisticTask: Task = {
      id: tempId,
      titolo: newTaskData.titolo,
      descrizione: newTaskData.descrizione,
      progettoId: progettoId,
      assegnatoA: [],
      dataCreazione: new Date(),
      stato: StatoTask.TODO
    };
  
    if (!project.tasks) {
      project.tasks = [];
    }
    project.tasks.push(optimisticTask);
  
    // Resetta lo stato dell'aggiunta per l'interfaccia
    this.addingTaskProjectId = null;
    this.newTaskName = '';
    this.newTaskDescription = '';
  
    // Effettua la chiamata al servizio per creare il task
    this.taskService.createTask(newTaskData, progettoId).subscribe({
      next: (savedTask: Task) => {
        const index = project.tasks!.findIndex(task => task.id === tempId);
        if (index !== -1) {
          project.tasks![index] = savedTask;
        }
      },
      error: (error) => {
        project.tasks = project.tasks!.filter(task => task.id !== tempId);
      }
    });
  }  
  
  cancelAddTask() {
    this.addingTaskProjectId = null;
    this.newTaskName = '';
    this.newTaskDescription = '';
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe(data => {
      const savedPositions = localStorage.getItem('projectPositions');
      let positionMap: { [key: number]: { positionX: number, positionY: number } } = savedPositions ? JSON.parse(savedPositions) : {};
  
      const COLS = 4; // Numero di colonne della griglia
      const SPACING_X = 300; // Spaziatura orizzontale
      const SPACING_Y = 200; // Spaziatura verticale
  
      this.projects = data.map((project, index) => {
        const row = Math.floor(index / COLS); // Riga nella griglia
        const col = index % COLS; // Colonna nella griglia
  
        return {
          ...project,
          positionX: positionMap[project.id!]?.positionX ?? col * SPACING_X + 50,
          positionY: positionMap[project.id!]?.positionY ?? row * SPACING_Y + 50,
        };
      });
  
      this.projectDropListIds = this.projects.map(proj => `taskList-${proj.id}`);
      this.saveProjectPositions();
    });
  }
  
  saveProjectPositions() {
    const positionMap = this.projects.reduce((acc, project) => {
      acc[project.id!] = { positionX: project.positionX!, positionY: project.positionY! };
      return acc;
    }, {} as { [key: number]: { positionX: number, positionY: number } });
  
    localStorage.setItem('projectPositions', JSON.stringify(positionMap));
  }
  
  onProjectMoved(event: any, project: Progetto) {
    project.positionX = event.source.getFreeDragPosition().x;
    project.positionY = event.source.getFreeDragPosition().y;
    this.saveProjectPositions();
  }
  
  onDragStartProject(project: Progetto) {
    this.draggedProject = project;
  }
  
  startNewProject() {
    this.isAddingNewProject = true;
  }
  
  addProject() {
    if (!this.newProjectName.trim()) return;
  
    const tempId = Math.floor(Math.random() * 1000000);
  
    const newProject: Progetto = {
      id: tempId,
      nome: this.newProjectName,
      tasks: [],
      partecipanti: [],
      ordineId: undefined,
      dataCreazione: new Date(),
      positionX: (this.projects.length % 4) * 300 + 50,
      positionY: Math.floor(this.projects.length / 4) * 200 + 50
    };
  
    this.projects.push(newProject);
    this.projectDropListIds.push(`taskList-${tempId}`);
  
    this.newProjectName = '';
  
    const projectToSend = { ...newProject };
    delete projectToSend.id;
    delete projectToSend.positionX;
    delete projectToSend.positionY;
  
    this.projectService.createProject(projectToSend).subscribe({
      next: (savedProject) => {
        const index = this.projects.findIndex(proj => proj.id === tempId);
        if (index !== -1) {
          this.projects[index] = { ...savedProject, positionX: newProject.positionX, positionY: newProject.positionY };
          this.projectDropListIds[index] = `taskList-${savedProject.id}`;
        }
      },
      error: () => {
        this.projects = this.projects.filter(proj => proj.id !== tempId);
      }
    });
  }
  
  moveTask(event: CdkDragDrop<Task[]>, targetProject: Progetto) {
    console.log(event)
    console.log(targetProject)
    if (!event.item.data || !targetProject) return;
  
    const draggedTask: Task = event.item.data;
    const sourceProject = this.projects.find(proj => proj.tasks?.includes(draggedTask));
  
    if (!sourceProject) return;
  
    if (event.previousContainer === event.container) {
      moveItemInArray(targetProject.tasks!, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      draggedTask.progettoId = targetProject.id!;
  
      this.taskService.updateTask(targetProject.id!, draggedTask.id!, draggedTask.id!).subscribe({
        next: () => console.log("Task spostato correttamente"),
        error: () => {
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
        }
      });
    }
  }
  
  openAddTaskDialog(project: Progetto) {
    this.selectedProject = project;
    this.displayAddTaskDialog = true;
  }
  
  // **NUOVE AGGIUNTE PER IL MENU DEI TASK E IL DIALOG DI MODIFICA**
  selectedTask: Task | null = null;
  displayEditTaskDialog: boolean = false;
  editTaskName: string = '';
  editTaskDescription: string = '';
  taskMenuItems: MenuItem[] = [];
  
  onTaskMenuClick(event: MouseEvent, task: Task, project: Progetto) {
    this.selectedTask = task;
    this.taskMenuItems = [
      {
        label: 'Elimina Task',
        icon: 'pi pi-trash',
        command: () => this.deleteTask(task, project)
      },
      {
        label: 'Modifica Task',
        icon: 'pi pi-pencil',
        command: () => this.openEditTaskDialog(task)
      }
    ];
    this.taskMenu.show(event);
  }
  
  deleteTask(task: Task, project: Progetto) {
    project.tasks = project.tasks!.filter(t => t.id !== task.id);

    this.taskService.deleteTask(task.id!).subscribe({
      next: () => {
      },
      error: () => {
        this.loadProjects();
      }
    });
  }

  editTask: Task = {
    id: 0,
    titolo: '',
    descrizione: '',
    stato: StatoTask.TODO,
    assegnatoA: [],
    dataCreazione: new Date(),
    dataScadenza: new Date(),
    progettoId: 0
  };

  toEditProject: Progetto = {
    id: 0,
    nome: '',
    descrizione: '',
    ordineId: 0,
    partecipanti: [],
    dataCreazione: new Date(),
    tasks: []
  };
  
      
  openEditTaskDialog(task: Task) {
    this.selectedTask = task;
    this.editTaskName = task.titolo;
    this.editTaskDescription = task.descrizione!;
    this.editTask = task;  
    let date = new Date(this.editTask.dataScadenza || new Date());
    this.editTask.dataScadenza = date;
    console.log(this.editTask);  
    this.displayEditTaskDialog = true;
  }

  editProject(project: Progetto) {
    this.selectedProject = project;
    this.toEditProject = project
    this.displayEditProjectDialog = true;
  }


  updateProject() {
    if (!this.selectedProject) return;
    this.selectedProject = this.toEditProject;
    this.projectService.editProject(this.toEditProject).subscribe({
      next: () => {
        this.loadProjects();
        this.closetoEditProject();
      },
      error: () => {
        // Gestione errore
      }
    });
  }


  
  updateTask() {
    if (!this.selectedTask) return;
    this.selectedTask = this.editTask;
    this.taskService.editTask(this.editTask).subscribe({
      next: () => {
        this.loadProjects();
        this.closeEditTaskDialog();
      },
      error: () => {
        // Gestione errore
      }
    });
  }

  closetoEditProject() {
    this.selectedProject = null;
    this.displayEditProjectDialog =false;
  }
  
  closeEditTaskDialog() {
    this.displayEditTaskDialog = false;
    this.selectedTask = null;
  }
}
