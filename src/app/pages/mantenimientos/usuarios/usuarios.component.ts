import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;

  imgSubs!: Subscription;

  constructor(
    private usuarioService: UsuariosService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuario();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => {
        this.cargarUsuario();
      });
  }

  cargarUsuario() {
    this.cargando = true;
    this.usuarioService
      .cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuario();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.busquedasService.buscar('usuarios', termino).subscribe((resp) => {
      this.usuarios = resp;
    });
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioService.uid) {
      Swal.fire('Error', 'No puedo borrarse a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe((resp) => {
          Swal.fire(
            'Usuario Borrado!',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
          );
          this.cargarUsuario();
        });
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe((resp) => {
      console.log(resp);
    });
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal(
      'usuarios',
      usuario.uid || '',
      usuario.img
    );
  }
}
