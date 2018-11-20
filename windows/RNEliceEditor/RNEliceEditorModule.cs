using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Elice.Editor.RNEliceEditor
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNEliceEditorModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNEliceEditorModule"/>.
        /// </summary>
        internal RNEliceEditorModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNEliceEditor";
            }
        }
    }
}
