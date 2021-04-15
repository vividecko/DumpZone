# Frontend Guide
TL;DR - Don't reinvent the wheel.
## HTML/CSS
Use the `<main>` and `<content>` tags as the containers for your documents (see shitty image). Tweak their style inline or in a stylesheet in `views/static` - avoid doing it globally unless it makes sense to. Also, whenever you're working with styles, look in `global.css` to see if you can use a variable name or existing class for what you're doing.
![html_format](https://user-images.githubusercontent.com/81930371/114947634-7938c000-9e1b-11eb-8b99-bf155d0be3df.PNG)
## File Structure
  The HTML files are all in `views/` and are EJS files (HTML with embedded JS). Every request for a document in `server.js` loads `template.ejs`, which in turn loads the desired document. Other notes:
  * `student_header.ejs` is the bar atop each page in the student view.
  * `work.ejs` will encompass the assignments, practice tests, and tutorials pages.
