import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Action } from 'src/app/models/action';
import { ConnectionService } from 'src/app/services/connection.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  actions: Action[] = [];
  selectedAction: Action | null = null;
  private baseUrl = environment.apiUrl;
  
  @ViewChild('actionEditTemplate') actionEditTemplate: any;

  constructor(
    private http: HttpClient, 
    private modalService: NgbModal,
    private connectionService: ConnectionService
    ) {}

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  ngOnInit(): void {}

  listAllActions(): void {
    this.http.get<Action[]>(`${this.baseUrl}/admin/action/list`).subscribe(
      (data) => {
        this.actions = data;
      },
      (error) => {
        console.error('Error fetching actions:', error);
      }
    );
  }

  openActionModal(action: Action): void {
    this.selectedAction = {...action};
    this.modalService.open(this.actionEditTemplate, { size: 'lg' });
  }

  updateAction(modal: NgbModalRef): void {
    if (this.selectedAction) {
      const actionToUpdate = this.selectedAction;
      this.http.patch<{ message: string, action: Action }>(
        `${this.baseUrl}/admin/action/patch/${actionToUpdate._id}`, 
        actionToUpdate
      ).subscribe(
        (response) => {
          console.log(response.message);
          const index = this.actions.findIndex(a => a._id === actionToUpdate._id);
          if (index !== -1) {
            this.actions[index] = actionToUpdate;
          }
          modal.close();
        },
        (error) => {
          console.error('Error updating action:', error);
        }
      );
    }
  }

  openCreateActionModal(): void {
    // Clear the selectedAction object for creating a new action
    this.selectedAction = {
      _id: '',
      name: '',
      desc: '',
      changeBody: 0,
      changeMind: 0,
      changeSense: 0,
      changeRelations: 0,
      changeJourney: 0,
      changeLove: 0
    };
    // Open the modal for creating a new action
    this.modalService.open(this.actionEditTemplate, { size: 'lg' });
  }
  
  createAction(modal: NgbModalRef): void {
    if (this.selectedAction) {
      this.http.put<{ message: string, action: Action }>(
        `${this.baseUrl}/admin/action/create`,
        this.selectedAction
      ).subscribe(
        (response) => {
          console.log(response.message);
          // Add the new action to the actions array
          this.actions.push(response.action);
          modal.close();
        },
        (error) => {
          console.error('Error creating action:', error);
        }
      );
    }
  }
  
}
