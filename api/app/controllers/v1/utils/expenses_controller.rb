class V1::Utils::ExpensesController < ApplicationController
    def month_availables
        render json: Expense.select("DISTINCT TO_DATE(date, 'DDMMYYYY') AS parsed_date").map { |e| e.parsed_date.strftime('%m/%Y') }.uniq.sort
    end

    def categories
        @categories = Category.where(id: Expense.select(:category_id).distinct).page(params[:page]).per(params[:per_page] || 50)

        render json: {
            current_page: @categories.current_page,
            total_pages: @categories.total_pages,
            total_count: @categories.total_count,
            categories: @categories.as_json(include: [:status, :category, :user])
        }
    end

    def first
        @expenses = Expense.first(params[:quantity]).page(params[:page]).per(params[:per_page] || 50)

        render json: {
            current_page: @expenses.current_page,
            total_pages: @expenses.total_pages,
            total_count: @expenses.total_count,
            expenses: @expenses.as_json(include: [:status, :category, :user])
        }
    end
end