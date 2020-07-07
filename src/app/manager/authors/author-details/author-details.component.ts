import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Author} from '../../../models/author';
import {AuthorService} from '../../../services/author.service';

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.scss']
})
export class AuthorDetailsComponent implements OnInit {
  public author: Author;

  public isEditAuthorMode: boolean;

  constructor(private route: ActivatedRoute,
              private authorService: AuthorService) {

    const authorId = this.route.snapshot.paramMap.get('id');

    this.authorService.getApiAuthor(authorId).subscribe(author => {
      this.author = author;

      this.authorService.setAuthor(this.author);
    });

    this.isEditAuthorMode = false;
  }

  ngOnInit() { }

  activateEditAuthorMode() {
    this.isEditAuthorMode = true;
  }

  deactivateEditAuthorMode() {
    this.isEditAuthorMode = false;
  }

  editAuthor() {
    return this.authorService.patchApiAuthor(this.author).subscribe(() => {
      console.log(this.author);
      this.isEditAuthorMode = false;
    });
  }
}
