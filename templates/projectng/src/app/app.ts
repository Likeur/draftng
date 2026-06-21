import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar';
import { TopbarComponent } from './shared/components/topbar';
import { WorkspaceService } from './shared/services/workspace.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent, 
    TopbarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly state = inject(WorkspaceService);
}
