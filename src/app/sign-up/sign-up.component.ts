import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup,FormControl,FormsModule,ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router ,RouterModule} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CourseguardService } from '../courseguard.service';
import { AuthServiceService } from '../auth-service.service';
import { SocialLoginModule, SocialAuthServiceConfig, SocialAuthService } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule,SocialLoginModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers:[CourseguardService,AuthServiceService,SocialAuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '750300741709-ir60qvj3lmadj40k36gkvmdddot0968c.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('153159880945029')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }]
  })

export class SignUpComponent 
{
  constructor(private authService:SocialAuthService,private authservice:AuthServiceService,private coursegurad:CourseguardService,private router:Router,private activatedRoute:ActivatedRoute,private http:HttpClient){
  
  }
  form: any = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    phone:null,
    dateOfBirth:null
  };
  xForm=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required,Validators.minLength(5)]),
    phone:new FormControl('',[Validators.required]),
    firstName:new FormControl('',[Validators.required,Validators.minLength(1)]),
    lastName:new FormControl('',[Validators.required,Validators.minLength(1)]),
    dateOfBirth:new FormControl('',Validators.required)
  })

  SignUpUser(data:any){
    const { firstName , lastName, email, password,phone,dateOfBirth} = this.xForm.value
    console.log(this.xForm.value);
  
    this.authservice.SignUp(firstName, lastName, email, password,phone,dateOfBirth).subscribe(
      (res:any)=>{
        console.log(res)
        this.xForm.reset();
        this.authservice.storeToken(res.data);
        this.router.navigate(['login']);
      }
    );
    // this.authService.register(this.registrationForm.value).subscribe();
  }
  login(){
    this.router.navigate(['login'])
  }

   get firstName(){
     return this.xForm.get('firstName')
   }
   
   get lastName(){
    return this.xForm.get('lastName')
  }
   
  get email(){
    return this.xForm.get('email')
  }
  
  get password(){
    return this.xForm.get('password')
  }

  get phone(){
    return this.xForm.get('phone')
  }
  get dateOfBirth(){
    return this.xForm.get('dateOfBirth')
  }


  visible:boolean = true;
  changetype:boolean =true;

  viewpass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

   user:any;
   loggedIn:any;
  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user)
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }


}