class V1::Reports::ExpensesController < ApplicationController
    def by_category_and_month_year
        result = Category.all.each_with_object({}) do |category, hash|
            total = Expense.where("category_id = #{category.id} AND date like '%#{params[:month_year]}'").sum(:value)
            hash[category.summary] = total
        end

        render json: result
    end

    def all_by_month_year
        @expenses = Expense.all_by_month_year(params[]).page(params[:page]).per(params[:per_page] || 50)

        render json: {
            current_page: @expenses.current_page,
            total_pages: @expenses.total_pages,
            total_count: @expenses.total_count,
            expenses: @expenses.as_json(include: [:status, :category, :user])
        }
    end

    def current_year_total_months
        @expenses = Expense.current_year_total_months

        render json: @expenses.map{|g| { month_year: g.month_year, total: g.total.to_f } }
    end
end