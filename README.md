# react-native-elice-editor

### Mostly automatic installation

`$ react-native link react-native-elice-editor`

### Manual installation

#### iOS/

1. In XCode, in the project navigator, right click `Libraries` ➜
   `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-elice-editor` and add
   `RNEliceEditor.xcodeproj`
3. In XCode, in the project navigator, select your project. Add
   `libRNEliceEditor.a` to your project's `Build Phases` ➜
   `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`

- Add `import com.reactlibrary.RNEliceEditorPackage;` to the imports at the top
  of the file
- Add `new RNEliceEditorPackage()` to the list returned by the `getPackages()`
  method

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-elice-editor'
   project(':react-native-elice-editor').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-elice-editor/android')
   ```
3. Insert the following lines inside the dependencies block in
   `android/app/build.gradle`:
   ```
     compile project(':react-native-elice-editor')
   ```

#### Windows

[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNEliceEditor.sln` in
   `node_modules/react-native-elice-editor/windows/RNEliceEditor.sln` folder to
   their solution, reference from their app.
2. Open up your `MainPage.cs` app

- Add `using Elice.Editor.RNEliceEditor;` to the usings at the top of the file
- Add `new RNEliceEditorPackage()` to the `List<IReactPackage>` returned by the
  `Packages` method

## Usage

```javascript
import RNEliceEditor from "react-native-elice-editor";

// TODO: What to do with the module?
RNEliceEditor;
```

todo

- set styles
- set theme
