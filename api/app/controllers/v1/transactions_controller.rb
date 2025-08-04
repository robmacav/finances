class V1::TransactionsController < ApplicationController
  before_action :set_transaction, only: %i[ show update destroy ]

  def index
    @transactions = Transaction.order(date: :asc).page(params[:page]).per(params[:per_page] || 50)

    render json: {
      current_page: @transactions.current_page,
      total_pages: @transactions.total_pages,
      total_count: @transactions.total_count,
      transactions: @transactions.as_json(include: [:status, :category, :user])
    }
  end

  def show
    render json: @transaction
  end

  def create
    puts "########### inicio"
    puts transactions_params


    if params[:transactions].present? && params[:transactions].is_a?(Array)
      trs = transactions_params

      trs.each do |tr|
        if tr[:date].present?
          begin
            tr[:date] = Date.strptime(tr[:date], '%d%m%Y')
          rescue ArgumentError
            tr[:date] = nil
          end
        end
      end

      trs = trs.map { |transaction_param| Transaction.new(transaction_param) }

      puts "########## arra"
      puts trs.inspect

      Transaction.transaction do
        trs.each(&:save!)
      end

      render json: transactions, status: :created
    else
      @transaction = Transaction.new(transaction_params)

      if @transaction.save
        render json: @transaction, status: :created, location: v1_transaction_url(@transaction)
      else
        render json: @transaction.errors, status: :unprocessable_entity
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def update
    if @transaction.update!(transaction_params)
      render json: @transaction
    else
      render json: @transaction.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @transaction.destroy!
  end

  private
    def set_transaction
      @transaction = Transaction.find(params[:id])
    end

    def transactions_params
      params.require(:transactions).map do |transaction|
        ActionController::Parameters.new(transaction.to_unsafe_h).permit(:summary, :details, :value, :date, :category_id, :kind, :status_id, :user_id)
      end
    end

    def transaction_params
      params.permit(:summary, :details, :value, :date, :category_id, :kind, :status_id, :user_id)
    end
end
