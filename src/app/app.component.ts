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
  private sourcesLinkActive: boolean;
  private authorsLinkActive: boolean;
  private essaysLinkActive: boolean;

  ngOnInit() {
    this.timelinesLinkActive = true;
    this.eventsLinkActive = false;
    this.personsLinkActive = false;
    this.sourcesLinkActive = false;
    this.authorsLinkActive = false;
    this.essaysLinkActive = false;

    this.setActiveClass(location.pathname);
  }

  addActiveClass($event) {
    this.setActiveClass($event.target.pathname);
  }

  setActiveClass(pathname) {
    if (pathname.startsWith('/timeline')) {
      this.timelinesLinkActive = true;
      this.eventsLinkActive = false;
      this.personsLinkActive = false;
      this.sourcesLinkActive = false;
      this.authorsLinkActive = false;
      this.essaysLinkActive = false;

    } else if (pathname === '/manager/events') {
      this.timelinesLinkActive = false;
      this.eventsLinkActive = true;
      this.personsLinkActive = false;
      this.sourcesLinkActive = false;
      this.authorsLinkActive = false;
      this.essaysLinkActive = false;

    } else if (pathname === '/manager/persons') {
      this.timelinesLinkActive = false;
      this.eventsLinkActive = false;
      this.personsLinkActive = true;
      this.sourcesLinkActive = false;
      this.authorsLinkActive = false;
      this.essaysLinkActive = false;

    } else if (pathname === '/manager/sources') {
      this.timelinesLinkActive = false;
      this.eventsLinkActive = false;
      this.personsLinkActive = false;
      this.sourcesLinkActive = true;
      this.authorsLinkActive = false;
      this.essaysLinkActive = false;
    } else if (pathname === '/manager/authors') {
      this.timelinesLinkActive = false;
      this.eventsLinkActive = false;
      this.personsLinkActive = false;
      this.sourcesLinkActive = false;
      this.authorsLinkActive = true;
      this.essaysLinkActive = false;

    } else if (pathname.startsWith('/essay')) {
      this.timelinesLinkActive = false;
      this.eventsLinkActive = false;
      this.personsLinkActive = false;
      this.sourcesLinkActive = false;
      this.authorsLinkActive = false;
      this.essaysLinkActive = true;
    }
  }
}
