import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [],
})
export class RxjsComponent implements OnInit, OnDestroy {
  public intervalSubs: Subscription;

  constructor() {
    // this.retornoObservable()
    //   .pipe(retry(2))
    //   .subscribe(
    //     (valor) => console.log('Subs: ', valor),
    //     (err) => console.warn('Error: ', err),
    //     () => console.info('Obs TErminado')
    //   );

    this.intervalSubs = this.retornaIntervalo().subscribe((valor) =>
      console.log(valor)
    );
  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  ngOnInit(): void {}

  retornaIntervalo(): Observable<number> {
    const intervalo$ = interval(500).pipe(
      take(10),
      map((valor) => valor + 1),
      filter((valor) => valor % 2 === 0)
    );

    return intervalo$;
  }

  retornoObservable(): Observable<number> {
    let i = 0;

    const obs$ = new Observable<number>((observer) => {
      const intervalo = setInterval(() => {
        i++;
        observer.next(i);

        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        if (i === 2) {
          i = 0;
          observer.error('I llego a 2');
        }
      }, 1000);
    });

    return obs$;
  }
}
