import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstant } from '../globalConstant/global.constant';

@Injectable({ providedIn: 'root' })
export class InactivityService {

  private readonly TIMEOUT_MS = 60 * 60 * 1000;

  private timer: ReturnType<typeof setTimeout> | null = null;

  private readonly ACTIVITY_EVENTS = [
    'mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'
  ];

  private boundReset = this.resetTimer.bind(this);

  constructor(private router: Router, private zone: NgZone) {}

  startWatching(): void {
    this.zone.runOutsideAngular(() => {
      this.ACTIVITY_EVENTS.forEach(event =>
        window.addEventListener(event, this.boundReset, { passive: true })
      );
    });

    this.resetTimer();
  }


  stopWatching(): void {
    this.ACTIVITY_EVENTS.forEach(event =>
      window.removeEventListener(event, this.boundReset)
    );

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private resetTimer(): void {
    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {

      this.zone.run(() => this.logout());
    }, this.TIMEOUT_MS);
  }

  private logout(): void {
    this.stopWatching();
    localStorage.removeItem(GlobalConstant.LOGIN_LOCAL_KEY);
    localStorage.removeItem(GlobalConstant.TOKEN_KEY);
    alert('You have been logged out due to 1 hour of inactivity.');
    this.router.navigateByUrl('/login');
  }
}
