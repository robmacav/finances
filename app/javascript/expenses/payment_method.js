function activeSelectCards() {
    let selectPaymentMethod = document.querySelector("#payment-method");
    let cards = document.querySelector("#cards");

    function validShowInputs() {
        if (selectPaymentMethod.value == "Cartão de Crédito") {
            cards.classList.remove("d-none");
            cards.classList.add("d-inline-block");
        } else {
            cards.classList.remove("d-inline-block");
            cards.classList.add("d-none");
        }
    }

    selectPaymentMethod.addEventListener("click", () => {
        validShowInputs();
    })

    $(document).ready(function() {
        validShowInputs();
    });
}

function initializeExpenseFormFunctions() {
    activeSelectCards();
}

document.addEventListener("shown.bs.modal", function() {
    initializeExpenseFormFunctions();
});