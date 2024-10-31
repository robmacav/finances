function DatepickerDayMonthYear() {
    $('.datepicker-dd-mm-yyyy').mask('00/00/0000').datepicker({
        format: 'dd/mm/yyyy',
        orientation: "bottom auto",
        autoclose: true,
        todayHighlight: true
    });
}

function DatepickerMonthYear() {
    $('.datepicker-mm-yyyy').mask('00/0000').datepicker({
        minViewMode: 'months',
        format: 'mm/yyyy',
        orientation: "bottom auto",
        autoclose: true,
        todayHighlight: true
    });
}

function DatepickerYear() {
    $('.datepicker-yyyy').mask('0000').datepicker({
        minViewMode: 'years',
        format: 'yyyy',
        orientation: "bottom auto",
        autoclose: true,
        todayHighlight: true
    });
}

function DatepickerInit() {
    DatepickerDayMonthYear();
    DatepickerMonthYear();
    DatepickerYear();
}

document.addEventListener("turbo:load", function() {
    DatepickerInit();
})

document.addEventListener("shown.bs.modal", function() {
    DatepickerInit();
})