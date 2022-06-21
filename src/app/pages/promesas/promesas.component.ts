import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [],
})
export class PromesasComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.getUsuarios().then((usuarios) => {
      console.log(usuarios);
    });

    // const promesa = new Promise((resolve, reject) => {
    //   if (false) {
    //     resolve('Hola Mundo');
    //   } else {
    //     reject('Algo salio mal');
    //   }
    // });

    // promesa
    //   .then(() => {
    //     console.log('Promesa Termine');
    //   })
    //   .catch((err) => {
    //     console.log('Error en promesa', err);
    //   });

    // console.log('Fin init');
  }

  getUsuarios() {
    const promesa = new Promise((resolve) => {
      fetch('https://reqres.in/api/users')
        .then((resp) => resp.json())
        .then((body) => resolve(body.data));
    });

    return promesa;
  }
}
