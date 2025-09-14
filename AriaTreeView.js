/** 
 * This is an ARIA Tree View class that uses the details/summary tags and is
 * ready to use. This class is made by Grayson Peddie and uses the MIT license.
 * Anyone can distribute the class and make improvements as long as my name
 * "Grayson Peddie" is attributed.
 *
 * This class helps web developers implement an ARIA tree view. This works by
 * attaching the ID of the container that is outside the details tag. For example:
 *
 * <div id="ldaptreeview">
 *   <details role="tree">
 *     <summary role="treeitem">dc=graysonpeddie,dc=lan</summary>
 *     <details role="group">
 *       <summary role="treeitem">ou=Home</summary>
 *     </details
 *   </details>
 * </div>
 *
 * Any details and summary tags that is added within the details will get expanded
 * by pressing the right-arrow key or collapsed by pressing the left arrow key as
 * long as the summary receives focus.
 */
class AriaTreeView {
    constructor(rootSelector) {
        // Root container element for the tree view
        this.root = rootSelector;

        // Array of visible tree items (summary elements with role="treeitem")
        // This is necessary in order to assign events to all tree items.
        this.visibleTreeItems = [];
        // Array of all tree items (summary elements with role="treeitem")
        // This is necessary in order to limit selection to visible tree items.
        this.allTreeItems = [];

        // Index of the currently selected tree item
        this.selectedIndex = 0;

        // Bind event handlers to preserve 'this' context
        this.handleTIKeyDown = this.handleTIKeyDown.bind(this);
        this.handleTIClick = this.handleTIClick.bind(this);
        this.handleTVClick = this.handleTVClick.bind(this);

        // Listen for selection changes internally (depends on your base class implementation)
        this.addEventListener('selectionchange', this._onSelectionChange.bind(this));

        // Initialize the tree view
        this.init();
    }

    /**
     * Initialize the tree view object.
     */
    init() {
        // Expose all the tree items so that all the events can be assigned
        // all at once.
        this.allTreeItems = this.root.querySelectorAll('[role="treeitem"]');
        this.allTreeItems.forEach((item) => {
            item.addEventListener('keydown', this.handleTIKeyDown);
            item.addEventListener('mouseup', this.handleTIClick);
        });

        this.root.addEventListener('click', this.handleTVClick);

        // Initialize tree items and set up event listeners
        this.loaded = false;
        this.updateTreeItems();

        // Set initial selection (first treeitem with aria-selected="true" or first item)
        const initiallySelected = this.visibleTreeItems.findIndex(
            (item) => item.getAttribute('aria-selected') === 'true'
        );
        this.selectedIndex = initiallySelected >= 0 ? initiallySelected : 0;
        this.setSelected(this.selectedIndex);
    }

    /**
     * Update the visible tree items in the this.visibleTreeItems array.
     * This is a recursive function that looks for any additional tree items that are currently
     * opened.
     */
    updateTreeItems(children = null) {
        // Refresh the list of tree items visible in the tree
        if(children == null) {
            this.visibleTreeItems = [this.root.querySelector('details > [role="treeitem"]')];
            if(this.root.querySelectorAll('[open=""] > details').length > 0) {
                this.updateTreeItems(this.root.querySelectorAll('[open=""] > details'));
            }
        } else {
            for(let i = 0; i < children.length; i++) {
                this.visibleTreeItems.push(children[i].closest("details").querySelector('[role="treeitem"]'));
            }
        }
    }

    /**
     * Calls after the user uses the up/down arrow keys or clicks in the summary.
     * This will make sure that anything that is not selected gets a tabindex
     * attrbute set to -1 and the only one that is selected how has an
     * aria-selected attribute set to true.
     */
    setSelected(index) {
        // Update aria-selected and tabindex for all tree items
        this.visibleTreeItems.forEach((item, i) => {
            if (i === index) {
                item.setAttribute('aria-selected', 'true');
                item.setAttribute('tabindex', '0');
                if(this.loaded == true) item.focus();
                else this.loaded = true; // don't steal focus upon page load.
            } else {
                item.removeAttribute('aria-selected');
                item.setAttribute('tabindex', '-1');
            }
        });
        this.selectedIndex = index;
    }

    /**
     * Handle the arrow keys. Up and down arrow keys changes the selection
     * to the next or previous tree item, left arrow key collapses the tree
     * items, and right arrow key shows additional tree items. Home and End
     * keys take users to the first or the last tree item that is visible in
     * the tree view. If the spacebar and Enter key is being used, don't do
     * anything, as this can cause bugs in the tree view object.
     */
    handleTIKeyDown(e) {
        console.log(e.key);
        switch (e.key) {
            case 'ArrowRight':
                this.expand(this.selectedIndex);
                break;
            case 'ArrowLeft':
                this.collapse(this.selectedIndex);
                break;
            case 'ArrowUp':
                this.selectPrevious(e);
                break;
            case 'ArrowDown':
                this.selectNext(e);
                break;
            case 'Home': {
                    this.setSelected(0);
                    e.preventDefault();
                }
                break;
            case 'End': {
                    this.setSelected(this.visibleTreeItems.length - 1);
                    e.preventDefault();
                }
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                break;
            default:
                break;
        }
    }

    /**
     * Handle the click of the tree item from a pointing device.
     */
    handleTIClick(e) {
        const clickedItem = e.currentTarget;
        const index = this.visibleTreeItems.indexOf(clickedItem);
        if (index >= 0) {
            this.setSelected(index);
            this.closeSubfolders(clickedItem);
        }
    }

    /**
     * If the user clicks anywhere in the tree view, take care of the
     * user's intention by focusing in the selected item. This can
     * actually help in reducing cognitive load for everyone.
     */
    handleTVClick(e) {
        this.setSelected(this.selectedIndex);
    }

    /*
     * Show additional tree items if there are any.
     */
    expand(index) {
        const item = this.visibleTreeItems[index];
        if (!item) return;
        const details = item.closest('details');
        if (details) {
            details.open = true;
            setTimeout(() => this.updateTreeItems(), 10);
        }
    }

    /*
     * Hide tree items if additional tree items are shown.
     */
    collapse(index) {
        const item = this.visibleTreeItems[index];
        if (!item) return;
        const details = item.closest('details');
        if (details) {
            details.open = false;
            // Close all nested details inside this details
            details.querySelectorAll('details').forEach((d) => (d.open = false));
            this.updateTreeItems();
        }
    }

    /**
     * Select the previous tree item that is currently visible unless the tree item is the first.
     */
    selectPrevious(e) {
        if (this.selectedIndex > 0) {
            this.setSelected(this.selectedIndex - 1);
        }
        e.preventDefault();
    }

    /**
     * Select the next tree item that is currently visible unless the tree item the last visible item.
     */
    selectNext(e) {
        if (this.selectedIndex + 1 < this.visibleTreeItems.length) {
            this.setSelected(this.selectedIndex + 1);
        }
        e.preventDefault();
    }

    /**
     * If the tree item is collapsed, collapse additional tree items as well
     * if needed. This is to replicate how Active Directory behaves in Windows
     * Server. These are treeted as folders or in the case of LDAP, "Organizational
     * Units." Note that knowledge of LDAP is not needed if this tree view is needed
     * for anything different.
     */
    closeSubfolders(item) {
        const details = item.closest('details');
        if (!details) return;
        setTimeout(() => {
            if (!details.open) {
                details.querySelectorAll('details').forEach((d) => (d.open = false));
            }
            this.updateTreeItems();
        }, 10);
    }

    // -------------------------------------------
    // SELECTION CHANGE EVENT
    // -------------------------------------------

    /**
     * This is an event that will be called when a selection has changed.
     * @param {Event} e Event Handler
     */
    _onSelectionChange(e) {
        // Dispatch a custom event with the new selectedIndex or selected item info
        this.dispatchEvent(new CustomEvent('selectionchange', {
            detail: { selectedIndex: this.selectedIndex, selectedItem: this.selectedItem },
            bubbles: true,
            composed: true
        }));
    }
  
    // Alternatively, if you control the setter for selectedIndex:
    set selectedIndex(value) {
        if (this._selectedIndex !== value) {
            this._selectedIndex = value;
            this._onSelectionChange();
        }
    }

    // Get the selected index.
    get selectedIndex() {
        return this._selectedIndex;
    }
}
