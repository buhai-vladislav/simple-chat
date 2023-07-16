## **Description**

---

The project for chatting. You can create a room and chatting. Created basic `JWT` auth flow with access token. Used `MongoDB` as data storage. `Socket.io` used to create client-server interactions. Client writed on `React` library and used `NextUI` for UI component and `styled-components` for additional styling. Used `Redux` as state manager and `RTK` for working with actions and api service.

## **Prerequisites**

---

- node >= 18.0
- docker

## **Run application**

---

1. Change your credential in the `.env` file. Also you can use default but it`s not secure.

2. Setup your `docker` image by `docker-compose` file, running next command:

   ```properties
   npm run services:start
   ```

3. Install your packages for BE part and for FE part open the `src/client` folder:

   ```properties
   npm i
   ```

4. In the root folder run next command for starting application:

   ```properties
   npm run serve
   ```

5. Now you can open `http://localhost:{YOUR_PORT}` to see the result.
