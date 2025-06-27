import { Component } from "@angular/core";
import { Router } from "@angular/router";

export interface Game {
  id: number;
  name: string;
  imageUrl: string;
  rating: number;
  playStoreUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(public router: Router) {
    window.addEventListener('game-search', ((event: CustomEvent) => {
      const searchQuery = event.detail.toLowerCase();
      this.filteredGames = this.games.filter(game =>
        game.name.toLowerCase().includes(searchQuery)
      );
    }) as EventListener);
  }

  filteredGames: Game[] = [];
  games: Game[] = [
    { id: 1, name: 'Free Fire', imageUrl: 'assets/game1.jpg', rating: 4.9, playStoreUrl: 'https://m.memuplay.com/download-Free-Fire-Battlegrounds.html' },
    { id: 2, name: 'Stardew Valley', imageUrl: 'assets/2.jpg', rating: 4.8, playStoreUrl: 'https://www.stardewvalley.net' },
    { id: 3, name: 'Elden Ring', imageUrl: 'assets/elden_ring.jpg', rating: 4.8, playStoreUrl: 'https://koyso.com/download/12' },
    { id: 4, name: 'Red Dead Redemption 2', imageUrl: 'assets/rdr2.jpg', rating: 4.7, playStoreUrl: 'https://se7en.ws/red-dead-redemption-2/?lang=en' },
    { id: 5, name: 'The Witcher 3: Wild Hunt', imageUrl: 'assets/witcher3.jpg', rating: 4.6, playStoreUrl: 'https://se7en.ws/the-witcher-3/?lang=en' },
    { id: 6, name: 'Horizon Zero Dawn', imageUrl: 'assets/horizon.jpg', rating: 4.5, playStoreUrl: 'https://horizon-zero-dawn-complete-edition.en.softonic.com/download' },
    { id: 7, name: 'Assassin\'s Creed Valhalla', imageUrl: 'assets/assassin.jpg', rating: 4.4, playStoreUrl: 'https://luadist.org/6-assassins-creed-valhalla-remove/' },
    { id: 8, name: 'The Last of Us Part II', imageUrl: 'assets/last_of_us.jpg', rating: 4.3, playStoreUrl: 'https://koyso.com/download/1542' },
    { id: 9, name: 'Minecraft', imageUrl: 'assets/minecraft.jpg', rating: 4.2, playStoreUrl: 'https://www.techspot.com/downloads/5235-minecraft.html' },
    { id: 10, name: 'FIFA 22', imageUrl: 'assets/fifa.jpg', rating: 4.1, playStoreUrl: 'https://fifa-22.en.softonic.com/' }
  ];

  installGame(playStoreUrl: string) {
    window.open(playStoreUrl, '_blank');
  }
}
