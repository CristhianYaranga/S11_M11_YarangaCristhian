export interface Estudiante {
  id?: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  edad: number;
  carrera: string;
  codigo: string;
  fechaNacimiento: string;
  genero: string;
  direccion: string;
}

export const CARRERAS = [
  'Ingeniería de Sistemas',
  'Diseño Gráfico',
  'Marketing',
  'Administración',
  'Ingeniería Civil',
  'Contabilidad'
];

export const GENEROS = ['Masculino', 'Femenino', 'Otro'];
