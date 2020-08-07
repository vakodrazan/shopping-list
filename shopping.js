const shoppingForm = document.querySelector(".shopping");
const list = document.querySelector(".list");

// we need an array to hold our state 
let items = [];

const handleSubbmit = e => {
    e.preventDefault();
    const name = event.currentTarget.item.value;
    if (!name) return;
    const item = {
        name,
        id: Date.now(),
        complete: false,
    };
    // push ito our state
    items.push(item);
    console.info(`There are now ${items.length} in your state`);
    e.target.reset();
    list.dispatchEvent(new CustomEvent('itemsUpdate'));

}

const displayItems = () => {
    console.log(items);
    const html = items
        .map(
            item => 
            `<li class="shopping-item">
                <input 
                    value="${item.id}" 
                    ${item.complete ? 'checked' : ''}
                    type="checkbox"
                    >
                <span class="itemName">${item.name}</span>
                <button aria-label="Remove ${item.name}" value="${item.id}">&times;</button>
            </li>`
        )
        .join('');
    console.log(html);
    list.innerHTML = html;
}

const mirrorToLocalStorage = () => {
    console.log('mirrorring items to local storage');
    localStorage.setItem('Items', JSON.stringify(items));
};

const restoreFromLocalStorage = () => {
    console.log('Restoring from Ls')
    const lsItems = JSON.parse(localStorage.getItem('Items'));
    if (lsItems) {
        items.push(...lsItems);
    };
    list.dispatchEvent(new CustomEvent('itemsUpdate'));
};

const deleteItem = id => {
    console.log("deleting item", id);
    items = items.filter(item => item.id !== id);
    list.dispatchEvent(new CustomEvent('itemsUpdate'));
}

const markAsComplete = id => {
    console.log(id);
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdate'));
}

shoppingForm.addEventListener('submit', handleSubbmit);
list.addEventListener('itemsUpdate', displayItems);
list.addEventListener('itemsUpdate', mirrorToLocalStorage);

list.addEventListener('click', function(e) {
    const id = parseInt(e.target.value)
    if (e.target.matches('button')) {
        deleteItem(parseInt(id));
    }
    if (e.target.matches('input[type="checkbox"]')) {
        markAsComplete(id);
    }
})

restoreFromLocalStorage();
