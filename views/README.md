# Frontend
Real quick, here's the structure of the frontend:
## Pages
* `login.ejs` is the login page. In `server.js` this is set to be the landing page when not logged in.
* `register.ejs` is the registration page.
* `index.ejs` is the home page. In the future it'll probably just be some EJS script to load HTML depending on whether the user is a student or instructor. For now, though, we'll just make this file the student's home page.
## Other Important Stuff
* `global-style.ejs` is the CSS that's loaded in every page (using the EJS syntax `<%- include('global-style.ejs'); -%>` instead of `<link>` because only that seems to work).
* `nav.ejs` is just a `<nav>` tag and its contents in a separate file. It's loaded into every page. It should have content loaded dynamically using embedded JavaScript (EJS) for different views. The nav-specific CSS is all inline in this file.
