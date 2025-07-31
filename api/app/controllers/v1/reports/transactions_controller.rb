class V1::Reports::TransactionsController < ApplicationController
  def all_by_month_year
    expenses = Expense.all_by_month_year(params[:month_year])
    incomes = Income.all_by_month_year(params[:month_year])

    all_transactions = (expenses + incomes).sort_by do |t|
      parse_date(t.date) || Date.new(1970,1,1) # fallback data antiga para evitar erro
    end

    paginated = Kaminari.paginate_array(all_transactions).page(params[:page]).per(params[:per_page] || 50)

    render json: {
      current_page: paginated.current_page,
      total_pages: paginated.total_pages,
      total_count: paginated.total_count,
      transactions: paginated.map { |t| serialize_transaction(t) }
    }
  end

  private

  def parse_date(value)
    return value if value.is_a?(Date)
    return nil if value.nil?

    begin
      if value.to_s.match?(/^\d{8}$/)
        Date.strptime(value.to_s, "%d%m%Y")
      else
        Date.parse(value.to_s)
      end
    rescue ArgumentError
      nil
    end
  end

  def serialize_transaction(transaction)
    date = parse_date(transaction.date)

    value_prefix = transaction.is_a?(Expense) ? "- R$" : "+ R$"

    {
      id: transaction.id,
      summary: transaction.summary,
      details: transaction.details,
      value: "#{value_prefix} #{'%.2f' % transaction.value}",
      
      date: date && {
        full: date.strftime("%d/%m/%Y"),
        day: date.day,
        month: date.month,
        year: date.year
      },

      status: {
        id: transaction.status&.id,
        summary: transaction.status&.summary
      },

      category: {
        id: transaction.category&.id,
        summary: transaction.category&.summary,
        color: transaction.category&.color
      },

      type: transaction.is_a?(Expense) ? "expenses" : "incomes"
    }
  end
end
