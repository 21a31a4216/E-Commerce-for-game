import { Component } from '@angular/core';
import { AccountService } from './_services';
import { User } from './_models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent {
    user?: User | null;
    searchQuery: string = '';
    searchSubject = new Subject<string>();

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
        
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(query => {
            // Emit search event that will be handled by the home component
            window.dispatchEvent(new CustomEvent('game-search', { detail: query }));
        });
    }

    onSearch() {
        this.searchSubject.next(this.searchQuery);
    }

    logout() {
        this.accountService.logout();
    }
}