![Pixel Pusher Logo](/design/cover.png)

# Pixel Pusher Online (Beta)

A free and open-source MMORPG inside Figma. Pick a character and explore a variety of maps together with your coworkers. Features include:

- 10 avatars
- 4 maps
- Custom nickname
- Chatroom

## Screenshot

![Gameplay screenshot](/design/screenshot.png)

## Under the hood

- The game is built with Figma's Plugin and Widget API.
- The avatar animation is achieved with PNG sprite.
- The chat system stores messages inside each page and polls for update.
- The maps are built from existing tilesets and assembled using Figma.
- The control UI is a web app that sends commands to the Figma main app, built in Preact.

## How to contribute

My goal is to encourage more game designers and developers to learn and experiment. You are welcome to submit your avatar or map design and a social link that you would to promote.

### Avatar design requirement

- Dimension: 16 × 16
- Full color
- Sprite
  - 4-direction walk frames
  - Idle frame (optional if walk frame includes idle state)
- Submit a PR with the following information
  - Avatar name
  - Your name (either real or artist name)
  - Your social link (optional)
  - Your preferred license (optional)

### Map design requirement

- Grid size: 16 × 16
- Dimension: up to you
- Submit a PR with the following information
  - Spwan point(s): which row and column should players initially appear at?
  - Map name
  - Ideal number of players (this might be used in the future)
  - Your name (either real or artist name)
  - Your social link (optional)
  - Your preferred license (optional)

## Licenses and credits

- Source code: MIT
- Cover art is made from [javikolog](https://route1rodent.itch.io/)'s tileset, under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) license.
- Avatars and maps bear credits to a variety of artists whose names and lienses are listed in the game UI.
- Inspiration from Interactive Figmaland
- My gratitude to the following individuals:
  - Jackie Chui for technical advice
  - June Punkasem for design advice
