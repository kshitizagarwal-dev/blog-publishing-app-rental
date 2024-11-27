import { Routes } from '@angular/router';

import { DashboardComponent } from './component/dashboard/dashboard.component';
import { authGuard } from './services/auth.guard';
import { LoginComponent } from './component/login/login.component';

import { AllPostsComponent } from './component/posts/all-posts/all-posts.component';
import { NewPostComponent } from './component/posts/new-post/new-post.component';
import { AuthorsComponent } from './component/authors/authors.component';
import { SinglePostComponent } from './component/posts/single-post/single-post.component';
import { CommentsComponent } from './component/comments/comments.component';
import { RegisterComponent } from './component/register/register.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'login', component: LoginComponent },
    { path:'register', component:RegisterComponent},
    { path: 'authors', component: AuthorsComponent },
    { path: 'comments/:id', component: CommentsComponent, canActivate:[authGuard] },
    { path: 'posts', component: AllPostsComponent },
    { path: 'posts/new', component: NewPostComponent,  },
    { path: 'post/:id', component: SinglePostComponent,  },

    
];
