import { RouterModule, Routes } from '@angular/router';
import { GraphicsComponent } from './pages/graphics/graphics.component';
import { HomeComponent } from './pages/home/home.component';
import { MaterialComponent } from './pages/material/material.component';
import { PrimengComponent } from './pages/primeng/primeng.component';
import { StandardComponent } from './pages/standard/standard.component';

export const routes: Routes = [
    { path:'', redirectTo: 'Home', pathMatch: 'full' }, // Toto je default
    { path:'Home', component: HomeComponent },
    { path:'StandardComponent', component: StandardComponent },
    { path:'GraphicsComponent', component: GraphicsComponent },
    { path:'PrimengComponent', component: PrimengComponent },
    { path:'MaterialComponent', component: MaterialComponent },
    { path:'**', redirectTo: 'Home' }
];

export const appRouterModule=RouterModule.forRoot(routes);

