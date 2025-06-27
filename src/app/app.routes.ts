import { RouterModule, Routes } from '@angular/router';
import { StandardComponent } from './pages/standard/standard.component';
import { GraphicsComponent } from './pages/graphics/graphics.component';
import { PrimengComponent } from './pages/primeng/primeng.component';
import { MaterialComponent } from './pages/material/material.component';

export const routes: Routes = [
    { path:'', redirectTo: 'Home', pathMatch: 'full' }, // Toto je default
    { path:'StandardComponent', component: StandardComponent },
    { path:'GraphicsComponent', component: GraphicsComponent },
    { path:'PrimengComponent', component: PrimengComponent },
    { path:'MaterialComponent', component: MaterialComponent },
    { path:'**', redirectTo: 'Home' }
];

export const appRouterModule=RouterModule.forRoot(routes);

