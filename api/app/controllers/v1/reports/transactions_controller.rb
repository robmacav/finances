class V1::Reports::TransactionsController < ApplicationController
  include CurrencyFormatable

  def all_by_month_year
    transactions = Transaction
      .by_month_year(params[:month_year])
      .page(params[:page])
      .per(params[:per_page] || 50)

    transactions_data = if params[:group_by] == "true"
                          I18n.with_locale(:'pt-BR') do
                            transactions
                              .group_by { |t| I18n.l(t.date, format: "%a, %d %B de %Y") }
                              .transform_values { |trs| trs.map { |t| TransactionPresenter.new(t).as_json } }
                          end
                        else
                          transactions.map { |t| TransactionPresenter.new(t).as_json }
                        end

    render json: {
      current_page: transactions.current_page,
      total_pages: transactions.total_pages,
      total_count: transactions.total_count,
      transactions: transactions_data
    }
  end
end