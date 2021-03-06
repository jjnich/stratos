import { Injectable } from '@angular/core';
import { IListConfig, ListViewTypes } from '../../list.component.types';
import { APIResource } from '../../../../../store/types/api.types';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/app-state';
import { ListView } from '../../../../../store/actions/list.actions';
import { CfStacksDataSource } from './cf-stacks-data-source';
import { BaseCfListConfig } from '../base-cf/base-cf-list-config';
import { CfStacksCardComponent } from './cf-stacks-card/cf-stacks-card.component';
import { ActiveRouteCfOrgSpace } from '../../../../../features/cloud-foundry/cf-page.types';
import { ITableColumn } from '../../list-table/table.types';

@Injectable()
export class CfStacksListConfigService extends BaseCfListConfig<APIResource> {
  dataSource: CfStacksDataSource;
  cardComponent = CfStacksCardComponent;
  enableTextFilter = true;
  text = {
    title: null,
    filter: 'Search by name',
    noEntries: 'There are no stacks'
  };
  columns: ITableColumn<APIResource>[] = [{
    columnId: 'name',
    headerCell: () => 'Name',
    sort: {
      type: 'sort',
      orderKey: 'name',
      field: 'entity.name'
    }
  }, {
    columnId: 'createdAt',
    headerCell: () => 'Creation',
    sort: {
      type: 'sort',
      orderKey: 'createdAt',
      field: 'metadata.created_at'
    },
  }];

  constructor(private store: Store<AppState>, private activeRouteCfOrgSpace: ActiveRouteCfOrgSpace) {
    super();
    this.dataSource = new CfStacksDataSource(this.store, activeRouteCfOrgSpace.cfGuid, this);
  }

  getDataSource = () => this.dataSource;
  getColumns = () => this.columns;
}
