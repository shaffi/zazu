import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { OrganizationComponent } from './organization/organization.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AdminReportDetailsComponent } from './admin-report-details/admin-report-details.component';

@NgModule({
  declarations: [
    AdminComponent,
    OrganizationListComponent,
    OrganizationDetailsComponent,
    OrganizationComponent,
    UserDetailsComponent,
    AdminReportDetailsComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, AngularMaterialModule],
  providers: []
})
export class AdminModule {}
