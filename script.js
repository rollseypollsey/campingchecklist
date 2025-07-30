/*
 * Camping Checklist Web App
 *
 * This script powers a dynamic checklist application. It loads a list of
 * camping gear and supplies, allows users to check off items, add
 * categories or items, edit names, delete entries, and reorder items via
 * drag‑and‑drop. Optional items can be hidden or shown using the global
 * toggle. The state of the checklist persists in localStorage so that
 * progress isn’t lost between sessions. Users can also print the list
 * or share it by generating a link containing the encoded checklist
 * state. When a link with encoded data is opened, the app will load
 * that version of the checklist.
 */

(() => {
  /**
   * Generate a UUID for categories and items. We need unique
   * identifiers to track elements in the DOM and data model.
   */
  function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * The default dataset for the camping checklist. This mirrors the
   * categories and items from the Cozi Family Camping Checklist【770859095008976†L67-L134】.
   * Some items are marked as optional based on whether they’re nice‑to‑have
   * extras (e.g. a French press or extra blankets). Users can toggle
   * the visibility of optional items using the “Show optional items”
   * checkbox. When adding new items, they start as non‑optional but
   * can be marked optional by clicking the star icon.
   */
  const defaultData = {
    categories: [
      {
        id: generateId(),
        name: 'Campsite Gear',
        items: [
          { id: generateId(), name: 'Tent, poles, stakes', checked: false, optional: false },
          { id: generateId(), name: 'Tent footprint (ground cover for under your tent)', checked: false, optional: false },
          { id: generateId(), name: 'Extra tarp or canopy', checked: false, optional: true },
          { id: generateId(), name: 'Sleeping bag for each camper', checked: false, optional: false },
          { id: generateId(), name: 'Sleeping pad for each camper', checked: false, optional: false },
          { id: generateId(), name: 'Repair kit for pads, mattress, tent, tarp', checked: false, optional: false },
          { id: generateId(), name: 'Pillows', checked: false, optional: false },
          { id: generateId(), name: 'Extra blankets', checked: false, optional: true },
          { id: generateId(), name: 'Chairs', checked: false, optional: false },
          { id: generateId(), name: 'Headlamps or flashlights (extra batteries)', checked: false, optional: false },
          { id: generateId(), name: 'Lantern', checked: false, optional: false },
          { id: generateId(), name: 'Lantern fuel or batteries', checked: false, optional: true }
        ]
      },
      {
        id: generateId(),
        name: 'Kitchen',
        items: [
          { id: generateId(), name: 'Stove', checked: false, optional: false },
          { id: generateId(), name: 'Fuel for stove', checked: false, optional: false },
          { id: generateId(), name: 'Matches or lighter', checked: false, optional: false },
          { id: generateId(), name: 'Firewood', checked: false, optional: false },
          { id: generateId(), name: 'Frying pan', checked: false, optional: false },
          { id: generateId(), name: 'Pot', checked: false, optional: false },
          { id: generateId(), name: 'French press or portable coffee maker', checked: false, optional: true },
          { id: generateId(), name: 'Corkscrew', checked: false, optional: true },
          { id: generateId(), name: 'Tablecloth', checked: false, optional: true },
          { id: generateId(), name: 'Roasting sticks for marshmallows, hot dogs', checked: false, optional: true },
          { id: generateId(), name: 'Food‑storage containers, bags', checked: false, optional: false },
          { id: generateId(), name: 'Trash bags', checked: false, optional: false },
          { id: generateId(), name: 'Cooler', checked: false, optional: false },
          { id: generateId(), name: 'Ice', checked: false, optional: true },
          { id: generateId(), name: 'Water bottles', checked: false, optional: false },
          { id: generateId(), name: 'Plates, bowls, forks, spoons, knives', checked: false, optional: false },
          { id: generateId(), name: 'Cups, mugs', checked: false, optional: true },
          { id: generateId(), name: 'Paring knife, spatula, cooking spoon', checked: false, optional: false },
          { id: generateId(), name: 'Cutting board', checked: false, optional: false },
          { id: generateId(), name: 'Foil', checked: false, optional: false },
          { id: generateId(), name: 'Biodegradable soap', checked: false, optional: true },
          { id: generateId(), name: 'Sponge, dishcloth, dishtowel', checked: false, optional: true },
          { id: generateId(), name: 'Paper towels', checked: false, optional: true },
          { id: generateId(), name: 'Extra bin for washing dishes', checked: false, optional: true }
        ]
      },
      {
        id: generateId(),
        name: 'Clothes',
        items: [
          { id: generateId(), name: 'Clothes for daytime', checked: false, optional: false },
          { id: generateId(), name: 'Sleepwear', checked: false, optional: false },
          { id: generateId(), name: 'Swimsuits', checked: false, optional: true },
          { id: generateId(), name: 'Rainwear', checked: false, optional: false },
          { id: generateId(), name: 'Shoes: hiking/walking shoes, easy‑on shoes, water shoes', checked: false, optional: false },
          { id: generateId(), name: 'Extra layers for warmth', checked: false, optional: false },
          { id: generateId(), name: 'Gloves', checked: false, optional: true },
          { id: generateId(), name: 'Hats', checked: false, optional: true }
        ]
      },
      {
        id: generateId(),
        name: 'Personal Items',
        items: [
          { id: generateId(), name: 'Sunscreen', checked: false, optional: false },
          { id: generateId(), name: 'Insect repellant', checked: false, optional: false },
          { id: generateId(), name: 'First‑aid kit', checked: false, optional: false },
          { id: generateId(), name: 'Prescription medications', checked: false, optional: false },
          { id: generateId(), name: 'Toothbrush, toiletries', checked: false, optional: false },
          { id: generateId(), name: 'Soap', checked: false, optional: false },
          { id: generateId(), name: '60% or higher alcohol‑based hand sanitizer', checked: false, optional: false },
          { id: generateId(), name: 'Toilet paper', checked: false, optional: false }
        ]
      },
      {
        id: generateId(),
        name: 'Other Items',
        items: [
          { id: generateId(), name: 'Camera', checked: false, optional: true },
          { id: generateId(), name: 'Campsite reservation confirmation, phone number', checked: false, optional: false },
          { id: generateId(), name: 'Maps, area information', checked: false, optional: false },
          { id: generateId(), name: 'Bikes toys', checked: false, optional: true },
          { id: generateId(), name: 'Toys', checked: false, optional: true },
          { id: generateId(), name: 'Pet supplies and food', checked: false, optional: true },
          { id: generateId(), name: 'Disinfectant spray and wipes', checked: false, optional: true },
          { id: generateId(), name: 'String or clothesline', checked: false, optional: true }
        ]
      }
    ],
    showOptional: true
  };

  // Keys for localStorage and URL parameter
  const STORAGE_KEY = 'campingChecklistData';
  const PARAM_KEY = 'data';

  // DOM elements
  const categoriesContainer = document.getElementById('categories');
  const addCategoryButton = document.getElementById('addCategoryButton');
  const toggleOptionalCheckbox = document.getElementById('toggleOptional');
  const printButton = document.getElementById('printButton');
  const shareButton = document.getElementById('shareButton');
  const resetButton = document.getElementById('resetButton');

  /**
   * Load data from URL, localStorage or default. If a `data` parameter
   * exists in the URL, it will override localStorage and default. The
   * parameter is expected to be a base64 encoded JSON string. We use
   * try/catch to handle invalid data gracefully.
   */
  function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const encoded = urlParams.get(PARAM_KEY);
    if (encoded) {
      try {
        // Decode URI components and base64 decode the string, handling UTF‑8 characters.
        // We first decode the percent encoding applied in the query string, then
        // atob() gives us a binary string, which we convert back to UTF‑8 using
        // escape() and decodeURIComponent(). This reverses the encoding used in
        // generateShareLink().
        const base64 = decodeURIComponent(encoded);
        const binaryString = atob(base64);
        const json = decodeURIComponent(escape(binaryString));
        const parsed = JSON.parse(json);
        return parsed;
      } catch (e) {
        console.warn('Failed to parse encoded data from URL:', e);
      }
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse data from localStorage:', e);
      }
    }
    // Fallback to default dataset
    return JSON.parse(JSON.stringify(defaultData));
  }

  /**
   * Save the current data to localStorage. We also update the
   * `showOptional` checkbox state on save so that UI and data remain
   * synchronized.
   */
  function saveData() {
    data.showOptional = toggleOptionalCheckbox.checked;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Renders all categories and items into the DOM. This function
   * removes any existing category elements and rebuilds the DOM based
   * on the current `data` object. After rendering, drag‑and‑drop
   * functionality is initialized for both categories and items.
   */
  function render() {
    // Clear existing content
    categoriesContainer.innerHTML = '';
    // Apply class to hide optional items based on global toggle
    if (data.showOptional) {
      document.body.classList.remove('hidden-optional');
    } else {
      document.body.classList.add('hidden-optional');
    }
    // Render each category
    data.categories.forEach((category) => {
      const section = document.createElement('section');
      section.className = 'category';
      section.dataset.categoryId = category.id;

      // Category header: editable name and delete button
      const header = document.createElement('div');
      header.className = 'category-header';
      const nameInput = document.createElement('input');
      nameInput.className = 'category-name';
      nameInput.value = category.name;
      nameInput.addEventListener('blur', () => {
        category.name = nameInput.value.trim() || 'Untitled Category';
        saveData();
      });
      header.appendChild(nameInput);
      // Only allow deleting custom categories (those not in default list). We check
      // whether the category exists in defaultData by name. If not found, it’s custom.
      const isDefault = defaultData.categories.some((c) => c.name === category.name);
      if (!isDefault) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-category';
        deleteButton.title = 'Delete category';
        deleteButton.textContent = '✖';
        deleteButton.addEventListener('click', () => {
          if (confirm(`Delete category "${category.name}"?`)) {
            data.categories = data.categories.filter((c) => c.id !== category.id);
            saveData();
            render();
          }
        });
        header.appendChild(deleteButton);
      }
      section.appendChild(header);

      // Item list container
      const listEl = document.createElement('ul');
      listEl.className = 'item-list';
      // Render items
      category.items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'item';
        li.dataset.itemId = item.id;
        if (item.optional) li.classList.add('optional');
        // Add checked class if item is initially checked
        if (item.checked) li.classList.add('checked');

        // Drag handle to enable drag‑and‑drop. We use a separate element
        // instead of making the entire item draggable so that editing
        // the item name doesn’t conflict with drag actions.
        const dragHandle = document.createElement('span');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '≡';
        li.appendChild(dragHandle);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'item-checkbox';
        checkbox.checked = !!item.checked;
        checkbox.addEventListener('change', () => {
          item.checked = checkbox.checked;
          // Toggle class to strike through the text when checked
          li.classList.toggle('checked', checkbox.checked);
          saveData();
        });
        li.appendChild(checkbox);

        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.contentEditable = 'true';
        nameSpan.innerText = item.name;
        // On blur update the item name
        nameSpan.addEventListener('blur', () => {
          item.name = nameSpan.innerText.trim() || 'Untitled Item';
          saveData();
        });
        li.appendChild(nameSpan);

        // Optional toggle button
        const optionalBtn = document.createElement('button');
        optionalBtn.className = 'toggle-optional';
        optionalBtn.innerHTML = item.optional ? '⭐' : '☆';
        if (item.optional) optionalBtn.classList.add('optional-true');
        optionalBtn.title = item.optional ? 'Optional (click to make required)' : 'Required (click to make optional)';
        optionalBtn.addEventListener('click', () => {
          item.optional = !item.optional;
          saveData();
          render();
        });
        li.appendChild(optionalBtn);

        // Delete item button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-item';
        deleteBtn.title = 'Delete item';
        deleteBtn.textContent = '✖';
        deleteBtn.addEventListener('click', () => {
          category.items = category.items.filter((i) => i.id !== item.id);
          saveData();
          render();
        });
        li.appendChild(deleteBtn);

        listEl.appendChild(li);
      });
      section.appendChild(listEl);

      // Add item button
      const addItemBtn = document.createElement('button');
      addItemBtn.className = 'add-item-button';
      addItemBtn.textContent = '+ Add Item';
      addItemBtn.addEventListener('click', () => {
        const newItemName = prompt('New item name:');
        if (newItemName && newItemName.trim() !== '') {
          category.items.push({
            id: generateId(),
            name: newItemName.trim(),
            checked: false,
            optional: false
          });
          saveData();
          render();
        }
      });
      section.appendChild(addItemBtn);
      categoriesContainer.appendChild(section);
    });
    // Initialize drag‑and‑drop for categories (reordering categories)
    Sortable.create(categoriesContainer, {
      handle: '.category-header',
      animation: 150,
      onEnd: (evt) => {
        const moved = data.categories.splice(evt.oldIndex, 1)[0];
        data.categories.splice(evt.newIndex, 0, moved);
        saveData();
      }
    });
    // Initialize drag‑and‑drop for each item list. We allow moving items within
    // and across categories using the same group name.
    document.querySelectorAll('.item-list').forEach((ul) => {
      Sortable.create(ul, {
        group: { name: 'items', pull: true, put: true },
        animation: 150,
        draggable: '.item',
        handle: '.drag-handle',
        onEnd: (evt) => {
          // Determine source and destination categories using the closest
          // ancestor with the `.category` class. `evt.from` and `evt.to`
          // refer to the lists themselves (ul elements). Using `closest`
          // allows us to handle nested structures more reliably.
          const fromSection = evt.from.closest('.category');
          const toSection = evt.to.closest('.category');
          if (!fromSection || !toSection) return;
          const fromCategoryId = fromSection.dataset.categoryId;
          const toCategoryId = toSection.dataset.categoryId;
          const fromCategory = data.categories.find((c) => c.id === fromCategoryId);
          const toCategory = data.categories.find((c) => c.id === toCategoryId);
          if (!fromCategory || !toCategory) return;
          const movedItem = fromCategory.items.splice(evt.oldIndex, 1)[0];
          toCategory.items.splice(evt.newIndex, 0, movedItem);
          saveData();
        }
      });
    });
  }

  /**
   * Generates a share link with the current checklist encoded into the
   * URL. We remove the existing `data` parameter to avoid double
   * encoding. The encoded data is base64‑encoded JSON representing
   * the entire data object. The link uses the current page’s origin
   * and pathname, preserving other query parameters.
   */
  function generateShareLink() {
    // Copy a shallow clone of data to avoid persisting showOptional state to the link
    const dataCopy = JSON.parse(JSON.stringify(data));
    // Convert the JSON string into a base64 representation that can handle
    // Unicode characters. The native btoa() function only works with
    // Latin‑1 strings, so we first encode the string as URI components
    // and unescape it. See: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
    const json = JSON.stringify(dataCopy);
    function base64EncodeUnicode(str) {
      // First encode the string as UTF‑8 percent escapes, then unescape to
      // convert into a Latin‑1 binary string suitable for btoa().
      return btoa(unescape(encodeURIComponent(str)));
    }
    const encodedData = base64EncodeUnicode(json);
    const encodedParam = encodeURIComponent(encodedData);
    // Build the URL without duplicating existing data param
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM_KEY);
    url.searchParams.append(PARAM_KEY, encodedParam);
    return url.toString();
  }

  // Event listeners
  toggleOptionalCheckbox.addEventListener('change', () => {
    data.showOptional = toggleOptionalCheckbox.checked;
    saveData();
    render();
  });
  addCategoryButton.addEventListener('click', () => {
    const categoryName = prompt('New category name:');
    if (categoryName && categoryName.trim() !== '') {
      data.categories.push({
        id: generateId(),
        name: categoryName.trim(),
        items: []
      });
      saveData();
      render();
    }
  });
  printButton.addEventListener('click', () => {
    window.print();
  });
  shareButton.addEventListener('click', () => {
    const link = generateShareLink();
    showShareModal(link);
  });

  // Reset button to restore the default checklist. This clears the
  // localStorage and removes any encoded data from the URL. We
  // confirm with the user before wiping current progress.
  resetButton.addEventListener('click', () => {
    if (confirm('Reset the checklist to the original items? This will erase your current changes.')) {
      // Remove any saved data
      localStorage.removeItem(STORAGE_KEY);
      // Remove data parameter from URL if present
      const url = new URL(window.location.href);
      url.searchParams.delete(PARAM_KEY);
      window.history.replaceState(null, '', url.toString());
      // Reload default data and re-render
      data = JSON.parse(JSON.stringify(defaultData));
      toggleOptionalCheckbox.checked = data.showOptional;
      saveData();
      render();
    }
  });

  /**
   * Display a modal overlay containing the shareable link. Users can
   * copy the link to their clipboard or close the modal. This avoids
   * relying on browser dialogs that may be disabled in embedded
   * environments. The modal is removed when closed.
   * @param {string} link The URL to present to the user
   */
  function showShareModal(link) {
    // Remove any existing overlay
    const existing = document.querySelector('.share-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.className = 'share-overlay';
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    const title = document.createElement('h2');
    title.textContent = 'Shareable Link';
    const textarea = document.createElement('textarea');
    textarea.readOnly = true;
    textarea.value = link;
    // Select all text when clicked for convenience
    textarea.addEventListener('focus', () => textarea.select());
    const actions = document.createElement('div');
    actions.className = 'modal-actions';
    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => {
      textarea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
        }
      } catch (err) {
        console.warn('Copy command failed:', err);
      }
    });
    // Email button to compose an email with the link in the body
    const emailBtn = document.createElement('button');
    emailBtn.className = 'email-btn';
    emailBtn.textContent = 'Email';
    emailBtn.addEventListener('click', () => {
      const mailto = 'mailto:?subject=' + encodeURIComponent('Family Camping Checklist') + '&body=' + encodeURIComponent(link);
      window.location.href = mailto;
    });
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => overlay.remove());
    actions.appendChild(copyBtn);
    actions.appendChild(emailBtn);
    actions.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(textarea);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    // Focus the textarea to highlight the link immediately
    textarea.focus();
  }

  // Initialize data and render UI
  let data = loadData();
  // Set the checkbox state based on data
  toggleOptionalCheckbox.checked = data.showOptional;
  // Render the UI
  render();
})();