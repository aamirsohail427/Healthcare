import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, ResetPasswordFormModule, CreateAccountFormModule, ChangePasswordFormModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { AccountsListComponent, AdminDashboardComponent, AppSettingsComponent, AssignmentDetailComponent, AssignmentsListComponent, AttendanceDetailComponent, AppointmentsListComponent, PastMedicationDetailComponent, PastMedicationsListComponent, CurrentMedicationsListComponent, PrescriptionsListComponent, PhysicianDetailComponent, PhysiciansListComponent, FeeDetailComponent, FeesListComponent, AttachmentDetailComponent, AttachmentsListComponent, GuardiansListComponent, PatientDashboardComponent, AllergyDetailComponent, InvoicesListComponent, AllergiesListComponent, LookupDetailComponent, LookupsListComponent, MenusListComponent, DrugDetailComponent, DrugsListComponent, PatientProfileComponent, SurgeryDetailComponent, SurgeryiesListComponent, EmergencyContactsListComponent, StaffDetailComponent, StaffsListComponent, HobbiesListComponent, StudentDashboardComponent, StudentDetailComponent, StudentsListComponent, TeacherDashboardComponent, ConversationComponent, FamilyDetailComponent, FamiliesListComponent, SocialAccountsListComponent, CurrentMedicationDetailComponent, ExcercisesListComponent, ExerciseDetailComponent, SmokingComponent, CaffeineComponent, InsurancesListComponent, InsuranceDetailComponent } from './pages';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DevExtremeModule, DxDataGridModule, DxDropDownBoxModule, DxButtonModule, DxTabsModule, DxSelectBoxModule, DxCheckBoxModule, DxContextMenuModule, DxFormModule, DxPopupModule, DxScrollViewModule, DxResponsiveBoxModule, DxNumberBoxModule, DxRadioGroupModule, DxListModule, DxTreeListModule, DxFileUploaderModule, DxTextBoxModule, DxTagBoxModule, DxTextAreaModule, DxDateBoxModule, DxTreeViewModule, DxValidatorModule, DxValidationGroupModule, DxColorBoxModule, DxSwitchModule, DxChartModule, DxToolbarModule, DxTabPanelModule, DxTemplateModule, DxLoadPanelModule } from 'devextreme-angular';
import { FormatHelper, GridListHelper, StorageHelper } from './shared/utils';
import { SharedButtonComponent } from './shared/button';
import { HttpClientModule } from '@angular/common/http';
import { DateFilterComponent } from './shared/date-filter';
import { UserProfileService } from './shared';
import { InitSystemService } from './shared/utils/init-system.service';
import { GuardianDetailComponent } from './pages/patient-profile/components/guardians/detail';



@NgModule({
  imports: [
    DevExtremeModule,
    CommonModule,
    FormsModule,
    DxDataGridModule,
    DxDropDownBoxModule,
    DxButtonModule, DxTabsModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxContextMenuModule,
    DxFormModule,
    DxPopupModule,
    DxScrollViewModule,
    DxResponsiveBoxModule,
    DxNumberBoxModule,
    DxRadioGroupModule,
    DxListModule,
    DxTabsModule,
    DxTreeListModule,
    DxFileUploaderModule,
    DxTextBoxModule,
    DxTagBoxModule,
    DxTextAreaModule,
    DxDateBoxModule,
    DxTreeViewModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxColorBoxModule,
    DxSwitchModule,
    DxChartModule,
    DxToolbarModule,
    DxFileUploaderModule,
    DxTabPanelModule,
    DxTemplateModule,
    DxLoadPanelModule,

    BrowserModule,
    SideNavOuterToolbarModule,
    SingleCardModule,
    FooterModule,
    ResetPasswordFormModule,
    CreateAccountFormModule,
    ChangePasswordFormModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    StudentsListComponent,
    StudentDetailComponent,
    InsurancesListComponent,
    InsuranceDetailComponent,
    ExcercisesListComponent,
    ExerciseDetailComponent,
    PastMedicationsListComponent,
    PastMedicationDetailComponent,
    GuardiansListComponent,
    GuardianDetailComponent,
    CurrentMedicationsListComponent,
    CurrentMedicationDetailComponent,
    AppointmentsListComponent,
    AttendanceDetailComponent,
    DrugsListComponent,
    DrugDetailComponent,
    StaffsListComponent,
    StaffDetailComponent,
    SharedButtonComponent,
    PatientProfileComponent,
    AccountsListComponent,
    SurgeryiesListComponent,
    SurgeryDetailComponent,
    DateFilterComponent,
    EmergencyContactsListComponent,
    SocialAccountsListComponent,
    PhysiciansListComponent,
    PhysicianDetailComponent,
    PrescriptionsListComponent,
    FamiliesListComponent,
    FamilyDetailComponent,
    AssignmentsListComponent,
    AssignmentDetailComponent,
    InvoicesListComponent,
    AdminDashboardComponent,
    StudentDashboardComponent,
    TeacherDashboardComponent,
    PatientDashboardComponent,
    FeesListComponent,
    FeeDetailComponent,
    AppSettingsComponent,
    AttachmentsListComponent,
    AttachmentDetailComponent,
    MenusListComponent,
    LookupsListComponent,
    LookupDetailComponent,
    ConversationComponent,
    HobbiesListComponent,
    AllergiesListComponent,
    AllergyDetailComponent,
    SmokingComponent,
    CaffeineComponent
  ],
  entryComponents: [
    StudentDetailComponent
  ],
  providers: [AuthService, ScreenService, AppInfoService, UserProfileService, InitSystemService, StorageHelper, GridListHelper, FormatHelper],
  bootstrap: [AppComponent]
})
export class AppModule { }
