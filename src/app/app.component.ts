import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'history-app';

  private timelinesLinkActive: boolean;
  private eventsLinkActive: boolean;
  private personsLinkActive: boolean;
  private referencesLinkActive: boolean;
  private authorsLinkActive: boolean;

  ngOnInit() {
    this.timelinesLinkActive = true;
    this.eventsLinkActive = false;
    this.personsLinkActive = false;
    this.referencesLinkActive = false;
    this.authorsLinkActive = false;

    this.setActiveClass(location.pathname);
  }

  addActiveClass($event) {
    this.setActiveClass($event.target.pathname);
  }

  setActiveClass(pathname) {
    if (pathname === '/timelines') {
      this.timelinesLinkActive = true;
      this.eventsLinkActive = false;
      this.personsLinkActive = false;
      this.referencesLinkActive = false;
      this.authorsLinkActive = false;
    } else if (pathname === '/manager/events') {
      this.timelinesLinkActive = false;
      this.eventsLinkActive = true;
      this.personsLinkActive = false;
      this.referencesLinkActive = false;
      this.authorsLinkActive = false;
    } else if (pathname === '/manager/persons') {
      this.timelinesLinkActive = false;
      this.eventsLinkActive = false;
      this.personsLinkActive = true;
      this.referencesLinkActive = false;
      this.authorsLinkActive = false;
    } else if (pathname === '/manager/references') {
      this.timelinesLinkActive = false;
      this.eventsLinkActive = false;
      this.personsLinkActive = false;
      this.referencesLinkActive = true;
      this.authorsLinkActive = false;
    } else if (pathname === '/manager/authors') {
      this.timelinesLinkActive = false;
      this.eventsLinkActive = false;
      this.personsLinkActive = false;
      this.referencesLinkActive = false;
      this.authorsLinkActive = true;
    }
  }
}
