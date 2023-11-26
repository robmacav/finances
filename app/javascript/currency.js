function RealCurrencyFull() {
    $('.real-currency').mask("#.##0,00", {reverse: true});
}

function RealCurrencyNoCents() {
    $('.real-currency-no-cents').mask("#.##0", {reverse: true});
}

function RealCurrencyInit() {
    RealCurrencyFull();
    RealCurrencyNoCents();
}

document.addEventListener("turbo:load", function() {
    RealCurrencyInit();
})

document.addEventListener("shown.bs.modal", function() {
    RealCurrencyInit();
})