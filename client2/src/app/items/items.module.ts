import { NgModule } from "@angular/core";
import { CommonModule, NgPlural } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from "@angular/router";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatTabsModule,
} from '@angular/material';
import { FormlyModule } from "@ngx-formly/core";
import { FormlyMaterialModule } from "@ngx-formly/material";
import { FileUploadModule } from 'ng2-file-upload';
import { ItemComponent } from "./item/item.component";
import { ItemService } from "./shared/item.service";
import { ItemsService } from "./shared/items.service";
import { ItemPageComponent } from './item-page/item-page.component';
import { ItemAutoCompleteComponent } from './item-auto-complete/item-auto-complete.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ItemSearchBarComponent } from './item-search-bar/item-search-bar.component';
import { ItemsTableComponent } from './items-table/items-table.component';
import { CovalentDataTableModule, CovalentPagingModule } from '@covalent/core';
import { ItemResolverService } from './shared/item.resolver.service';
import { ReturnPageComponent } from './return-page/return-page.component';
import { SharedModule } from "../shared/shared.module";
import { ItemSearchPageComponent } from './item-search-page/item-search-page.component';
import { ItemEditFormComponent } from "./item-edit-form/item-edit-form.component";
import { ItemAddPageComponent } from './item-add-page/item-add-page.component';
import { ItemHistoryComponent } from './item-history/item-history.component';
import { ItemLabelsComponent } from './item-labels/item-labels.component';
import { ItemStatusComponent } from './item-status/item-status.component';
import { ItemAntolinComponent } from './item-antolin/item-antolin.component';
import { ItemEditCoverComponent } from './item-edit-cover/item-edit-cover.component';
import { ItemCardComponent } from './item-card/item-card.component';

/**
 * Angular module for the items (books, CDs) in the library.
 *
 * The module provides the ItemsService communicating the backend and the components
 * for viewing and editing items.
 */
@NgModule({
  imports: [
    FileUploadModule,
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CovalentDataTableModule,
    CovalentPagingModule,
    SharedModule,
    MatCardModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
    RouterModule,
  ],
  declarations: [
    ItemComponent,
    ItemPageComponent,
    ItemAutoCompleteComponent,
    ItemSearchBarComponent,
    ItemsTableComponent,
    ReturnPageComponent,
    ItemSearchPageComponent,
    ItemEditFormComponent,
    ItemAddPageComponent,
    ItemHistoryComponent,
    ItemLabelsComponent,
    ItemStatusComponent,
    ItemAntolinComponent,
    ItemEditCoverComponent,
    ItemCardComponent,
  ],
  providers: [
    ItemResolverService,
    ItemService,
    ItemsService,
  ],
  exports: [
    ItemComponent,
    ItemAutoCompleteComponent,
    ItemSearchBarComponent,
    ItemPageComponent,
    ItemsTableComponent,
    ItemEditCoverComponent,
    ItemStatusComponent,
    ItemAntolinComponent,
    ItemCardComponent,
    ItemSearchPageComponent,
  ]
})
export class ItemsModule { }
