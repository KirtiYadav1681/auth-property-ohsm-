1. Start by cloning the GitHub repository 

2. After cloning the repository, navigate to the project folder: 
    cd project

3. Install the required dependencies by running the following command: 
    npm install

4. Create a '.env' file in the root directory of the project and add the following environment variables with their corresponding values:
    PORT=
    SESSION_SECRET=
    TRANSPORTER_EMAIL=
    TRANSPORTER_PASS=
    JWT_SECRET=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=

5. Obtain the 'GOOGLE_CLIENT_ID' and 'GOOGLE_CLIENT_SECRET' by creating a new project and then credentials from the Google Cloud Console. Make sure to add the authorized URL in the following format:
    http://localhost:PORT/auth/google/callback (Replace 'PORT' with the actual port number.)

6. Start the server by running the following command:
    npm start
    
Now you can work on the project as per the routes mentioned in the project. Remember to replace any placeholder values with your actual credentials and configuration details.