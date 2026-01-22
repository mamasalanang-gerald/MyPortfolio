import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile, SocialLink } from '../../models/profile.model';
import { PROFILE_DATA } from '../../data/profile.data';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  @Input() profile: Profile = PROFILE_DATA;
  
  contactForm: FormGroup;
  formSubmitted = false;
  formSuccess = false;
  formError = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private emailService: EmailService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get email(): string {
    return this.profile.email;
  }

  get socialLinks(): SocialLink[] {
    return this.profile.socialLinks;
  }

  get nameControl() {
    return this.contactForm.get('name');
  }

  get emailControl() {
    return this.contactForm.get('email');
  }

  get messageControl() {
    return this.contactForm.get('message');
  }

  getSocialIcon(platform: string): string {
    const icons: Record<string, string> = {
      github: '&#xf09b;',
      linkedin: '&#xf0e1;',
      twitter: '&#xf099;',
      facebook: '&#xf09a;',
      instagram: '&#xf16d;',
      youtube: '&#xf167;',
      dribbble: '&#xf17d;',
      behance: '&#xf1b4;'
    };
    return icons[platform.toLowerCase()] || '&#xf0c1;';
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.formError = false;
      
      this.emailService.sendContactEmail(this.contactForm.value, this.profile.email)
        .then((response) => {
          this.formSuccess = true;
          this.contactForm.reset();
          this.formSubmitted = false;
          this.isSubmitting = false;
          
          // Reset success message after 5 seconds
          setTimeout(() => {
            this.formSuccess = false;
          }, 5000);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          this.formError = true;
          this.isSubmitting = false;
          
          // Reset error message after 5 seconds
          setTimeout(() => {
            this.formError = false;
          }, 5000);
        });
    }
  }
}
