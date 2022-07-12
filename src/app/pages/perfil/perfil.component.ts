import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  public perfilForm!: FormGroup;
  public usuario: Usuario;
  imagenSubir!: File;
  imgTem: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuariosService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required]],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(
      (resp) => {
        console.log(resp);
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
      },
      (err) => {
        console.warn(err);
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  cambiarImagen(target: any) {
    console.log('Cargar img');

    this.imagenSubir = target.files[0];

    if (!target.files[0]) {
      this.imgTem = '';
      return;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(target.files[0]);

    reader.onloadend = () => {
      this.imgTem = reader.result?.toString() || '';
    };
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid || '')
      .then((img) => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
      })
      .catch((err) => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }
}
