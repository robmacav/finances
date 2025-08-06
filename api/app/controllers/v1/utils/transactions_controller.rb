class V1::Utils::TransactionsController < ApplicationController
    def form_data
        render json: {
            kind: Transaction.kinds.map { |key, value| { id: value, summary: I18n.t("activerecord.attributes.transaction.kind.#{key}", locale: :'pt-BR'), value: key } },
            statuses: Status.all,
            categories: Category.order(summary: :desc)
        }
    end
end