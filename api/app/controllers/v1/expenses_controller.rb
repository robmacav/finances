class V1::ExpensesController < ApplicationController
  before_action :set_expense, only: %i[ show update destroy ]

  def index
    @expenses = Expense.order(date: :asc).page(params[:page]).per(params[:per_page] || 50)

    render json: {
      current_page: @expenses.current_page,
      total_pages: @expenses.total_pages,
      total_count: @expenses.total_count,
      expenses: @expenses.as_json(include: [:status, :category, :user])
    }
  end

  def show
    render json: @expense
  end

  def create
    if params[:expenses].present? && params[:expenses].is_a?(Array)
      expenses = expenses_params.map { |expense_param| Expense.new(expense_param) }

      Expense.transaction do
        expenses.each(&:save!)
      end

      render json: expenses, status: :created
    else
      @expense = Expense.new(expense_params)

      if @expense.save
        render json: @expense, status: :created, location: v1_expense_url(@expense)
      else
        render json: @expense.errors, status: :unprocessable_entity
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def update
    if @expense.update(expense_params)
      render json: @expense
    else
      render json: @expense.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @expense.destroy!
  end

  private
    def set_expense
      @expense = Expense.find(params[:id])
    end

    def expenses_params
      params.require(:expenses).map do |expense|
        ActionController::Parameters.new(expense.to_unsafe_h).permit(:summary, :details, :value, :date, :category_id, :status_id, :user_id)
      end
    end

    def expense_params
      params.permit(:summary, :details, :value, :date, :category_id, :status_id, :user_id)
    end
end
