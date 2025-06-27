import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-submit-review',
  templateUrl: './submit-review.component.html',
  styleUrls: ['./submit-review.component.css'] // change if using .less
})
export class SubmitReviewComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      gameId: ['', Validators.required],
      username: ['', Validators.required],
      reviewText: ['', Validators.required],
      rating: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  submitReview() {
    if (this.form.invalid) {
      alert('Please fill all fields correctly');
      return;
    }

    const review = this.form.value;

    this.http.post('http://localhost:5229/api/reviews', review).subscribe({
      next: (res) => {
        alert('Review submitted successfully!');
        this.form.reset();
      },
      error: (err) => {
        console.error('Submit failed', err);
        alert('Failed to submit review.');
      }
    });
  }
}
