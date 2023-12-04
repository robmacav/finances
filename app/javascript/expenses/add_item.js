function createItemInputs() {
    var index = document.querySelector("#expense-items").childElementCount;

    const inputs = `
        <div class="col-12 col-sm-12">
            <hr class="d-block d-sm-none">
        </div>
        <div class="col-12 col-sm-2 mb-3 mb-sm-0">
            <label for="expense_items_attributes_${index}_quantity">Quantidade</label>
            <input class="form-control" type="text" value="1" name="expense[items_attributes][${index}][quantity]" id="expense_items_attributes_${index}_quantity">
        </div>
        <div class="col-12 col-sm-5 mb-3 mb-sm-0">
            <label for="expense_items_attributes_${index}_description">Descrição</label>
            <input class="form-control" type="text" name="expense[items_attributes][${index}][description]" id="expense_items_attributes_${index}_description">
        </div>
        <div class="col-12 col-sm-3 mb-5 mb-sm-0">
            <label for="expense_items_attributes_${index}_value">Valor</label>
            <input class="form-control real-currency d-inline-block" type="text" name="expense[items_attributes][${index}][value]" id="expense_items_attributes_${index}_value">
        </div>
        <div class="col-12 col-sm-2 mb-3 mb-sm-0">
            <label for="" class="d-none d-sm-inline-block text-white">Remover</label>
            <span class="btn btn-neutral d-block remove-item"><i class="bi bi-x-lg"></i></span>
        </div>
    `;

    return inputs;
}


function addItemExpense() {
    btnAddItem = document.querySelector("#add-item");
    divItems = document.querySelector("#expense-items");

    btnAddItem.addEventListener("click", () => {
        var itemDiv = document.createElement("div");
        itemDiv.classList.add("row");
        itemDiv.classList.add("mb-3");

        itemDiv.innerHTML = createItemInputs();

        divItems.appendChild(itemDiv);

        itemDiv.querySelectorAll('.remove-item').forEach(removeItemBtn => {
            removeItemBtn.addEventListener('click', () => {
                itemDiv.remove();
            });
        });
    })
}

document.addEventListener("shown.bs.modal", function() {
    addItemExpense();
});