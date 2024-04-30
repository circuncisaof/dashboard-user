import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css']
})
export class SlidesComponent implements OnInit, OnDestroy {

  timerSubs$!:Subscription;

  @Input() images: string[] = [];

  private _indexImageActive: number = 0
  get indexImageActive() {
    return this._indexImageActive;
  }

  set indexImageActive(value:number) {
    this._indexImageActive = value < this.images.length ? value : 0;
  }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer():void {
    this.timerSubs$ = timer(30000).subscribe(()=>{
      this.activeImage(
        this.indexImageActive + 1
      )
    })
  }

  stopTimer():void{
    this.timerSubs$?.unsubscribe()
  }

  activeImage(index:number):void{
    this.indexImageActive = index;
    this.startTimer();
  }
}
