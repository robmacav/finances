class V1::Reports::TransactionsController < ApplicationController
    def all_by_month_year
        @transactions = Transaction.by_month_year(params[:month_year])
                        .page(params[:page])
                        .per(params[:per_page] || 50)

        render json: {
            current_page: @transactions.current_page,
            total_pages: @transactions.total_pages,
            total_count: @transactions.total_count,
            transactions: @transactions.map { |e| serialize_transaction(e) }
        }
    end

    private

    def serialize_transaction(transaction)
        value_prefix = transaction.expense? ? "- R$" : "+ R$"

        {
            id: transaction.id,
            summary: transaction.summary,
            details: transaction.details,
            value: "#{value_prefix} #{'%.2f' % transaction.value}",
            kind: transaction&.kind,

            date: {
                full: transaction&.date.strftime("%d/%m/%Y"),
                day: transaction.date&.day,
                month: transaction.date&.month,
                year: transaction.date&.year
            },

            status: {
                id: transaction.status&.id,
                summary: transaction.status&.summary
            },

            category: {
                id: transaction.category&.id,
                summary: transaction.category&.summary,
                color: transaction.category&.color
            }
        }
    end
end
