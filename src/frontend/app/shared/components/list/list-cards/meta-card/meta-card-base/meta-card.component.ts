
import {of as observableOf,  Observable ,  combineLatest } from 'rxjs';
import { Component, ContentChild, ContentChildren, Input, QueryList } from '@angular/core';

import { CardStatus } from '../../../../application-state/application-state.service';
import { MetaCardItemComponent } from '../meta-card-item/meta-card-item.component';
import { MetaCardTitleComponent } from '../meta-card-title/meta-card-title.component';
import { IPermissionConfigs } from '../../../../../../core/current-user-permissions.config';
import { map, tap } from 'rxjs/operators';

export interface MetaCardMenuItem {
  icon?: string;
  label: string;
  action: Function;
  can?: Observable<boolean>;
  disabled?: Observable<boolean>;
}
@Component({
  selector: 'app-meta-card',
  templateUrl: './meta-card.component.html',
  styleUrls: ['./meta-card.component.scss']
})
export class MetaCardComponent {

  @ContentChildren(MetaCardItemComponent)
  metaItems: QueryList<MetaCardItemComponent>;

  @ContentChild(MetaCardTitleComponent)
  title: MetaCardTitleComponent;

  @Input('status$')
  status$: Observable<CardStatus>;

  @Input('actionMenu')
  set actionMenu(actionMenu: MetaCardMenuItem[]) {
    this._actionMenu = actionMenu.map(menuItem => {
      if (!menuItem.can) {
        menuItem.can = observableOf(true);
      }
      return menuItem;
    });
    this.showMenu$ = combineLatest(actionMenu.map(menuItem => menuItem.can)).pipe(
      map(cans => cans.some(can => can))
    );
  }

  public _actionMenu: MetaCardMenuItem[];
  public showMenu$: Observable<boolean>;

  @Input('clickAction')
  clickAction: Function = null;

  constructor() {
    if (this.actionMenu) {
      this.actionMenu = this.actionMenu.map(element => {
        if (!element.disabled) {
          element.disabled = observableOf(false);
        }
        return element;
      });
    }
  }

  cancelPropagation = (event) => {
    event.cancelBubble = true;
    event.stopPropagation();
  }

}
