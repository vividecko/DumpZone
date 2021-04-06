# DumpZone
## Install for Development
1. Open your command line and `cd` to a directory to work in.
2. Clone the repo: `git clone https://github.com/mwfsu/KeyboardWarriors-DumpZone`
3. Make your own branch of the repo: `git checkout -b [branch name]` (where `[branch name]` is whatever name you want)
4. Install required modules (while you're in the directory in which you cloned the repo): `npm i express ejs express-session express-flash passport passport-local`
5. Install a couple more: `npm i --save-dev nodemon dotenv`
6. Create a file called `.env` and write `SESSION_SECRET=[randomstring]`, where `[randomstring]` is, you know, a random string of letters and numbers.

## Commit Changes
1. Edit some files, then run `npx nodemon server.js` in the directory of your cloned repo. Look at the output on the command line for any errors. You can keep Nodemon running in a separate terminal because it dynamically updates the server as you change files.
2. Open `http://localhost:3000` in your web browser, and use the website to test out your changes. Also, open the web browser's console to check for any errors there.
3. If there are no errors or problems, then run `git add [files]`, where `[files]` is a list of _each_ file you changed. This stages the files, meaning they're selected when you commit (upload) them to our GitHub repo.
4. Run `git status` to make sure you staged the right files. (They'll be labelled as "tracked.")
5. Commit the changes to your local repo. Run `git commit -m '[informative message of what you did]'`. If this is your first commit, Git will make you enter your email and name.
6. Finally, push the changes to your repo online: `git push origin [branch name]` (where `[branch name]` is the name of the branch you made when you cloned the repo - see above)
7. When you log into GitHub, you should see a pull request waiting to be submitted, so you can submit it and then Jake can approve it or something like that.
