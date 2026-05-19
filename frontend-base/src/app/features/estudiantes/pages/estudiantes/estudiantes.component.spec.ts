import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EstudiantesComponent } from './estudiantes.component';
import { EstudiantesService } from '../../services/estudiantes.service';

describe('EstudiantesComponent', () => {
  let component: EstudiantesComponent;
  let fixture: ComponentFixture<EstudiantesComponent>;
  let service: EstudiantesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudiantesComponent],
      imports: [ReactiveFormsModule],
      providers: [EstudiantesService]
    })
    .compileComponents();

    service = TestBed.inject(EstudiantesService);
    fixture = TestBed.createComponent(EstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.estudianteForm).toBeDefined();
    expect(component.estudianteForm.get('nombre')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.estudianteForm.valid).toBeFalsy();
  });

  it('should add estudiante to list', () => {
    const initialCount = component.estudiantes.length;
    const nuevoEstudiante = {
      nombre: 'Test',
      apellido: 'User',
      correo: 'test@example.com',
      telefono: '3001234567',
      edad: 20,
      carrera: 'Ingeniería de Sistemas',
      codigo: 'EST123',
      fechaNacimiento: '2004-01-15',
      genero: 'Masculino',
      direccion: 'Calle 10 #20'
    };
    component.estudianteForm.patchValue(nuevoEstudiante);
    component.guardarEstudiante();
    expect(component.estudiantes.length).toBeGreaterThan(initialCount);
  });

  it('should show error message for invalid email', () => {
    const emailControl = component.estudianteForm.get('correo');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should validate minimum age', () => {
    const edadControl = component.estudianteForm.get('edad');
    edadControl?.setValue(15);
    expect(edadControl?.hasError('min')).toBeTruthy();
  });

  it('should validate phone pattern', () => {
    const telefonoControl = component.estudianteForm.get('telefono');
    telefonoControl?.setValue('123');
    expect(telefonoControl?.hasError('pattern')).toBeTruthy();
  });
});
