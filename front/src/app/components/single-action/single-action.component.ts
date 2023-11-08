import {  Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ConnectionService } from 'src/app/services/connection.service';

interface Action {
  _id: string;
  name: string;
  desc: string;
  pictureUrl?: string;
}

@Component({
  selector: 'app-single-action',
  templateUrl: './single-action.component.html',
  styleUrls: ['./single-action.component.css']
})
export class SingleActionComponent implements OnInit {
  @Input() action!: Action;

  constructor(private connectionService: ConnectionService) {}

  getImageUrl(relativePath?: string): string {
    const assetsBasePath = 'assets/img/';
    return relativePath ? `${assetsBasePath}${relativePath}` : `${assetsBasePath}default.jpg`;
  }
  
  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  ngOnInit(): void {
  }

  @Output() actionDone = new EventEmitter<string>();

  markActionAsDone(id: string): void {
    this.actionDone.emit(id);
  }

}
