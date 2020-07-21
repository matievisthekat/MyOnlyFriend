# VirtualFriend
Made with Node.JS, Python 3.8 and immense lonelyness. This programming allows you to speeck into your microphone and receive a response (Currently set as male, en-GB but it can be changed)

## Using it yourself
- Clone this repository onto your computer
- Create a file called `key.json` in the root directory
- Go to https://cloud.google.com/docs/authentication/getting-started, get your credentials and put them in the `kays.json` file
- Install the dependencies with `npm i`
- You will need to install [SoX](http://sox.sourceforge.net/)
    - MacOS
        - Run `brew install sox`
    - Linux
        - Run `sudo apt-get install sox libsox-fmt-all`
    - Windows
        - [Install the binaries](http://sourceforge.net/projects/sox/files/latest/download)
- Run `npm start` and speak into your microphone!