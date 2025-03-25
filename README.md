# **Book Rental API (Express & MongoDB)**  

This is a simple backend service that:  
- **Fetches books** containing the word “green” in their title from the Open Library API every 5 minutes
- **Stores the books** in a MongoDB database while preventing duplicates.  
- **Provides API endpoints** to rent and return books.  
- **Ensures concurrency control** so multiple users cannot rent the same book simultaneously.  

---

## **Tech Stack**  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose ORM  
- **Scheduling:** node-cron  
- **External API:** Open Library API  
- **Testing (optional):** Jest, Supertest  

---

## **Setup & Installation**  

### **1. Clone the Repository**  
```sh
git clone https://github.com/yourusername/book-rental-api.git
cd book-rental-api
```

### **2. Install Dependencies**  
```sh
npm install
```

### **3. Configure Environment Variables**  
Create a `.env` file and add:  
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### **4. Start the Server**  

#### **For Development (with auto-reload using nodemon)**  
```sh
npm run dev
```

#### **For Production**  
```sh
npm start
```

---

## **API Endpoints**  

### **POSTMAN DOCUMENTATION**
https://documenter.getpostman.com/view/29626287/2sAYkKJxjC 

### **1. Get All Stored Books**  
#### **GET** `/books`  
Returns the list of books stored in the database.  

#### **Response Example:**  
```json
[
  {
    "_id": "65b6f0cf8c6a1b001e8b8a4a",
    "title": "Green Eggs and Ham",
    "author": "Dr. Seuss",
    "openLibraryId": "OL12345M",
    "isRented": false
  }
]
```

---

### **2. Rent a Book**  
#### **POST** `/books/rent`  
Rents a book if it’s not already rented.  

#### **Request Body:**  
```json
{
  "bookId": "65b6f0cf8c6a1b001e8b8a4a",
  "userId": "user123"
}
```

#### **Response (Success):**  
```json
{
  "message": "Book rented successfully",
  "book": {
    "_id": "65b6f0cf8c6a1b001e8b8a4a",
    "title": "Green Eggs and Ham",
    "isRented": true,
    "rentedBy": "user123"
  }
}
```

#### **Response (Already Rented):**  
```json
{
  "error": "Book is already rented by another user"
}
```

---

### **3. Return a Book**  
#### **POST** `/books/return`  
Returns a book if it was previously rented by the user.  

#### **Request Body:**  
```json
{
  "bookId": "65b6f0cf8c6a1b001e8b8a4a",
  "userId": "user123"
}
```

#### **Response (Success):**  
```json
{
  "message": "Book returned successfully",
  "book": {
    "_id": "65b6f0cf8c6a1b001e8b8a4a",
    "title": "Green Eggs and Ham",
    "isRented": false
  }
}
```

#### **Response (Not Rented by User):**  
```json
{
  "error": "Book was not rented by this user"
}
```

---

## **Scheduled Job (Fetching Books from Open Library)**  
- A cron job **runs every 5 minutes** (or 10 seconds in test mode) to fetch books containing "green" in the title.  
- The fetched books are upserted into MongoDB to avoid duplicates.  

### **Modify Fetch Interval (For Testing)**
To change the interval to **10 seconds**, modify `scheduler.js`:  
```javascript
cron.schedule('*/10 * * * * *', async () => {
    console.log('Fetching books from Open Library...');
    await fetchAndStoreBooks();
});
```
For production, revert it to **every 5 minutes**:  
```javascript
cron.schedule('*/5 * * * *', async () => {
    console.log('Fetching books from Open Library...');
    await fetchAndStoreBooks();
});
```

---

## **Project Structure**  
```
/book-rental-api
│── /models
│   ├── Book.js         # Mongoose model for books
│── /routes
│   ├── bookRoutes.js   # API routes for book rental system
│── /services
│   ├── bookService.js  # Service for fetching books from Open Library
│── /utils
│   ├── scheduler.js    # Cron job for fetching books every 5 min
│── server.js           # Main entry point
│── package.json        # Dependencies and scripts
│── README.md           # API Documentation
```

---

## **Next Steps (Future Enhancements)**  
- **User Authentication:** Implement JWT-based authentication.  
- **Book Reviews API:** Allow users to add ratings/reviews for books.  
- **Pagination & Filtering:** Enhance `/books` endpoint to support pagination.  

---