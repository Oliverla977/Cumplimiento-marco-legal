import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  authState,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private auth = inject(Auth);

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  registrarse(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  getAuth(): Observable<any> {
    return authState(this.auth);
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  currentUser(){
    return this.auth.currentUser;
  }

  // funciones para cambio de contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    
    if (!user || !user.email) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      console.log('Contraseña actualizada correctamente');
    } catch (error: any) {
      // errores
      switch (error.code) {
        case 'auth/wrong-password':
          throw new Error('La contraseña actual es incorrecta');
        case 'auth/weak-password':
          throw new Error('La nueva contraseña es muy débil');
        case 'auth/requires-recent-login':
          throw new Error('Por seguridad, necesitas iniciar sesión nuevamente');
        case 'auth/invalid-credential':
          throw new Error('Credenciales inválidas');
        default:
          throw new Error('Error al cambiar la contraseña: ' + error.message);
      }
    }
  }

  validatePasswordStrength(password: string): { valid: boolean; message: string } {
    if (password.length < 6) {
      return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return { 
        valid: false, 
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' 
      };
    }
    
    return { valid: true, message: 'Contraseña válida' };
  }

}
