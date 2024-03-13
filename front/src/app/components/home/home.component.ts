import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ChartConfiguration, ChartData, ChartType  } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Action } from 'src/app/models/action';
import { UserStats } from 'src/app/models/user-stats';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userStats?: UserStats;
  actions: Action[] = [];
  filteredActions: Action[] = [];
  inspirationQuote?: string;
  inspirationImage: string | null = null;
  private baseUrl = environment.apiUrl; // Ensure environment is pointing to the right API
  currentPage: number = 0;
  itemsPerPage: number = 5;
  searchQuery: string = '';
  isGraphVisible: boolean = false;

  // Changed static to true if the modal doesn't depend on any conditions to be displayed
  @ViewChild('congratulationsModal', { static: true }) private congratulationsModal!: ElementRef;
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 100, 
      }
    }
  };
  public radarChartLabels: string[] = ['Body', 'Mind', 'Sense', 'Relations', 'Journey', 'Love'];

  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      { data: [], label: 'User Stats' }
    ]
  };
  public radarChartType: ChartType = 'radar';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getUserStats();
    this.getInspirationQuote();
  }

  toggleGraphVisibility(): void {
    this.isGraphVisible = !this.isGraphVisible; 
  }

  getUserStats(): void {
    this.http.get<{ user: UserStats; actions: Action[] }>(`${this.baseUrl}/user-stats`).subscribe({
      next: (data) => {
        this.userStats = data.user;
        this.updateChartData();
        this.actions = data.actions;
        this.filteredActions = this.actions.slice(0, 5);
      },
      error: (error) => {
        console.error('Error fetching user stats:', error);
      }
    });
  }

  updateChartData(): void {
    if (this.userStats) {
      const newData = [
        this.userStats.body,
        this.userStats.mind,
        this.userStats.sense,
        this.userStats.relations,
        this.userStats.journey,
        this.userStats.love,
      ];

      // It's often a good idea to clone the array so that Angular detects the change
      this.radarChartData.datasets[0].data = [...newData];
      
      // Now we need to update the chart if it's already rendered
      if (this.chart && this.chart.chart) {
        this.chart.chart.update();
      }
    }
  }

  getInspirationQuote(): void {
    this.http.get<{ inspirationQuote: string; }>(`${this.baseUrl}/user-inspiration-quote`).subscribe({
      next: (data) => {
        // this.inspirationQuote = data.inspirationQuote;
        // this.fetchInspirationalImage(data.inspirationQuote);
      },
      error: (error) => {
        console.error('Error fetching inspiration quote:', error);
        this.inspirationQuote = "Keep pushing forward!";
      }
    });
  }

  fetchInspirationalImage(quote: string): void {
    this.http.post<{ inspirationImage: string; }>(`${this.baseUrl}/user-inspiration-image`, { content: quote }).subscribe({
      next: (data) => {
        this.inspirationImage = data.inspirationImage;
      },
      error: (error) => {
        console.error('Error fetching inspiration image:', error);
        this.inspirationImage = "default-image-url";
      }
    });
  }

  markActionAsDone(actionId: string): void {
    this.http.post<{ user: UserStats }>(`${this.baseUrl}/mark-as-done`, { actionId })
      .subscribe({
        next: (response) => {
          console.log('OK', response);
          this.userStats = response.user;
          this.updateChartData(); // Call this method to update the chart data
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error marking action as done:', error);
          alert('There was an error. Please try again later.');
        }
      });
  }

  filterActions(query: string): void {
    if (query.length >= 3) {
      this.filteredActions = this.actions.filter(action =>
        action.name?.toLowerCase().includes(query) ||
        action.desc?.toLowerCase().includes(query)
      );
    } else {
      this.filteredActions = this.actions.slice(0, this.itemsPerPage);
    }
    console.log(this.filteredActions);
    this.currentPage = 0; // Reset to the first page
    this.updateFilteredActions(true); // Pass true to indicate the actions are already filtered
    this.cdr.detectChanges();
  }
  
  updateFilteredActions(isFiltered: boolean = false): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredActions = isFiltered
      ? this.filteredActions.slice(startIndex, endIndex) // If filtered, slice the filteredActions array
      : this.actions.slice(startIndex, endIndex); // If not filtered, slice the full actions array
    this.cdr.detectChanges(); // Detect changes in case Angular missed it
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateFilteredActions();
    }
  }

  goToNextPage(): void {
    if ((this.currentPage + 1) * this.itemsPerPage < this.actions.length) {
      this.currentPage++;
      this.updateFilteredActions();
    }
  }
}