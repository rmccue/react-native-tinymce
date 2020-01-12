# react-native-tinymce

HTML WYSIWYG for React Native, in pure JS. (Works in Expo apps!)

Combine the power of TinyMCE with the usability of native UI.

## Demo

A demo of the editor is included in this repo. You can run this in the iOS Simulator or on your native device using [Expo](https://docs.expo.io/versions/v36.0.0/get-started/installation/#2-mobile-app-expo-client-for-ios) in minutes.

```sh
# Clone down this repo.
git clone https://github.com/rmccue/react-native-tinymce.git
cd react-native-tinymce

# Install dependencies.
npm install

# Build the app using Expo.
npm start
```

Once the app has started, follow the instructions in the build tool to run in the simulator or on-device.


## Usage

```jsx
import React from 'react';
import { Editor } from 'react-native-tinymce';

const MyEditor = props => (
	<Editor
		ref={ ref => this.editor = ref }
		value="<p>Hello world!</p>"
	/>
)
```

Pass the initial HTML content as the `value` prop.

To retrieve the content from the editor, call the `getContent()` method on the editor instance. This returns a promise which will resolve to the HTML string.

Avoid changing the `value` prop too often, as it causes TinyMCE to re-parse and re-render the value unnecessarily.


## Architecture

The main component is the Editor component. This renders a TinyMCE-based WYSIWYG into a webview, and sets up the interactions with it.

When focussed on the WYSIWYG, the Editor component renders the toolbar as a keyboard accessory view.

The toolbar can be overridden via the `children` render prop, and by default renders the included Toolbar component. Override this prop to add additional buttons as needed.

When the user presses the format button, the toolbar and keyboard are hidden, and the formatter pane is shown. This pane interacts with TinyMCE's underlying formatting utilities.


## Icons

By default, react-native-tinymce uses a set of fallback icons.

To use native iOS icons, load in SF Symbols as a font using `expo-font`, with the name `sfsymbols`.


## Credits

Copyright 2019 Ryan McCue

Licensed under the MIT license.
