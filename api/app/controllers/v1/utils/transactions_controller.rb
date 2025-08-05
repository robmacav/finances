class V1::Utils::TransactionsController < ApplicationController
    def meta
        render json: {
            kind: Transaction.kinds,
            statuses: Status.all,
            categories: Category.order(summary: :desc)
        }
    end
end