# The-HinterLands-IO-
New version of the hinterlands, created using web technologies

# Pre-requisites
1) Install Node.js (and npm- LTS version is fine): https://nodejs.org/en/
2) Make sure you can open a command window/console/terminal and run 'node -v' and 'npm -v' to see the node and npm versions.

# How to get the source code and install dependencies
1) Make sure you have git installed(should be able to see the version using git --version from the console): https://git-scm.com/downloads
2) Clone the project 
  a) On the main page: https://github.com/Ackmi/The-HinterLands-IO- click the green 'clone button to get the url
  b) In the console on your computer, go to the folder you want the source code in, and type 'git clone https://github.com/Ackmi/The-HinterLands-IO-.git .' (the period at the end will clone it to the current folder)
3) Now you have the source code on your computer. To get all the libraries needed, run (in the console) 'npm install' (which will look in the package.json, see all the dependencies, and download and install them into a node_modules sub folder)

#How to run the server and client
1) Download and install Visual Code
2) Open the folder you have the source code in with Visual Code
3) Open the settings (File->preferences->settings) and paste in the JSON and save:
{
    "emmet.includeLanguages": {
        "javascript":"javascriptreact"
    },
  "emmet.syntaxProfiles": {
      "javascript":"jsx"
  },
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "editor.minimap.enabled": false,
  "editor.hideCursorInOverviewRuler": true
}
4) Open up the first console/terminal in visual code (ctrl+` -the key next to '1' on the keyboard)
5) We'll have to have 3 consoles open (the '+' next to 1:bash on the bottom right), 1 for compiling the server TyeScript to JavaScript, 1 for running the node server, and one for webpacking the client (which also compiles the TypeScript)
  a) To start the server files being transpiled from TypeScript to JavaScript, in the first console type: 'cd src/server' then 'tsc -w' (first changes to the server src folder, second runs the typescript compiler in watch mode, which will transpile your typescript to javascript whenever a file changes)
  b) Open up a new terminal/console and start the server using: 'npm run server' (when you run 'npm run...'- it looks in package.json, at the scripts, and finds the one with the same name, and actually runs that command)
  c) Lastly, we can start the client running. Open the 3rd console/terminal window, type 'cd src/client', then 'webpack -w' (this will start webpack- which both runs tsc to transpile our TypeScript, as well as takes all our individual files/ "modules", and bundles them into one giant JS file for the browser to load)
6) Now we can see the game if we go to 'http://localhost:8081/' in the browser- which is where the node server is hosting the files.




