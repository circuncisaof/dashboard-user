import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard.service';
import { MainModule } from './main/main.module';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo:'main/people'},
  {path: 'main', loadChildren: () => import('./main/main.module').then(routes => routes.MainModule),
  canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
