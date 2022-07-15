import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent implements OnInit {
  imagenSubir!: File;
  imgTem: string = '';

  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.imgTem = '';
    this.modalImagenService.cerrarModal();
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
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then((img) => {
        Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      })
      .catch((err) => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }
}
