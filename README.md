# Project Backend API

This project is a backend API for an authentication system that allows users to set their profiles as public or private. It also includes functionality to allow admin users to view both public and private user profiles, while normal users can only access public profiles.

## Installation

1.  Clone the repository:

        ```bash
        git clone https://github.com/your-repo.git
        ```

2.  Install dependencies:

        ```bash
        npm install
        ```

3.  Start the server:

        ```bash
        npm start
        ```

## API Documentation

The API documentation is generated using Swagger. You can access the documentation by visiting the `/api-docs` endpoint when the server is running.

## Endpoints

### Register a new user

- **Endpoint:** POST /api/user/register
- **Description:** Endpoint to create a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "1234567890",
    "role": "user",
    "isPublic": true,
    "bio": "Lorem ipsum dolor sit amet"
  }
  ```

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
