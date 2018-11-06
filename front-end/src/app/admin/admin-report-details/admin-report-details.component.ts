import { UserService } from './../../shared/services/user.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ReportService } from '../../shared/services/report.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as ReportViewModel from '../../shared/view-models/report.viewmodel';
import { OrganizationService } from '../../shared/services/organization.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-admin-report-details',
  templateUrl: './admin-report-details.component.html',
  styleUrls: ['./admin-report-details.component.scss']
})
export class AdminReportDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    private userService: UserService,
    private organizationService: OrganizationService,
    public dialog: MatDialog,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
  }

  sub: any;
  organizationID;
  userID;
  reportID;
  organization = null;
  user = undefined;
  report: ReportViewModel.ReportWithMetaData = null;
  userView: boolean;
  viewInitialized = false;
  selectedOrgID;
  selectedOrg;
  new = false;
  edited = false;
  async ngOnInit() {
    try {
      this.viewInitialized = false;
      this.sub = this.route.params.subscribe(params => {
        this.organizationID = params['id'];
        this.userID = params['userID'];
        this.reportID = params['reportID'];
      });
      this.selectedOrgID = await this.route.snapshot.queryParamMap.get('selectedOrg');
      this.report = await this.reportService.getReport(this.reportID, this.selectedOrgID);
      console.log(this.report);
      this.selectedOrg = await this.report.organizations.find( org => {
        return org._id === this.selectedOrgID;
      });

      if (this.userID !== undefined) {
        this.userView = true;
        this.user = await this.userService.getLocalUser(this.userID);
      } else {
        this.userView = false;
        this.user = false;
      }
      if (this.organizationID) {
        this.organization = await this.organizationService.getLocalOrganization(this.organizationID);
      } else {
        this.organization = false;
      }
      this.new = (await this.route.snapshot.queryParamMap.get('new')) === 'new';
      this.edited = (await this.route.snapshot.queryParamMap.get('edited')) === 'true';
      this.viewInitialized = true;
    } catch (error) {
      console.log(error);
    }

  }

  async openDialog( ) {
    const dialogRef = this.dialog.open(DeleteReportConfirmation, {
      data: { report: this.report.name}
    });
     dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const status = await <any>this.reportService.deleteReport(this.report);
        if (status.status === '200') {
          this.router.navigate(['../../'], { relativeTo: this.route });
        } else {
          this.snackBar.open('Error: ' + status.message, 'Dismiss', {
            duration: 5000,
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this.viewInitialized = false;
    this.sub.unsubscribe();
  }


  closeNewBar() {
    this.new = false;
    this.edited = false;
  }
}


@Component({
  selector: 'delete-report-confirmation',
  templateUrl: 'delete-report-confirmation.html'
})
export class DeleteReportConfirmation {
  constructor(
    public dialogRef: MatDialogRef<DeleteReportConfirmation>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

