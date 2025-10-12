class TransactionPresenter
    include CurrencyFormatable

    def initialize(transaction)
        @transaction = transaction
    end

    def as_json
        {
            id: @transaction.id,
            kind: @transaction.kind,
            summary: @transaction.summary,
            details: @transaction.details,

            value: {
                original: @transaction.value,
                formated: "#{@transaction.expense? ? '-' : '+'} #{format_currency(@transaction.value)}"
            },

            date: {
                original: @transaction.date,
                full: @transaction.date.strftime("%d/%m/%Y"),
                day: @transaction.date.day,
                month: @transaction.date.month,
                year: @transaction.date.year
            },
      
            status: @transaction.status&.then { |s| { id: s.id, summary: s.summary } },
            category: @transaction.category&.then { |c| { id: c.id, summary: c.summary, color: c.color } }
        }
    end
end