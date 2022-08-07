# Dev tasks

- [DONE] Hot reload any asset change
- [DONE] Bunlde single html output
- [DONE] Vertical jiggle issue
- Sprite generator
  - Generate one-use sprite from ui thread
- Handle Ctrl-Z in figma
- Implement useEffect w/ deps array
- Implement useMemo w/ deps array
- Debounce input rate
- Auto snap to grid when walking
- UI-main thread rpc utils

# Phase 0: Technical POC

- Simple bubble chat
- Add hints for free and open maps
- One click to load prebuild maps
- Add credit and donation links for character and map artists
- Test object creation from character
- Timeout the emote
- [OK] Persist character setting across sessions
  - [FAIL] Remove inactive characters -> Only FigJam allows query all active users
- [OK] Allow nickname
  - [OK] Render with Figma user color
  - [OK] Hover tooltip shows real name
- [OK] Auto open UI on creation
- [OK] Render user name in Figma Label style
- [OK] Emoji-based emote
- [OK] camera auto-centering
- [OK] "Find my character" button
- [OK] Test sprite
  - credit: https://onlinepngtools.com/convert-png-to-base64
- [OK] Test web audio
- [OK] Test user id ownership model
- [OK] Test character selector
- [OK] Test display user name
- [OK] One character per user
- [OK] First press to turn without move
- [FAIL] Test autonomous walk. -> This require persisted UI

# Phase 1: Public beta

- Render quick menu directly on the widget
- Hit box detection, prevent overlap
- Customizable emoji
- Game control panel
  - Character
  - Emote
  - Chat
  - Other player detail display
- Ground shadow effect
- Smooth walk animation
- Proximity text chat
- Deep character customization
- Tiled map builder

# Phase 2: GA

- Pet system
- Proximity audio
- P2P Video chat
- Skeleton based animation
- Map with occlusion
