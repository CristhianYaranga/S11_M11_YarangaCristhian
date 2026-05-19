import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Estudiante } from '../models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private estudiantesSubject = new BehaviorSubject<Estudiante[]>(this.getEstudiantesIniciales());
  public estudiantes$ = this.estudiantesSubject.asObservable();

  constructor() {}

  private getEstudiantesIniciales(): Estudiante[] {
    return [
      {
        id: '1',
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan@example.com',
        telefono: '3001234567',
        edad: 20,
        carrera: 'Ingeniería de Sistemas',
        codigo: 'EST001',
        fechaNacimiento: '2004-01-15',
        genero: 'Masculino',
        direccion: 'Calle 10 #20-30'
      },
      {
        id: '2',
        nombre: 'María',
        apellido: 'García',
        correo: 'maria@example.com',
        telefono: '3009876543',
        edad: 21,
        carrera: 'Diseño Gráfico',
        codigo: 'EST002',
        fechaNacimiento: '2003-05-20',
        genero: 'Femenino',
        direccion: 'Calle 15 #50-40'
      }
    ];
  }

  getEstudiantes(): Estudiante[] {
    return this.estudiantesSubject.getValue();
  }

  agregarEstudiante(estudiante: Estudiante): void {
    const nuevoEstudiante = {
      ...estudiante,
      id: this.generarId()
    };
    const estudiantes = this.getEstudiantes();
    this.estudiantesSubject.next([...estudiantes, nuevoEstudiante]);
  }

  actualizarEstudiante(id: string, estudiante: Estudiante): void {
    const estudiantes = this.getEstudiantes();
    const index = estudiantes.findIndex(e => e.id === id);
    if (index !== -1) {
      const actualizado = { ...estudiante, id };
      estudiantes[index] = actualizado;
      this.estudiantesSubject.next([...estudiantes]);
    }
  }

  eliminarEstudiante(id: string): void {
    const estudiantes = this.getEstudiantes();
    const filtrados = estudiantes.filter(e => e.id !== id);
    this.estudiantesSubject.next(filtrados);
  }

  private generarId(): string {
    return `EST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
