# App screenshots for the phone frames

`MobileShowcase` renders one `PhoneSnapshot` per app that has a `mobile` entry
in `lib/data/apps.ts`. Drop the PNGs here, named after the app id:

    fullhouse.png
    safesound.png

Capture rules:

- **Size**: 480x972 or larger (2x the 240x486 frame) so it stays sharp on retina.
- **Width**: shoot the app at ~390px CSS width — a real phone viewport, not a
  squashed desktop layout.
- **Crop**: cut the browser chrome and the device status bar. `PhoneFrame` draws
  its own notch and 9:41 status row, and the snapshot sits below it.
- **Content**: the app's dashboard or main screen with realistic data. No
  placeholder text, no lorem, no empty states.

Until a PNG exists the section renders nothing, so a missing file is invisible
rather than broken.
