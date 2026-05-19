import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Estudiante, CARRERAS, GENEROS } from '../../models/estudiante.model';
import { EstudiantesService } from '../../services/estudiantes.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-estudiantes',
  standalone: false,
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit, OnDestroy {
  
  // Configuración del formulario
  estudianteForm!: FormGroup;
  paso = 1;
  
  // Datos
  estudiantes: Estudiante[] = [];
  estudianteSeleccionado: Estudiante | null = null;
  
  // Edición
  editando = false;
  estudianteEnEdicion: Estudiante | null = null;
  
  // Opciones
  carreras = CARRERAS;
  generos = GENEROS;
  
  // Gestión de suscripciones
  private destroy$ = new Subject<void>();
  
  // Validadores personalizados
  private patternTelefono = /^\d{7,15}$/; // Acepta 7 a 15 dígitos

  constructor(
    private fb: FormBuilder,
    private estudiantesService: EstudiantesService
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private inicializarFormulario(): void {
    this.estudianteForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      apellido: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      correo: ['', [
        Validators.required,
        Validators.email
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(this.patternTelefono)
      ]],
      edad: ['', [
        Validators.required,
        Validators.min(18),
        Validators.max(80)
      ]],
      carrera: ['', Validators.required],
      codigo: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      direccion: ['', [
        Validators.required,
        Validators.minLength(5)
      ]]
    });
  }

  private cargarEstudiantes(): void {
    this.estudiantesService.estudiantes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(estudiantes => {
        this.estudiantes = estudiantes;
      });
  }

  guardarEstudiante(): void {
    if (!this.estudianteForm.valid) {
      this.marcarTodosCamposTocados();
      return;
    }

    const formData = this.estudianteForm.value;

    if (this.editando && this.estudianteEnEdicion) {
      this.estudiantesService.actualizarEstudiante(
        this.estudianteEnEdicion.id!,
        formData
      );
    } else {
      this.estudiantesService.agregarEstudiante(formData);
    }

    this.resetearFormulario();
  }

  editarEstudiante(estudiante: Estudiante): void {
    this.editando = true;
    this.estudianteEnEdicion = estudiante;
    this.estudianteForm.patchValue(estudiante);
    this.paso = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarEstudiante(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      this.estudiantesService.eliminarEstudiante(id);
    }
  }

  cancelarEdicion(): void {
    this.resetearFormulario();
  }

  private resetearFormulario(): void {
    this.estudianteForm.reset();
    this.editando = false;
    this.estudianteEnEdicion = null;
    this.paso = 1;
  }

  private marcarTodosCamposTocados(): void {
    Object.keys(this.estudianteForm.controls).forEach(key => {
      const control = this.estudianteForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  siguientePaso(): void {
    // Validar campos del paso 1
    const camposPaso1 = ['nombre', 'apellido', 'correo', 'telefono', 'edad', 'codigo'];
    const todasValidas = camposPaso1.every(campo => {
      const control = this.estudianteForm.get(campo);
      return control && control.valid;
    });

    if (todasValidas) {
      this.paso = 2;
    } else {
      camposPaso1.forEach(campo => {
        const control = this.estudianteForm.get(campo);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  anteriorPaso(): void {
    this.paso = 1;
  }

  // Métodos helper para validación en template
  tieneError(nombreCampo: string): boolean {
    const control = this.estudianteForm.get(nombreCampo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  obtenerErrorMessage(nombreCampo: string): string {
    const control = this.estudianteForm.get(nombreCampo);
    if (!control || !control.errors) {
      return '';
    }

    const errores = control.errors;

    if (errores['required']) {
      return `${this.traducirCampo(nombreCampo)} es requerido`;
    }
    if (errores['minlength']) {
      return `${this.traducirCampo(nombreCampo)} debe tener al menos ${errores['minlength'].requiredLength} caracteres`;
    }
    if (errores['maxlength']) {
      return `${this.traducirCampo(nombreCampo)} no debe exceder ${errores['maxlength'].requiredLength} caracteres`;
    }
    if (errores['email']) {
      return 'Ingrese un correo electrónico válido';
    }
    if (errores['pattern']) {
      if (nombreCampo === 'telefono') {
        return 'Ingrese un teléfono válido (7 a 15 dígitos)';
      }
      return `${this.traducirCampo(nombreCampo)} tiene un formato inválido`;
    }
    if (errores['min']) {
      return `${this.traducirCampo(nombreCampo)} debe ser mayor o igual a ${errores['min'].min}`;
    }
    if (errores['max']) {
      return `${this.traducirCampo(nombreCampo)} debe ser menor o igual a ${errores['max'].max}`;
    }

    return 'Campo inválido';
  }

  private traducirCampo(nombreCampo: string): string {
    const traduccion: { [key: string]: string } = {
      nombre: 'Nombre',
      apellido: 'Apellido',
      correo: 'Correo',
      telefono: 'Teléfono',
      edad: 'Edad',
      carrera: 'Carrera',
      codigo: 'Código',
      fechaNacimiento: 'Fecha de Nacimiento',
      genero: 'Género',
      direccion: 'Dirección'
    };
    return traduccion[nombreCampo] || nombreCampo;
  }

  esValido(nombreCampo: string): boolean {
    const control = this.estudianteForm.get(nombreCampo);
    return !!(control && control.valid && (control.dirty || control.touched));
  }

  cerrarModal(): void {
    this.estudianteSeleccionado = null;
  }

  trackByFn(index: number, item: Estudiante): any {
    return item.id;
  }

  obtenerCamposInvalidos(): string[] {
    const camposInvalidos: string[] = [];
    Object.keys(this.estudianteForm.controls).forEach(key => {
      const control = this.estudianteForm.get(key);
      if (control && control.invalid) {
        camposInvalidos.push(this.traducirCampo(key));
      }
    });
    return camposInvalidos;
  }
}