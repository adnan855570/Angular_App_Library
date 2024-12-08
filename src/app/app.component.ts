import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  books: any[] = [];
  newBook = { id: '', name: '', author: '', edition: '' };
  searchQuery = '';
  deleteBookId = '';
  outcomeMessage = '';
  apiURL = 'https://sjd38wgqwh.execute-api.us-east-1.amazonaws.com/sonam_rani_stage';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBooks();
  }

  getBooks() {
    // Use responseType 'text' to get the raw string response from the API
    this.http.get(`${this.apiURL}?param=all`, { responseType: 'text' }).subscribe(
      (data: string) => {
        try {
          // Parse the string into a JSON object (array in this case)
          this.books = JSON.parse(data);
          if (Array.isArray(this.books)) {
            // Successfully parsed and it's an array
            this.outcomeMessage = 'Records fetched successfully';
          } else {
            // Handle the case where the response is not an array
            this.outcomeMessage = 'Error: Data is not in the correct format';
          }
        } catch (error) {
          this.outcomeMessage = 'Error parsing response';
          console.error('Parsing error: ', error);
        }
      },
      (error) => {
        this.outcomeMessage = 'Error fetching records';
        console.error('API Error: ', error);
      }
    );
  }
  
  addBook() {
    const { id, name, author, edition } = this.newBook;
    if (!id || !name || !author || !edition) {
      this.outcomeMessage = 'Please fill in all fields';
      return;
    }

    this.http.get(`${this.apiURL}?param=${id},${name},${author},${edition}`).subscribe(
      () => {
        this.outcomeMessage = 'Book added successfully';
        this.getBooks(); // Refresh the list of books
        this.clearNewBook(); // Clear the input fields after adding
      },
      (error) => {
        this.outcomeMessage = 'Error adding book';
      }
    );
  }
  deleteBookById() {
    if (!this.deleteBookId) {
      this.outcomeMessage = 'Please enter a valid book ID';
      return;
    }
  
    this.http.get(`${this.apiURL}?param=delete=${this.deleteBookId}`).subscribe(
      (response: any) => {
        if (response) {
          // The record has been successfully deleted
          this.outcomeMessage = `Book with ID ${this.deleteBookId} deleted successfully`;
          this.getBooks(); // Refresh the list of books after deletion
        } else {
          // If response does not have content, show a generic success message
          this.outcomeMessage = `Book with ID ${this.deleteBookId} deleted`;
        }
        this.deleteBookId = ''; // Clear the delete field
      },
      (error) => {
        // Handle the case where the request failed
        this.outcomeMessage = `Error deleting book with ID ${this.deleteBookId}`;
      }
    );
  }
  
  searchBook() {
    if (!this.searchQuery) {
      this.outcomeMessage = 'Please enter a book name to search';
      return;
    }
  
    this.http.get(`${this.apiURL}?param=search=${this.searchQuery}`).subscribe(
      (response: any) => {
        if (response && response.length > 0) {
          this.books = response; // Assuming the API returns an array of books matching the search
          this.outcomeMessage = `Found ${response.length} book(s) with the name "${this.searchQuery}"`;
        } else {
          this.outcomeMessage = `No books found with the name "${this.searchQuery}"`;
        }
        this.searchQuery = ''; // Clear the search field
      },
      (error) => {
        this.outcomeMessage = `Error searching for book with the name "${this.searchQuery}"`;
      }
    );
  }
  

  clearNewBook() {
    this.newBook = { id: '', name: '', author: '', edition: '' };
  }
}
