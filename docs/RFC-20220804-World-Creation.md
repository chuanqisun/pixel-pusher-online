# World Creation

- User creates avatar by dragging widget onto canvas
- Click on new born avatar to start customization
  - Customization in an iframe
  - Generate a public/private key pair for authentication
- Character rendered as Widget instance
  - Only Widget can group and seal multiple SVGs into a single opaque element
- iframe remains open to get keyboard input
- Input event authenticated against target avartar before execution