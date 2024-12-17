# High-Level Architecture of Real-Time Quiz Application

## I. Overview

This document outlines the architecture of a real-time quiz application that integrates various technologies, including NestJS for the backend, Node.js for WebSockets, Redis for caching, Kafka for message queueing, MySQL for database management, and Elasticsearch for logging. The application aims to handle real-time interactions, user sessions, and efficient data management for a seamless quiz experience.

![Quiz Application Architecture](./Architecture.png)

## II. Architecture Components

### 1. **Load Balancer and Proxy (Nginx)**

- **Technology**: Nginx
- **Responsibilities**:
  - **Load Balancing**: Distributes incoming traffic across multiple instances of the backend (NestJS) to ensure high availability and fault tolerance.
  - **Reverse Proxy**: Handles requests from users, forwarding them to appropriate backend services (NestJS or Node.js) based on the request type.
  - **SSL Termination**: Nginx handles SSL/TLS termination to ensure secure communication between the frontend and backend.
  - **Caching**: Nginx can cache static assets and reduce load on the backend by serving cached content for frequently requested resources.

### 2. **Backend Services (NestJS)**

- **Technology**: NestJS
- **Responsibilities**:
  - Manages user sessions, business logic, and provides RESTful API endpoints for quiz functionality.
  - Interacts with MySQL for persistent storage and Redis for caching frequently accessed data.
  - Provides real-time features through WebSockets by integrating Node.js for socket management.
  - **DTO (Data Transfer Objects)**:

    - DTOs ensure proper data validation, transformation, and type safety before interacting with the business logic.
  - **Unit Testing**:

    - **Jest** is used for unit and integration testing. Unit tests focus on individual components, mocking external services, and ensuring that business logic is functioning correctly.
    - **Test Coverage** ensures that critical functionality, such as user authentication, quiz management, and leaderboard updates, are tested to prevent bugs and optimize performance.
  - **Performance Optimization**:

    - **Caching**: Frequently accessed data, such as user sessions and quiz data, are cached in Redis to reduce load on the database.
    - **Rate Limiting**: Prevents abuse by restricting the number of requests a user can make in a given time frame.
    - **Async Operations**: NestJS handles non-blocking asynchronous operations for handling requests without blocking the event loop.

### 3. **Socket Service (Node.js)**

- **Technology**: Node.js with WebSockets
- **Responsibilities**:
  - Manages real-time interactions using WebSocket protocol. This allows the system to push quiz updates, such as question changes, leaderboard updates, and real-time participant data, to clients.
  - Node.js manages the WebSocket connections and listens for incoming messages or events to broadcast them to connected clients.
  - **Message Queue (Kafka)**:

    - **Kafka** is used as the message broker to handle asynchronous communication between services. It allows reliable message delivery and decouples services like NestJS and Node.js, enabling scalable and fault-tolerant communication.
    - Kafka ensures that events such as quiz updates or leaderboard changes are processed and broadcasted in real-time.

### 4. **Database (MySQL)**

- **Technology**: MySQL (Master-Slave Replication)
- **Responsibilities**:
  - **MySQL** is used as the primary database for storing user information, quiz data, answers, and leaderboard details.
  - **Master-Slave Replication**: The database is set up in a master-slave configuration, where the master handles write operations, and slaves handle read operations, thus ensuring high availability and load balancing across multiple database instances.
  - **Performance Optimization**:

    - **Indexing**: Critical columns are indexed to speed up query performance.
    - **Database Sharding**: For scalability, the database is partitioned based on user data or quiz IDs to distribute the load.
    - **Connection Pooling**: Optimized database connections are used to reduce latency and increase the throughput of queries.

### 5. **Caching Layer (Redis)**

- **Technology**: Redis
- **Responsibilities**:
  - Caches frequently requested data such as active quiz states, leaderboard data, and user information to enhance performance and reduce database load.
  - Acts as a session store for storing temporary session information for users while they are taking the quiz.
  - **Performance Optimization**:

    - **Data Expiry**: Data in Redis is set to expire after a certain time to ensure that stale information is not served to users.
    - **Persistent Data**: Redis provides mechanisms for persisting data to disk if required, ensuring data durability even during system crashes.

### 6. **Frontend (ReactJS)**

- **Technology**: ReactJS
- **Responsibilities**:
  - The frontend provides the user interface for interacting with the quiz application. It includes components for displaying quiz questions, receiving answers, showing the leaderboard, and handling real-time updates.
  - ReactJS ensures a dynamic and responsive UI, making it easy to manage state across multiple components and update the UI in real time.
  - **Performance Optimization**:

    - **Lazy Loading**: Components are loaded only when they are needed, reducing the initial load time and improving performance.
    - **Code Splitting**: The application is split into smaller bundles that are loaded on demand to reduce the initial download size.
    - **API Caching**: API responses are cached locally to prevent unnecessary network requests and improve the user experience.

### 7. **Logging and Error Tracking**

- **Technology**: Elasticsearch & Sentry
- **Responsibilities**:
  - **Elasticsearch** is used for logging events and querying user actions, such as answering questions, leaderboard updates, and system events. This enables real-time monitoring and performance analytics.
  - **Sentry** is integrated into both the frontend and backend to track and report errors, providing detailed information on issues such as failed requests, exceptions, or performance bottlenecks.
  - **Performance Optimization**:

    - **Log Aggregation**: Elasticsearch aggregates logs from multiple services, making it easier to monitor the system’s health and identify potential issues.
    - **Error Prioritization**: Sentry helps prioritize critical errors based on frequency and severity, allowing for faster resolution of high-priority issues that impact performance.

---

### 8. Summary of Key Technologies and Their Benefits:

- **Nginx**: Provides load balancing, reverse proxy, SSL termination, and caching to ensure high availability and performance.
- **NestJS**: A powerful backend framework built on Node.js, using TypeScript for type safety, DTOs for validation, and Jest for unit and integration testing to maintain high performance and scalability.
- **Node.js with WebSockets**: Manages real-time updates, ensuring low-latency communication between the server and clients.
- **Kafka**: Handles asynchronous communication and decouples services for better scalability.
- **MySQL (Master-Slave Replication)**: A robust relational database that ensures high availability and reliability for data storage and retrieval.
- **Redis**: Caches frequently used data to reduce load on the database and improve application performance.
- **ReactJS**: A dynamic and responsive frontend framework that provides an engaging user experience with performance optimization techniques like lazy loading and API caching.
- **Elasticsearch**: Provides powerful search capabilities and real-time logging, helping to monitor system health and performance.
- **Sentry**: Tracks and monitors errors across both the frontend and backend, ensuring rapid identification and resolution of issues.

---

## III. Performance and Scalability Considerations:

- **Load Balancing with Nginx** ensures that the system can handle a large number of concurrent users by distributing traffic evenly across the backend services.
- **Master-Slave Database Replication** in MySQL allows for horizontal scalability, ensuring that read requests are handled by the slave instances while the master handles write operations.
- **Message Queue (Kafka)** ensures reliable message delivery and processing, allowing the system to scale horizontally by adding more consumers and workers as needed.
- **Caching with Redis** reduces database load and speeds up response times by storing frequently accessed data in memory.
- **Real-Time Communication** via WebSockets (Node.js) ensures that updates, such as quiz progress and leaderboard changes, are delivered instantly to users.
- **Testing (Unit and Integration)** ensures that the system’s performance is constantly validated and optimized, with efficient error handling and fault tolerance in place.

## IV. Project Setup and Execution

### 1. Prerequisites

* Node.js: Version 20 or higher
* Docker: Installed on your system

### 2. Steps to Run the Project

#### Start Docker Services

* Run the docker-compose.yml file using the command:

```bash
docker-compose up
```

#### Start the Backend Service

* Navigate to the quiz-be directory and execute:

```bash
yarn start:dev
```

#### Start the Socket Service

* Navigate to the quiz-socket directory an1. d execute:

```bash
yarn start
```

#### Start the Frontend Application

* Navigate to the quiz-fe directory and execute:

```bash
yarn dev
```

##### Congratulations! Your project should now be running successfully. Good luck!
