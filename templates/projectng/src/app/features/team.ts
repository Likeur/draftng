import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamProject {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Completed' | 'Review' | 'On Hold';
  progress: number;
}

interface TeamMember {
  initials: string;
  name: string;
  avatarGrad: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  lead: string;
  leadAvatarGrad: string;
  members: TeamMember[];
  projects: TeamProject[];
  velocity: number; // percentage
}

@Component({
  selector: 'app-team',
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-blur-slide font-sans">
      
      <!-- Team Header Panel -->
      <section class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 class="font-display font-extrabold text-md tracking-tight select-none">
            Teams Workspace
          </h2>
          <p class="text-xs text-zinc-400 mt-1">Configure functional developer groups, leads, projects and velocity metrics.</p>
        </div>

        <div class="flex items-center gap-3 select-none">
          <!-- View switcher toggle (Grid vs List) -->
          <div [class]="isDark() ? 'bg-zinc-900/60 border-zinc-850' : 'bg-zinc-100 border-zinc-200'" class="p-1 rounded-xl border flex items-center shrink-0">
            <button 
              (click)="viewMode.set('grid')" 
              [class]="viewMode() === 'grid' ? (isDark() ? 'bg-zinc-800 text-zinc-50 font-bold' : 'bg-white text-zinc-950 font-bold shadow-sm') : 'text-zinc-400 hover:text-zinc-650'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all clickable-scale">
              Grid
            </button>
            <button 
              (click)="viewMode.set('list')" 
              [class]="viewMode() === 'list' ? (isDark() ? 'bg-zinc-800 text-zinc-50 font-bold' : 'bg-white text-zinc-950 font-bold shadow-sm') : 'text-zinc-400 hover:text-zinc-650'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all clickable-scale">
              List
            </button>
          </div>

          <button 
            (click)="createTeam()"
            class="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold text-xs transition-colors cursor-pointer select-none clickable-scale">
            Create Team
          </button>
        </div>
      </section>

      @if (viewMode() === 'grid') {
        <!-- Team Grid Cards (Flat layout, subtle dark mode borders) -->
        <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          @for (team of teams(); track team.id) {
            <div 
              [class]="isDark() ? 'bg-zinc-900 border-zinc-850 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-850'" 
              class="p-6 rounded-2xl border flex flex-col justify-between min-h-[360px] transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
              
              <div class="space-y-4">
                <!-- Top details -->
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="font-display font-bold text-sm leading-tight text-zinc-900 dark:text-zinc-50">{{ team.name }}</h3>
                    <p class="text-[10px] text-zinc-450 mt-1 font-semibold leading-normal">{{ team.description }}</p>
                  </div>
                  <span class="px-2.5 py-0.5 rounded text-[8px] font-bold bg-teal-500/10 text-teal-500 border border-teal-500/20 shrink-0">
                    {{ team.projects.length }} Active
                  </span>
                </div>

                <!-- Lead Info -->
                <div class="flex items-center gap-2 text-[10px] font-semibold text-zinc-455">
                  <span>Lead:</span>
                  <span [class]="team.leadAvatarGrad" class="w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-[8px] text-zinc-950">
                    {{ team.lead.split(' ').map(n => n[0]).join('') }}
                  </span>
                  <span class="text-zinc-800 dark:text-zinc-100 font-bold">{{ team.lead }}</span>
                </div>

                <!-- Members Avatar list -->
                <div class="flex items-center gap-2 pt-1">
                  <span class="text-[10px] text-zinc-450 font-bold mr-1">Roster:</span>
                  <div class="flex items-center -space-x-1.5">
                    @for (mem of team.members; track mem.name) {
                      <div 
                        [title]="mem.name" 
                        [class]="mem.avatarGrad + (isDark() ? ' border-zinc-950' : ' border-zinc-50')" 
                        class="w-5.5 h-5.5 rounded-full border flex items-center justify-center font-bold text-[7px] text-zinc-950 cursor-help select-none">
                        {{ mem.initials }}
                      </div>
                    }
                  </div>
                </div>

                <!-- Ongoing Projects Section -->
                <div class="pt-3 border-t" [class]="isDark() ? 'border-zinc-850' : 'border-zinc-100'">
                  <span class="text-[10px] text-zinc-400 font-bold block mb-2">Ongoing Projects</span>
                  <div class="space-y-2">
                    @for (project of team.projects; track project.title) {
                      <div 
                        [class]="isDark() ? 'bg-zinc-900/60 border-zinc-850/60' : 'bg-zinc-50 border-zinc-100'" 
                        class="p-2.5 rounded-xl border flex flex-col gap-1.5 transition-colors">
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-xs text-zinc-800 dark:text-zinc-100 truncate max-w-[160px]">{{ project.title }}</span>
                          <span 
                            [class]="project.priority === 'High' ? 'text-rose-500 bg-rose-500/10' : (project.priority === 'Medium' ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-500 bg-zinc-500/10')" 
                            class="px-1.5 py-0.2 rounded text-[7px] font-extrabold shrink-0">
                            {{ project.priority }}
                          </span>
                        </div>
                        <div class="flex items-center justify-between gap-3 text-[10px]">
                          <div class="flex-grow h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                            <div class="h-full bg-teal-500 rounded-full transition-all duration-350" [style.width.%]="project.progress"></div>
                          </div>
                          <span class="font-bold text-zinc-500 dark:text-zinc-400 min-w-[28px] text-right">{{ project.progress }}%</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <!-- Bottom Progress details -->
              <div class="mt-6 pt-4 border-t" [class]="isDark() ? 'border-zinc-850' : 'border-zinc-100'">
                <div class="flex items-center justify-between text-[10px] font-bold text-zinc-400 mb-1.5">
                  <span>Cycle velocity</span>
                  <span class="text-teal-500">{{ team.velocity }}% Target</span>
                </div>
                
                <!-- Progress bar -->
                <div class="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div class="h-full bg-teal-500 rounded-full transition-all duration-300" [style.width.%]="team.velocity"></div>
                </div>

                <div class="flex justify-end gap-2 mt-4">
                  <button 
                    (click)="addMember(team.id)"
                    class="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[10px] font-bold cursor-pointer transition-colors clickable-scale">
                    Add Member
                  </button>
                  <button 
                    (click)="newProject(team.id)"
                    class="px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 text-[10px] font-bold cursor-pointer transition-colors clickable-scale">
                    New Project
                  </button>
                </div>
              </div>

            </div>
          }
        </section>
      } @else {
        <!-- Team List View (Full width rows, shadow-free, subtle dark borders) -->
        <section class="space-y-4">
          @for (team of teams(); track team.id) {
            <div 
              [class]="isDark() ? 'bg-zinc-900 border-zinc-850 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-855'" 
              class="p-5 rounded-2xl border flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
              
              <!-- Left section: Team Info -->
              <div class="flex-grow max-w-xl">
                <div class="flex items-center gap-3">
                  <h3 class="font-display font-bold text-sm leading-tight text-zinc-900 dark:text-zinc-50">{{ team.name }}</h3>
                  <span class="px-2 py-0.5 rounded text-[8px] font-bold bg-teal-500/10 text-teal-500 border border-teal-500/20">
                    {{ team.projects.length }} Projects
                  </span>
                </div>
                <p class="text-[10px] text-zinc-450 mt-1 font-semibold leading-normal">{{ team.description }}</p>
                
                <div class="flex flex-wrap items-center gap-4 mt-3 text-[10px] font-semibold text-zinc-455">
                  <div class="flex items-center gap-1.5">
                    <span>Lead:</span>
                    <span [class]="team.leadAvatarGrad" class="w-4.5 h-4.5 rounded-full flex items-center justify-center font-extrabold text-[7.5px] text-zinc-950">
                      {{ team.lead.split(' ').map(n => n[0]).join('') }}
                    </span>
                    <span class="text-zinc-800 dark:text-zinc-100 font-bold">{{ team.lead }}</span>
                  </div>
                  
                  <div class="flex items-center gap-1.5">
                    <span>Roster:</span>
                    <div class="flex items-center -space-x-1.5">
                      @for (mem of team.members; track mem.name) {
                        <div 
                          [title]="mem.name" 
                          [class]="mem.avatarGrad + (isDark() ? ' border-zinc-950' : ' border-zinc-50')" 
                          class="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[7px] text-zinc-950 cursor-help select-none shrink-0">
                          {{ mem.initials }}
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <!-- Middle section: Projects (Side-by-side) -->
              <div class="w-full xl:w-[320px] shrink-0 border-t xl:border-t-0 xl:border-l xl:border-r border-zinc-200 dark:border-zinc-850 py-4 xl:py-0 xl:px-6">
                <span class="text-[10px] text-zinc-400 font-bold block mb-1.5">Projects Status</span>
                <div class="grid grid-cols-1 gap-2">
                  @for (project of team.projects; track project.title) {
                    <div class="flex items-center justify-between gap-4 text-xs font-semibold">
                      <span class="text-zinc-850 dark:text-zinc-200 truncate text-[11px] max-w-[140px]">{{ project.title }}</span>
                      <div class="flex items-center gap-2 shrink-0">
                        <div class="w-16 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                          <div class="h-full bg-teal-500 rounded-full" [style.width.%]="project.progress"></div>
                        </div>
                        <span class="text-[10px] text-zinc-500 dark:text-zinc-400 text-right min-w-[24px] font-bold">{{ project.progress }}%</span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Right section: Cycle stats & actions -->
              <div class="w-full xl:w-48 shrink-0 flex flex-col justify-between gap-3 select-none">
                <div>
                  <div class="flex items-center justify-between text-[10px] font-bold text-zinc-400 mb-1">
                    <span>Cycle velocity</span>
                    <span class="text-teal-500 font-bold">{{ team.velocity }}%</span>
                  </div>
                  <div class="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div class="h-full bg-teal-500 rounded-full transition-all duration-300" [style.width.%]="team.velocity"></div>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button 
                    (click)="addMember(team.id)"
                    class="flex-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[10px] font-bold cursor-pointer transition-colors text-center clickable-scale">
                    Add Member
                  </button>
                  <button 
                    (click)="newProject(team.id)"
                    class="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 text-[10px] font-bold cursor-pointer transition-colors text-center clickable-scale">
                    Project
                  </button>
                </div>
              </div>

            </div>
          }
        </section>
      }

    </div>
  `
})
export class TeamComponent {
  public readonly isDark = input<boolean>(false);
  protected readonly viewMode = signal<'grid' | 'list'>('grid');

  // List of active dev teams with projects list
  protected readonly teams = signal<Team[]>([
    {
      id: 1,
      name: 'Core Platform Group',
      description: 'Focuses on Angular application performance, core framework upgrade compliance, and route scaffolding.',
      lead: 'Lisa Nguyen',
      leadAvatarGrad: 'avatar-grad-1',
      members: [
        { initials: 'LN', name: 'Lisa Nguyen', avatarGrad: 'avatar-grad-1' },
        { initials: 'SU', name: 'Simba Developer', avatarGrad: 'avatar-grad-2' },
        { initials: 'AN', name: 'Alexandre Naudin', avatarGrad: 'avatar-grad-3' }
      ],
      projects: [
        { title: 'Angular 22 Core Migration', priority: 'High', status: 'In Progress', progress: 75 },
        { title: 'Route Scaffolding CLI', priority: 'Medium', status: 'Review', progress: 90 }
      ],
      velocity: 88
    },
    {
      id: 2,
      name: 'Design Systems Architecture',
      description: 'Engineers reusable layout guidelines, Tailwind CSS v4 variables configuration, and shadow-free UI token libraries.',
      lead: 'Simba Developer',
      leadAvatarGrad: 'avatar-grad-2',
      members: [
        { initials: 'SD', name: 'Simba Developer', avatarGrad: 'avatar-grad-2' },
        { initials: 'DK', name: 'Daniel Kojo', avatarGrad: 'avatar-grad-4' },
        { initials: 'ER', name: 'Elena Rostova', avatarGrad: 'avatar-grad-1' }
      ],
      projects: [
        { title: 'Tailwind CSS v4 Variables', priority: 'High', status: 'In Progress', progress: 88 },
        { title: 'Shadow-free UI Library', priority: 'Low', status: 'On Hold', progress: 40 }
      ],
      velocity: 94
    },
    {
      id: 3,
      name: 'Integrations & APIs',
      description: 'Connects third party tooling, database migration workflows, and secures authentication web endpoints.',
      lead: 'Daniel Kojo',
      leadAvatarGrad: 'avatar-grad-4',
      members: [
        { initials: 'DK', name: 'Daniel Kojo', avatarGrad: 'avatar-grad-4' },
        { initials: 'AN', name: 'Alexandre Naudin', avatarGrad: 'avatar-grad-3' },
        { initials: 'DP', name: 'Diana Prince', avatarGrad: 'avatar-grad-5' }
      ],
      projects: [
        { title: 'OAuth Browser Hydration', priority: 'High', status: 'In Progress', progress: 60 },
        { title: 'Database Migration Script', priority: 'Medium', status: 'Completed', progress: 100 }
      ],
      velocity: 75
    }
  ]);

  protected addMember(id: number): void {
    const team = this.teams().find(t => t.id === id);
    if (!team) return;

    this.teams.update(list => 
      list.map(t => {
        if (t.id === id) {
          const names = ['Bruce Wayne', 'Yuki Tanaka', 'Clara Oswald'];
          const initials = ['BW', 'YT', 'CO'];
          const grads = ['avatar-grad-4', 'avatar-grad-2', 'avatar-grad-3'];
          const idx = t.members.length % names.length;
          
          return { 
            ...t, 
            members: [
              ...t.members, 
              { initials: initials[idx], name: names[idx], avatarGrad: grads[idx] }
            ] 
          };
        }
        return t;
      })
    );
    alert(`Added new developer slot successfully to ${team.name}!`);
  }

  protected newProject(id: number): void {
    const team = this.teams().find(t => t.id === id);
    if (!team) return;

    this.teams.update(list =>
      list.map(t => {
        if (t.id === id) {
          return {
            ...t,
            projects: [
              ...t.projects,
              { title: 'API Integration Testing', priority: 'Medium', status: 'In Progress', progress: 10 }
            ]
          };
        }
        return t;
      })
    );
    alert(`Created new active project slot successfully for ${team.name}!`);
  }

  protected createTeam(): void {
    alert('Create Team: Enter parameters to structure a new developer operations group.');
  }
}

