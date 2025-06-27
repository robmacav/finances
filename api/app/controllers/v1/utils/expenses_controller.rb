class V1::Utils::ExpensesController < ApplicationController
    def month_availables
        render json: Expense.select("DISTINCT TO_DATE(date, 'DDMMYYYY') AS parsed_date").map { |e| e.parsed_date.strftime('%m/%Y') }.uniq.sort
    end
end