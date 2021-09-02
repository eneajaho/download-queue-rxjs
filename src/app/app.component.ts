import { Component } from '@angular/core';
import { of, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  template: `
    <button (click)="addToQueue('test' + index)">
      Add to queue
    </button>

    <ul>
      <li *ngFor="let item of queueItems">
        {{ item }}
      </li>
    </ul>

    <ng-container *ngIf="(queue$ | async)"></ng-container>
  `
})
export class AppComponent {
  queue = new Subject<string>();

  // will be used as a counter
  index = 0;

  // will be used only to preview the queue
  queueItems = [];

  queue$ = this.queue.asObservable().pipe(
    // by using concatMap we wait for the observable to finish before
    // subsrcibing to the next one
    concatMap(async item => {
      // await this.download(item).then(res => {
      //   console.log(res);
      //   this.removeFromQueue(item);
      //   return of(item);
      // });

      let downloadedItem = await this.download(item);
      console.log(downloadedItem);
      this.removeFromQueue(item);
      return of(item);
    })
  );

  addToQueue(item: string): void {
    this.queue.next(item);
    this.queueItems = [...this.queueItems, item];
    this.index++;
  }

  removeFromQueue(item: string): void {
    this.queueItems = this.queueItems.filter(x => x !== item);
  }

  async download(item: string): Promise<string> {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve('Donwloaded >> ' + item);
      }, 1500);
    });
  }
}
