function addEventRemoveItem() {
    const btnsRemoveItem = document.querySelectorAll(".remove-item")

    btnsRemoveItem.forEach( item => {
        if (item.id != 0) {
            item.addEventListener('click', () => {
                item.parentElement.parentElement.remove();
    
                name = item.parentElement.parentElement.querySelectorAll("input")[3].name
    
                inputDestroy = document.createElement("input");
                inputDestroy.setAttribute("name", name)
                inputDestroy.setAttribute("value", true);
    
                document.querySelector("#expense-items").appendChild(inputDestroy);
            })
        }
    })
}

document.addEventListener("shown.bs.modal", function() {
    addEventRemoveItem();
});