import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-images',
  standalone: true,
imports:[CommonModule],
  templateUrl: './upload-images.component.html',
  styleUrl: './upload-images.component.css'
})
export class UploadImagesComponent {
  images: string[] = [];

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.images.push(result);
        this.saveToLocalStorage();
      };
      reader.readAsDataURL(file);
    });
  }

  saveToLocalStorage(): void {
    localStorage.setItem('uploadedImages', JSON.stringify(this.images));
  }

  loadFromLocalStorage(): void {
    const storedImages = localStorage.getItem('uploadedImages');
    if (storedImages) {
      this.images = JSON.parse(storedImages);
    }
  }

  ngOnInit(): void {
    this.loadFromLocalStorage();
  }
}
