# DumpZone
## Install for Development
1. Open your command line and `cd` to a directory to work in.
2. Clone the repo: `git clone https://github.com/mwfsu/KeyboardWarriors-DumpZone`
3. Make your own branch of the repo: `git checkout -b [branch name]` (where `[branch name]` is whatever name you want)
4. Install required modules (while you're in the directory in which you cloned the repo): `npm i express ejs express-session express-flash passport passport-local`
5. Install a couple more (don't forget the `--save-dev` option here): `npm i --save-dev nodemon dotenv`
6. Create a file called `.env` and write `SESSION_SECRET=[randomstring]`, where `[randomstring]` is, you know, a random string of letters and numbers. (If you're wondering what the session secret is, it's a secret key stored in the server for encrypting cookies. During development, it doesn't matter whether the session key is secure/complex. It just has to be there or else an error will be thrown.)

## Contribute Changes
1. Run `git pull origin main` within your working directory to make sure you're developing with the up-to-date project.
2. Edit some files, then run `npx nodemon server.js` in the directory of your cloned repo. Look at the output on the command line for any errors. You can keep Nodemon running in a separate terminal because it dynamically updates the server as you change files.
3. Open `http://localhost:3000` in your web browser, and use the website to test out your changes. Also, open the web browser's console to check for any errors there.
4. If there are no errors or problems, then run `git add [files]`, where `[files]` is a list of _each_ file you changed. This stages the files, meaning they're selected when you commit them to your local repo.
5. Run `git status` to make sure you staged the right files. (Git will tell you which files are tracked vs. untracked and which have been modified, etc.)
6. Commit the changes to your local repo. Run `git commit -m '[informative message of what you did]'`. (If this is your first commit, Git will make you enter your email and name.)
7. Finally, push the changes to your branch online: `git push origin [branch name]` (where `[branch name]` is the name of the branch you made when you ran `git checkout -b` - see above)
8. When you log into GitHub, you should see a pull request waiting to be submitted, so you can submit it (with an optional message), and then Jake can merge it into the main branch, which officially adds your modifications to the project.
