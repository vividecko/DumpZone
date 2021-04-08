:: Install the HomeMath server for development/testing by:
::  - branching the GitHub repo.
::  - installing required Node modules via Node's npm package manager.
::  - generating a placeholder session key in the file ".env".
::  - generating and self-signing the certificates needed for HTTPS to function
::    during development/testing, which partially follows this guide:
::    https://zeropointdevelopment.com/how-to-get-https-working-in-windows-10-localhost-dev-environment/

@echo off
title HomeMath Server Install (Development)
pause

set BRANCH_NAME=myedits   :: This could be anything.

:: You probably have Git for Windows installed, in which case this is probably
:: where it is.
set GIT_PATH=%ProgramFiles%\Git\mingw64\bin
if not exist %GIT_PATH% (
  echo Make sure you have Git for Windows installed:
  echo https://gitforwindows.org/
  pause
  exit /B
)
set PATH=%PATH%;%GIT_PATH%

git checkout -b "%BRANCH_NAME%"

:: Install required node.js modules, referencing package.json for dependencies.
:: A folder "node_modules" will be created by npm within the current directory.
npm install

:: For development, we need a placeholder session key, which is used to sign
:: cookies via the express-session module. This key isn't secure, but it
:: doesn't have to be secure in testing/development.
echo SESSION_SECRET=%RANDOM%%RANDOM%%RANDOM% > .env

:: Again, we can use dumb, insecure passphrases because it's for testing.
supersecretpw=%RANDOM%%RANDOM%%RANDOM%
rootname=rootSSL    :: name of our root SSL key
domain=localhost    :: name of our domain (localhost, for testing)

echo SSL CERT SETUP...
echo
openssl.exe genrsa -des3 -passout pass:%supersecretpw% -out %rootname%.key 2048

echo -------------------------------------------------------------------------
echo For the following input, just enter whatever (e.g. press enter^).
echo -------------------------------------------------------------------------
openssl.exe req -x509 -new -nodes -key %rootname%.key -sha256 -days 64 -out %rootname%.pem

echo -------------------------------------------------------------------------
echo HERE'S THE ANNOYING PART.
echo In the certmgr window, click on the "Trusted Root Certification
echo Authorities" directory, right-click the "Certificates" subdirectory,
echo select "All Tasks ^> Import...", and then type the full path to
echo "%rootname%.pem" when it asks you which certificate file to import.
echo
echo NOTE: If you browse to the cert. in File Explorer, then set the file type
echo to "All Files" so that it shows the ".pem" file you're looking for.
echo
echo Once you're done, close the certmgr window and resume this installation.
echo -------------------------------------------------------------------------
certmgr
pause

echo -------------------------------------------------------------------------
echo For the following input, just enter whatever (e.g. press enter^).
echo -------------------------------------------------------------------------
openssl req -new -sha256 -nodes -out %domain%.csr -newkey rsa:2048 -keyout %domain%.key
openssl x509 -req -in %domain%.csr -CA %rootname%.pem -passin pass:%pw% -CAkey %rootname%.key -CAcreateserial -out %domain%.crt -days 64 -sha256 -extensions "authorityKeyIdentifier=keyid,issuer\n basicConstraints=CA:FALSE\n keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment\n  subjectAltName=DNS:%domain%"

echo If all went well, then run "npm run test-site" or "npx nodemon server.js" to start the server.
echo Then, go to https://%domain%:3000 in your web browser.
pause
