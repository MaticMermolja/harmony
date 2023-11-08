import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/services/connection.service';

interface FormData {
  [key: string]: any;
}

@Component({
  selector: 'app-boarding',
  templateUrl: './boarding.component.html'
})
export class BoardingComponent {
  currentStep: number = 1;
  steps: number[] = [1, 2, 3];
  private baseUrl = environment.apiUrl;
  
  allQuestions = [
    { id: 'Q1', text: 'Do you workout, run, or exercise on a regular basis?', value: 50 },
    { id: 'Q2', text: 'Do you eat healthy?', value: 50 },
    { id: 'Q3', text: 'Do you feel like having enough energy for daily activities?', value: 50 },
    { id: 'Q4', text: 'Do you often talk to people you like?', value: 50 },
    { id: 'Q5', text: 'Do you have active social life?', value: 50 },
    { id: 'Q6', text: 'Do you have good relations with your friends and family?', value: 50 },
    { id: 'Q7', text: 'Do you enjoy what you are working on your job?', value: 50 },
    { id: 'Q8', text: 'Do you have hobbies you like to follow?', value: 50 },
    { id: 'Q9', text: 'Do you feel loved?', value: 50 },
    { id: 'Q10', text: 'Do you want to learn new things?', value: 50 },
    { id: 'Q11', text: 'Do you have own projects you do?', value: 50 },
    { id: 'Q12', text: 'Do you enjoy yourself?', value: 50 }
  ];

  constructor(
    private http: HttpClient, 
    private router: Router,
    private connectionService: ConnectionService
  ) {}

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  ngOnInit(): void {
    this.getBoardingLevel();
  }

  private getBoardingLevel() {
    this.http.get(`${this.baseUrl}/utils/getBoardingLevel`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    }).subscribe({
      next: (data: any) => {
        this.currentStep = data.boardingLevel || this.currentStep;
        console.log('getBoardingLevel() > data.boardingLevel');
        if (data.boardingLevel === 4) {
          this.router.navigate(['/boarding/final']);
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  getCurrentQuestions() {
    const startIndex = (this.currentStep - 1) * 4;
    return this.allQuestions.slice(startIndex, startIndex + 4);
  }
  
  async submitForm() {
    const data = this.getCurrentQuestions().reduce<FormData>((acc, question) => {
      acc[question.id] = question.value;
      return acc;
    }, {});

    try {
      const response = await this.http.post(`${this.baseUrl}/boarding/${this.currentStep}`, data).toPromise();
      console.log(response);
      // Move to the next step if there are more steps, otherwise, perhaps redirect
      if (this.currentStep < this.steps.length) {
        this.currentStep++;
      } else {
        this.router.navigate(['/boarding/final']);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
