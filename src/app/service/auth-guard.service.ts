import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  private auth = inject(Auth);

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        if (user) {

           // usuario autenticado, revisamos rol
          const usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion') || '[]');
          const rolUsuario = usuarioSesion.length ? usuarioSesion[0].id_rol : 0;

          const rolesPermitidos = route.data['roles'] as number[] | undefined;


          if (!rolesPermitidos || rolesPermitidos.includes(rolUsuario)) {
            observer.next(true);
          } else {
            this.router.navigate(['/403']);
            observer.next(false);
          }


          //observer.next(true);
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
