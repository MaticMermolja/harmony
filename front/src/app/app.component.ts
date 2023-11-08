import { Component } from '@angular/core';
import { OnlineOfflineService } from './services/jwa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private onlineOfflineService: OnlineOfflineService) {
    onlineOfflineService.connectionChanged.subscribe(online => {
      if (online) {
        console.log('We just went online');
      } else {
        console.log('We are offline');
      }
    });
  }
}
