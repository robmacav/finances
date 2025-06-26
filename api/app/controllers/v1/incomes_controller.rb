class V1::IncomesController < ApplicationController
  before_action :set_income, only: %i[ show update destroy ]

  def index
    @incomes = Income.page(params[:page]).per(params[:per_page] || 50)

    render json: {
      current_page: @incomes.current_page,
      total_pages: @incomes.total_pages,
      total_count: @incomes.total_count,
      incomes: @incomes.as_json(include: [:status, :category, :user])
    }
  end

  def show
    render json: @income
  end

  def create
    @income = Income.new(income_params)

    if @income.save
      render json: @income, status: :created, location: @income
    else
      render json: @income.errors, status: :unprocessable_entity
    end
  end

  def update
    if @income.update(income_params)
      render json: @income
    else
      render json: @income.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @income.destroy!
  end

  private
    def set_income
      @income = Income.find(params[:id])
    end

    def income_params
      params.permit(:summary, :details, :value, :date, :category_id, :user_id)
    end
end
