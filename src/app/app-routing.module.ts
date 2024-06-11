import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'destinos'
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'cadastrar',
    loadComponent: () => import('@pages/cadastrar/cadastrar.component').then(c => c.CadastrarComponent)
  },
  {
    path: 'destinos',
    loadComponent: () => import('@pages/destinos/destinos.component').then(c => c.DestinosComponent)
  },
  {
    path: 'novo-destino',
    loadComponent: () => import('@pages/novo-destino/novo-destino.component').then(c => c.NovoDestinoComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
