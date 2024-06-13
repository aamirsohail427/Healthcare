import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';
import { AccountsListComponent, AppSettingsComponent, AssignmentsListComponent, PastMedicationsListComponent, CurrentMedicationsListComponent, PhysiciansListComponent, FeesListComponent, AttachmentsListComponent, InvoicesListComponent, LookupsListComponent, DrugsListComponent, GuardiansListComponent, SurgeryiesListComponent, EmergencyContactsListComponent, StudentsListComponent, FamiliesListComponent, MenusListComponent, StaffsListComponent, PatientProfileComponent, SocialAccountsListComponent, AppointmentsListComponent, HobbiesListComponent, AllergiesListComponent, ExcercisesListComponent, SmokingComponent, CaffeineComponent, ConversationComponent, PrescriptionsListComponent, InsurancesListComponent } from './pages';
import { AdminDashboardComponent, PatientDashboardComponent } from './pages/home';
import { AuthGuardService } from './shared';

const routes: Routes = [
  {
    path: 'patient-profile',
    component: PatientProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'dashboard',
    component: PatientDashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'caffeine',
    component: CaffeineComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'insurances',
    component: InsurancesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'conversations',
    component: ConversationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'smoking',
    component: SmokingComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'past-medications',
    component: PastMedicationsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'guardians',
    component: GuardiansListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'current-medications',
    component: CurrentMedicationsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'physicians',
    component: PhysiciansListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'drugs',
    component: DrugsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'accounts',
    component: AccountsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'surguries',
    component: SurgeryiesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'appointments',
    component: AppointmentsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'emergency-contacts',
    component: EmergencyContactsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'social-accounts',
    component: SocialAccountsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'prescriptions',
    component: PrescriptionsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'invoices',
    component: InvoicesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'assessments',
    component: AssignmentsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'families',
    component: FamiliesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'classes-fee',
    component: FeesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'app-settings',
    component: AppSettingsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'attachments',
    component: AttachmentsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'lookups',
    component: LookupsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'exercises',
    component: ExcercisesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'hobbies',
    component: HobbiesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'allergies',
    component: AllergiesListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'menus',
    component: MenusListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'staffs',
    component: StaffsListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), DxDataGridModule, DxFormModule],
  providers: [AuthGuardService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
