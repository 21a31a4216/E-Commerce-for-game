import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent {
  game: { id: number; name: string; imageUrl: string; rating: number; playStoreUrl: string; description: string };
  reviewText: string = '';
  selectedRating: number = 5;
  reviews: any[] = [];
  starIcons: string[] = ['star', 'star', 'star', 'star', 'star'];
  playStoreUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private accountService: AccountService
  ) {
    const gameId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    const games: { id: number; name: string; imageUrl: string; rating: number, playStoreUrl: string, description: string }[] = [
        { id: 1, name: 'Free Fire', imageUrl: 'assets/game1.jpg', rating: 4.9, playStoreUrl: 'https://m.memuplay.com/download-Free-Fire-Battlegrounds.html', description: 'Free Fire is a battle royale game developed by Garena for Android and iOS. It became the most downloaded mobile game globally in 2019. The game consists of up to 50 players falling from a parachute on an island in search of weapons and equipment to kill the other players.' },
        { id: 2, name: 'Stardew Valley', imageUrl: 'assets/2.jpg', rating: 4.8, playStoreUrl: 'https://www.stardewvalley.net', description: 'Stardew Valley is a farming simulation game where players manage their own farm, interact with villagers, and explore caves. It offers a relaxing experience with deep gameplay mechanics.' },
        { id: 3, name: 'Elden Ring', imageUrl: 'assets/elden_ring.jpg', rating: 4.8, playStoreUrl: 'https://koyso.com/download/12', description: 'Elden Ring is an action RPG developed by FromSoftware. Set in a world created by Hidetaka Miyazaki and George R.R. Martin, it features challenging combat and open-world exploration.' },
        { id: 4, name: 'Red Dead Redemption 2', imageUrl: 'assets/rdr2.jpg', rating: 4.7, playStoreUrl: 'https://se7en.ws/red-dead-redemption-2/?lang=en', description: 'Red Dead Redemption 2 is an epic tale of life in America at the dawn of the modern age. It follows outlaw Arthur Morgan and the Van der Linde gang as they rob, fight and flee across the vast open world.' },
        { id: 5, name: 'The Witcher 3: Wild Hunt', imageUrl: 'assets/witcher3.jpg', rating: 4.6, playStoreUrl: 'https://se7en.ws/the-witcher-3/?lang=en', description: 'The Witcher 3 is a story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.' },
        { id: 6, name: 'Horizon Zero Dawn', imageUrl: 'assets/horizon.jpg', rating: 4.5, playStoreUrl: 'https://horizon-zero-dawn-complete-edition.en.softonic.com/download', description: 'Horizon Zero Dawn is an action RPG set in a post-apocalyptic world where robotic creatures roam the land. Players control Aloy, a hunter who uses her skills to survive and uncover her past.' },
        { id: 7, name: 'Assassin\'s Creed Valhalla', imageUrl: 'assets/assassin.jpg', rating: 4.4, playStoreUrl: 'https://luadist.org/6-assassins-creed-valhalla-remove/', description: 'Assassin\'s Creed Valhalla is an action RPG that lets players take on the role of Eivor, a Viking raider leading their clan from Norway to England during the Viking Age.' },
        { id: 8, name: 'The Last of Us Part II', imageUrl: 'assets/last_of_us.jpg', rating: 4.3, playStoreUrl: 'https://koyso.com/download/1542', description: 'The Last of Us Part II is an action-adventure game set in a post-apocalyptic world. It follows Ellie as she seeks revenge in a world ravaged by a deadly fungal infection.' },
        { id: 9, name: 'Minecraft', imageUrl: 'assets/minecraft.jpg', rating: 4.2, playStoreUrl: 'https://www.techspot.com/downloads/5235-minecraft.html', description: 'Minecraft is a sandbox game where players explore a blocky, procedurally generated 3D world and can build anything imaginable. It offers both creative and survival modes.' },
        { id: 10, name: 'FIFA 22', imageUrl: 'assets/fifa.jpg', rating: 4.1, playStoreUrl: 'https://fifa-22.en.softonic.com/', description: 'FIFA 22 is a football simulation game featuring realistic gameplay, licensed teams and leagues, and advanced player animations powered by HyperMotion technology.' }
      ];
    this.game = games.find(g => g.id === gameId) || games[0];
    this.getReviews().subscribe({
      next: (reviews: any) => {
        this.reviews = reviews;
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
      }
      
    });
  }
  installGame(playStoreUrl: string) {
    window.open(playStoreUrl, '_blank');
  }
  selectRating(rating: number) {
    this.selectedRating = rating === this.selectedRating ? 0 : rating;
    this.starIcons = this.getStarRating(this.selectedRating);
  }

  getReviews() {
    return this.http.get(`http://localhost:5229/auth/reviews/${this.game.id}`);
  }

  getStarRating(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'star' : 'star_border');
    }
    return stars;
  }

  ngOnInit() {
    this.starIcons = this.getStarRating(this.selectedRating);
  }

  submitReview() {
    if (!this.reviewText.trim()) {
      alert('Please enter your review text');
      return;
    }
    
    if (this.selectedRating < 1 || this.selectedRating > 5) {
      alert('Please select a valid rating between 1 and 5');
      return;
    }
   const newReview = {
  username: this.accountService.userValue?.username || '',
  gameId: this.game.id,
  reviewText: this.reviewText,
  rating: this.selectedRating
};





    
    this.http.post('http://localhost:5229/auth/submit-review', newReview).subscribe({
      next: () => {
        this.reviewText = '';
        this.selectedRating = 5; // Reset to default
        this.getReviews().subscribe({
          next: (reviews: any) => {
            this.reviews = reviews;
            alert('Review submitted successfully!');
          },
          error: (err) => {
            console.error('Error fetching updated reviews:', err);
          }
        });
      },
      error: (err: any) => {
        console.error('Error submitting review:', err);
        alert('Failed to submit review');
      }
    });
  }
}