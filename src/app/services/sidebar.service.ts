import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public sideNavToggleSubject: BehaviorSubject<any> =
    new BehaviorSubject(null);

  constructor() { }

  public toggle() {
    return this.sideNavToggleSubject.next(null);
  }
}