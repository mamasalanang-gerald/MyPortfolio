import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceId = 'service_portfolio'; // You'll set this up in EmailJS
  private templateId = 'template_k88819f'; // You'll set this up in EmailJS
  private publicKey = 'mbjTS7iIvX2Y7d-E2'; // Get this from https://dashboard.emailjs.com/admin/account

  constructor() {
    // Initialize EmailJS with your public key
    // You need to sign up at https://www.emailjs.com/ and get your public key
    if (this.publicKey && this.publicKey !== 'YOUR_PUBLIC_KEY_HERE') {
      emailjs.init(this.publicKey);
    } else {
      console.warn('EmailJS public key not configured. Please add your public key to email.service.ts');
    }
  }

  sendContactEmail(data: ContactMessage, recipientEmail: string): Promise<any> {
    const templateParams = {
      to_email: recipientEmail,
      from_name: data.name,
      from_email: data.email,
      message: data.message,
      reply_to: data.email
    };

    return emailjs.send(this.serviceId, this.templateId, templateParams);
  }
}

