# FinalProjectInternetTools
Internet Tools COSC 2956 Final Project

Internet Tools Final Project Andi Raymond
########################################

1. Running Application Locally
______________________________

Follow these steps to run the application locally.
	1. Open VS CODE. 
	2. File -> open folder -> Select "Final Project" folder -> open
	3. If you don't have express or SQLite 3, open terminal.
	4. Type "npm install express" to install express
	5. Type "npm install sqlite3" to install SQLite3
	6. Once express and sqlite3 are installed, in terminal type "node server.js".
	7. Ctrl + click the link "http://localhost:3000" in the terminal to launch the website. 

2. API Endpoints 
_________________
*Note: I had difficulty changing some of the names from the lecture code. I decided to leave it so that the website can work and so that you can see where I used the lecture code.

	1. app.get("/current"). This gets the logged in user's file from the fileInfo sql table. 
 *2. app.get("/students"). This gets all of the files from the fileInfo sql table. 
 *3. app.delete("/delete-student/:id"). This deletes the file data from the fileInfo sql table.
	4. app.post("/register"). This updates the users sql table with new registration info. 
	5. app.post("login). This checks the users sql table to verify a user who is trying to log in. It inserts a token into the token sql table.
	6. app.get("/myfiles.html"). This sends the user to the My Files page after logging in. 
	7. app.get("/api/myfiles-data"). This allows only logged in users to access the My Files page. 
	8. app.get("/api/downloads-data"). This allows only logged in users to access the Downloads page. 
	9. app.get("/api/upload-data"). This allows only logged in users to access the Upload page. 
	7. app.get("/api/error-data"). This allows only logged in users to access the Error page if they upload an invalid file.
	8. app.get("/api/success-data"). This allows only logged in users to access the Success page if they upload a valid file. 
	9. app.post('/api/upload'). This works with Multer middlewear to upload a single user file. It checks the size and file type validity.
	Must be <= 20mb and .MP4 or .PDF. It inserts the file metadata and owner into the fileInfo sql table.
	10. app.listen(3000). This starts the server at "http://localhost:3000".

3. Resources
_____________

The following resources were used to complete this Final Project: 
	1. https://github.com/expressjs/multer/blob/main/README.md
	2. https://expressjs.com/en/resources/middleware/multer.html
	3. https://expressjs.com/en/guide/database-integration.html
	4. https://nodejs.org/api/sqlite.html
	5. https://sqlite.org/index.html
	6. Lectures and code from Internet Tools Lecture 1,2,7,8,9
	7. Physical Textbook: Fundamentals of Web Development by Randy Connolly and Ricardo Hoar 2015 edition




