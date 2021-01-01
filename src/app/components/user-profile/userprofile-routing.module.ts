import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './userprofile.component';

const routes: Routes = [
    {
        path: '',
        component: UserProfileComponent,
        data: {
            title: 'Profile'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserProfileRoutingModule { }
