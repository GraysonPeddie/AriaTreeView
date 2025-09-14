# AriaTreeView
The AriaTreeView class is a ready-to-made tree view that is accessible for users of screen readers and those who rely on keyboard for navigating the tree view.

## How to Use?

### JavaScript

Add the `AriaTreeView` class within JavaScript and create a new instance of the ARIA tree view. For example:

```js
var tview = new AriaTreeView(mytreeview);
```

Where `mytreeview` is a div container that contains the details and summary tags.

Also, you can have an event called when the selection is changed regardless of whether the user uses the keyboard or the mouse. Add an event listener for `treeviewselectionchange` in your code to trigger an event.

```js
var tvLDAPMain = new LDAPTreeView(ldaptreeview_main);
tvLDAPMain.addEventListener('ldapselectionchange', (e) => {
    console.log(JSON.stringify(e.detail));
});
```

In my case, I have extended AriaTreeView to create a new LDAPTreeView object so that I can enable and disable buttons when a `selectedIndex` has changed.

### HTML

```
<div id="mytreeview">
  <details role="tree">
    <summary role="treeitem">dc=graysonpeddie,dc=lan</summary>
    <details role="group">
      <summary role="treeitem">ou=Home</summary>
    </details>
  </details>
</div>
```

Note that no knowledge of LDAP (Lightweight Directory Access Protocol) is required. This is only just an example.

The `tree` role is the brain of the tree view. The `tree` role accepts both `treeitem` and `group` which the `group` role can have an additional `treeitem` role.

For more information about the ARIA Tree View, visit [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tree_role](ARIA Tree View from MDN) and to view the demo of the tree view, the W3C has made a couple of [https://www.w3.org/WAI/ARIA/apg/patterns/treeview/](tree view patterns) that should help you get started, but the AriaTreeView class should be of help to get web developers started in constructing a tree view.

## Why `AriaTreeView` Class is Needed?

`AriaTreeView` is needed because there is no native HTML for the tree view. As I don't want to use ARIA (Accessible Rich Internet Applications), I wanted to use a combination of details and summary tag along with radio buttons. Hoowever, Deque's Axe Automated Accessibility Tool flagged this issue, even if a tabindex is set to -1 for the summary tag. I tried to be innovative, but even if I don't have any issues when using the keyboard to navigate through the tree view, I suppose it can be unpredictable and cause issues for those who must rely on keyboard for navigation, even for those who do not use a screen reader such as VoiceOver for macOS, NVDA or JAWS for Windows, or even Orca screen reader for Linux. And by the way, my name is Grayson Peddie and I used Kagi's AI Assistant (Kagi is a premium search service with AI capabilities) to help me out with converting from procedural programming to object-oriented programming by developing an AriaTreeView class. This is needed in order to help me write an "interactive" documentation that helps Linux-exclusive administrators setup their OpenLDAP server, Kerberos, DNS, and SASL authentication between OpenLDAP and Kerberos. The documentation that ties all this together is sorely needed and that's why I used AI to help me out with this. But the documentation and the class I wrote came from me, so I'm the one who wrote the code, even though the AI did assist me on getting the procedural functions converted to a class for re-usability.

## License

This AriaTreeView is made by Grayson Peddie and uses the MIT license. All web developers using the ARIA tree view class are free to do whatever they want as long my name (Grayson Peddie) is mentioned.
