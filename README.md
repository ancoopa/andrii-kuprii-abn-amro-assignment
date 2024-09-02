# ABN Amro Assignment
* Completed by **Andrii Kuprii**
* Ship date: **02 Sep,  2024**
* You can find the task description in the root directory: `./abn-amro-fe-web-assignment.pdf`.

# Things to consider
* Unfortunalely, I had very limited time for the project. If we consider the standard flow as: `"Make it work" -> "Make it right" -> "Make it fast"`, I stopped at the `"Make it work"` stage. The project isn't ready for the production by my standards. Its implementation is just the **proof of concept**: no proper desing system, no theming, no styles structure and classes design, etc. I was focusing mostley on the product (how it works, looks, and feels) and on the overal app architecture (to not have critical bottlenecks system-design-wise).

* It was **my first experience with `Vue.js`**, and I'm sure there are better ways to do many things I've done "wrong" (also, it took me a bunch of time to learn on the go that's why I hav to cut corners here and there).

* Since this is a frontend task, please **ignore the backend implementation details** (I didn't invest much time in it on purpose), there is no error handling, no logging, no proper config and setup, it doesn't have a proper database (data is saved to the memory and caches to the JSON file), no proper endpoint design, even the framework (I'd prefer Fastify in 2024; Express is used just as the industry standard that most of the developers are familiar with), etc.

# Architecture
Please check the architecture diagram: `./architecture-diagram.png`.

Due to the **Tvmaze team** cache strategy their API doesn't have endpoints to fetch TV shows by genre. Also, the API it doesn't have endpoints to fetch TV shows sorted by rating. Both things are the requirements for the assignment.    

To handle this (and also to not force users to cache all the TV shows on their machines) I've implemented a simple **"backend for frontend" server** that caches all the TV shows on start. The server has the paginated endpoint that allows to fetch TV shows by genres sorted by rating.

The rest of the endpoints ("fetch single TV show" and "search by name") are used directly from the Tvmaze API.

From the frontend point of view, it is a standard SPA that communicates with the cache server, and with the Tvmaze server.

# How to run the project
## Requirements
* Node version: **v20.11.0**

## Instruction
1. Clone the repository.

<hr/>

_Backend setup:_

2. Go to `./backend`, run `npm i`, then `npm start`.
3. Wait until the server will cache TV shows to the memory (cached TV shows will also be added to the `dont-remove-me-cached-shows.json` file to speed up future server reruns).

<hr/>

_Frontend setup:_

4. Go to `./frontend`, run `npm i`, then `npm run dev`.
5. The client dev server will run on the default port: http://localhost:5173/


# TODO
The app has all the required features. This migh work for the prototype (e. g. to quickly test the business idea), but to be able to move with it forward (add new features quickly, etc.), some improvements are required.
1. Hire a UI/UX designer to improve the **design**.

2. Take Care of **Styles**.
I didn't have time to do CSS the way it should be done. At the moment pure CSS is used. I prefer SCSS. It also makes sense to use some CSS framework (e. g. Tailwind). Also, the CSS classes structure and design system can be improved (and some parts can be created because they are absent).

3. Some of the existing components can be splitted to more smaller components. With having a proper design system buttons, inputs, ancors, cards also should be converted into standard "shared" components.

4. Desingn and optimise **test cases**: think/research what test scenarios are critical, etc.

5. Add e2e tests.

6. Add proper logging system, analytics, errors tracking.

7. Implement a proper backend (convert the prototype we have into a real app): proper database, error handling, logging, etc. 
