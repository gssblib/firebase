import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorService } from "../../core/error-service";
import { RpcError } from "../../core/rpc-error";
import { BarcodeFieldComponent } from "../../shared/barcode-field/barcode-field.component";
import { Borrower } from '../shared/borrower';
import { BorrowersService } from '../shared/borrowers.service';
import { BorrowerService } from '../shared/borrower.service';

/**
 * Presents the items that a borrower has currently checked out.
 */
@Component({
  selector: 'gsl-borrower-checkouts',
  templateUrl: './borrower-checkouts.component.html',
  styleUrls: ['./borrower-checkouts.component.css']
})
export class BorrowerCheckoutsComponent implements OnInit {
  borrower: Borrower;

  @Output()
  borrowerChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('barcode')
  barcode: BarcodeFieldComponent;

  constructor(
    private errorService: ErrorService,
    private borrowerService: BorrowerService,
    private borrowersService: BorrowersService
  ) { }

  ngOnInit() {
    this.borrower = this.borrowerService.borrower;
  }

  checkout(barcode) {
    console.log('checkout ' + JSON.stringify(barcode));
    this.borrowersService.checkOutItem(barcode, this.borrower.borrowernumber)
      .catch((error: RpcError) => this.onError(barcode, error))
        .subscribe((barcode: string) => this.onSuccess(barcode));
  }

  private onSuccess(result) {
    console.log('success', result);
    this.borrowerChange.emit(null);
    this.barcode.barcode = '';
  }

  private onError(barcode: string, error: RpcError) {
    this.errorService.showError(this.toErrorMessage(barcode, error));
    this.barcode.barcode = '';
    // Resolve the error.
    return Observable.create(() => {});
  }

  private toErrorMessage(barcode: string, error: RpcError) {
    switch (error.errorCode) {
      case 'ENTITY_NOT_FOUND':
        return `Item with barcode ${barcode} does not exist.`;
      case 'ITEM_ALREADY_CHECKED_OUT':
        return `Item with barcode ${barcode} is already checked out.`;
      default:
        return `Server error: ${error.errorCode}`;
    }
  }
}
