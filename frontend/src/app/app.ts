import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InactivityService } from './core/services/inactivity.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('employee_22');

  constructor(private inactivityService: InactivityService) {
    
  }

  ngOnInit(): void {
    this.inactivityService.startWatching();
  }
}
