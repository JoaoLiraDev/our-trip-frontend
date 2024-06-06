import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'cadastrar',
    loadComponent: () => import('@pages/cadastrar/cadastrar.component').then(c => c.CadastrarComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
