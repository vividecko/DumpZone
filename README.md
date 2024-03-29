# DumpZone
## Resources
* [Git basics](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository)
* [GitHub basics](https://git-scm.com/book/en/v2/GitHub-Contributing-to-a-Project)

## Install for Development/Testing
0. Install [node.js](https://nodejs.org/en/download/).
1. Open your command line and `cd` (change directory) to whatever directory you want the server to be in.
2. Clone the repo: `git clone https://github.com/vividecko/DumpZone`
3. Now you have all the files in a folder called `DumpZone`. Run the installation script inside: that means running `.\install.bat` on the command line (**with admin privileges**), or right-clicking `install.bat` in File Explorer and selecting "Run as Administrator". Follow any instructions you see in the installation script.
4. Install MySQL according to [this tutorial](https://www.prisma.io/dataguide/mysql/setting-up-a-local-mysql-database).
5. Run `mysql` from the command line and log in with your MySQL root user password. (If `mysql` is not recognized as a command, you can specify the full path to the executable file - probably under something like `C:\Program Files\MySQL\MySQLsomethingsomething\bin\mysql` in Windows.)
6. Using the `mysql` command, issue `CREATE DATABASE homemath;`.
7. Next, issue `CREATE USER server@localhost IDENTIFIED BY 'pw';`. Replace `pw` with the not-so-secret password in `server.js` - look for the random string of letters among the DB info. Make sure to surround `pw` with single quotes.
8. Next, issue `GRANT SELECT, INSERT, UPDATE, ALTER, DELETE ON homemath.* TO server@localhost;`.
9. Issue `\q` to quit `mysql`. Now issue `mysql -u root -p homemath < homemath.sql` in your `DumpZone` directory.

## Contribute Changes
1. If you're about to start editing files, then before you do so, run `git pull origin main` in your `DumpZone` directory. This updates the files with what's currently on GitHub.
2. Edit some files, then start the server by running `npm run test-site` or `npx nodemon server.js` (same thing). As long as this command is running, you can view the website in your browser.
3. Open `localhost` in your browser to test stuff. Look at the browser's console (`ctrl+shift+J`) for any errors.
4. If there are no errors or problems, then select which files you modified and want to commit by issuing `git add [list of files]`.
5. Run `git status` and look at the output to make sure you're about to commit the correct files that you modified.
Run `git commit -m "[describe what you changed]"`. Now Git has recorded the changes in your *local* copy of the repo. (If this is your first commit, Git will make you enter your email and display name.)
6. Run `git push origin myedits` to upload your changes to GitHub. Type your GitHub credentials. But wait, there's more!!11!1!
7. Log onto GitHub via your browser, look at [DumpZone's pull requests](https://github.com/vividecko/DumpZone/pulls), select `New pull request`, select the `myedits` branch, and go on to submit the pull request (with a description, preferably). You can then merge it by going back to [DumpZone's pull requests](https://github.com/vividecko/DumpZone/pulls) and confirming the merge. You should now see the changes when you look at the files in the repo on GitHub. What happened was you uploaded your changes to your own branch of DumpZone, and then you merged the changes from your branch into the main branch (using the permissions Jake gave you).
