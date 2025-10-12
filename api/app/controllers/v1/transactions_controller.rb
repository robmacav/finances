class V1::TransactionsController < ApplicationController
  before_action :set_transaction, only: %i[show update destroy]

  def index
    transactions = Transaction
      .order(date: :asc)
      .page(params[:page])
      .per(params[:per_page] || 50)

    render json: {
      current_page: transactions.current_page,
      total_pages: transactions.total_pages,
      total_count: transactions.total_count,
      transactions: transactions.as_json(include: [:status, :category, :user])
    }
  end

  def show
    render json: @transaction
  end

  def create
    if params[:transactions].present? && params[:transactions].is_a?(Array)
      transactions = transactions_params.map { |attrs| Transaction.new(attrs) }

      Transaction.transaction do
        transactions.each(&:save!)
      end

      render json: transactions, status: :created
    else
      transaction = Transaction.create!(transaction_params)
      render json: transaction, status: :created, location: v1_transaction_url(transaction)
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def update
    @transaction.update!(transaction_params)
    render json: @transaction
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def batch_update
    transactions = Transaction.where(id: params[:ids])
    update_attrs = params.require(:data)
      .permit(:summary, :details, :value, :date, :category_id, :kind, :status_id, :user_id)
      .to_h
      .compact_blank

    transactions.update_all(update_attrs)
    
    render json: transactions
  end

  def batch_destroy
    return render json: { error: "IDs inválidos ou ausente" }, status: :bad_request unless params[:ids].present? && params[:ids].is_a?(Array)

    transactions = Transaction.where(id: params[:ids])
    return render json: { error: "Nenhuma transação encontrada para os IDs informados" }, status: :not_found if transactions.empty?

    transactions.destroy_all
    
    head :no_content
  end

  def destroy
    @transaction.destroy!
    head :no_content
  end

  private

  def set_transaction
    @transaction = Transaction.find(params[:id])
  end

  def transaction_params
    params.permit(:summary, :details, :value, :date, :category_id, :kind, :status_id, :user_id)
  end

  def transactions_params
    params.require(:transactions).map do |transaction|
      ActionController::Parameters.new(transaction.to_unsafe_h)
        .permit(:summary, :details, :value, :date, :category_id, :kind, :status_id, :user_id)
    end
  end
end