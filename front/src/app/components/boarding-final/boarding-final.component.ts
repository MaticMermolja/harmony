  import { Component } from '@angular/core';
  import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
  import { environment } from 'src/environments/environments';
  import { HttpClient } from '@angular/common/http';
  import { Router } from '@angular/router';
  import { ConnectionService } from 'src/app/services/connection.service';
  
  @Component({
    selector: 'app-boarding-final',
    templateUrl: './boarding-final.component.html'
  })
  export class BoardingFinalComponent {
    items = [
      { name: 'Body', importance: 'Most important' },
      { name: 'Mind', importance: 'Very important' },
      { name: 'Sense', importance: 'Important' },
      { name: 'Relations', importance: 'Somewhat important' },
      { name: 'Journey', importance: 'Not in the focus' },
      { name: 'Love', importance: 'Least important' }
    ];
    private baseUrl = environment.apiUrl;
  
    data: { [key: string]: number } = {};
  
    constructor(
      private http: HttpClient, 
      private router: Router,
      private connectionService: ConnectionService
    ) {}
    
    public isConnected(): boolean {
      return this.connectionService.isConnected;
    }
  
    drop(event: any) {
      const dropEvent = event as CdkDragDrop<{ name: string; importance: string; }[]>;
      moveItemInArray(this.items, dropEvent.previousIndex, dropEvent.currentIndex);
      this.updateRanking();
    }
  
    updateRanking() {
      this.items.forEach((item, index) => {
        this.data[item.name] = this.items.length - index;
      });
    }
  
    async submitRanking() {
      // Construct the data object with proper keys
      const submitData = this.items.reduce<Record<string, number>>((acc, item) => {
        acc[item.name] = this.data[item.name];
        return acc;
      }, {});
  
      try {
        // Use Angular HttpClient for the POST request
        const response = await this.http.post(`${this.baseUrl}/boarding/4`, submitData).toPromise();
  
        // Handle the response here, e.g., navigate to a new route or reload
        if (response) {
          // Assuming 'response' contains the URL to navigate to after successful operation
          this.router.navigate(['/']); // Change to the desired route
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
