class V1::Reports::ExpensesController < ApplicationController
    def by_category_and_month_year
        result = Category.all.each_with_object({}) do |category, hash|
            total = Expense.where("category_id = #{category.id} AND date like '%#{params[:month_year]}'").sum(:value)
            hash[category.summary] = total
        end

        render json: result
    end
end