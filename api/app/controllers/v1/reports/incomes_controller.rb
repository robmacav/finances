class V1::Reports::IncomesController < ApplicationController
    def all_by_month_year
        @incomes = Income.all_by_month_year(params[:month_year]).page(params[:page]).per(params[:per_page] || 50)

        render json: {
            current_page: @incomes.current_page,
            total_pages: @incomes.total_pages,
            total_count: @incomes.total_count,
            incomes: @incomes.as_json(include: [:status, :category, :user])
        }
    end
end