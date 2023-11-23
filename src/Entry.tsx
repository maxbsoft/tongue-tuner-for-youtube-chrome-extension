import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { PopUp } from "./components/PopUp";
import AppProvider from "./AppContext";

/*
To insert the app into the dom you should first find the class of the element on the webpage you are modifying 
and set that class to insertionElement below
*/

const insertionElementId = "this-page-intentionally-left-blank.org";

const body = document.getElementById(insertionElementId);

/*
You can now append the app to the body of the webpage you are modifying
You can preform additional checks here if you like this is just a base example.
*/
const baseElementClassName = "my-extension-container";

if (body) {
  body.innerHTML += `<div class="${baseElementClassName}"></div>`;
}
if (window.location.href.indexOf('this-page-intentionally-left-blank.org') >= 0) {
  const container = document.getElementsByClassName(baseElementClassName)[0];
  if (container) {
    const root = createRoot(container!);

    root.render(
      <React.StrictMode>
        <AppProvider>
          <App />
        </AppProvider>
      </React.StrictMode>
    );
  }
} else {
  const container = document.getElementById("root");
  const root = createRoot(container!);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <PopUp />
      </AppProvider>
    </React.StrictMode>
  );
}
