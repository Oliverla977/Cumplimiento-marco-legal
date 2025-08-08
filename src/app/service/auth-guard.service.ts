import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  private auth = inject(Auth);

  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        if (user) {
          observer.next(true);
        } else {
          this.router.navigate(['/login']);
          observer.next(false);
        }
        observer.complete();
      });

      return { unsubscribe };
    });
  }
}
